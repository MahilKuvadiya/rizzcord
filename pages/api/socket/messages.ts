import {  currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler (
    req : NextApiRequest,
    res : NextApiResponseServerIo
){
    if(req.method !== 'POST') {
        return res.status(405).json({error : 'Method not allowed.'})
    }

    try{
        const profile = await currentProfilePages(req);
        
        const { serverId , channelId , values } =  req.body
        let { content , fileUrl } = values

        if(!content && fileUrl){
            content = fileUrl
        }

        if(!profile){
            return res.status(401).json({message : "Unauthorized from pages/api/socket/messages"})
        }

        if(!serverId){
            return res.status(401).json({message : "serverId missing from pages/api/socket/messages"})           
        }

        if(!channelId){
            return res.status(401).json({message : "channel ID missing from pages/api/socket/messages"})           
        }

        const server = await db.server.findUnique({
            where : {
                id : serverId
            },
            include : { 
                members : true
            }
        })

        if(!server) {
            return res.status(404).json({message : 'Server not found'})
        }

        const channel = await db.channel.findUnique({
            where : {
                id : channelId,
                serverId : serverId
            }
        })

        if(!channel){
            return res.status(404).json({message : 'Channel not found'})
        }

        const member = server.members.find((member) => member.profileId === profile.id)

        if(!member){
            return res.status(404).json({message : 'Member not found'})
        }

        const message = await db.channelMessage.create({
            data : {
                content : content,
                fileUrl : fileUrl,
                channelId : channel.id,
                memberId : member.id
            },
            include : {
                member: { 
                    include : {
                        profile : true
                    }
                }
            }
        })

        const ChannelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(ChannelKey,message)

        return res.status(200).json(message)
    }catch ( error ){
        console.log('error from pages/api/socket/message.ts ', error)
        return res.status(500).json({message : 'Internal server error.'});
    }
}