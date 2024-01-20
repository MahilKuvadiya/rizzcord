"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


// "use client";

// import { Italic, Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import { Toggle } from "@/components/ui/toggle";
// import { useState } from "react";

// export function ModeToggle() {
//   const { setTheme } = useTheme();
//   const [bool, setBool] = useState(true);//true = dark


//   const triggerFunction = () => {
    
//     if (bool) {
//         console.log("d")
//         setTheme("dark");
//         setBool(false)
//     }
//     else{
//         console.log("l")
//         setTheme("light")
//         setBool(true)
//     }

//   };


//   return (
//     <Toggle variant="outline" aria-label="Toggle italic" onClick={triggerFunction}>
//         <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" onClick={}/>
//         <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//     </Toggle>
//   );
// }
