"use client";

import { FloatingWhatsAppButton, type FloatingWhatsAppButtonProps } from "./FloatingWhatsAppButton";

// Canal oficial exclusivo: 5588997099082
export const WHATSAPP_CANONICAL_PHONE = "5588997099082";

export { FloatingWhatsAppButton };

export function FloatingWhatsApp(props: FloatingWhatsAppButtonProps) {
  return <FloatingWhatsAppButton {...props} />;
}
