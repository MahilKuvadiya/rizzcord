import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Croissant, Crown, Hash, Mic, Video, Wand } from "lucide-react";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface serverSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.LEADER]: <Crown className="h-4 w-4 mr-2" />,
  [MemberRole.COLEADER]: <Croissant className="h-4 w-4 mr-2 " />,
  [MemberRole.ELDER]: <Wand className="h-4 w-4 mr-2 " />,
  [MemberRole.SPIDER]: null,
};

export const ServerSidebar = async ({ serverId }: serverSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role;

  return (
    <div className="flex flex-col h-full bg-pastel-secondary w-full dark:bg-dark-primary">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2 mb-0 pb-4">
          <ServerSearch
            data={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Audio Channel",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.channelName,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.userName,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection 
            label="Text Channel"
            sectionType='channel'
            channelType={ChannelType.TEXT}
            role={role}
            />
            <div>
              {textChannels.map((channel) => (
                <ServerChannel
                key={channel.id} 
                channel={channel}
                server={server}
                role={role}/>
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
            label="Audio Channel"
            sectionType='channel'
            channelType={ChannelType.AUDIO}
            role={role}
            />
            <div>
              {audioChannels.map((channel) => (
                <ServerChannel 
                key={channel.id}
                channel={channel}
                server={server}
                role={role}/>
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection 
            label="Video Channel"
            sectionType='channel'
            channelType={ChannelType.VIDEO}
            role={role}
            />
            <div>
              {videoChannels.map((channel) => (
                <ServerChannel
                key={channel.id} 
                channel={channel}
                server={server}
                role={role}/>
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection 
            label="Members"
            sectionType='member'
            role={role}
            server={server}
            />
            <div>
              {members.map((member) => (
                <ServerMember 
                member={member}
                server={server}/>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      server sidebar
    </div>
  );
};
