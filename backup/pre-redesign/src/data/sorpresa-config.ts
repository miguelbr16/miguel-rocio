/**
 * ✏️ EDITA ESTO antes del aniversario — Rocío verá estos datos el 18 nov 2026
 * cuando complete el Caso 002.
 */
export const sorpresaConfig = {
  /** Pon true solo para probar el final sin esperar al 18 nov */
  devUnlockAll: false,

  /** Hora exacta del gran reveal (18 nov 2026, 20:00 por defecto) */
  revealAt: new Date(2026, 10, 18, 20, 0, 0),

  cena: {
    titulo: "Cena de aniversario",
    restaurante: "Restaurante Siglo 21", // ← cambia al que reserves
    hora: "21:00",
    direccion: "Campolivar, Valencia", // ← dirección real
    nota: "Mesa reservada a tu nombre. Viste elegante — pero cómoda.",
  },

  flores: {
    titulo: "Flores",
    mensaje: "Un ramo te estará esperando antes de la cena.",
    detalle: "En casa, sobre la mesa del salón.", // ← dónde las dejarás
  },

  extra: {
    titulo: "Algo más",
    emoji: "💍",
    mensaje:
      "Hay una sorpresa más. No la busques — llegará cuando tenga que llegar.",
    // Cuando sepas qué es (anillo, viaje, carta física…), edítalo aquí:
    hint: "Confía en M. Esta noche es tuya.",
  },

  cartaFisica: {
    titulo: "Carta en mano",
    mensaje: "Miguel tiene una carta escrita a mano para ti esta noche.",
  },
} as const;
