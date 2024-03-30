import React from "react";
import { Hash, Plus, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Loading = () => {
  return (
    <div className="h-full ">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <div className="bg-pastel-third space-y-4 flex flex-col items-center h-full text-primary w-full py-3">
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
          group-hover:rounded-[16px] transition-all overflow-hidden 
          items-center justify-center bg-background dark:bg-neutral-700 
          group-hover:bg-pastel-secondary/40"
          >
            <Plus
              className="group-hover:text-background transition text-pastel-third/40"
              size={25}
            />
          </div>
          <Separator className="h-[2px] bg-pastel-secondary w-10 rounded-md mx-auto dark:bd-dark-third" />
          <div className="group flex relative items-center">
            <div className="absolute left-0 bg-pastel-third/40 rounded-r-full transition-all w-[4px] h-[36pz]" />
            <div className="animate-pulse relative group flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden bg-primary/10 text-primary rounded-[16px]"></div>
          </div>
          <div>

          </div>
        </div>
      </div>
      <div className="md:pl-[72px] h-full">
      <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 ">
        <div className="flex flex-col h-full bg-pastel-secondary w-full dark:bg-dark-primary">
          <div
            className="w-full text-md font-rilo font-semibold px-3 flex items-center h-12 border-pastel-third/60
            dark:border-dark-third border-b-2 bg-pastel-secondary hover:bg-pastel-third/40 transition shadow-md"
          >
            <p className="w-40 h-4 bg-pastel-third/40 rounded-lg animate-pulse"></p>
          </div>
          {/*server search bar*/}
          <div className="mt-2 mb-0 pb-4 px-3">
            <div
              className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full
        bg-pastel-third/40 hover:bg-pastel-third/50 dark:hover:bg-dark-secondary/50 transition
        text-pastel-third hover:text-pastel-fourth dark:text-dark-third dark:hover:text-dark-fourth
        shadow-inner shadow-pastel-third animate-pulse"
            >
              <Search className="h-4 w-4" />
              Search
            </div>
          </div>
          {/* general channel */}
          <div className="flex items-center justify-between py-1 px-3">
            <p
              className="font-jersey text-sm text-pastel-third/40 
            dark:text-dark-third animate-pulse"
            >
              TEXT CHANNEL
            </p>
            <Plus className="text-pastel-third/40 animate-pulse ml-auto h-4 w-4 " />
          </div>
          <div className="flex items-center py-1 text-pastel-third/40 font-rilo px-5">
            <Hash className="mr-2 h-4 w-4 flex-shrink-0" />
            general
          </div>
        </div>
      </div>
      <div className="h-full md:pl-60">
      <div className="bg-pastel-primary dark:bg-dark-primary flex flex-col h-full ">
        
        {/*Chat header*/}
        <div
          className="w-full text-md font-rilo font-semibold px-3 flex items-center h-12 border-pastel-third/60
        dark:border-dark-third/60 border-b-2 bg-pastel-primary transition shadow-md
        dark:bg-dark-primary"
        >
          <div className="text-pastel-third/40 flex animate-pulse items-center">
            <p className="w-5 h-5 bg-pastel-secondary/40 rounded-lg animate-pulse mr-2"></p>
            <p className="w-40 h-4 bg-pastel-secondary/40 rounded-lg animate-pulse"></p>
          </div>
        </div>
      </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Loading;
