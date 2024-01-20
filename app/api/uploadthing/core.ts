import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
const f = createUploadthing();
 

const handleAuth = () =>{
    const { userId }= auth();
    if(!userId){
        throw new Error("UnAuthorized");
    }

    return {userId : userId};
}

export const ourFileRouter = {
  serverImage : f({
    image : {
        maxFileSize : '4MB',
        maxFileCount : 1
    }
  }).middleware ( () => handleAuth())
  .onUploadComplete(() => console.log("Image uploaded!")),
  
  messegeFile : f([
    "image",
    "pdf"
  ]).middleware(() => handleAuth())
  .onUploadComplete(() => console.log("File uploadede!"))

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;