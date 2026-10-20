"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Focusable element that shows a tooltip on hover, keyboard focus and tap.
// The tooltip is portaled to document.body (position: fixed, pointer-events: none), so it can never
// change the size of the table or sit under the cursor. The text is also the accessible name.
export function Tip({ text, children, className = "", style }: {
  text: string; children?: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const lastPointer = useRef<string>("mouse");
  const [pos, setPos] = useState<{ x: number; y: number; below: boolean } | null>(null);

  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130);
    // Flip below the element when there is no room above.
    const above = r.top > 56;
    const y = above ? r.top : r.bottom;
    setPos((p) => (p && p.x === x && p.y === y ? p : { x, y, below: !above }));
  };
  const hide = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    const onScroll = () => setPos(null);
    const onOutside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPos(null);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [pos]);

  return (
    <span
      ref={ref}
      role="img"
      tabIndex={0}
      aria-label={text}
      className={`tip-host ${className}`}
      style={style}
      onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") show(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") hide(); }}
      onClick={() => { if (lastPointer.current !== "mouse") (pos ? hide() : show()); }}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape" && pos) {
          e.stopPropagation();
          hide();
        }
      }}
    >
      {children}
      {pos && typeof document !== "undefined"
        ? createPortal(
            <span className={`tip ${pos.below ? "tip-below" : ""}`} role="tooltip" aria-hidden="true" style={{ left: pos.x, top: pos.y }}>
              {text}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
