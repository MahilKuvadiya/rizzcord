"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, Croissant, Wand } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MemberRoleIconMap } from "../icon-map";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}


export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();


  const onClick = ( ) => { 
    router.push(`/servers/${server.id}/conversations/${member.id}`)
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
      {MemberRoleIconMap[member.role]}
      <p>{member.profile.userName}</p>
    </button>
  );
};
