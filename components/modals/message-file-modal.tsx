"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/modal-store";


const formSchema = z.object({
  fileUrl: z.string().min(2, {
    message: "attachment is required.",
  }),
});

const MessageFileModal = () => {
  const {isOpen , onClose , type , data} = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type==='messageFile';

  const { apiUrl , query } = data;

    let serverId : string | undefined= undefined
    let channelId : string | undefined = undefined

    if(query){
        serverId = query['serverId']
        channelId = query['channelId']
    }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{

        const dataPackage = {
            values : values,
            serverId : serverId,
            channelId : channelId
        }

      await axios.post(apiUrl || "",dataPackage)

      form.reset();
      router.refresh();
      handleClose();
    }catch(error){
      console.log("Error", error)
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  }

  return (
    <Dialog open = {isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 w-[30%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Add an attachments
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
          <DialogDescription className="font-rilo text-center">
            send a file as a message.
          </DialogDescription>
        </DialogHeader>
       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6">
              <div className="flex item-center justify-center text-center font-jersey">
                <FormField 
                  control= {form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={field.onChange}
                          value = {field.value} 
                          endPoint = 'messageFile'
                        />
                      </FormControl>
                      <FormMessage className='font-rilo' />
                    </FormItem>
                  )}
                />
              </div>
              
            </div>
            <DialogFooter className="px-6 py-3 pt-0">
              <Button
                disabled={isLoading}
                className="bg-pastel-fourth hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
              >
                send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
