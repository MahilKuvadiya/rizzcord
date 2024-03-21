import HomePageModal from "@/components/modals/home-page-modal";
import InitialModel from "@/components/modals/initial-model";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Button } from "@/components/ui/button";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton, UserProfile, redirectToSignIn } from "@clerk/nextjs";
import { ChevronsLeft, ChevronsRight, Home } from "lucide-react";
import { redirect } from "next/navigation";

const page = async () => {
  const profile = await initialProfile();

  if (!profile) {
    return (
      <HomePageModal />
    );
  }else{
    console.log("profile exists " + profile.email)
  }

  const servers = await db.server
    .findFirst({
      where: {
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
    })
    .catch((e) => {
      console.log(e);
    }).finally(()=>{
      console.log("server found")
    });

  if (servers) return redirect(`/servers/${servers.id}`);

  return (
      <HomePageModal />
  );
};

export default page;
