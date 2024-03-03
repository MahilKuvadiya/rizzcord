import { Hash, MailboxIcon } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
};

export const ChatWelcome = ({
  name,
  type
}: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-pastel-secondary dark:bg-dark-secondary flex items-center justify-center">
          <MailboxIcon className="h-12 w-12 text-pastel-fourth dark:text-dark-fourth" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold font-rilo text-pastel-fourth dark:text-dark-fourth">
        {type === "channel" ? "Welcome to #" : ""}{name}
      </p>
      <p className="text-pastel-third font-rilo dark:text-dark-third text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with --${name}--`
        }
      </p>
    </div>
  )
}