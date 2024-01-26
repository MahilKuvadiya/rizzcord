"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, Croissant, Wand } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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
  const params = useParams();
  const router = useRouter();


  const onClick = ( ) => { 
    router.push(`/servers/${server.id}/conversations/${member.profileId}`)
  }

  return (
    <button
    onClick={onClick}
      className={cn(
        "group px-2 py-1 rounded-md flex items-center gap-x-2 w-full hover:bg-pastel-third/20 dark:hover:bg-pastel-third/20 transition mb-1 text-pastel-third hover:text-pastel-fourth font-rilo",
        params?.profileId === member.profileId &&
          "bg-pastel-third/20 text-pastel-fourth shadow-inner shadow-pastel-fourth"
      )}
    >
      {roleIconMap[member.role]}
      <p>{member.profile.userName}</p>
    </button>
  );
};
