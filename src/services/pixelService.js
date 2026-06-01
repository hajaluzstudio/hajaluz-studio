// HAJA LUZ STUDIO // META PIXEL TRACKING SERVICE
// Este serviço centraliza o envio de eventos de conversão para o Meta (Facebook) Pixel.

export const trackPixelEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] Evento disparado com sucesso: "${eventName}"`, params);
  } else {
    console.log(`[Meta Pixel] Simulação de evento (Pixel ID pendente): "${eventName}"`, params);
  }
};
