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
  name: z.string().min(2, {
    message: "Name should be more than 2 characters.",
  }),
  imageUrl: z.string().min(2, {
    message: "Server image is required.",
  }),
});

const CreateServerModal = () => {
  const {isOpen , onClose , type} = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type==='createServer';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      await axios.post('/api/servers',values)

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
      <DialogContent className="space-y-0 bg-pastel-primary text-pastel-fourth p-0 w-[30%]">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-2xl font-jersey">
            Customize your server
          </DialogTitle>
          <hr className=" border-pastel-fourth border-1" />
          <DialogDescription className="font-rilo text-center">
            Give your server a personality with a name and image.
            <br />
            You can always change it later.
          </DialogDescription>
        </DialogHeader>
       
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-6">
              <div className="flex item-center justify-center text-center font-jersey">
                <FormField 
                  control= {form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={field.onChange}
                          value = {field.value} 
                          endPoint = 'serverImage'
                        />
                      </FormControl>
                      <FormMessage className='font-rilo' />
                    </FormItem>
                  )}
                />
              </div>
                    <br/>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="font-jersey text-pastel-fourth dark:text--pastel-primary">
                      Server name<span className="font-inter text-lg">:</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-pastel-secondary border-2 border-pastel-fourth focus-visible:ring-0 text-pastel-fourth font-semibold focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='font-rilo' />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-3 pt-0">
              <Button
                disabled={isLoading}
                className="bg-pastel-fourth hover:bg-pastel-fourth/50 hover:text-pastel-fourth font-jersey font-extralight"
              >
                create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
