"use client";

import { ChannelMessage, Member, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader, ServerCrashIcon } from "lucide-react";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";
import { format } from 'date-fns' 

const DTAE_FORMAT = 'd MMM yyyy, HH:mm'

type ChannelMessageWithMembersWithProfile = ChannelMessage & {
    member : Member & {
        profile : Profile
    }
}

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      queryKey,
      paramKey,
      paramValue,
    });

    if ( status === 'pending' ){
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Loader className="h-8 w-8 text-pastel-fourth dark:text-dark-fourth animate-spin my-4"/>
                <p className="font-rilo text-xs text-pastel-fourth dark:text-dark-fourth">
                    Loading messages...
                </p>
            </div>
        )
    }

    if ( status === 'error' ){
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <ServerCrashIcon className="h-8 w-8 text-pastel-fourth dark:text-dark-fourth my-4"/>
                <p className="font-rilo text-xs text-pastel-fourth dark:text-dark-fourth">
                    Something went wrong!!!
                </p>
            </div>
        )
    }
    

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      {/* <div className="flex-1" /> */}
      <ChatWelcome name={name} type={type} />
      <div className="flex flex-col-reverse mt-auto ">
        {data?.pages?.map((page , i) => (
            <Fragment key={i} >
                {page.messages.map((message : ChannelMessageWithMembersWithProfile) => (
                    <div key={message.id}>
                        <ChatItem 
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        fileUrl={message.fileUrl}
                        member={message.member}
                        currentmember={member}
                        isDeleted={message.deleted}
                        timestamp={format(new Date(message.createdAt),DTAE_FORMAT)}
                        isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}/>
                    </div>
                ))}
            </Fragment>
        ))}
                 
      </div>
    </div>
  );
};
