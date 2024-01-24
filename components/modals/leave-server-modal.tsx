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
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const LeaveServer = () => {
  const {isOpen ,onClose , type , data} = useModal()
    const router = useRouter();

  const { server } = data;
  const isModalOpen = isOpen && type === "leaveServer";

  const [isLoading,setisLoading] = useState(false);

  const onLeave = async () => {
    try {
        setisLoading(true);

        const response = await axios.patch(`/api/servers/${server?.id}/leave-server`)

        onClose();
        router.refresh();
        router.push("/")
    } catch (error) {
        console.log("error from leave-server-modal",error)
    }finally{
        setisLoading(false)
    }
  }

  return (
    <Dialog open = {isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 w-[30%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Leave server
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
          <DialogDescription className="text-center font-rilo">
            Are you sure you want to leave <span className="font-bold">{server?.serverName}</span> ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 ">
            <div className="flex items-center justify-between w-full">
                <Button 
                disabled={isLoading}
                onClick={onClose}
                className="bg-transparent text-pastel-third hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight">
                    Cancel
                </Button>
                <Button 
                disabled={isLoading}
                onClick={onLeave}
                className="bg-red-500 hover:bg-red-700  font-jersey font-extralight">
                    Confirm
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>  
    </Dialog>
  );
};


export default LeaveServer