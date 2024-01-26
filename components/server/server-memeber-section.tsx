"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ServerMember } from "./server-member";

interface ServerMemberSectionProp {
  members: ({ profile: Profile } & Member)[];
  server: Server;
}

export const ServerMemberSection = ({
  members,
  server,
}: ServerMemberSectionProp) => {
  const leaderMember = members.filter(
    (member) => member.role === MemberRole.LEADER
  );
  const coLeaderMember = members.filter(
    (member) => member.role === MemberRole.COLEADER
  );
  const elderMember = members.filter(
    (member) => member.role === MemberRole.ELDER
  );
  const spiderMember = members.filter(
    (member) => member.role === MemberRole.SPIDER
  );

  return (
    <div>
        {leaderMember.map((member) => (
            <ServerMember
            key={member.id}
            member={member}
            server={server}
            />
        ))}
        {coLeaderMember.map((member) => (
            <ServerMember
            key={member.id}
            member={member}
            server={server}
            />
        ))}
        {elderMember.map((member) => (
            <ServerMember
            key={member.id}
            member={member}
            server={server}
            />
        ))}
        {spiderMember.map((member) => (
            <ServerMember
            key={member.id}
            member={member}
            server={server}
            />
        ))}
    </div>
    );
};

