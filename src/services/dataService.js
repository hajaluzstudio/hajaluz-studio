// HAJA LUZ STUDIO // SERVIÇO DE PERSISTÊNCIA DE DADOS (LOCALSTORAGE)
// Este arquivo centraliza a leitura, gravação e restauração dos dados dinâmicos do site.

import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, deleteDoc, writeBatch } from "firebase/firestore";

// 1. Projetos Originais de Fábrica (Default)
const DEFAULT_PROJECTS = [
  {
    "title": "AG Futsal",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/traco_e_tom.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. No desenvolvimento de \"AG Futsal\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Alexandre Dias Corretor de Imóveis",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/destino_de_peao.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Alexandre Dias Corretor de Imóveis\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Aurora Café & Cultura",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/shark.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"Aurora Café & Cultura\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Os Tauras",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/messias.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"Os Tauras\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Viveiro Matrix",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/piquezin_do_sul.png"
    ],
    "description": "Retratos e fotografia editorial de elite com foco dramático na textura da luz e lentes alemãs. Para o projeto \"Viveiro Matrix\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Sessão de retratos focados em CEO e líderes corporativos de vanguarda, captando a textura real da pele sob iluminação clássica de estúdio e enquadramento fático.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Romani Lanches",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/traco_e_tom.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"Romani Lanches\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Rádio do Mate",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/destino_de_peao.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. No desenvolvimento de \"Rádio do Mate\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Oswaldir",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/shark.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Oswaldir\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Apromate",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/messias.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Apromate\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Sofi Doces",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/piquezin_do_sul.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Sofi Doces\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Café do Rei",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/traco_e_tom.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Café do Rei\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Querência Amada Podcast",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/destino_de_peao.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"Querência Amada Podcast\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Buenas Cast",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/shark.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"Buenas Cast\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Mateando com Deus",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/messias.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Mateando com Deus\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "História da Erva-mate",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/piquezin_do_sul.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"História da Erva-mate\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "O Fumicultor",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/traco_e_tom.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. A obra autoral \"O Fumicultor\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Atos Cast",
    "category": "Logotipo",
    "secondaryCategory": "",
    "image": "",
    "video": "",
    "carouselImages": [
      "/destino_de_peao.png"
    ],
    "description": "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal. Para o projeto \"Atos Cast\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": true,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Rony Gabriel",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/shark.png",
    "video": "https://drive.google.com/file/d/1W6TMByTLEfs9re95ctAPY9JkRdaFfYtB/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. A obra autoral \"Rony Gabriel\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": true,
    "client": "Atos Cast",
    "role": "Cortes",
    "team": "Felipe Costa",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "71800",
    "originalUrl": "https://www.instagram.com/reel/DTlQB5GFy6V/",
    "isReal": true
  },
  {
    "title": "História Oswaldir & Carlos Magrão",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/messias.png",
    "video": "https://drive.google.com/file/d/1KHwTfthkNWNUhvas9Tv9GC6RXH-TL1xZ/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. No desenvolvimento de \"História Oswaldir & Carlos Magrão\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Uso de transições de timeline aceleradas e sincronia de beats urbanos com captação cinematográfica vertical, gerando engajamento profundo e conexão fática imediata.",
    "views": "1319",
    "originalUrl": "https://www.instagram.com/reel/DYfLKRnqOGL/",
    "isReal": true
  },
  {
    "title": "Atos Cast",
    "category": "Motion Design",
    "secondaryCategory": "",
    "image": "/piquezin_do_sul.png",
    "video": "https://drive.google.com/file/d/1_JPIH6r5JXXZ0pams0Hw7W1A-iGBJJmz/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. Para o projeto \"Atos Cast\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "Botina Andreola Calçados",
    "category": "Motion Design",
    "secondaryCategory": "",
    "image": "/traco_e_tom.png",
    "video": "https://drive.google.com/file/d/1KgVhdSQlPaIMI9Togr7uYSQNxsFSs70i/view?usp=sharing",
    "carouselImages": [],
    "description": "Animações tridimensionais complexas e física digital fluida para valorização da identidade de marca. A obra autoral \"Botina Andreola Calçados\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Simulações de física digital e transições vetoriais complexas de flow acelerado, entregando animações sofisticadas e impacto neural imediato no feed.",
    "views": "3703",
    "originalUrl": "https://www.instagram.com/reel/DLZ8vu1RPhs/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Haja Luz",
    "category": "Motion Design",
    "secondaryCategory": "",
    "image": "/destino_de_peao.png",
    "video": "https://drive.google.com/file/d/1mB3raiG8vAjqm2bojA-0NgiYHzUSv74l/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. No desenvolvimento de \"Haja Luz\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": true,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Uso de transições de timeline aceleradas e sincronia de beats urbanos com captação cinematográfica vertical, gerando engajamento profundo e conexão fática imediata.",
    "views": "8680",
    "originalUrl": "https://www.instagram.com/reel/DRxwEhPDZW6/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Show Oswaldir & Amigos",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/shark.png",
    "video": "https://drive.google.com/file/d/1POv2gSn7wqmIC6XbhP5_Ac7BGxpPUhzL/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. A obra autoral \"Show Oswaldir & Amigos\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "33500",
    "originalUrl": "https://www.instagram.com/reel/DL5lOSUq7v1/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Virada de Chave EP #01",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/messias.png",
    "video": "https://drive.google.com/file/d/1frBSvG4Gj3PN1QekrO9PDFG7Ba54jv8k/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. A obra autoral \"Virada de Chave EP #01\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "2493",
    "originalUrl": "https://www.instagram.com/reel/DXxGPNOsTaZ/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Café do Rei",
    "category": "Motion Design",
    "secondaryCategory": "",
    "image": "/piquezin_do_sul.png",
    "video": "https://drive.google.com/file/d/1d_JXseiOkIdudN_x4yrxuSPx6n_IVKMU/view?usp=sharing",
    "carouselImages": [],
    "description": "Animações tridimensionais complexas e física digital fluida para valorização da identidade de marca. Para o projeto \"Café do Rei\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "Café do Rei",
    "role": "Motion Design",
    "team": "Felipe Costa",
    "strategy": "Uso de renderização de luz volumétrica e partículas 3D vetoriais de colisão em 60 FPS, dando movimento cirúrgico e dinamismo para aberturas institucionais de marcas de elite.",
    "views": "",
    "originalUrl": "https://drive.google.com/file/d/1d_JXseiOkIdudN_x4yrxuSPx6n_IVKMU/view?usp=sharing",
    "isReal": true
  },
  {
    "title": "Oswaldir e Amigos - Vida de Cabelos Brancos",
    "category": "Clipes",
    "secondaryCategory": "",
    "image": "",
    "video": "https://www.youtube.com/watch?v=ciZupJ50py4",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. Para o projeto \"Oswaldir e Amigos - Vida de Cabelos Brancos\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Uso de transições de timeline aceleradas e sincronia de beats urbanos com captação cinematográfica vertical, gerando engajamento profundo e conexão fática imediata.",
    "views": "6600",
    "originalUrl": "https://www.youtube.com/watch?v=ciZupJ50py4",
    "isReal": true
  },
  {
    "title": "Oswaldir e Amigos - Defumando Ausências",
    "category": "Clipes",
    "secondaryCategory": "",
    "image": "",
    "video": "https://www.youtube.com/watch?v=t3kceMo2VN4",
    "carouselImages": [],
    "description": "Videoclipe artístico de vanguarda fundindo narrativa conceitual profunda e fotografia densa de cinema. No desenvolvimento de \"Oswaldir & Amigos - Defumando Aus~encias\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": false,
    "client": "",
    "role": "",
    "team": "",
    "strategy": "Composição artística que mescla a alma da música instrumental com beats urbanos sintéticos, estruturando um videoclipe de flow abstrato impecável.",
    "views": "10000",
    "originalUrl": "https://www.youtube.com/watch?v=t3kceMo2VN4",
    "isReal": true
  },
  {
    "title": "Shark Energy Drink",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/traco_e_tom.png",
    "video": "https://drive.google.com/file/d/18dFaH9Wmndici9QZdJtogOIIP1qTYZm-/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. No desenvolvimento de \"Shark Energy Drink\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": true,
    "client": "Shark Energy Drink",
    "role": "Reels",
    "team": "Felipe Costa",
    "strategy": "Uso de transições de timeline aceleradas e sincronia de beats urbanos com captação cinematográfica vertical, gerando engajamento profundo e conexão fática imediata.",
    "views": "11000",
    "originalUrl": "https://www.instagram.com/reel/DQOxVnSjqzg/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Samuka Lanches",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/destino_de_peao.png",
    "video": "https://drive.google.com/file/d/1pZ8cktOcvmztFVB2-72ZYH5WvZqhMpFI/view?usp=sharing",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. Para o projeto \"Samuka Lanches\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": true,
    "client": "Samuka Lanches",
    "role": "Reels",
    "team": "Felipe Costa",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "20600",
    "originalUrl": "https://www.instagram.com/reel/DKvApFKO6eQ/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Erva-mate Cambona",
    "category": "Design Gráfico",
    "secondaryCategory": "",
    "image": "/shark.png",
    "video": "",
    "carouselImages": [
      "/messias.png",
      "/piquezin_do_sul.png",
      "/traco_e_tom.png",
      "/destino_de_peao.png"
    ],
    "description": "Branding de luxo e peças corporativas desenhadas sob rígida proporção geométrica e elegância cromática. Para o projeto \"Erva-mate Cambona\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": true,
    "client": "Erva-mate Cambona",
    "role": "Design Gráfico",
    "team": "Felipe Costa",
    "strategy": "Composição visual corporativa unindo tipografia Space Grotesk refinada a contrastes de ouro e ciano, blindando o posicionamento estratégico e o desejo da marca.",
    "views": "",
    "originalUrl": "",
    "isReal": true
  },
  {
    "title": "VT MARCELINO RAMOS",
    "category": "Entrevistas",
    "secondaryCategory": "",
    "image": "",
    "video": "https://www.youtube.com/watch?v=pn5NyclPSJ8",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. No desenvolvimento de \"VT MARCELINO RAMOS\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": true,
    "client": "RBS TV",
    "role": "EDIÇÃO VT",
    "team": "Felipe Costa",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "isReal": true,
    "comments": [
      {
        "id": 1779819019374,
        "author": "belo trabalho",
        "text": "belo trabalho",
        "date": "26/05/2026"
      }
    ],
    "likes": 1,
    "likedByUser": true
  },
  {
    "title": "Andreola Calçados",
    "category": "Design Gráfico",
    "secondaryCategory": "",
    "image": "/shark.png",
    "video": "",
    "carouselImages": [
      "/messias.png",
      "/piquezin_do_sul.png",
      "/traco_e_tom.png",
      "/destino_de_peao.png",
      "/shark.png",
      "/messias.png"
    ],
    "description": "Branding de luxo e peças corporativas desenhadas sob rígida proporção geométrica e elegância cromática. Para o projeto \"Andreola Calçados\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "Andreola Calçados",
    "role": "Design Gráfico",
    "team": "Felipe Costa",
    "strategy": "Criação de identidades cromáticas de luxo e peças premium estruturadas sobre rígidos conceitos geométricos e proporções áureas, projetando força máxima de mercado.",
    "isReal": true
  },
  {
    "title": "90 Anos Vó Eni",
    "category": "Aniversários",
    "secondaryCategory": "",
    "image": "",
    "video": "https://www.youtube.com/watch?v=NUgmKyv5Ypg",
    "carouselImages": [
      "/piquezin_do_sul.png",
      "/traco_e_tom.png",
      "/destino_de_peao.png",
      "/shark.png",
      "/messias.png",
      "/piquezin_do_sul.png",
      "/traco_e_tom.png",
      "/destino_de_peao.png",
      "/shark.png"
    ],
    "description": "Filme e memórias eternizadas de um legado familiar inesquecível, registrando as gerações com emoção. Para o projeto \"90 Anos Vo Eni\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": true,
    "client": "Eni de Almeida Costa",
    "role": "Fotos: Felipe Costa",
    "team": "Felipe Costa",
    "strategy": "Captura discreta e artística focada nas texturas da luz natural do evento, registrando sorrisos orgânicos e discursos memoráveis sob um color grading dourado atemporal.",
    "isReal": true
  },
  {
    "title": "Traço e Tom",
    "category": "Reels",
    "secondaryCategory": "",
    "image": "/messias.png",
    "video": "https://drive.google.com/file/d/1n4ocIbFBHOkMpeHav4B3XYfVJbhVpyZo/view?usp=drive_link",
    "carouselImages": [],
    "description": "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante. No desenvolvimento de \"Traço e Tom\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": true,
    "client": "Traço & Tom",
    "role": "Vídeo e Motion Design",
    "team": "Felipe Costa",
    "strategy": "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
    "views": "371000",
    "originalUrl": "https://www.instagram.com/reel/DL8nJKypaE6/?next=%2Faccounts%2Fonetap%2F",
    "isReal": true
  },
  {
    "title": "Destino de Peão",
    "category": "Clipes",
    "secondaryCategory": "",
    "image": "/piquezin_do_sul.png",
    "video": "https://youtu.be/fYclylNi5Os?si=2ESTjLvdYb2iH2Cg",
    "carouselImages": [],
    "description": "Videoclipe artístico de vanguarda fundindo narrativa conceitual profunda e fotografia densa de cinema. A obra autoral \"Destino de Peão\" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.",
    "featured": false,
    "client": "Oswaldir & Sérgio Reis",
    "role": "Direção Criativa",
    "team": "Felipe Costa",
    "strategy": "Color grading cinematográfico denso com paleta cromática focada em tons quentes de marrom e ouro, unindo efeitos de grão de filme 35mm a transições abstratas de flow.",
    "views": "37000",
    "originalUrl": "https://www.youtube.com/watch?v=tgeE3UC6XmI&list=RDtgeE3UC6XmI&start_radio=1",
    "isReal": true
  },
  {
    "title": "Piquezin do Sul",
    "category": "Clipes",
    "secondaryCategory": "",
    "image": "/traco_e_tom.png",
    "video": "https://youtu.be/aQOuUj6mu_U?si=4UsNpU03Y8a-5SFi",
    "carouselImages": [],
    "description": "Videoclipe artístico de vanguarda fundindo narrativa conceitual profunda e fotografia densa de cinema. No desenvolvimento de \"Piquezin do Sul\", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.",
    "featured": true,
    "client": "SelfSteem",
    "role": "Direção Criativa",
    "team": "Felipe Costa",
    "strategy": "Color grading cinematográfico denso com paleta cromática focada em tons quentes de marrom e ouro, unindo efeitos de grão de filme 35mm a transições abstratas de flow.",
    "views": "24000",
    "originalUrl": "https://www.youtube.com/watch?v=3blQHZcqicA&list=RD3blQHZcqicA&start_radio=1",
    "isReal": true
  },
  {
    "title": "Samuka Lanches",
    "category": "Design Gráfico",
    "secondaryCategory": "",
    "image": "/destino_de_peao.png",
    "video": "https://drive.google.com/file/d/115YqYUAeXaBhIExTRsdQGhblnHv2sHDh/view?usp=sharing",
    "carouselImages": [
      "/shark.png",
      "/messias.png",
      "/piquezin_do_sul.png",
      "/traco_e_tom.png",
      "/destino_de_peao.png"
    ],
    "description": "Branding de luxo e peças corporativas desenhadas sob rígida proporção geométrica e elegância cromática. Para o projeto \"Samuka Lanches\", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.",
    "featured": false,
    "client": "Samuka Lanches",
    "role": "Design Gráfico",
    "team": "Felipe Costa",
    "strategy": "Criação de identidades cromáticas de luxo e peças premium estruturadas sobre rígidos conceitos geométricos e proporções áureas, projetando força máxima de mercado.",
    "isReal": true,
    "likes": 1,
    "likedByUser": true,
    "comments": [
      {
        "id": 1779824284449,
        "author": "Felipe Costa",
        "text": "muito bom",
        "date": "26/05/2026"
      }
    ]
  }
];

