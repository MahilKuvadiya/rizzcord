"use client";

import { useUser } from "@clerk/nextjs";
import { Loader, Mic, Video } from "lucide-react";
import { useEffect, useState } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Button } from "./ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  name: string;
  type: string;
}

export const MediaRoom = ({ chatId, video, audio, name, type }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const [connect, setConnect] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (!user?.username) return;

    const name = user.username;

    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();
        setToken(data.token);
      } catch (e) {
        console.log("Error -->", e);
      }
    })();
  }, [user?.username, chatId]);

  useEffect(()=>{
    if(type === 'conversation'){
      setConnect(true);
    }
  },[])

  const onConnect = () => {
    setConnect(true);
  };

  const onDisconnected = () => {
    setConnect(false);
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: undefined,
      }
    }, { skipNull: true });

    router.push(url);
  };

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader className="h-8 w-8 text-pastel-fourth dark:text-dark-fourth animate-spin my-4" />
        <p className="text-pastel-fourth text-xs dark:text-dark-fourth ">
          Connecting to the room...
        </p>
      </div>
    );
  }


  if (!connect && type !=='conversation') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-[250px] rounded-xl bg-pastel-secondary  shadow-inner shadow-pastel-fourth">
          <div className="flex m-2 p-2  rounded-lg text-pastel-fourth shadow-sm shadow-pastel-fourth">
            {video ? (
              <Video className="h-8 w-8 mr-2" />
            ) : (
              <Mic className="h-8 w-8 mr-2" />
            )}
            <span className="font-rilo text-lg">{name}</span>
          </div>
          <div className="mx-4 font-rilo text-pastel-fourth">
            Confirm joining
          </div>
          <div className="flex w-full">
            <Button
              onClick={onConnect}
              className="ml-auto mr-2 my-2 bg-pastel-fourth hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
            >
              join
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-clip">
      <LiveKitRoom
        className="h-full w-full p-5 flex items-center justify-center"
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        video={video}
        audio={audio}
        data-lk-theme="default"
        connect={connect}
        onDisconnected={onDisconnected}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};
