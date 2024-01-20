import { Server,Member, Profile } from "@prisma/client";

export type ServerWithMemberAndProfile = Server & {
    members : (Member & { profile : Profile})[]
}