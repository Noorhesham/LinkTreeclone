import { useEffect, useTransition } from "react";
import { useLoading } from "../context/LoadingContext";

export const useSetLoading = () => {
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);
  const WrapperFn = (fn: any) => {
    startTransition(() => {
      fn();
    });
  };
  return { WrapperFn };
};
