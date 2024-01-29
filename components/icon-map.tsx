import { ChannelType, MemberRole } from "@prisma/client";
import { Croissant, Crown, Hash, Mic, Video, Wand } from "lucide-react";

export const ChannelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4 flex-shrink-0" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4 flex-shrink-0" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4 flex-shrink-0" />,
};

export const MemberRoleIconMap = {
  [MemberRole.LEADER]: <Crown className="h-4 w-4 mr-2" />,
  [MemberRole.COLEADER]: <Croissant className="h-4 w-4 mr-2 " />,
  [MemberRole.ELDER]: <Wand className="h-4 w-4 mr-2 " />,
  [MemberRole.SPIDER]: null,
};