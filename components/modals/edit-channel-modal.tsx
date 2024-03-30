"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
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
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect } from "react";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name should be more than 1 characters.",
  }).refine(
    name => name.toLowerCase() !== 'general',
    {
        message : 'Channel name cannot be "General"'
    }
  ),
  type : z.nativeEnum(ChannelType)
});


const EditChannelModal = () => {
  const {isOpen , onClose , type ,data} = useModal()
  const router = useRouter()
  const params = useParams()

  const isModalOpen = isOpen && type==='editChannel';
  const { channel , server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT
    },
  });

  useEffect(()=>{
    if( channel ){
        form.setValue('name',channel.channelName)
        form.setValue('type',channel.type)
    }
  },[channel ,form])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const dataPackage = {
        serverId : server?.id,
        values : values
      }
      const res = await axios.patch(`/api/channels/${channel?.id}/edit-channel`,dataPackage)

      form.reset();
      router.refresh();
      onClose();
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
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 md:w-[30%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Edit channel
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
        </DialogHeader>
       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6 space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-jersey text-pastel-fourth dark:text--pastel-primary">
                      Channel name<span className="font-inter text-lg">:</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-pastel-secondary border-2 border-pastel-fourth focus-visible:ring-0 text-pastel-fourth font-semibold focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='font-rilo' />
                  </FormItem>
                )}
              />
              <FormField 
              control={form.control}
              name = 'type'
              render={({field}) => (
                <FormItem className="space-y-0">
                    <FormLabel className="font-jersey text-pastel-fourth dark:text--pastel-primary pb-0 mb-0">
                      Channel type<span className="font-inter text-lg">:</span>
                    </FormLabel>
                    <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger
                            className="bg-pastel-secondary border-2 border-pastel-fourth focus-visible:ring-0 text-pastel-third font-semibold font-jersey focus-visible:ring-offset-0">
                                <SelectValue placeholder='Select a channel type'/>
                            </SelectTrigger>
                        </FormControl>
                        <FormMessage className="font-rilo"/>
                        <SelectContent className="bg-pastel-secondary font-jersey text-pastel-third">
                            {Object.values(ChannelType).map((type) => (
                                <SelectItem 
                                className="hover:bg-pastel-third focus-visible:ring-0 focus-visible:ring-offset-0"
                                key={type}
                                value={type}
                                >
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>

              )}
              />

            </div>
            <DialogFooter className="px-6 py-3 pt-0">
              <Button
                disabled={isLoading}
                className="bg-pastel-fourth hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
              >
                save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
