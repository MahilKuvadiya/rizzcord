import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
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

  if (!channel || !profile) {
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
      <div className="flex-1">Future messeges</div>
      <ChatInput
        name={channel.channelName}
        type="channel"
        apiUrl="/api/socket/messages"
        serverId={channel.serverId}
        channelId={channel.id}
      />
    </div>
  );
};

export default channelIdPage;
