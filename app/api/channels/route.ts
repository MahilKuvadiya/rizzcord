import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req : Request){
    try{
        const profile = await currentProfile();

        if(!profile ){
            return new NextResponse("Unauthorized from api/channels",{ status : 401 })
        }

        const { serverId , values } = await req.json();
        const { name , type } : { 
            name : string , 
            type : ChannelType
        } = values;

        if(!serverId){
            return new NextResponse("Server ID is Missing" , { status : 400 });
        }

        if( name.toLocaleLowerCase() === 'general'){
            return new NextResponse('Channel name cannot be "General',{status:400});
        }

        const response = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in : [
                                MemberRole.COLEADER,
                                MemberRole.LEADER,
                                MemberRole.ELDER
                            ]
                        }
                    }
                }
            },
            data : {
                channels : {
                    create : [
                        { channelName : name , type : type , profileId : profile.id}
                    ]
                }
            }
        })

        return NextResponse.json(response);

    }catch( error ){
        return new NextResponse("Error from /api/channels",{ status : 500 });
    }
}