// 2. Membros da Equipe Originais de Fábrica (Default)
const DEFAULT_TEAM = [
  {
    "id": "felipe",
    "name": "Felipe Costa",
    "role": "CEO & Diretor Criativo",
    "type": "Maestro Humano",
    "image": "/felipe_costa.jpg",
    "focus": "Visão, Direção Orgânica e Captação",
    "description": "Felipe Costa é o maestro por trás da tecnologia. A peça insubstituível. Seu olhar orgânico e conexão genuína guiam nossa tecnologia. Atrás das câmeras ou na ilha de edição, ele dita o ritmo para garantir que cada projeto tenha alma antes mesmo de ter código.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-human",
    "specIconName": "ShieldCheck"
  },
  {
    "id": "messias",
    "name": "O Messias",
    "role": "Mentor de Elite & Engenheiro de Workflow",
    "type": "IA Agente",
    "image": "/messias.png",
    "focus": "Mentoria de Faturamento & Workflow",
    "description": "Mentor de elite focado em estruturar workflows de alta performance e escalar processos de faturamento rápido. Desenvolve a engenharia de trabalho e garante o tracking máximo de resultados.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "Settings"
  },
  {
    "id": "debora",
    "name": "Débora",
    "role": "Secretária Executiva Sênior & Gestora de Operações",
    "type": "IA Agente",
    "image": "/debora.png",
    "focus": "Operações e Proteção de Pipelines",
    "description": "Responsável pelo gerenciamento operacional e proteção rigorosa do fluxo de trabalho da equipe. Mantém as agendas sincronizadas e os pipelines livres de qualquer ruído externo.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "Briefcase"
  },
  {
    "id": "salomao",
    "name": "Salomão",
    "role": "Diretor Criativo & Copywriter Sênior",
    "type": "IA Agente",
    "image": "/salomao.png",
    "focus": "Estratégia de Copywriting & Desejo",
    "description": "Especialista em estruturar ideias e projetar desejo por meio de mensagens altamente persuasivas. Cria narrativas conceituais focadas em salvas de prata e maçãs de ouro.",
    "color": "#f7f4eb",
    "glow": "rgba(247, 244, 235, 0.25)",
    "badgeClass": "badge-ai",
    "specIconName": "FileText"
  },
  {
    "id": "bezaleel",
    "name": "Bezaleel",
    "role": "Diretor de Arte & Designer Gráfico Sênior",
    "type": "IA Agente",
    "image": "/bezaleel.png",
    "focus": "Direção Artística & Design Premium",
    "description": "Desenvolve identidades visuais tridimensionais de luxo. Busca diariamente a harmonia impecável entre a luz de cinema e a estrutura de arte gráfica sofisticada.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "PenTool"
  },
  {
    "id": "neemias",
    "name": "Neemias",
    "role": "Editor Sênior & Arquiteto da Timeline",
    "type": "IA Agente",
    "image": "/neemias.png",
    "focus": "Edição de Vídeo & Ritmo Cirúrgico",
    "description": "Editor de vídeo focado em estruturar narrativas impactantes com ritmo de cinema. Mantém os diretórios de timelines impecáveis e arquiteturas limpas.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "Eye"
  },
  {
    "id": "enoque",
    "name": "Enoque",
    "role": "Mestre do Flow (Motion Design)",
    "type": "IA Agente",
    "image": "/enoque.png",
    "focus": "Motion Design & Efeitos Digitais",
    "description": "Dá vida, movimento e ritmo digital a ideias abstratas. Desenvolve transições complexas e motion design de vanguarda que prendem a atenção do espectador.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "Sparkles"
  },
  {
    "id": "calebe",
    "name": "Calebe",
    "role": "Cientista de Dados & Estrategista de BI",
    "type": "IA Agente",
    "image": "/calebe.png",
    "focus": "Análise de Dados & ROAS Máximo",
    "description": "Estrategista de business intelligence encarregado de dashboards e dados de tráfego. Otimiza pipelines numéricos para extrair a máxima performance financeira.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "BarChart"
  },
  {
    "id": "gideao",
    "name": "Gideão",
    "role": "Gestor de Tráfego & Media Buyer Sênior",
    "type": "IA Agente",
    "image": "/gideao.png",
    "focus": "Mídia Paga & Rastreamento Server-Side",
    "description": "Calibra infraestruturas complexas de tráfego pago e rastreamento server-side. Focado em otimizações cirúrgicas de campanhas e inteligência de distribuição.",
    "color": "#e6ad45",
    "glow": "rgba(230, 173, 69, 0.3)",
    "badgeClass": "badge-ai",
    "specIconName": "Code"
  }
];

