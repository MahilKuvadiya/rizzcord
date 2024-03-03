import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

const channelIdPage = async ({
  params,
}: {
  params: {
    serverId: string;
    channelId: string;
  };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !profile || !member) {
    redirect("/");
  }

  return (
    <div className="bg-pastel-primary dark:bg-dark-primary flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        name={channel.channelName}
        channelType={channel.type}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.channelName}
            member={member}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />
          <ChatInput
            name={channel.channelName}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom 
        chatId={channel.id}
        video={false}
        audio={true}
        name={channel.channelName}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom 
        chatId={channel.id}
        video={true}
        audio={true}
        name={channel.channelName}
        />
      )}
    </div>
  );
};

export default channelIdPage;
