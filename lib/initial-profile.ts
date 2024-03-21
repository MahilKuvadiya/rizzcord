import { auth, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  } else {
    console.log("\n\n" + userId + "userID\n\n");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (profile) return profile;

  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const newProfile = await db.profile.create({
    data: {
      userId: userId,
      userName: `${user.username}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
