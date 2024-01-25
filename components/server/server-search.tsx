'use client'

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data : {
        label : string,
        type : 'member' | 'channel',
        data : {
            icon : React.ReactNode,
            name : string,
            id : string
        }[] | undefined ;
    }[]
}

export const ServerSearch = ({
    data
} : ServerSearchProps) => { 
    const router = useRouter();
    const params = useParams();

    const [isOpen,setIsOpen] = useState(false);

    const onClick = ({id , type } : {id:string , type : 'channel' | 'member' }) => {
        setIsOpen(false);

        if(type === 'channel'){
            router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
        if(type === 'member'){
            router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }
     }


    useEffect(()=> {
        const down = (e : KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        } 

        document.addEventListener('keydown',down)
        return () => document.removeEventListener("keydown",down)
    } , [] )
    return ( 
        <>
        <button
        onClick={() => setIsOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full
        bg-pastel-third/20 hover:bg-pastel-third/50 dark:hover:bg-dark-secondary/50 transition
        text-pastel-third hover:text-pastel-fourth dark:text-dark-third dark:hover:text-dark-fourth
         shadow-inner shadow-pastel-fourth" >
            <Search className="h-4 w-4"/>
            <p className="font-rilo font-sm">
                Search
            </p>
            <kbd
            className="pointer-event-none inline-flex h-5 select-none items-center gap-1 rounded border
            px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto border-pastel-third
            text-pastel-third">
                <span className="text-xs">CTRL</span>K
            </kbd>
        </button>
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput placeholder="Search all channels and members" className="font-rilo"/>
            <CommandList>
        
                <CommandEmpty >
                    No results found.
                </CommandEmpty>
                {data.map(({ label , type , data }) => {
                    if(!data?.length){
                        return null;
                    }

                    return (
                        <CommandGroup key={label} heading={label}>
                            {data.map(({ id , name , icon }) => {
                                return(
                                    <CommandItem key={id} className="hover:text-pastel-fourth"
                                    onSelect={() => onClick({id, type})}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
        </>
    )
}
