import { redirectToSignIn } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const ServerIdPage = async ({
  params 
} : { params : { serverId : string}}) => {

  const profile = await currentProfile();

  if(!profile) { 
    return redirectToSignIn()
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          channelName: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const generalChannel = server?.channels[0];

  if(!generalChannel) {
    return null;
  }


  return redirect(`/servers/${server.id}/channels/${generalChannel.id}`);
}
 
export default ServerIdPage;