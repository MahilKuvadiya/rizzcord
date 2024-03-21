"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronsRight, ChevronsLeft, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/modal-store";

const HomePageModal = () => {
  const { isSignedIn, isLoaded } = useUser();

  const { onOpen } = useModal();

  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col h-full items-center justify-center bg-pastel-primary overflow-x-hidden ">
      <div className="font-jersey text-9xl text-pastel-fourth flex">
        <p>RIZZ</p>
        <ChevronsRight className="h-20 w-20 text-pastel-fourth" />
      </div>
      <div className="font-jersey text-9xl text-pastel-fourth flex">
        <ChevronsLeft className="h-20 w-20 text-pastel-fourth" />
        <p>CORD</p>
      </div>
      <div className="mt-4 flex gap-x-2 w-[280px] items-center justify-center overflow-hidden">
        {!isSignedIn ? (
          <>
            <Button
              className="w-[50%] bg-pastel-fourth font-jersey"
              onClick={() => router.push("/sign-in")}
              disabled={!isLoaded}
            >
              {!isLoaded ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <span>sign in</span>
              )}
            </Button>
            <Button
              className="w-[50%] bg-pastel-fourth font-jersey"
              onClick={() => router.push("/sign-up")}
              disabled={!isLoaded}
            >
              {!isLoaded ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  Get started <ChevronsRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-[50%] bg-pastel-fourth font-jersey"
              onClick={() => {onOpen('joinServer')}}
              disabled={!isLoaded}
            >
              {!isLoaded ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <span>Join server</span>
              )}
            </Button>
            <Button
              className="w-[50%] bg-pastel-fourth font-jersey"
              onClick={() => onOpen("createServer")}
              disabled={!isLoaded}
            >
              {!isLoaded ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <>create server</>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePageModal;
