"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Mounted only while open. Native showModal makes the rest of the page inert.
export function Modal({ children, labelId, onClose, drawer = false }: { children: ReactNode; labelId: string; onClose: () => void; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, []);
  return createPortal(<dialog ref={ref} aria-labelledby={labelId} aria-modal="true" className={drawer ? "app-dialog cart-dialog" : "app-dialog product-dialog"}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]')).filter(element => element.getClientRects().length > 0);
      const first = elements[0]; const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}><div className="dialog-surface">{children}</div></dialog>, document.body);
}
