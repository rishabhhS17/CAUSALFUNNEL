import { useEffect } from "react";
import "./Toast.css";

const TOAST_MS = 2000;

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  if (!toast) {
    return null;
  }

  return (
    <div key={toast.id} className="toast" role="status">
      {toast.text}
    </div>
  );
}
