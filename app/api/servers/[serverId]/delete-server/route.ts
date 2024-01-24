import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    { params } : { params : { serverId : string } }
){
    try {
        
        const profile = await currentProfile();

        if(!profile) { 
            return new NextResponse("UNauthorized from /api/servers/serverId/delete-server", { status : 401 })
        }

        if(!params.serverId ){ 
            return new NextResponse("Server Id missing", { status : 400}); 
        }

        const response = await db.server.delete({
            where : { 
                id : params.serverId
            }
        })

        return NextResponse.json(response);
    } catch (error) {
        console.log("Error from /api/servers/serverId/delete-server",error);
        return new NextResponse("Internal server error", { status : 500 })
    }
}