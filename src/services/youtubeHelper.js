// HAJA LUZ STUDIO // UTILITÁRIO AUXILIAR DO YOUTUBE
// Funções para extração de IDs, validação e carregamento de capas HD automáticas.

/**
 * Extrai o ID único de 11 caracteres de um link do YouTube.
 * Funciona para: youtu.be, youtube.com/watch, youtube.com/embed, v/..., etc.
 * @param {string} url - A URL do vídeo do YouTube
 * @returns {string|null} - O ID do vídeo ou null se inválido
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  
  // 1. Check for standard YouTube patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }

  // 2. Check for YouTube Shorts patterns: youtube.com/shorts/VIDEO_ID
  const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(shortsReg);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  
  return null;
};

/**
 * Retorna se uma dada URL é um link do YouTube.
 * @param {string} url - A URL a ser testada
 * @returns {boolean}
 */
export const isYouTubeUrl = (url) => {
  if (!url) return false;
  return getYouTubeId(url) !== null;
};

/**
 * Retorna o link da capa oficial em alta definição de um vídeo do YouTube.
 * @param {string} url - A URL do vídeo
 * @returns {string} - Link da imagem HD (maxresdefault.jpg) ou HQ (hqdefault.jpg) de fallback
 */
export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeId(url);
  if (!videoId) return '';
  
  // maxresdefault é a capa HD original enviada pelo criador.
  // Usamos maxresdefault.jpg e caso falhe na renderização do HTML, o navegador exibe o alt ou o CSS cuida.
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Extrai o ID único de um arquivo do Google Drive.
 * @param {string} url - A URL do arquivo do Google Drive
 * @returns {string|null} - O ID do arquivo ou null se inválido
 */
export const getGoogleDriveId = (url) => {
  if (!url) return null;
  const reg1 = /\/d\/([a-zA-Z0-9_-]+)/;
  const reg2 = /[?&]id=([a-zA-Z0-9_-]+)/;
  const match1 = url.match(reg1);
  if (match1) return match1[1];
  const match2 = url.match(reg2);
  if (match2) return match2[1];
  return null;
};

/**
 * Retorna se uma dada URL é um link do Google Drive.
 * @param {string} url - A URL a ser testada
 * @returns {boolean}
 */
export const isGoogleDriveUrl = (url) => {
  if (!url) return false;
  return getGoogleDriveId(url) !== null;
};

/**
 * Converte um link de compartilhamento do Google Drive em um link de streaming direto de vídeo.
 * @param {string} url - A URL original do Google Drive
 * @returns {string} - A URL direta de download/stream
 */
export const getGoogleDriveDirectLink = (url) => {
  const id = getGoogleDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
};

/**
 * Extrai o ID único de um Reel ou Post do Instagram.
 * Funciona para: instagram.com/reel/ID ou instagram.com/p/ID
 * @param {string} url - A URL do Instagram
 * @returns {string|null} - O ID do post/reel ou null se inválido
 */
export const getInstagramId = (url) => {
  if (!url) return null;
  const regExp = /(?:instagram\.com\/)(?:p|reel|tv)\/([^/?#&\s]+)/i;
  const match = url.match(regExp);
  if (match) {
    return match[1];
  }
  return null;
};

/**
 * Retorna se uma dada URL é um link do Instagram Reel ou Post.
 * @param {string} url - A URL a ser testada
 * @returns {boolean}
 */
export const isInstagramUrl = (url) => {
  if (!url) return false;
  return getInstagramId(url) !== null;
};
