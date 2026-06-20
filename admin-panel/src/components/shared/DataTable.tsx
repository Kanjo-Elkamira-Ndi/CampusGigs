import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import type { LucideIcon } from "lucide-react";
import React from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyAction?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  onRetry,
  emptyIcon,
  emptyTitle = "No records",
  emptyAction,
}: DataTableProps<T>) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
        <AlertCircle className="text-red-500 mt-0.5" size={20} />
        <div className="flex-1">
          <div className="font-medium text-red-900">Failed to load data</div>
          <div className="text-sm text-red-700 mt-1">
            {(error as any)?.response?.data?.message ??
              (error as any)?.message ??
              "An error occurred"}
          </div>
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-neutral-500 bg-neutral-50">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`text-left font-medium px-4 py-3 ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-neutral-100">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                <EmptyState icon={emptyIcon} title={emptyTitle} action={emptyAction} />
              </td>
            </tr>
          ) : (
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={rowKey(row)}
                  layout
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  className="border-b border-neutral-100 hover:bg-neutral-50/60 transition-colors"
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 text-sm ${c.className ?? ""}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
