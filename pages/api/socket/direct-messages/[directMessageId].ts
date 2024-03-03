import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ body: "Method not allowed." });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content } = req.body;
    
    const { conversationId, directMessageId } = req.query

    if (!profile) {
      return res.status(401).json({ body: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "conversation ID missing" });
    }

    if (!directMessageId) {
      return res.status(400).json({ body: "direct messageId missing" });
    }

    const conversation = await db.conversation.findUnique({
      where : {
        id : conversationId as string,
        OR : [
          {
            memberOne : {
              profileId : profile.id
            }
          },
          {
            memberTwo : {
              profileId : profile.id
            }
          }
        ]
      },
      include : {
        memberOne : {
          include : {
            profile : true
          }
        },
        memberTwo : {
          include : { 
            profile : true
          }
        }
      }
    });

    if(!conversation){
      return res.status(404).json({body : 'Conversation is missing.'});
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo
    
    if (!member) {
      return res.status(404).json({ body: "member not found" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId : conversationId as string
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ body: "Message not found" });
    }

    const isMessageOwner = directMessage?.member?.profileId == profile.id;
    const isLeader = member.role === MemberRole.LEADER;
    const isCOleader = member.role === MemberRole.COLEADER;
    const isElder = member.role === MemberRole.ELDER;

    const canEdit = isMessageOwner || isLeader || isCOleader || isElder;

    if (!canEdit) {
      return res.status(401).json({ body: "Unauthorized from line 103" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          fileUrl: "",
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ body: "Unauthorized" });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;


    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (err) {
    console.log("Error from pages/api/socket/messages/messageis.ts", err);
    return res.status(500).json({ body: "Internal server error" });
  }
}
