import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    const { name , imageUrl } =await req.json();

    if(!profile ) {
        return new NextResponse("Unauthorized" , { status : 401 })
    }

    if(!params.serverId) { 
        return new NextResponse("Server ID missing" , { status : 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId : profile.id
      },
      data: {
        serverName: name,
        imageUrl: imageUrl,
      },
    }).catch ( () => {
        return new NextResponse("Internal server Error." , { status : 500 })
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("error from spi / servers/ serverid / update-server", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
