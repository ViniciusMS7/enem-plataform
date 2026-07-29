"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<((message: string, type?: ToastType) => void) | null>(null);

// Uso: const showToast = useToast(); showToast("Salvo!", "success");
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx;
}

let idCounter = 0;

const ESTILO: Record<ToastType, { borda: string; Icon: typeof Info }> = {
  success: { borda: "border-correct", Icon: CheckCircle2 },
  error: { borda: "border-incorrect", Icon: XCircle },
  info: { borda: "border-ink", Icon: Info },
};

const COR_ICONE: Record<ToastType, string> = {
  success: "text-correct",
  error: "text-incorrect",
  info: "text-ink",
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remover = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remover(id), 4000);
    },
    [remover]
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-xs">
        {toasts.map((t) => {
          const { borda, Icon } = ESTILO[t.type];
          return (
            <div
              key={t.id}
              className={`border-2 ${borda} bg-paper px-4 py-3 shadow-[4px_4px_0_0_rgba(22,35,59,1)] flex items-start gap-2 fade-up`}
            >
              <Icon size={16} className={`${COR_ICONE[t.type]} shrink-0 mt-0.5`} />
              <p className="font-mono text-xs leading-relaxed flex-1">{t.message}</p>
              <button
                onClick={() => remover(t.id)}
                className="text-ink/30 hover:text-ink shrink-0"
                aria-label="Fechar"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