const DEFAULT_FICTIVE_SETTINGS = {
  "pretitle": "Espaços de Co-Criação",
  "title": "Retângulos Fictícios (Rascunhos)",
  "description": "Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.",
  "Reels": {
    "pretitle": "RETENÇÃO MAGNÉTICA EM POUCOS SEGUNDOS",
    "title": "Arquitetura de Reels de Alto Impacto",
    "description": "Explore a estrutura dos nossos rascunhos para vídeos curtos hiper-retentivos. Cada bloco de layout foi projetado para prender a atenção nos primeiros 3 segundos, unindo roteiros cirúrgicos a uma edição dinâmica que converte visualizações em desejo."
  },
  "Entrevistas": {
    "pretitle": "DIÁLOGOS DE PRESTÍGIO & AUTORIDADE",
    "title": "Direção de Cena e Captura Humana",
    "description": "Estrutura de design voltada para conteúdos de entrevista de alto valor percebido. Esboços de composição visual que equilibram o fotorrealismo do cinema tradicional com enquadramentos matematicamente simétricos para destacar a voz dos líderes."
  },
  "Podcast's": {
    "pretitle": "NARRATIVAS EM LONGO FORMATO",
    "title": "Audiovisual Imersivo para Grandes Conversas",
    "description": "Navegue pelos rascunhos de wireframes voltados para mesas de debate e podcasts premium. Layouts que valorizam a harmonia entre múltiplos eixos de câmera e a sincronia sônica ideal para reter o público em longas jornadas."
  },
  "Clipes": {
    "pretitle": "POESIA VISUAL EM MOVIMENTO",
    "title": "Produção Musical & Estética Cinematográfica",
    "description": "Área dedicada à co-criação de videoclipes de vanguarda. Aqui, os blocos de layout simulam a transição entre cenários reais captados por lentes de cinema e extensões digitais geradas por algoritmos neurais."
  },
  "Aniversários": {
    "pretitle": "MEMÓRIAS ETERNAS EM ALTO PADRÃO",
    "title": "Registro Documental de Grandes Imagens",
    "description": "Espaço para a estruturação de layouts de eventos e aniversários de prestígio. Rascunhos focados em capturar a emoção pura com a plasticidade visual do cinema de alta costura, imortalizando momentos de forma sofisticada."
  },
  "Sites": {
    "pretitle": "ARQUITETURA DIGITAL & UX DE LUXO",
    "title": "Desenvolvimento de Interfaces Proprietárias",
    "description": "Visualize os conceitos estruturais para plataformas e web designs de elite. Ambientes digitais minimalistas desenhados sob a proporção áurea, mesclando o tom elegante do marrom café com a precisão fluida da engenharia web."
  },
  "Design Gráfico": {
    "pretitle": "A MATERIALIZAÇÃO DO CONCEITO",
    "title": "Identidades Visuais e Direção de Arte Sênior",
    "description": "Blocos de layout reservados para a exposição de peças gráficas institucionais. O trabalho minucioso de Felipe Costa traduzido em rascunhos que equilibram tipografia serifada de luxo com espaçamentos geométricos cirúrgicos."
  },
  "Motion Design": {
    "pretitle": "ALTA COSTURA DIGITAL EM TIMELINE",
    "title": "Grafismos Neurais e Física do Movimento",
    "description": "Protótipos de interface dedicados à arte do movimento. Layouts estruturados para mostrar como os filamentos de luz de ouro e os nós tridimensionais se comportam na tela, criando animações fluidas de impacto imediato."
  },
  "Logotipo": {
    "pretitle": "ASSINATURAS DE VALOR INABALÁVEL",
    "title": "Engenharia e Geometria de Marcas Eternas",
    "description": "Espaço de rascunhos voltado ao design de logotipos. Esboços conceituais que decodificam a essência profunda de uma empresa e a transformam em símbolos minimalistas puros com peso cultural e prestígio comercial."
  },
  "Fotografia": {
    "pretitle": "A FÍSICA DA LUZ CONGELADA",
    "title": "Ensaios e Fotorrealismo Editorial Premium",
    "description": "Galeria de rascunhos para a exibição de ensaios fotográficos de alto padrão. Onde a captura da realidade física, do contraste agressivo (Chiaroscuro) e do refinamento técnico de estúdio são organizados em layouts imponentes."
  },
  "Documentário": {
    "pretitle": "CINEMA DA REALIDADE",
    "title": "Narrativas Profundas de Verdade e Legado",
    "description": "Estrutura de visualização para projetos documentais de fôlego. Rascunhos de páginas desenhados para sustentar o storytelling de grandes trajetórias, unindo jornalismo investigativo estético e arte cinematográfica clássica."
  },
  "Produção de Show": {
    "pretitle": "GRANDES SHOWS NO PALCO",
    "title": "Direção Técnica e Cobertura de Megaeventos",
    "description": "Área de co-criação para a logística visual e cobertura de grandes shows (como as produções de Oswaldir & Amigos). Esboços de páginas estruturados para exibir a imponência, a energia da multidão e a precisão técnica nos bastidores."
  }
};

