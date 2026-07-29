"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { api } from "@/services/api";

export default function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    api.getProfile().then((p) => setStreak(p.currentStreak));
  }, []);

  if (streak === null) return null;

  return (
    <div className="flex items-center gap-2 border-2 border-ink px-3 py-2 bg-white/40">
      <Flame
        size={18}
        className={streak > 0 ? "text-accent fill-accent" : "text-ink/30"}
      />
      <span className="font-mono text-sm">
        <span className="font-bold">{streak}</span> {streak === 1 ? "dia seguido" : "dias seguidos"}
      </span>
    </div>
  );
}
