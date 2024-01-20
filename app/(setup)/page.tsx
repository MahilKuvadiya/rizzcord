import InitialModel from "@/components/modals/initial-model";
import { db } from "@/lib/db"
import { initialProfile } from "@/lib/initial-profile"
import { UserButton,UserProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const page =async () => {

  
  const profile = await initialProfile();

  const servers = await db.server.findFirst({
    where: {
      members : {
        some : {
          profileId : profile.id
        }
      }
    }
  })

  if(servers)
    return redirect(`/servers/${servers.id}`);
  
  return (
    <InitialModel />
  )
}

export default page