import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
    req : Request,
    { params } : { params : { channelId : string }}
){
    try {
        const profile = await currentProfile();

        const { serverId , values } = await req.json();

        const { name , type } = values

        if(!profile) { 
            return new NextResponse('Unauthorized', { status : 401 })
        }

        if(!params.channelId) { 
            return new NextResponse('Channel ID missing' , {status : 400 })
        }

        console.log(serverId,'aac')
        if(!serverId){
            return new NextResponse("Server prop missing" , { status : 400 })
        }

        const response = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            not : MemberRole.SPIDER
                        }
                    }
                }
            },
            data: {
                channels : {
                    update : {
                        where : {
                            id : params.channelId,
                            channelName : {
                                not : 'general'
                            }
                        },
                        data : {
                            channelName : name,
                            type : type
                        }
                    }
                }
            }
        })

        return NextResponse.json(response);
    } catch (error) {
        console.log("Error from /api/channel/channelId",error);
        return new NextResponse('Internal server error', { status : 500 })
    }
}