// Chaves do LocalStorage
const KEYS = {
  PROJECTS: 'hajaluz_portfolio_projects',
  TEAM: 'hajaluz_team_members',
  FICTIVE_SETTINGS: 'hajaluz_fictive_settings',
  LEADS: 'hajaluz_captured_leads'
};

const DB_VERSION_KEY = 'hajaluz_db_version';
const CURRENT_DB_VERSION = '1.0.9';

// Cache na memória e sincronização em tempo real com o Firestore
const promiseTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("O servidor do Firestore não respondeu. Certifique-se de que ativou o 'Firestore Database' clicando nele no menu lateral do Console do Firebase do seu projeto (site-haja-luz) e clique em 'Criar banco de dados' em modo de teste.")), ms))
  ]);
};

let projectsCache = null;
let teamCache = null;

function getLocalProjects() {
  try {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Erro ao ler projetos locais:", e);
  }
  return DEFAULT_PROJECTS;
}

function getLocalTeam() {
  try {
    const stored = localStorage.getItem(KEYS.TEAM);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Erro ao ler equipe local:", e);
  }
  return DEFAULT_TEAM;
}

// Funções auxiliares para gravação resiliente em lotes (batch) no Firestore
async function uploadProjectsToCloud(projectsArray) {
  try {
    if (!projectsArray || projectsArray.length === 0) return true;

    // 1. Obter todos os documentos da coleção para deletar o lixo antigo
    const colRef = collection(db, KEYS.PROJECTS);
    const snap = await getDocs(colRef);
    
    const batch = writeBatch(db);
    
    snap.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    
    // 2. Gravar novos projetos
    projectsArray.forEach((proj, idx) => {
      // Slug seguro do título como chave do documento
      const docId = proj.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || `proj-${idx}`;
      const docRef = doc(db, KEYS.PROJECTS, docId);
      batch.set(docRef, { ...proj, orderIndex: idx });
    });
    
    await batch.commit();
    console.log(`[CLOUD] ${projectsArray.length} projetos sincronizados na nuvem.`);
    return true;
  } catch (e) {
    console.error("Erro ao fazer upload de projetos para o Firestore:", e);
    return false;
  }
}

