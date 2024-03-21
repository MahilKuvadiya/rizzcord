import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse(
        "Unauthorized from api/servers/serverID/leave-server",
        { status: 401 }
      );
    }

    if (!params.serverId) {
      return new NextResponse("Server Id missing", { status: 401 });
    }

    const isServerAvailable = await db.server.findFirst({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!isServerAvailable) {
      return new NextResponse("No such server available", { status: 400 });
    }

    const response = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log("Error from /api/servers/serverID/leave-server", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
