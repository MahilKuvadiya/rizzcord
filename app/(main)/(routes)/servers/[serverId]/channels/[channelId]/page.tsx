import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const channelIdPage = async ({
  params
} : {
  params : {
    serverId : string,
    channelId : string
  }
}) => {

  const profile = await currentProfile();

  if(!profile ) { 
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where : {
      id: params.channelId
    }
  });

  const member = await db.member.findFirst({
    where : {
      serverId : params.serverId,
      profileId : profile.id
    }
  });

  if(!channel || !profile){
    redirect('/')
  }


  return (
    <div>
      <ChatHeader 
      serverId={params.serverId}
      name={channel.channelName}
      channelType={channel.type}
      type='channel'
      />
    </div>
  )
}

export default channelIdPage