import { IState } from "@/store/reducer/room";
import { RefObject, useEffect } from "react";
import { useAppSelector } from "./app";

export default function useScroll(scrollEl: RefObject<HTMLDivElement>) {
  const { scrollToTop, scrollToEnd } = useAppSelector<IState>(
    (state) => state.room
  );
  function handleScrollToTop() {
    if (scrollEl.current?.scrollTop !== undefined) {
      scrollEl.current?.scrollTo({ top: 0 });
    }
  }
  function handleScrollToBottom() {
    scrollEl.current?.scrollTo({ top: 999999999 });
  }
  function getBottomSpace() {
    if (scrollEl.current?.scrollTop !== undefined) {
      return scrollEl.current.scrollHeight - scrollEl.current.scrollTop;
    }
    return NaN;
  }
  useEffect(() => {
    handleScrollToTop();
  }, [scrollToTop]);
  useEffect(() => {
    handleScrollToBottom();
  }, [scrollToEnd]);
  return {
    getBottomSpace,
    handleScrollToTop,
    handleScrollToBottom,
  };
}
