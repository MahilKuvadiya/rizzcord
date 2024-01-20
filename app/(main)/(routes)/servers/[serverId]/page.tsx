import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const ServerIdPage = async () => {
  return (
    <div className="bg-pastel-primary flex h-full w-full z-0">
        hii
    </div>
  )
}
 
export default ServerIdPage;