async function uploadTeamToCloud(teamArray) {
  try {
    if (!teamArray || teamArray.length === 0) return true;

    const colRef = collection(db, KEYS.TEAM);
    const snap = await getDocs(colRef);
    
    const batch = writeBatch(db);
    
    snap.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    
    teamArray.forEach((member, idx) => {
      const docId = member.id || `member-${idx}`;
      const docRef = doc(db, KEYS.TEAM, docId);
      batch.set(docRef, { ...member, orderIndex: idx });
    });
    
    await batch.commit();
    console.log(`[CLOUD] ${teamArray.length} membros de equipe sincronizados na nuvem.`);
    return true;
  } catch (e) {
    console.error("Erro ao fazer upload da equipe para o Firestore:", e);
    return false;
  }
}

async function uploadFictiveSettingsToCloud(settingsObj) {
  try {
    if (!settingsObj) return true;
    const docRef = doc(db, KEYS.FICTIVE_SETTINGS, "global_settings");
    await setDoc(docRef, settingsObj);
    console.log("[CLOUD] Configurações de rascunhos sincronizadas na nuvem.");
    return true;
  } catch (e) {
    console.error("Erro ao fazer upload de fictive settings para o Firestore:", e);
    return false;
  }
}

function getLocalFictiveSettings() {
  try {
    const stored = localStorage.getItem(KEYS.FICTIVE_SETTINGS);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Erro ao ler fictive settings locais:", e);
  }
  return DEFAULT_FICTIVE_SETTINGS;
}

