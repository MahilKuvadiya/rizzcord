import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const InvitePage = async ({ params }: {params : {inviteCode : string}}) => {
    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn()
    }

    const existingMember = await db.server.findFirst({
        where : {
            inviteCode : params.inviteCode,
            members : {
                some : {
                    profileId : profile.id
                }
            }
        }
    });

    if(existingMember) { 
        return redirect(`/servers/${existingMember.id}`)
    }

    const server = await db.server.update({
        where : {
            inviteCode : params.inviteCode
        },
        data : {
            members : {
                create : [
                    {
                        profileId : profile.id
                    }
                ]
            }
        }
    }).catch(err => {
        return redirect("/");
    });

    if(server){
        return redirect(`/servers/${server.id}`)
    }


  return null;
}

export default InvitePage