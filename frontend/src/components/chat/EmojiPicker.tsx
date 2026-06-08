import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS: Record<string, string[]> = {
  Smileys: [
    "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊",
    "😋","😎","😍","🥰","😘","🤩","🤔","🤨","😐","😏",
    "😮","🤐","😪","😴","😛","😜","😝","😒","😓","😢",
    "😭","😤","😡","🤬","🥳","🤯","😱","🤗","🥺","😈",
  ],
  Animals: [
    "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯",
    "🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉",
    "🐺","🐴","🦄","🐝","🦋","🐌","🐞","🐢","🐍","🐙",
    "🐬","🐳","🦈","🐘","🦒","🦘","🐕","🐈","🦜","🦩",
  ],
  Food: [
    "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐",
    "🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🥦","🥬",
    "🥕","🌽","🥔","🍞","🥖","🧀","🥚","🍳","🥞","🧇",
    "🥓","🍔","🍟","🍕","🌮","🌯","🥗","🍣","🍱","🍩",
    "🍪","🧁","🍰","🎂","🍿","🍫","☕️","🍺","🍷","🧃",
  ],
  Flags: [
    "🏁","🚩","🎌","🏳️‍🌈","🏳️‍⚧️","🇺🇳","🇺🇸","🇬🇧","🇫🇷","🇩🇪",
    "🇮🇹","🇪🇸","🇵🇹","🇧🇷","🇯🇵","🇰🇷","🇨🇳","🇮🇳","🇷🇺","🇨🇦",
    "🇦🇺","🇿🇦","🇳🇬","🇬🇭","🇰🇪","🇲🇦","🇸🇳","🇪🇹","🇹🇿","🇨🇮",
  ],
};

const CATEGORIES = Object.keys(EMOJIS);

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? Object.fromEntries(
        Object.entries(EMOJIS).map(([cat, list]) => [
          cat,
          list.filter((e) => e.includes(search)),
        ]),
      )
    : EMOJIS;

  const visibleCategories = CATEGORIES.filter((cat) => filtered[cat].length > 0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const offsets = visibleCategories.map((cat) => {
        const el = categoryRefs.current[cat];
        if (!el) return { cat, top: Infinity };
        const rect = el.getBoundingClientRect();
        const parent = container.getBoundingClientRect();
        return { cat, top: Math.abs(rect.top - parent.top) };
      });
      const closest = offsets.sort((a, b) => a.top - b.top)[0];
      if (closest && closest.top < 80) setActiveCategory(closest.cat);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [visibleCategories]);

  return (
    <div className="border border-border rounded-xl bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="relative p-2 pb-0">
        <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji…"
          className="w-full h-9 rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-1 px-2 pt-2 pb-1 overflow-x-auto border-b border-border sticky top-0 bg-card z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              categoryRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={cn(
              "shrink-0 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
              activeCategory === cat
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="overflow-y-auto p-2 max-h-56">
        {visibleCategories.map((cat) => (
          <div key={cat} ref={(el) => { categoryRefs.current[cat] = el; }}>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 py-1.5">
              {cat}
            </div>
            <div className="grid grid-cols-8 gap-0.5">
              {filtered[cat].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
        {visibleCategories.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">No emojis found</p>
        )}
      </div>
    </div>
  );
}
