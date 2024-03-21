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
import {
  Check,
  Copy,
  LucideClipboardPaste,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export const JoinServerModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [copiedText, setCopiedText] = useState("");
  const [errorText, setErrorText] = useState("");
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();


  const { server } = data;
  const isModalOpen = isOpen && type === "joinServer";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [isPasted, setisPasted] = useState(false);
  const [isDeleted, setisDeleted] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const onPaste = async () => {
    const ct = await navigator.clipboard.readText();
    console.log(ct);

    setCopiedText(ct);

    setisPasted(true);

    setTimeout(() => {
      setisPasted(false);
    }, 1000);
  };

  const onDelete = async () => {
    setCopiedText("");

    setisDeleted(true);

    setTimeout(() => {
      setisDeleted(false);
    }, 1000);
  };

  const onJoin = async () => {
    setisLoading(true)
    setErrorText('loading...')
    if (copiedText.length <= 10) {
      setErrorText("Please provide correct URL or Invite-code.");
    } else {
      const res = await axios.patch(
        "/api/servers/something-trash/invite-code-modal",
        { url : copiedText }
      ).catch(()=>{
        setErrorText("Please provide correct URL or Invite-code.")
      });
      //something-trash is in for the serverId but in this api call we dont need the serverId
          console.log(res)
      if (res) {

        if(params?.serverId !== res.data.id){
          onClose();
          setErrorText('Redirecting...')
          router.push(copiedText)
        }
        onClose()
        setErrorText("")
      }
    }
    setisLoading(false)
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 gap-y-1">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Join server
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
        </DialogHeader>
        <div className="p-6 pt-2 pb-0">
          <Label className="uppercase text-sm font-jersey text-pastel-fourth dark:text-secondary/70">
            Server invite link:
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              readOnly
              disabled={isLoading}
              value={copiedText}
              className="bg-pastel-secondary focus-visible:ring-0 text-pastel-fourth focus-visible:ring-offset-0 font-rilo border border-pastel-fourth"
              placeholder="Paste link here"
            />
            <Button
              size="icon"
              disabled={isLoading}
              onClick={onPaste}
              className="bg-transparent hover:bg-pastel-secondary border border-pastel-fourth"
            >
              {isPasted ? (
                <Check className="w-4 h-4 text-pastel-fourth" />
              ) : (
                <LucideClipboardPaste className="w-4 h-4 text-pastel-fourth" />
              )}
            </Button>
            <Button
              size="icon"
              disabled={isLoading}
              onClick={onDelete}
              className="bg-transparent hover:bg-pastel-secondary border border-pastel-fourth"
            >
              {isDeleted ? (
                <Check className="w-4 h-4 text-pastel-fourth" />
              ) : (
                <Trash2 className="w-4 h-4 text-pastel-fourth" />
              )}
            </Button>
          </div>
        </div>
        <Label className="px-6 text-xs font-rilo text-red-500">
          {errorText}
        </Label>
        <DialogFooter className="px-6 py-3 pt-0">
          <Button
            disabled={isLoading}
            className="bg-pastel-fourth hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
            onClick={onJoin}
          >
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
