"use client";

import { Plus } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/modal-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";


export const NavigationAction = () => {
    const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip
        side="right"
        align="center"
        label="Add a server"
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
          group-hover:rounded-[16px] transition-all overflow-hidden 
          items-center justify-center bg-background dark:bg-neutral-700 
          group-hover:bg-pastel-secondary">
            <Plus
              className="group-hover:text-background transition text-pastel-third"
              size={25}
            />
          </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' side='right' className="bg-pastel-primary dark:bg-dark-primary 
                      text-pastel-fourth dark:text-dark-fourth space-y-[2px] shadow-black shadow-2xl">
            <DropdownMenuItem className="font-rilo text-pastel-fourth dark:text-pastel-fourth"
            onClick={()=>onOpen('joinServer')}>
              Join server
            </DropdownMenuItem>
            <DropdownMenuItem 
            className="font-rilo text-pastel-fourth dark:text-pastel-fourth"
            onClick={()=>onOpen('createServer')}>
            
              Create server
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
          group-hover:rounded-[16px] transition-all overflow-hidden 
          items-center justify-center bg-background dark:bg-neutral-700 
          group-hover:bg-pastel-secondary">
            <Plus
              className="group-hover:text-background transition text-pastel-third"
              size={25}
            />
          </div>
        </button> */}
      </ActionTooltip>
    </div>
  )
}