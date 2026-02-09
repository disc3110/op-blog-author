/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-[90vw] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-lg border px-4 py-3 shadow-lg backdrop-blur",
            "bg-slate-950/85 text-slate-100 border-slate-700",
            t.type === "success" ? "border-emerald-500/60" : "",
            t.type === "error" ? "border-red-500/60" : "",
            t.type === "info" ? "border-blue-500/60" : "",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                {t.title || (t.type === "success" ? "Success" : t.type === "error" ? "Error" : "Info")}
              </p>
              {t.message && <p className="mt-1 text-xs text-slate-300">{t.message}</p>}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const push = useCallback(
    ({ type = "info", title, message, duration = 3000 } = {}) => {
      const id = makeId();

      setToasts((prev) => [{ id, type, title, message }, ...prev].slice(0, 5));

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      push,
      dismiss,
      success: (message, opts = {}) => push({ type: "success", message, ...opts }),
      error: (message, opts = {}) => push({ type: "error", message, duration: 5000, ...opts }),
      info: (message, opts = {}) => push({ type: "info", message, ...opts }),
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}