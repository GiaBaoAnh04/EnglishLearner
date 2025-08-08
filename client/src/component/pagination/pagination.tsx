import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button, buttonVariants } from "../button/button";
import { cn } from "../../utils/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  siblingCount = 1,
  showFirstLast = true,
  showInfo = true,
}: PaginationProps) => {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page !== "number") return;
    onPageChange(page);
  };

  const paginationRange = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalButtons = totalNumbers + 2;

    if (totalPages <= totalButtons) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "ellipsis-right", totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "ellipsis-left", ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, "ellipsis-left", ...middleRange, "ellipsis-right", totalPages];
    }

    return [];
  };

  const getDisplayRange = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return { startItem, endItem };
  };

  const { startItem, endItem } = getDisplayRange();
  const pages = paginationRange();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex justify-between items-center", className)}>
      {showInfo && (
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center justify-center gap-1">
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages?.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`${page}-${index}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full text-muted-foreground w-9 h-9 p-0 flex items-center justify-center border-none bg-transparent"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={cn(
                "rounded-full text-muted-foreground w-9 h-9 p-0 flex items-center justify-center border-none",
                currentPage === page ? "bg-gray-200" : "bg-transparent"
              )}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export { Pagination };
