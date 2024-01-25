"use client";

import { ServerWithMemberAndProfile } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  server?: ServerWithMemberAndProfile;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-1">
      <p
        className="font-jersey text-sm text-pastel-third 
            dark:text-dark-third"
      >
        {label}
      </p>
      {sectionType === "channel" && role !== MemberRole.SPIDER && (
        <ActionTooltip label="Create channel" side="right">
          <button
            className="text-pastel-fourth"
            onClick={() => onOpen("createChannel", { server })}
          >
            <Plus className="ml-auto h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}
      {sectionType === "member" && role !== MemberRole.SPIDER && (
        <ActionTooltip label="Manage Members" side="right">
          <button
            className="text-pastel-fourth"
            onClick={() => onOpen("manageMembers", { server })}
          >
            <Settings className="ml-auto h-4 w-4 " />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
