"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, Croissant, Wand } from "lucide-react";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
    [MemberRole.LEADER]: <Crown className="h-4 w-4 mr-2" />,
    [MemberRole.COLEADER]: <Croissant className="h-4 w-4 mr-2 " />,
    [MemberRole.ELDER]: <Wand className="h-4 w-4 mr-2 " />,
    [MemberRole.SPIDER]: null,
  };

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  return (
  <button>
    {roleIconMap[member.role]}
    <p>
        {member.profile.userName}
    </p>
  </button>
    )
};
