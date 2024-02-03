"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endPoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Uploading Image" className="rounded-2xl" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 rounded-lg text-white p-1 absolute 
                            top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if(value && fileType === 'pdf'){
    return(
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-20 w-20 fill-pastel-secondary stroke-pastel-fourth" />
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-pastel-fourth dark:text-dark-fourth hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      className="bg-pastel-secondary border-2
             border-pastel-fourth"
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log("Upload error", error);
      }}
      appearance={{
        allowedContent:
          "flex h-8 flex-col items-center justify-center px-2 text-pastel-third",
        button:
          "ut-ready:bg-pastel-third ut-uploading:cursor-not-allowed rounded-r-none bg-pastel-third bg-none after:bg-pastel-fourth",
        label:
            "text-pastel-third hover:text-pastel-fourth",
        uploadIcon:
            "relative h-20 w-20 text-pastel-third hover:text-pastel-fourth",
        container:
            "p-2 "
        
      }}
    />
  );
};
