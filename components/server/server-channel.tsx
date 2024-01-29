"use client";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Hash, Mic, Video, Lock, Trash2, Edit } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import { ModalType, useModal } from "@/hooks/modal-store";
import { cn } from "@/lib/utils";
import { ChannelIconMap } from "../icon-map";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const onClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, modalType: ModalType) => {
    e.stopPropagation();
    onOpen(modalType, { channel, server });
  };

  return (
    <button
      onClick={() => onClick()}
      className={cn("group px-2 py-1 rounded-md flex items-center w-full hover:bg-pastel-third/20 dark:hover:bg-pastel-third/20 transition mb-1 text-pastel-third hover:text-pastel-fourth font-rilo",
      params?.channelId === channel.id && 'bg-pastel-third/20 text-pastel-fourth shadow-inner shadow-pastel-fourth')}
    >
      {ChannelIconMap[channel.type]}
      <p
      className="line-clamp-1">
        {channel.channelName}
      </p>
      {channel.channelName.toLowerCase() === "general" && (
        <Lock className="h-4 w-4 ml-auto" />
      )}
      {role !== MemberRole.SPIDER &&
        channel.channelName.toLowerCase() !== "general" && (
          <div className="group flex items-center justify-center ml-auto space-x-2">
            <ActionTooltip label="Edit Channel">
              <Edit
                onClick={(e) => onAction(e, "editChannel")}
                className={cn("hidden group-hover:block h-4 w-4",
                params?.channelId === channel.id && 'block')}
              />
            </ActionTooltip>
            <ActionTooltip label="Delete channel">
              <Trash2
                onClick={(e) => onAction(e, "deleteChannel")}
                className={cn("hidden group-hover:block h-4 w-4",
                params?.channelId === channel.id && 'block')}
              />
            </ActionTooltip>
          </div>
        )}
    </button>
  );
};
