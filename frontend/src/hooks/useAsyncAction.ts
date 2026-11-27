"use client";

import { useCallback, useState } from "react";

type AsyncResult<R> = { ok: true; value: R } | { ok: false };

export function useAsyncAction<Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>
) {
  const [isPending, setIsPending] = useState(false);

  const run = useCallback(
    async (...args: Args): Promise<AsyncResult<R>> => {
      setIsPending(true);
      try {
        return { ok: true, value: await action(...args) };
      } catch {
        return { ok: false };
      } finally {
        setIsPending(false);
      }
    },
    [action]
  );

  return { run, isPending };
}
