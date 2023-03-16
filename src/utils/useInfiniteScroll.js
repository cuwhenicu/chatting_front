import { useState, useEffect, useCallback } from "react";
import { initParams } from "../services/local";
import { getBackOptions } from "./getBackOptions";

import { throttle } from "./throttle";

const useInfiniteScroll = (fetcher, { size, onSuccess, onError }) => {
  const [page, setPage] = useState(1);
  const [totalCounts, setTotalCounts] = useState(1);
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);
  const [backParams, setBackParams] = useState(getBackOptions(initParams()));
  const [isLoading, setLoading] = useState(false);

  const executeFetch = useCallback(async () => {
    try {
      const data = await fetcher({ page, ...backParams });
      setLoading(true);
      setData((prev) => prev.concat(data.contents));
      setTotalCounts(data.totalCounts);
      setPage(data.pageNumber + 1);
      setNextPage(!data.isLastPage);
      setFetching(false);
      onSuccess?.();
    } catch (err) {
      console.log("execute - err", err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const { scrollTop, offsetHeight } = document.documentElement;
      if (window.innerHeight + scrollTop + 1 >= offsetHeight) {
        setFetching(true);
      }
    });
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching && hasNextPage) {
      executeFetch();
    } else if (!hasNextPage) setFetching(false);
  }, [isFetching]);

  useEffect(() => {
    setPage(1);
    setData([]);
    setNextPage(true);
    setFetching(true);
  }, [backParams]);

  return {
    page,
    data,
    totalCounts,
    isLoading,
    hasNextPage,
    setFetching,
    setBackParams,
  };
};

export default useInfiniteScroll;
