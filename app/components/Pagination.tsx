"use client";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetLoading } from "../hooks/useSetLoadingt";

export function PaginationDemo({ totalPages = 5 }: { totalPages?: number }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { WrapperFn } = useSetLoading();
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    //@ts-ignore
    url.searchParams.set("page", page);
    replace(url.toString(), { scroll: false });
    setCurrentPage(page);
  };
  return (
    <Pagination className=" mt-10 col-span-full">
      <PaginationContent>
        <PaginationItem className=" w-fit">
          <button
            className={`rounded-full ${
              currentPage >= (totalPages || 5) && " cursor-not-allowed "
            } w-fit flex mr-1 md:mr-3 p-1 items-center text-main2  bg-light duration-150 hover:text-white hover:bg-main2`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) WrapperFn(() => handlePageChange(currentPage - 1));
            }}
          >
            {" "}
            <ArrowLeft className="mr-1" />
          </button>
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                className={
                  currentPage === page ? "bg-main2   text-gray-50 rounded-full text-primary-foreground" : "rounded-full"
                }
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  WrapperFn(() => handlePageChange(page));
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <button
            className={`rounded-full ${
              currentPage >= (totalPages || 5) && " cursor-not-allowed "
            } bg-light text-main2 ml-1 md:ml-3 p-1 flex  1items-center duration-150 hover:text-white hover:bg-main2`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage >= totalPages) return null;
              WrapperFn(() => handlePageChange(currentPage + 1));
            }}
          >
            {" "}
            <ArrowRight className="mr-1" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