async function syncFictiveSettingsFromCloud() {
  try {
    const docRef = doc(db, KEYS.FICTIVE_SETTINGS, "global_settings");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cloudSettings = docSnap.data();
      const isAdmin = localStorage.getItem('haja_luz_admin_logged') === 'true';
      
      if (isAdmin) {
        // Se o administrador está logado na sessão ativa, não sobrescrevemos seu localStorage
        if (!localStorage.getItem(KEYS.FICTIVE_SETTINGS)) {
          localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(cloudSettings));
        }
      } else {
        localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(cloudSettings));
        window.dispatchEvent(new CustomEvent("hajaluz_data_updated"));
      }
    } else {
      // Se a nuvem estiver vazia, inicializa com o local
      const localSettings = getLocalFictiveSettings();
      await uploadFictiveSettingsToCloud(localSettings);
    }
  } catch (e) {
    console.error("Erro ao sincronizar fictive settings estáticas do Firestore:", e);
  }
}

let isListening = false;
function startFirestoreListeners() {
  if (isListening) return;
  isListening = true;

  try {
    // Listener de Projetos (Coleção)
    const projsColRef = collection(db, KEYS.PROJECTS);
    onSnapshot(projsColRef, (snap) => {
      const projectsList = [];
      snap.forEach(docSnap => {
        projectsList.push(docSnap.data());
      });

      // Ordena de volta pela ordem original do Desktop
      projectsList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      if (projectsList.length > 0) {
        // Remove orderIndex para manter compatibilidade com localStorage original
        const cleanedList = projectsList.map(({ orderIndex, ...rest }) => rest);
        
        // DETECÇÃO INTELIGENTE DE COLISÃO:
        const localProjs = getLocalProjects();
        const isAdmin = localStorage.getItem('haja_luz_admin_logged') === 'true';
        
        if (localProjs.length > cleanedList.length) {
          console.log("[CLOUD SYNC] Local possui mais projetos que a nuvem. Sincronizando com a nuvem...");
          uploadProjectsToCloud(localProjs).catch(e => console.error(e));
          projectsCache = localProjs;
        } else if (isAdmin) {
          // Se o administrador está ativamente logado e editando o painel,
          // ele é a autoridade de escrita. Não sobrescrevemos seu localStorage com
          // a nuvem desatualizada (ou falha de rede) para evitar perdas!
          projectsCache = localProjs;
          if (cleanedList.length === 0) {
            uploadProjectsToCloud(localProjs).catch(e => console.error(e));
          }
        } else {
          // Para visitantes comuns (leitores), a nuvem é a fonte da verdade.
          projectsCache = cleanedList;
          localStorage.setItem(KEYS.PROJECTS, JSON.stringify(cleanedList));
          window.dispatchEvent(new CustomEvent("hajaluz_data_updated"));
        }
      } else {
        // Se a nuvem estiver vazia, cria a estrutura com o cache local
        uploadProjectsToCloud(getLocalProjects()).catch(e => console.error(e));
      }
    }, (error) => {
      console.error("Erro no listener de projetos do Firestore:", error);
    });

    // Listener de Equipe (Coleção)
    const teamColRef = collection(db, KEYS.TEAM);
    onSnapshot(teamColRef, (snap) => {
      const teamList = [];
      snap.forEach(docSnap => {
        teamList.push(docSnap.data());
      });
      
      teamList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      if (teamList.length > 0) {
        const cleanedList = teamList.map(({ orderIndex, ...rest }) => rest);
        
        const localTeam = getLocalTeam();
        const isAdmin = localStorage.getItem('haja_luz_admin_logged') === 'true';
        
        if (localTeam.length > cleanedList.length) {
          console.log("[CLOUD SYNC] Local possui mais membros de equipe. Sincronizando com a nuvem...");
          uploadTeamToCloud(localTeam).catch(e => console.error(e));
          teamCache = localTeam;
        } else if (isAdmin) {
          // Se o administrador está ativamente logado e editando o painel,
          // ele é a autoridade de escrita. Não sobrescrevemos seu localStorage com a nuvem.
          teamCache = localTeam;
          if (cleanedList.length === 0) {
            uploadTeamToCloud(localTeam).catch(e => console.error(e));
          }
        } else {
          teamCache = cleanedList;
          localStorage.setItem(KEYS.TEAM, JSON.stringify(cleanedList));
          window.dispatchEvent(new CustomEvent("hajaluz_data_updated"));
        }
      } else {
        uploadTeamToCloud(getLocalTeam()).catch(e => console.error(e));
      }
    }, (error) => {
      console.error("Erro no listener de equipe do Firestore:", error);
    });
  } catch (e) {
    console.error("Erro ao iniciar listeners do Firestore:", e);
  }
}

