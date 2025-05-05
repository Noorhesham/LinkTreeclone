import { useQuery } from "@tanstack/react-query";
import { getCart } from "../lib/actions/actions";

export const useGetCart = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await getCart();
      return res?.data?.cart;
    },
  });

  return { data, isLoading };
};
