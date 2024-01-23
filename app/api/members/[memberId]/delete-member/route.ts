import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params } : { params : { memberId : string }}
) {
    try { 
        const profile  = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized from api/members/memberId Delete method", { status :  401 });
        }

        const { serverId } =await req.json();

        if(!serverId) { 
            return new NextResponse("Server ID missing", {status : 400 });
        }

        if(!params.memberId) { 
            return new NextResponse('Member ID missing',{ status : 400});
        }

        const server  = await db.server.update({
            where : { 
                id:serverId,
                profileId : profile.id
            },
            data : {
                members : { 
                    deleteMany : {
                        id : params.memberId,
                        profileId : {
                            not : profile.id
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true,
                    },
                    orderBy : {
                        role : 'asc'
                    }
                }
            }

        })

        return NextResponse.json(server);
    }catch ( error ){ 
        console.log("Error on delete /members/:memberId", error);
        return new Response('Server Error', { status: 500 });
    }
}