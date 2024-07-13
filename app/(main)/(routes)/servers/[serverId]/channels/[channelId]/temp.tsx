"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { ArrowUp } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const TempComp = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [initialLoad, setInitialLoad] = useState(true);

  const handleClick = () => {
    signOut(() => {
      router.push("/");
    })
  }

  useEffect(() => {
    // Check if it's not the initial load
    if (!initialLoad) {
        if(!pathname?.split('/').includes('servers') || !pathname?.split('/').includes('channels')) {
            handleClick()
        }
    }
    // After the first render, set initialLoad to false
    if (initialLoad) {
        console.log('changedd' + new Date().getTime())
      setInitialLoad(false);
    }
  }, [pathname]);

  return (
    <>
      <Button
        className="absolute right-2 top-14 p-4 bg-primary text-white "
        onClick={() => handleClick()}
      >
        Sign-Out from guest session
      </Button>
      <ArrowUp className="absolute right-8 top-28 text-primary h-6 w-6 animate-bounce" />
    </>
  );
};

export default TempComp;