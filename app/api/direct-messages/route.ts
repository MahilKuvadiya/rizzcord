import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server"

const MESSAGE_BATCH = 10

export async function GET(
    req:Request
){

    const { searchParams } = new URL(req.url)

    try{
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse('Unauthorized from api/ messages/ route.ts', { status : 401 })
        }

        const cursor = searchParams.get('cursor')
        const conversationId = searchParams.get('conversationId')

        if(!conversationId){
            return new NextResponse('Channel ID missing from api/messages/ route.ts', { status : 400 })
        }

        let messages : DirectMessage[] = [];

        if(cursor){
            messages =await db.directMessage.findMany({
                take : MESSAGE_BATCH,
                skip : 1,
                cursor : {
                    id : cursor
                },
                where : {
                    conversationId : conversationId
                },
                include :{
                    member : {
                        include : {
                            profile : true
                        }
                    }
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })
        } else {
            messages =await db.directMessage.findMany({
                take : MESSAGE_BATCH,                
                where : {
                    conversationId : conversationId
                },
                include :{
                    member : {
                        include : {
                            profile : true
                        }
                    }
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })
        }

        let nextCursor = null;

        if(messages.length === MESSAGE_BATCH){
            nextCursor = messages[MESSAGE_BATCH-1].id
        }

        return  NextResponse.json({
            messages : messages,
            nextCursor
        })
    }catch ( error ){
        console.log('Error from api/ direct - messages/ route.ts ',error)
        return new NextResponse('Internal server error',{ status : 500 })
    }
}