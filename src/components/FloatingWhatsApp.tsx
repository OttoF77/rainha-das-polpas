export function FloatingWhatsApp() {
  return (
    <aside
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-full bg-sysotto-navy-dark text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Pedir no WhatsApp: (88) 99709-9082
      </span>
      <a
        href="https://wa.me/5588997099082?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20pelo%20WhatsApp."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-hover text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 touch-target focus:outline-hidden focus:ring-4 focus:ring-emerald-300"
        aria-label="Conversar pelo WhatsApp no canal único (88) 99709-9082"
      >
        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.54 4.12 11.91C4.12 7.37 7.82 3.67 12.05 3.67Z" />
        </svg>
      </a>
    </aside>
  );
}
