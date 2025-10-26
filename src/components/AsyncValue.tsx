"use client";

import useAsync from "@/hooks/use-async";

export default function AsyncValue<T, E = any>({
  func,
  render,
}: Readonly<{
  func: () => Promise<T>;
  render: ({
    loading,
  }: {
    value: T | undefined;
    loading: boolean;
    error: E | undefined;
  }) => React.ReactNode;
}>) {
  return render(useAsync(func));
}
