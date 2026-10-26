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
  italico: true, maiusculas: true,
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

function mesclarTema(t) {
  t = t && typeof t === 'object' ? t : {};
  const r = Object.assign({}, TEMA_PADRAO, t);
  r.cores = Object.assign({}, TEMA_PADRAO.cores, t.cores || {});
  if (!(r.fonteTitulo in FONTES)) r.fonteTitulo = TEMA_PADRAO.fonteTitulo;
  if (!(r.fonteTexto in FONTES)) r.fonteTexto = TEMA_PADRAO.fonteTexto;
  for (const k of ['escTitulo', 'escTexto', 'logoAltura']) if (!isFinite(+r[k])) r[k] = TEMA_PADRAO[k];
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
  const fams = [...new Set([t.fonteTitulo, t.fonteTexto])].filter(f => f in FONTES);
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
    '--esc-tit': t.escTitulo, '--esc-txt': t.escTexto, '--logo-h': t.logoAltura + 'px',
    '--tit-estilo': t.italico ? 'italic' : 'normal', '--tit-caixa': t.maiusculas ? 'uppercase' : 'none'
  };
  for (const k in v) r.setProperty(k, String(v[k]));
  let l = document.getElementById('fontes-tema');
  if (!l) { l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'fontes-tema'; document.head.appendChild(l); }
  const u = urlFontes(t); if (l.getAttribute('href') !== u) l.href = u;
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = c.fundo;
}
