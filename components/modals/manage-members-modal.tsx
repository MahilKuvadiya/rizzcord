import { useModal } from "@/hooks/modal-store";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ServerWithMemberAndProfile } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  Check,
  Croissant,
  Crown,
  Loader,
  MemoryStick,
  MoreVertical,
  ShieldQuestion,
  Trash2,
  Wand,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  LEADER: <Crown className="h-4 w-4" />,
  COLEADER: <Croissant className="h-4 w-4" />,
  ELDER: <Wand className="h-4 w-4" />,
  SPIDER: null,
};

const ManageMembersModal = () => {
  const { onOpen, type, isOpen, onClose, data } = useModal();
  const { server } = data as { server: ServerWithMemberAndProfile };
  const router = useRouter();

  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "manageMembers";


  //sort members according to the roles
  const leaderMember = server?.members?.filter(
    (member) => member.role === MemberRole.LEADER
  ) || [];
  const coLeaderMember = server?.members?.filter(
    (member) => member.role === MemberRole.COLEADER
  ) || [];
  const elderMember = server?.members?.filter(
    (member) => member.role === MemberRole.ELDER
  ) || [];
  const spiderMember = server?.members?.filter(
    (member) => member.role === MemberRole.SPIDER
  ) || [];

  const sortedMembers = leaderMember.concat(coLeaderMember,elderMember,spiderMember);

  const onRoleChange = async (memberId : string , role : MemberRole ) => {
    try { 
      setLoadingId(memberId);

      const dataPackage = { 
        serverId : server?.id,
        memberId : memberId,
        role : role
      }

      console.log("ahoy")
      const response = await axios.patch(`/api/members/${memberId}` , dataPackage);
      console.log("ahoyahoy")

      router.refresh();
      onOpen("manageMembers" , { server : response.data })
    }catch ( error ) {
      console.log("Error from manage members modal onRoleChange method.");
    }finally { 
      setLoadingId("");
    }
  }

  const onKick = async (memberId : string) => {
    try { 
      setLoadingId(memberId);

      const dataPackage = {
        serverId : server?.id,
      }

      const response = await axios.patch(`/api/members/${memberId}/delete-member`, dataPackage);

      router.refresh();
      onOpen('manageMembers',{ server : response.data })
    }catch ( error ){ 
      console.log("error from manage-members-modals onKick function")
    }finally{
      setLoadingId("");
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth pt-0 pb-0 w-[30%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Manage Spiders
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
          <DialogDescription>
            {server?.members?.length} Spiders
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[420px] pr-6">
          <div className="space-y-3">
            {sortedMembers.map((member) => (
              <div className="flex items-center gap-x-3" key={member.id}>
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-0">
                  <div className="text-sm font-bold flex items-center font-rilo gap-x-4">
                    {member.profile.userName}
                    {roleIconMap[member.role]}
                  </div>
                  <div className="text-xs flex items-center font-riloLight">
                    {member.profile.email}
                  </div>
                </div>
                {server.profileId !== member.profileId && loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left" className="bg-pastel-primary dark:bg-dark-primary 
                      text-pastel-third dark:text-dark-third space-y-[2px] shadow-black shadow-2xl">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          className="flex items-center"
                        >
                          <ShieldQuestion
                            className="w-4 h-4 mr-2"
                          />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="bg-pastel-primary dark:bg-dark-primary 
                        text-pastel-third dark:text-dark-third space-y-[2px] shadow-black shadow-2xl">
                            <DropdownMenuItem
                            onClick={() => member.role !== "SPIDER" && onRoleChange(member.id,'SPIDER')}
                            >
                              <MemoryStick className="h-4 w-4 mr-2" />
                              SPIDER
                              {member.role === "SPIDER" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />  
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => member.role !== "ELDER" && onRoleChange(member.id,'ELDER')}
                            >
                              <Wand className="h-4 w-4 mr-2" />
                              ELDER
                              {member.role === "ELDER" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => member.role !== "COLEADER" && onRoleChange(member.id,'COLEADER')}
                            >
                              <Croissant className="h-4 w-4 mr-2" />
                              COLEADER
                              {member.role === "COLEADER" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onKick(member.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader className="animate-spin h-4 w-4 ml-auto" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
