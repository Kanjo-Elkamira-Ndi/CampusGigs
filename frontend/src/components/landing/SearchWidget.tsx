import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function SearchWidget() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"hire" | "work">("hire");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "hire") {
      navigate(`/freelancers${query ? "?skill=" + encodeURIComponent(query) : ""}`);
    } else {
      navigate(`/gigs${query ? "?q=" + encodeURIComponent(query) : ""}`);
    }
  };

  return (
    <div
      className="rounded-2xl p-1.5"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-1">
        <span className="text-xs text-white/50 font-medium whitespace-nowrap">I want to:</span>
        <button
          onClick={() => setMode("hire")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: mode === "hire" ? "var(--brand)" : "transparent",
            color: mode === "hire" ? "#fff" : "rgba(255,255,255,0.6)",
          }}
        >
          Hire Talent
        </button>
        <button
          onClick={() => setMode("work")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: mode === "work" ? "var(--brand)" : "transparent",
            color: mode === "work" ? "#fff" : "rgba(255,255,255,0.6)",
          }}
        >
          Find Work
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-2 pb-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
          <Search size={16} className="text-white/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for services, skills or gigs..."
            className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:brightness-110"
          style={{ backgroundColor: "var(--brand)" }}
        >
          Browse
        </button>
      </form>
    </div>
  );
}
