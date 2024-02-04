"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Edit, FileIcon, Trash2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useModal } from "@/hooks/modal-store";
import qs from "query-string";
import { useForm } from "react-hook-form";

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { MemberRoleIconMap } from "@/components/icon-map";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  fileUrl: string | null;
  member: Member & { profile: Profile };
  timestamp: string;
  isDeleted: boolean;
  isUpdated: boolean;
  currentmember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  fileUrl,
  member,
  timestamp,
  isDeleted,
  isUpdated,
  currentmember,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const fileType = fileUrl?.split(".").pop();

  const isLeader = currentmember.role === MemberRole.LEADER;
  const isCOleader = currentmember.role === MemberRole.COLEADER;
  const isElder = currentmember.role === MemberRole.ELDER;
  const isOwner = member.id === currentmember.id;
  const canDeleteMessage =
    !isDeleted && (isLeader || isCOleader || isElder || isOwner);
  const canEdit = !isDeleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    const handelKeyEvent = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handelKeyEvent);

    return () => window.removeEventListener("keydown", handelKeyEvent);
  }, []);

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.content === content) {
      onCancel();
    }
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      const res = await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log("error in editing message", error);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const onMemberClilck = () => {
    if (currentmember.id === member.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <div
      className="group relative items-center flex m-4 md:max-w-[75%] bg-pastel-secondary/20 md:hover:bg-pastel-secondary/40 transition
       my-1.5 rounded-md p-3"
    >
      <div className="group flex gap-x-2 items-start w-full text-pastel-fourth dark:text-dark-fourth">
        <div
          onClick={onMemberClilck}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="gap-x-2 items-center flex">
            <div className="flex items-center gap-x-2">
              <p
                onClick={onMemberClilck}
                className="font-rilo text-sm hover:underline cursor-pointer"
              >
                {member.profile.userName}
              </p>
              <ActionTooltip label={member.role} side="right">
                {MemberRoleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs font-riloLight -ml-2">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              ></Image>
            </a>
          )}
          {isPdf && (
            <div className="relative flex bg-pastel-secondary/40 items-center p-2 mt-2 rounded-md">
              <FileIcon className="h-10 w-10 fill-pastel-secondary stroke-pastel-fourth" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-pastel-fourth dark:text-dark-fourth hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                " font-riloLight text-sm",
                isDeleted &&
                  " line-through text-pastel-third dark:text-dark-third"
              )}
            >
              {content}
              {isUpdated && !isDeleted && (
                <span className="text-[10px] mx-2 ">(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-pastel-secondary/50 dark:bg-dark-secondary/50 border-none border-0 
                            focus-visible:ring-0 focus-visible:ring-offset-0 text-patel-fourth dark:text-dark-fourth"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isLoading}
                  className="h-10 w-14 font-jersey bg-pastel-third dark:bg-dark-third
                hover:bg-pastel-fourth dark:hover:bg-dark-fourth "
                >
                  Save
                </Button>
                <Button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="h-10 w-14 font-jersey bg-pastel-third dark:bg-dark-third
                hover:bg-pastel-fourth dark:hover:bg-dark-fourth "
                >
                  cancel
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-pastel-third font-riloLight">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="md:hidden group-hover:block p-1 item-center 
          absolute md:-top-2 top-2 md:right-5 right-2 md:bg-pastel-secondary/80 md:dark:bg-dark-secondary/80 rounded-sm
          text-pastel-fourth dark:text-dark-fourth"
        >
          <div className="flex gap-x-1 item-center">
            {canEdit && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setIsEditing(true)}
                  className="h-4 w-4 cursor-pointer ml-auto"
                />
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete">
              <Trash2
                onClick={() =>
                  onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="h-4 w-4 cursor-pointer ml-auto"
              />
            </ActionTooltip>
          </div>
        </div>
      )}
    </div>
  );
};
