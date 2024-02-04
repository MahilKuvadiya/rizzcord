import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, ChannelMessage, Profile } from "@prisma/client";

import { useSocket } from "@/components/providers/socket-provider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

type ChannelMessageWithMembersWithProfile = ChannelMessage & {
    member : Member & {
        profile : Profile
    }
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (newMessage : ChannelMessageWithMembersWithProfile) => {
        queryClient.setQueryData([queryKey],(oldData : any) => {
            if(!oldData || !oldData.pages || oldData.pages.length === 0){
                return oldData;
            }

            const newData = oldData.pages.map((page : any) =>{
                return {
                    ...page,
                    messages : page.messages.map((message : ChannelMessageWithMembersWithProfile) => {
                        if( message.id === newMessage.id){
                            return  newMessage;
                        }

                        return message;
                    })
                }
            })

            return {
                ...oldData,
                pages : newData
            }
        })
    });

    socket.on(addKey, (newMessage: ChannelMessageWithMembersWithProfile) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [{
                messages : [newMessage],
              }]
            }
          }
  
          const newData = [...oldData.pages];
  
          newData[0] = {
            ...newData[0],
            messages: [
              newMessage,
              ...newData[0].messages,
            ]
          };
  
          return {
            ...oldData,
            pages: newData,
          };
        });
      });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    }
  }, [queryClient, addKey, queryKey, socket, updateKey]);
}