// Código compartilhado entre o catálogo (index.html) e o painel (admin.html).

// Fontes disponíveis (Google Fonts) e os pesos carregados de cada uma.
const FONTES = {
  'Barlow Condensed': 'ital,wght@0,600;0,700;1,800',
  'Barlow': 'ital,wght@0,400;0,600;0,700;1,800',
  'Bebas Neue': '',
  'Oswald': 'wght@400;600;700',
  'Anton': '',
  'Teko': 'wght@400;600;700',
  'Rajdhani': 'wght@400;600;700',
  'Orbitron': 'wght@400;700;800',
  'Russo One': '',
  'Exo 2': 'ital,wght@0,400;0,700;1,800',
  'Press Start 2P': '',
  'Montserrat': 'ital,wght@0,400;0,600;0,700;1,800',
  'Poppins': 'ital,wght@0,400;0,600;0,700;1,800',
  'Inter': 'wght@400;600;700;800',
  'Roboto': 'ital,wght@0,400;0,700;1,700',
  'Nunito': 'ital,wght@0,400;0,700;1,800'
};

const TEMA_PADRAO = {
  fonteTitulo: 'Barlow Condensed', fonteTexto: 'Barlow',
  escTitulo: 1, escTexto: 1, logoAltura: 140,
  cores: {fundo: '#07090f', cartao: '#101624', texto: '#eef2fa', textoSec: '#8592aa', principal: '#2b8cff', destaque: '#ff2d55'}
};

const PALETAS = [
  {nome: 'Neon azul e vermelho', cores: {...TEMA_PADRAO.cores}},
  {nome: 'Verde gamer', cores: {fundo: '#060a07', cartao: '#0f1912', texto: '#eefaf1', textoSec: '#86a68f', principal: '#22c55e', destaque: '#facc15'}},
  {nome: 'Roxo neon', cores: {fundo: '#0b0714', cartao: '#161026', texto: '#f3eefc', textoSec: '#9a8db5', principal: '#8b5cf6', destaque: '#ec4899'}},
  {nome: 'Vermelho e preto', cores: {fundo: '#0a0a0a', cartao: '#171717', texto: '#f5f5f5', textoSec: '#a3a3a3', principal: '#ef4444', destaque: '#f97316'}},
  {nome: 'Laranja', cores: {fundo: '#0d0a07', cartao: '#1b140d', texto: '#fbf3ea', textoSec: '#a8957f', principal: '#f97316', destaque: '#38bdf8'}},
  {nome: 'Claro', cores: {fundo: '#f4f6fb', cartao: '#ffffff', texto: '#141a26', textoSec: '#5d6880', principal: '#1f6feb', destaque: '#e11d48'}}
];

const NOMES_CORES = {fundo: 'Fundo', cartao: 'Cartões', texto: 'Texto', textoSec: 'Texto secundário', principal: 'Cor principal', destaque: 'Cor de destaque'};

const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Textos do catálogo que podem ter fonte, tamanho, cor e estilo próprios.
// A ordem importa: o mais específico vem antes (usado para saber em qual texto o usuário clicou na prévia).
const TEXTOS = [
  {k: 'marca2', nome: 'Nome da loja — última palavra', sel: '.marca span', base: 'tit', soCor: true},
  {k: 'marca', nome: 'Nome da loja', sel: '.marca', base: 'tit', negrito: true, italico: true, maiusculas: true},
  {k: 'slogan', nome: 'Frase de apresentação', sel: '.slogan', base: 'txt', negrito: false, italico: false, maiusculas: false},
  {k: 'insta', nome: 'Instagram', sel: '.insta', base: 'txt', negrito: true, italico: false, maiusculas: false},
  {k: 'categorias', nome: 'Botões de categoria', sel: '.chip, .sub-item b', base: 'txt', negrito: true, italico: false, maiusculas: false},
  {k: 'secao', nome: 'Títulos das categorias', sel: '.sec-tit', base: 'tit', negrito: true, italico: true, maiusculas: true},
  {k: 'subsecao', nome: 'Subtítulos das subcategorias', sel: '.sub-tit', base: 'txt', negrito: true, italico: false, maiusculas: true},
  {k: 'nome', nome: 'Nome do produto', sel: '.nome', base: 'tit', negrito: true, italico: false, maiusculas: false},
  {k: 'desc', nome: 'Descrição do produto', sel: '.desc', base: 'txt', negrito: false, italico: false, maiusculas: false},
  {k: 'opcoes', nome: 'Opções do produto (garantia, oferta…)', sel: '.opcoes li', base: 'txt', negrito: true, italico: false, maiusculas: false},
  {k: 'gb', nome: 'Valor em GB', sel: '.preco.gb', base: 'tit', negrito: true, italico: false, maiusculas: false},
  {k: 'preco', nome: 'Preço', sel: '.preco:not(.gb)', base: 'tit', negrito: true, italico: false, maiusculas: false},
  {k: 'rodape', nome: 'Rodapé', sel: '.rodape', base: 'txt', negrito: false, italico: false, maiusculas: false}
];

