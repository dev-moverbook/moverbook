import { useEffect, useRef, useCallback, RefObject } from "react";

interface UseInfiniteScrollObserverArgs {
  onLoadMore: () => void;
  canLoadMore: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useInfiniteScrollObserver({
  onLoadMore,
  canLoadMore,
  rootMargin = "20px",
  threshold = 1.0,
}: UseInfiniteScrollObserverArgs): RefObject<HTMLDivElement | null> {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && canLoadMore) {
        onLoadMore();
      }
    },
    [canLoadMore, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver, rootMargin, threshold]);

  return loaderRef;
}