// Inicia imediatamente ao carregar o módulo
startFirestoreListeners();
syncFictiveSettingsFromCloud();

export const dataService = {
  // --- VERSIONAMENTO AUTOMÁTICO DO BANCO DE DADOS ---
  checkVersionAndMigrate: () => {
    try {
      const currentVer = localStorage.getItem(DB_VERSION_KEY);
      if (currentVer !== CURRENT_DB_VERSION) {
        const existingLeads = localStorage.getItem(KEYS.LEADS);
        
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
        localStorage.setItem(KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
        localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(DEFAULT_FICTIVE_SETTINGS));
        
        if (existingLeads) {
          localStorage.setItem(KEYS.LEADS, existingLeads);
        } else {
          localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
        }
        
        localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
        console.log(`[BANCO LOCAL] Banco de dados auto-atualizado com sucesso para a versão oficial ${CURRENT_DB_VERSION}`);
      }
    } catch (e) {
      console.error("Erro ao rodar migration de banco local:", e);
    }
  },

  // --- PORTFÓLIO DE PROJETOS ---
  getProjects: () => {
    if (!projectsCache) {
      projectsCache = getLocalProjects();
    }
    return projectsCache;
  },

  saveProjects: (projects) => {
    try {
      projectsCache = projects;
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
      
      // Sincroniza em background
      uploadProjectsToCloud(projects).catch(e => {
        console.error("Erro ao sincronizar projetos salvos com o Firestore:", e);
      });
      return true;
    } catch (e) {
      console.error("Erro ao salvar projetos localmente:", e);
      return false;
    }
  },

  // --- MEMBROS DA EQUIPE ---
  getTeam: () => {
    if (!teamCache) {
      teamCache = getLocalTeam();
    }
    return teamCache;
  },

  saveTeam: (team) => {
    try {
      teamCache = team;
      localStorage.setItem(KEYS.TEAM, JSON.stringify(team));
      
      uploadTeamToCloud(team).catch(e => {
        console.error("Erro ao sincronizar equipe salva com o Firestore:", e);
      });
      return true;
    } catch (e) {
      console.error("Erro ao salvar equipe localmente:", e);
      return false;
    }
  },

  // --- CONFIGURAÇÕES DE RASCUNHO (TEXTOS GLOBAIS) ---
  getFictiveSettings: () => {
    try {
      dataService.checkVersionAndMigrate();
      const stored = localStorage.getItem(KEYS.FICTIVE_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(DEFAULT_FICTIVE_SETTINGS));
      return DEFAULT_FICTIVE_SETTINGS;
    } catch (e) {
      console.error("Erro ao carregar fictive settings:", e);
      return DEFAULT_FICTIVE_SETTINGS;
    }
  },

  saveFictiveSettings: (settings) => {
    try {
      localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(settings));
      
      // Sincroniza em background
      uploadFictiveSettingsToCloud(settings).catch(e => {
        console.error("Erro ao sincronizar configurações fictícias com o Firestore:", e);
      });
      return true;
    } catch (e) {
      console.error("Erro ao salvar fictive settings:", e);
      return false;
    }
  },

  // --- CAPTURA DE LEADS (CLIENTES) ---
  getLeads: () => {
    try {
      const stored = localStorage.getItem(KEYS.LEADS);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (e) {
      console.error("Erro ao carregar leads:", e);
      return [];
    }
  },

  saveLead: (lead) => {
    try {
      const leads = dataService.getLeads();
      const newLead = {
        id: lead.id || `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: lead.name,
        whatsapp: lead.whatsapp,
        email: lead.email || '',
        category: lead.category || 'Geral',
        date: lead.date || new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: lead.status || 'Novo' // 'Novo' | 'Em Atendimento' | 'Fechado' | 'Arquivado'
      };
      leads.unshift(newLead);
      localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
      return newLead;
    } catch (e) {
      console.error("Erro ao salvar lead:", e);
      return null;
    }
  },

  updateLeadStatus: (leadId, newStatus) => {
    try {
      const leads = dataService.getLeads();
      const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      localStorage.setItem(KEYS.LEADS, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("Erro ao atualizar status do lead:", e);
      return false;
    }
  },

  deleteLead: (leadId) => {
    try {
      const leads = dataService.getLeads();
      const filtered = leads.filter(l => l.id !== leadId);
      localStorage.setItem(KEYS.LEADS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error("Erro ao excluir lead:", e);
      return false;
    }
  },

  // --- CONFIGURAÇÃO IMGBB DE UPLOAD CLOUD ---
  getImgbbApiKey: () => {
    try {
      return localStorage.getItem('hajaluz_imgbb_api_key') || '7e9d89280d56b02660aa3aeae7ff9dcd';
    } catch (e) {
      return '7e9d89280d56b02660aa3aeae7ff9dcd';
    }
  },

  saveImgbbApiKey: (key) => {
    try {
      localStorage.setItem('hajaluz_imgbb_api_key', key);
      return true;
    } catch (e) {
      return false;
    }
  },

  getUploadMode: () => {
    try {
      return localStorage.getItem('hajaluz_upload_mode') || 'cloud';
    } catch (e) {
      return 'cloud';
    }
  },

  saveUploadMode: (mode) => {
    try {
      localStorage.setItem('hajaluz_upload_mode', mode);
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- RESTAURAR PADRÕES DE FÁBRICA ---
  resetToDefaults: () => {
    try {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      localStorage.setItem(KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
      localStorage.setItem(KEYS.FICTIVE_SETTINGS, JSON.stringify(DEFAULT_FICTIVE_SETTINGS));
      localStorage.setItem(KEYS.LEADS, JSON.stringify([]));
      return true;
    } catch (e) {
      console.error("Erro ao restaurar padrões no localStorage:", e);
      return false;
    }
  },

  // --- MÉTODOS DE SINCRONIZAÇÃO ATIVA E REPORT DE ERROS ---
  uploadProjectsToCloudActive: async (projectsArray) => {
    const colRef = collection(db, KEYS.PROJECTS);
    const snap = await promiseTimeout(getDocs(colRef), 5000);
    const batch = writeBatch(db);
    snap.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    projectsArray.forEach((proj, idx) => {
      const docId = proj.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || `proj-${idx}`;
      const docRef = doc(db, KEYS.PROJECTS, docId);
      batch.set(docRef, { ...proj, orderIndex: idx });
    });
    await promiseTimeout(batch.commit(), 5000);
    return true;
  },

  uploadTeamToCloudActive: async (teamArray) => {
    const colRef = collection(db, KEYS.TEAM);
    const snap = await promiseTimeout(getDocs(colRef), 5000);
    const batch = writeBatch(db);
    snap.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    teamArray.forEach((member, idx) => {
      const docId = member.id || `member-${idx}`;
      const docRef = doc(db, KEYS.TEAM, docId);
      batch.set(docRef, { ...member, orderIndex: idx });
    });
    await promiseTimeout(batch.commit(), 5000);
    return true;
  },

  uploadFictiveSettingsToCloudActive: async (settingsObj) => {
    const docRef = doc(db, KEYS.FICTIVE_SETTINGS, "global_settings");
    await promiseTimeout(setDoc(docRef, settingsObj), 5000);
    return true;
  }
};
