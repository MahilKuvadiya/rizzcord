"use client";



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


export const InviteModal = () => {
  const {isOpen , onOpen, onClose , type , data} = useModal()
  const origin = useOrigin();

  const { server } = data;
  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [isCopied,setisCopied] = useState(false);
  const [isLoading,setisLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setisCopied(true);

    setTimeout(() => {
      setisCopied(false);
    },1000)
  }

  const onNew = async () => {
    try{
      setisLoading(true);

      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      console.log(response)
      onOpen("invite" , {server : response.data})

    }catch ( error) {
      console.log("error from invite modal", error);
    }finally {
      setisLoading(false);
    }
  }


  return (
    <Dialog open = {isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Invite friends
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
        </DialogHeader>
        <div className="p-6 pt-2">
          <Label
            className="uppercase text-sm font-jersey text-pastel-fourth dark:text-secondary/70"
          >
            Server invite link:
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input 
            disabled={isLoading}
            className="bg-pastel-secondary focus-visible:ring-0 text-pastel-fourth focus-visible:ring-offset-0 border border-pastel-fourth"
            value={inviteUrl}/>
            <Button size="icon" disabled={isLoading} onClick={onCopy} className="bg-transparent hover:bg-pastel-secondary border border-pastel-fourth">
              {isCopied ? <Check className="w-4 h-4 text-pastel-fourth"/> : <Copy className="w-4 h-4 text-pastel-fourth"/>}
              
            </Button>
          </div>
          <Button
          onClick={onNew}
          disabled={isLoading}
          variant="link"
          size="sm"
          className="font-rilo text-xs mt-4 text-pastel-third">
            Generate a new link 
            <RefreshCw className="text-pastel-third hover:text-pastel-fourth ml-2 h-3 w-3"/>
          </Button>
          
        </div>
      </DialogContent>  
    </Dialog>
  );
};


