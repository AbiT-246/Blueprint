import { useEffect, useState } from "react";

export type AsyncResource<TData> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: TData };

/** `load` must be referentially stable (module function or `useCallback`), or it will refetch every render. */
export function useAsyncResource<TData>(load: () => Promise<TData>): AsyncResource<TData> {
  const [resource, setResource] = useState<AsyncResource<TData>>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    load()
      .then((data) => {
        if (isActive) setResource({ status: "ready", data });
      })
      .catch(() => {
        if (isActive) setResource({ status: "error" });
      });

    return () => {
      isActive = false;
    };
  }, [load]);

  return resource;
}
