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
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

const DeleteMessage = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const { apiUrl , query } = data;
  const isModalOpen = isOpen && type === 'deleteMessage';

  const [isLoading, setisLoading] = useState(false);

  const onDelete = async () => {
    try {
      setisLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);
      
      onClose();
    } catch (error) {
        console.log("error from delete-message-modal", error);
    } finally {
        setisLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 w-[25%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Delete Message
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
          <DialogDescription className="text-center font-rilo">
            Are you sure you want to Delete this message?<br />
            It will be permnantly deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              className="bg-transparent text-pastel-third hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-700  font-jersey font-extralight"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessage;
