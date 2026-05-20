"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/me", fetcher);

  return {
    user: data?.user,
    isLoading,
    isError: error,
    mutate,
  };
}
