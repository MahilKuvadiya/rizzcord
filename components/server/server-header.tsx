"use client"

import { ServerWithMemberAndProfile } from "@/type";
import { MemberRole, Server } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusSquare, Settings, Trash2, UserPlus2, Users2 } from "lucide-react";
import { useModal } from "@/hooks/modal-store";

interface ServerHeaderProps { 
    server : ServerWithMemberAndProfile,
    role? : MemberRole
}

export const ServerHeader = ({
    server,
    role
} : ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isLeader = role === MemberRole.LEADER;
    const isElder = role === MemberRole.ELDER || isLeader;

    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-jersey font-semibold px-3 flex items-center h-12 border-pastel-third/60
                dark:border-dark-third border-b-2 bg-pastel-secondary hover:bg-pastel-third/40 transition shadow-md">
                    {server.serverName}
                    <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-56 text-xs font-medium fort-jersey
            bg-pastel-primary dark:bg-dark-primary 
            text-pastel-third dark:text-dark-third space-y-[2px]"  >
                
                {isElder && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey"
                    onClick={() => onOpen("invite", { server })}>

                        Invite spiders
                        <UserPlus2 className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                {isLeader && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey"
                    onClick={() => onOpen("editServer" , { server })}>
                        Server Setting
                        <Settings className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                {isLeader && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey">
                        Manage spiders
                        <Users2 className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                {isElder && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey">
                        Create channel
                        <PlusSquare className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>
                )}
                {isElder && (
                    <DropdownMenuSeparator className="bg-pastel-third ml-3 mr-3 rounded"/>
                )}
                {isLeader && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey text-red-600">
                    Delete server
                    <Trash2 className="ml-auto h-4 w-4"/>
                </DropdownMenuItem>
                )}
                {!isLeader && (
                    <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm font-jersey text-red-600">
                    Leave server
                    <LogOut className="ml-auto h-4 w-4"/>
                </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}