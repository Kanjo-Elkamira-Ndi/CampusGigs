import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [open, setOpen] = useState(false);
  if (data == null) return <span className="text-neutral-400">—</span>;
  return (
    <div className="inline-block max-w-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] px-2 py-0.5 hover:bg-neutral-200"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {"{...}"}
      </button>
      {open && (
        <pre className="mt-2 bg-neutral-950 text-green-400 text-xs rounded-lg p-3 font-mono overflow-x-auto max-h-64">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
