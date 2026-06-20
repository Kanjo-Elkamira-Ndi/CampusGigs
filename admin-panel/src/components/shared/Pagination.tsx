import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 text-sm text-neutral-600">
      <div className="text-xs sm:text-sm">
        Showing {start}–{end} of {total}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="h-8 w-8"
        >
          <ChevronsLeft size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8"
        >
          <ChevronLeft size={14} />
        </Button>
        <div className="px-3 text-xs text-neutral-500">
          Page <span className="font-medium text-neutral-900">{page}</span> of {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8"
        >
          <ChevronRight size={14} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="h-8 w-8"
        >
          <ChevronsRight size={14} />
        </Button>
      </div>
    </div>
  );
}
