'use client'

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicatior = () => {
    const { isConnected } = useSocket();

    if(!isConnected){
        return (
            <Badge variant='outline' className='bg-orange-600 text-white border-none'>
                Fallback : polling every 1s
            </Badge>
        )
    }

    return (
        <Badge variant='outline' className=' bg-emerald-600 text-white border-none'>
            Live : real-time updates
        </Badge>
    )
}