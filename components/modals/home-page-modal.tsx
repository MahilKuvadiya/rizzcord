"use client";

import { UserButton, useSignIn, useUser } from "@clerk/nextjs";
import { ChevronsRight, ChevronsLeft, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/modal-store";
import { useState } from "react";

const HomePageModal = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { isLoaded: isSignedInLoaded, signIn, setActive } = useSignIn();


  const { onOpen } = useModal();

  const router = useRouter();

  const handleClick = () => {
    console.log('click')
    handleSubmit()
  }

  const [email, setEmail] = useState('kuvadiya333@gmail.com');
  const [password, setPassword] = useState('Guest#12345678');

  const handleSubmit = async () => {
    console.log('m')
    console.log(isSignedInLoaded)
    if (!isSignedInLoaded) return;
    console.log('mm')
    
    try {
      const result =await signIn.create( {
        strategy: 'password',
        identifier: email,
        password : password
      })
      console.log(result)
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.refresh();
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="flex flex-1 flex-col h-full items-center justify-center bg-pastel-primary overflow-x-hidden">
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
          <div className=" flex items-center justify-center w-full h-full flex-col gap-y-2">
            <div className="flex w-full h-full items-center justify-center gap-x-2">
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
              
                </div>
            <Button
              className="w-[100%] bg-pastel-fourth font-jersey"
              onClick={() => handleClick()}
              disabled={!isLoaded}
              >
              {!isLoaded ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  Visit as Guest <ChevronsRight className="h-4 w-4" />
                </>
              )}
            </Button>
              </div>
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
