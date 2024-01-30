import { ChannelType } from "@prisma/client";
import { ChannelIconMap } from "../icon-map";
import { MobileToggle } from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import { SocketIndicatior } from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  channelType?: ChannelType;
}

const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  channelType,
}: ChatHeaderProps) => {
  return (
    <div
      className="w-full text-md font-rilo font-semibold px-3 flex items-center h-12 border-pastel-third/60
        dark:border-dark-third/60 border-b-2 bg-pastel-primary transition shadow-md
        dark:bg-dark-primary "
    >
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <div className="flex items-center text-pastel-fourth">
          {channelType !== undefined && ChannelIconMap[channelType]}
          {name}
        </div>
      )}
      {type === "conversation" && (
        <div className="flex items-center text-pastel-fourth">
          <UserAvatar src={imageUrl} className="h-7 w-7 md:h-8 md:w-8 mr-2" />
          {name}
        </div>
      )}
      <div className="ml-auto flex items-center">
        <SocketIndicatior />
      </div>
    </div>
  );
};

export default ChatHeader;
