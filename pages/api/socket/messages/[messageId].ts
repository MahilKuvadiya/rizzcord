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

    const { values } = req.body;
    
    const messageId = req.query["messageId"]?.toString();
    const serverId = req.query["serverId"]?.toString();
    const channelId = req.query["channelId"]?.toString();

    if (!profile) {
      return res.status(401).json({ body: "Unauthorized" });
    }

    if (!channelId || !serverId) {
      return res.status(400).json({ body: "Request props missing" });
    }

    if (!messageId) {
      return res.status(400).json({ body: "messageid missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!server) {
      return res.status(404).json({ body: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      return res.status(404).json({ body: "Channel not found" });
    }
    
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ body: "member not found" });
    }

    let message = await db.channelMessage.findFirst({
      where: {
        id: messageId,
        channelId: channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ body: "Message not found" });
    }

    const isMessageOwner = message?.member?.profileId == profile.id;
    const isLeader = member.role === MemberRole.LEADER;
    const isCOleader = member.role === MemberRole.COLEADER;
    const isElder = member.role === MemberRole.ELDER;

    const canEdit = isMessageOwner || isLeader || isCOleader || isElder;

    if (!canEdit) {
      return res.status(401).json({ body: "Unauthorized from line 103" });
    }

    if (req.method === "DELETE") {
      message = await db.channelMessage.update({
        where: {
          id: messageId,
          channelId: channelId,
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

      message = await db.channelMessage.update({
        where: {
          id: messageId,
          channelId: channelId,
        },
        data: {
          content: values.content,
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

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("Error from pages/api/socket/messages/messageis.ts", err);
    return res.status(500).json({ body: "Internal server error" });
  }
}
