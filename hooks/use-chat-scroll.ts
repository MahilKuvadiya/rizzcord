import { RefObject } from "react";
import { useState, useEffect } from "react";

type ChatScrollProps = {
  chatRef: RefObject<HTMLDivElement>;
  bottomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, sethasInitialized] = useState(false);
  const [previousHeight, setPreviousHeight] = useState<number | undefined>();

  // useEffect(() => {
  //   setTimeout(()=>{
  //     setPreviousScroll(chatRef.current?.scrollHeight);
  //   },100);
  //   console.log(previousScroll+'....previousScoll')

  // }, []);

  useEffect(() => {
    const topDiv = chatRef?.current;



    const handleScroll = () => {
      if (!topDiv) {
        return;
      }

      const scrollTop = topDiv?.scrollTop;

      if (scrollTop <= 200 && shouldLoadMore) {
        setPreviousHeight(topDiv.scrollHeight);
        console.log("previous scroll   " + previousHeight);
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        sethasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
