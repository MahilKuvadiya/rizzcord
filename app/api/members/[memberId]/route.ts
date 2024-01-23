import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function PATCH(
    req : Request,
    {params} : {params : { memberId : string}}
) {
    try{
        const profile = await currentProfile();
        
        if(!profile ) {
            return new NextResponse("Unauthorized from api/members/member ID", { status : 401})
        }

        const { serverId , memberId , role } = await req.json();

        if(!serverId) { 
            return new NextResponse("Server ID missing" , { status : 400 })
        }

        if(!params.memberId && params.memberId !== memberId){
            return new NextResponse("MemberId missing" ,{ status : 400} );
        }

        const response = await db.server.update({
            where : {
                id : serverId,
                profileId : profile.id
            },
            data : {
                members : {
                    update : {
                        where : {
                            id : memberId,
                            profileId : {
                                not : profile.id
                            }
                        },
                        data : {
                            role : role
                        }
                    }
                }
            },
            include : {
                members : {
                    include : {
                        profile : true
                    },
                    orderBy : {
                        role : 'asc'
                    }
                }
            
            }
            
        })


        return NextResponse.json(response)
    }catch ( error ){
        console.log("Error from api/members/ memberID / route", error)
        return new NextResponse("Internnal server Error" , { status : 500 });
    }
}