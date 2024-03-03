"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { MoveUp, Plus, SendHorizonal, Smile } from "lucide-react";
import { Input } from "../ui/input";
import axios from "axios";
import { useModal } from "@/hooks/modal-store";

interface ChatInputProps {
  apiUrl: string;
  query : Record<string,any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {


  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit =async (values: z.infer<typeof formSchema>) => {
    try{
        const dataPackage = {
            values : values,
            query : query
        }
    
        const res = await axios.post(apiUrl,dataPackage)

        form.reset();
    }catch (error){
        console.log(error)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
              <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen('messageFile', { apiUrl , query } )}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-pastel-third dark:bg-dark-third hover:bg-pastel-third
                     dark:hover:bg-dark-third/40 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-dark-primary" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-pastel-secondary/90 dark:bg-dark-secondary border-none border-0 focus-visible:ring-0 
                    focus-visible:ring-offset-0 shadow-inner shadow-pastel-fourth
                    font-rilo text-pastel-fourth dark:text-dark-fourth "
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <button 
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  className="absolute top-7 right-8 text-pastel-fourth">
                    <SendHorizonal />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
