import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    
    console.log(profile?.userName + "   profile name")

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { url } = await req.json();

    const isCode = !url.startsWith("http");

    const inviteCode = isCode ? url : url.split("/").pop();

    console.log("Request received ... " + inviteCode);

    const existingMember = await db.server
      .findFirst({
        where: {
          inviteCode: inviteCode,
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
      })
      .catch(() => {
        return new NextResponse("Server Error", { status: 500 });
      });

      console.log("Existing member "+ existingMember)

    if (existingMember) {
      return NextResponse.json(existingMember);
    }

    const isServerAvailable = await db.server.findFirst({
        where: {
            inviteCode : inviteCode
        }
    })

    if(!isServerAvailable){
        return new NextResponse('No such server available', { status : 400 })
    }

    const server = await db.server
      .update({
        where: {
          inviteCode: inviteCode,
        },
        data: {
          members: {
            create: [
              {
                profileId: profile.id,
              },
            ],
          },
        },
      })


      console.log("server updated")
      console.log(server)

    return NextResponse.json(server);
  } catch (e) {
    console.log(" error form servers - serverId - invite-code-modal", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
