import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
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
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topRef = chatRef?.current;

    const handelScroll = () => {
      const scrollTop = topRef?.scrollTop;

      console.log("scrolltop : ", scrollTop);

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topRef?.addEventListener("scroll", handelScroll);

    return () => topRef?.removeEventListener("scroll", handelScroll);
  }, [shouldLoadMore, loadMore, chatRef]);
};