function normPos(p) {
  const lp = Object.assign({modo: 'esquerda', x: 50, y: 0}, p && typeof p === 'object' ? p : {});
  if (!['esquerda', 'centro', 'direita', 'livre'].includes(lp.modo)) lp.modo = 'esquerda';
  lp.x = Math.min(100, Math.max(0, +lp.x || 0)); lp.y = Math.max(0, Math.round(+lp.y || 0));
  return {modo: lp.modo, x: lp.x, y: lp.y};
}
const LARGURA_CELULAR = 699;   // até essa largura (px) o site usa o layout e a posição de logo do celular

function mesclarTema(t) {
  t = t && typeof t === 'object' ? t : {};
  const r = Object.assign({}, TEMA_PADRAO, t);
  r.cores = Object.assign({}, TEMA_PADRAO.cores, t.cores || {});
  if (!(r.fonteTitulo in FONTES)) r.fonteTitulo = TEMA_PADRAO.fonteTitulo;
  if (!(r.fonteTexto in FONTES)) r.fonteTexto = TEMA_PADRAO.fonteTexto;
  for (const k of ['escTitulo', 'escTexto', 'logoAltura']) if (!isFinite(+r[k])) r[k] = TEMA_PADRAO[k];
  // estilo de cada texto (versões antigas tinham só "italico" e "maiusculas" gerais)
  const antigos = t.textos || {}, tx = {};
  for (const d of TEXTOS) {
    const v = {fonte: '', escala: 1, cor: '', negrito: !!d.negrito, italico: !!d.italico, maiusculas: !!d.maiusculas};
    if (!t.textos && (d.k === 'marca' || d.k === 'secao')) {
      if (t.italico === false) v.italico = false;
      if (t.maiusculas === false) v.maiusculas = false;
    }
    Object.assign(v, antigos[d.k] || {});
    if (v.fonte && !(v.fonte in FONTES)) v.fonte = '';
    v.escala = isFinite(+v.escala) && +v.escala > 0 ? +v.escala : 1;
    if (v.cor && !/^#[0-9a-f]{6}$/i.test(v.cor)) v.cor = '';
    tx[d.k] = v;
  }
  r.textos = tx;
  delete r.italico; delete r.maiusculas;
  // posição da logo: esquerda, centro, direita ou livre (x em % da largura, y em px do topo)
  // logoPos = computador; logoPosCel = celular (null = igual ao computador)
  r.logoPos = normPos(t.logoPos);
  r.logoPosCel = t.logoPosCel ? normPos(t.logoPosCel) : null;
  return r;
}

// ---------- árvore de categorias (sem limite de níveis) ----------
function arvore(l) {
  return (Array.isArray(l) ? l : []).filter(c => c && typeof c === 'object').map(c => ({
    id: String(c.id || novoId()), nome: String(c.nome ?? ''), filhas: arvore(c.filhas || c.subs)
  }));
}
function percorrer(lista, pai = null, nivel = 0, out = []) {
  for (const no of lista) { out.push({no, pai, nivel}); percorrer(no.filhas, no, nivel + 1, out); }
  return out;
}
const idsDe = no => [no.id, ...no.filhas.flatMap(idsDe)];

// Lê o produtos.json em qualquer versão (antiga ou nova) e devolve no formato atual.
function normalizarCatalogo(d) {
  d = d && typeof d === 'object' ? d : {};
  const li = d.loja || {};
  const loja = Object.assign({nome: '', slogan: '', whatsapp: '', instagram: '', rodape: '', logo: ''}, li);
  loja.ocultarNome = !!li.ocultarNome;
  loja.tema = mesclarTema(li.tema);

  const categorias = arvore(d.categorias);
  const existe = id => !!id && percorrer(categorias).some(n => n.no.id === id);
  const acharCat = v => {
    if (!v) return '';
    if (existe(String(v))) return String(v);
    let c = categorias.find(x => norm(x.nome) === norm(v));
    if (!c) { c = {id: novoId(), nome: String(v), filhas: []}; categorias.push(c); }
    return c.id;
  };

  const etiquetas = Array.isArray(d.etiquetas)
    ? d.etiquetas.filter(e => e && typeof e === 'object').map(e => ({id: String(e.id || novoId()), nome: String(e.nome ?? '')}))
    : [{id: 'destaque', nome: 'Destaque'}];

  const produtos = (Array.isArray(d.produtos) ? d.produtos : []).map(p => {
    const v = typeof p.valor === 'number' ? p.valor : p.preco;
    const etq = Array.isArray(p.etiquetas) ? p.etiquetas.map(String) : (p.destaque ? ['destaque'] : []);
    return {
      id: String(p.id || novoId()), nome: String(p.nome || ''), descricao: String(p.descricao || ''),
      categoria: existe(String(p.subcategoria || '')) ? String(p.subcategoria) : acharCat(p.categoria),
      unidade: p.unidade === 'GB' ? 'GB' : 'R$',
      valor: typeof v === 'number' && isFinite(v) ? v : null,
      imagens: Array.isArray(p.imagens) ? p.imagens.filter(Boolean) : (p.imagem ? [p.imagem] : []),
      disponivel: p.disponivel !== false,
      etiquetas: etiquetas.filter(e => etq.includes(e.id)).map(e => e.id)
    };
  });
  return {loja, categorias, etiquetas, produtos};
}

// ---------- tema ----------
function urlFontes(t) {
  const usadas = [t.fonteTitulo, t.fonteTexto, ...Object.values(t.textos || {}).map(v => v.fonte)];
  const fams = [...new Set(usadas)].filter(f => f && f in FONTES);
  return 'https://fonts.googleapis.com/css2?' +
    fams.map(f => 'family=' + f.replace(/ /g, '+') + (FONTES[f] ? ':' + FONTES[f] : '')).join('&') + '&display=swap';
}
function corSobre(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#fff';
  const n = parseInt(m[1], 16), lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  const L = .2126 * lin(n >> 16 & 255) + .7152 * lin(n >> 8 & 255) + .0722 * lin(n & 255);
  return L > .45 ? '#0b0f17' : '#ffffff';
}
function aplicarTema(tema) {
  const t = mesclarTema(tema), c = t.cores, r = document.documentElement.style;
  const v = {
    '--bg': c.fundo, '--card': c.cartao, '--txt': c.texto, '--mut': c.textoSec, '--azul': c.principal, '--verm': c.destaque,
    '--sobre-azul': corSobre(c.principal), '--sobre-verm': corSobre(c.destaque),
    '--f-tit': `"${t.fonteTitulo}","Arial Narrow",sans-serif`, '--f-txt': `"${t.fonteTexto}",system-ui,sans-serif`,
    '--esc-tit': t.escTitulo, '--esc-txt': t.escTexto, '--logo-h': t.logoAltura + 'px'
  };
  for (const k in v) r.setProperty(k, String(v[k]));
  // regras de cada texto
  let css = '';
  for (const d of TEXTOS) {
    const x = t.textos[d.k];
    r.setProperty('--e-' + d.k, String(x.escala));
    let p = '';
    if (x.fonte) p += `font-family:"${x.fonte}",${d.base === 'tit' ? '"Arial Narrow",' : ''}sans-serif;`;
    if (!d.soCor) p += `font-weight:${x.negrito ? (d.base === 'tit' ? 800 : 700) : 400};font-style:${x.italico ? 'italic' : 'normal'};text-transform:${x.maiusculas ? 'uppercase' : 'none'};`;
    if (x.cor) p += `color:${x.cor};`;
    if (p) css += `${d.sel}{${p}}\n`;
  }
  let s = document.getElementById('estilo-textos');
  if (!s) { s = document.createElement('style'); s.id = 'estilo-textos'; document.head.appendChild(s); }
  s.textContent = css;
  let l = document.getElementById('fontes-tema');
  if (!l) { l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'fontes-tema'; document.head.appendChild(l); }
  const u = urlFontes(t); if (l.getAttribute('href') !== u) l.href = u;
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = c.fundo;
}
