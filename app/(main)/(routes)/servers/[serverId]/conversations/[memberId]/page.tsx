import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { findOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const MemberIdPage = async ({
  params 
} : {
  params  : { serverId : string , memberId : string }
}) => {

  const profile = await currentProfile();

  if(!profile){
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where : {
      serverId : params.serverId,
      profileId : profile.id
    }
  });

  const clickedMember = await db.member.findFirst({
    where : {
      serverId : params.serverId,
      id : params.memberId
    },
    include : {
      profile : true
    }
  })

  if(!currentMember || !clickedMember ){
    return redirect('/')
  }

  const conversation = await findOrCreateConversation(currentMember?.id,clickedMember?.id);

  if(!conversation){
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne , memberTwo } = conversation;

  const otherMember = profile.id === memberOne.profile.id ? memberTwo : memberOne



  return (
    <div className="bg-pastel-primary dark:bg-dark-primary flex flex-col h-full">

    <ChatHeader 
    serverId={params.serverId}
    name={otherMember.profile.userName}
    type='conversation'
    imageUrl={otherMember.profile.imageUrl}
    />
    <ChatMessages 
    member={currentMember}
    name={otherMember.profile.userName}
    chatId={conversation.id}
    type="conversation"
    apiUrl="/api/direct-messages"
    socketUrl="/api/socket/direct-messages"
    paramKey="conversationId"
    paramValue={conversation.id}
    socketQuery={{
      conversationId : conversation.id
    }}
    />
    <ChatInput 
    type = 'conversation'
    name = {otherMember.profile.userName}
    apiUrl="/api/socket/direct-messages"
    query = {{
      conversationId : conversation.id
    }}/>
    </div>
  )
}

export default MemberIdPage