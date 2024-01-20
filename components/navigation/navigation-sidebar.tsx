import { redirect } from "next/navigation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItems } from "./navigation-items";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {

    const profile = await currentProfile();

    if(!profile){
        redirect("/")
    }

    const servers =await db.server.findMany({
        where : {
            members : {
                some : {
                    profileId : profile.id
                }
            }
        }
    });

    return (
        <div className="bg-pastel-third space-y-4 flex flex-col items-center h-full text-primary w-full py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-pastel-secondary w-10 rounded-md mx-auto dark:bd-dark-third"/>
            <ScrollArea className='flex-1 w-full'>
                {servers.map( (server) => (
                    <div key={server.id}>
                        <NavigationItems 
                            id = {server.id}
                            name = {server.serverName}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton 
                afterSignOutUrl="/"
                appearance={{
                    elements : {
                        avatarBox : "h-[48px] w-[48px]"
                    }
                }}/>

            </div>
        </div>
    )
}