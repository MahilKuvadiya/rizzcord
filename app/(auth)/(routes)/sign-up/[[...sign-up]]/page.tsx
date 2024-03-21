import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
        <SignUp
        afterSignUpUrl='/'/>
    )
}

export default page