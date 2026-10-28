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
  formatoFoto: '4/5', ajusteFoto: 'contain',          // fotos dos cartões: proporção e "inteira" (contain) ou "preencher" (cover)
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

const FORMATOS_FOTO = [
  {v: '1/1', nome: 'Quadrada (1:1)'}, {v: '4/5', nome: 'Capa de jogo (4:5)'}, {v: '3/4', nome: 'Retrato (3:4)'},
  {v: '2/3', nome: 'Pôster (2:3)'}, {v: '9/16', nome: 'Story (9:16)'}
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

// Itens do topo do site que podem ser posicionados livremente (cada aparelho tem as suas posições).
const ELEM_TOPO = [
  {k: 'logo', nome: 'Logo'},
  {k: 'marca', nome: 'Nome da loja'},
  {k: 'slogan', nome: 'Frase'},
  {k: 'insta', nome: 'Instagram'}
];
// modo: esquerda | centro | direita (no fluxo normal) ou livre (x = % da largura do conteúdo, y = px do topo)
// w = largura da caixa em px (0 = automática); al = alinhamento do texto na caixa; h = altura da logo
function normPos(p, k = 'logo', hPadrao = 140) {
  const o = Object.assign({modo: 'esquerda', x: 0, y: 0, w: 0, al: 'esquerda'}, p && typeof p === 'object' ? p : {});
  const r = {
    modo: ['esquerda', 'centro', 'direita', 'livre'].includes(o.modo) ? o.modo : 'esquerda',
    x: Math.min(100, Math.max(0, +o.x || 0)),
    y: Math.max(0, Math.round(+o.y || 0)),
    w: Math.max(0, Math.round(+o.w || 0)),
    al: ['esquerda', 'centro', 'direita'].includes(o.al) ? o.al : 'esquerda'
  };
  if (k === 'logo') r.h = Math.min(800, Math.max(20, Math.round(+o.h || hPadrao)));
  else r.hc = Math.max(0, Math.round(+o.hc || 0));      // altura da caixa do texto (0 = automática)
  return r;
}
function normPosicoes(ps, hPadrao) {
  const r = {};
  for (const e of ELEM_TOPO) r[e.k] = normPos(ps && ps[e.k], e.k, hPadrao);
  return r;
}
const LARGURA_CELULAR = 699;   // até essa largura (px) o site usa o layout e a posição de logo do celular

function mesclarTema(t) {
  t = t && typeof t === 'object' ? t : {};
  const r = Object.assign({}, TEMA_PADRAO, t);
  r.cores = Object.assign({}, TEMA_PADRAO.cores, t.cores || {});
  if (!(r.fonteTitulo in FONTES)) r.fonteTitulo = TEMA_PADRAO.fonteTitulo;
  if (!(r.fonteTexto in FONTES)) r.fonteTexto = TEMA_PADRAO.fonteTexto;
  for (const k of ['escTitulo', 'escTexto', 'logoAltura']) if (!isFinite(+r[k])) r[k] = TEMA_PADRAO[k];
  if (!FORMATOS_FOTO.some(f => f.v === r.formatoFoto)) r.formatoFoto = TEMA_PADRAO.formatoFoto;
  if (!['contain', 'cover'].includes(r.ajusteFoto)) r.ajusteFoto = TEMA_PADRAO.ajusteFoto;
  // tamanhos do celular (null = igual ao computador)
  const numOuNulo = v => (v !== null && v !== undefined && v !== '' && isFinite(+v) && +v > 0) ? +v : null;
  r.escTituloCel = numOuNulo(t.escTituloCel); r.escTextoCel = numOuNulo(t.escTextoCel);
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
    v.escalaCel = numOuNulo(v.escalaCel);        // tamanho no celular (null = igual ao computador)
    if (v.cor && !/^#[0-9a-f]{6}$/i.test(v.cor)) v.cor = '';
    tx[d.k] = v;
  }
  r.textos = tx;
  delete r.italico; delete r.maiusculas;
  // posições do topo: pc = computador; cel = celular (null = igual ao computador)
  const h = r.logoAltura, P = t.posicoes;
  if (P && P.pc) {
    const pc = normPosicoes(P.pc, h);
    r.posicoes = {pc, cel: P.cel ? normPosicoes({...P.pc, ...P.cel}, h) : null};
  } else {                                   // versões antigas: só a logo tinha posição
    const pc = normPosicoes({logo: t.logoPos}, h);
    let cel = null;
    if (t.logoPosCel) { cel = JSON.parse(JSON.stringify(pc)); cel.logo = normPos(t.logoPosCel, 'logo', h); }
    r.posicoes = {pc, cel};
  }
  delete r.logoPos; delete r.logoPosCel;
  return r;
}

// ---------- árvore de categorias (sem limite de níveis) ----------
// usa: lista de caminhos reaproveitados, cada um {id, modo}
//   modo 'filhas'  = as subcategorias da outra categoria entram aqui
//   modo 'inteira' = a outra categoria entra inteira, como subcategoria
function normUsa(u) {
  const l = Array.isArray(u) ? u : (u ? [u] : []);
  return l.map(x => typeof x === 'string' ? {id: x, modo: 'filhas'} : (x && typeof x === 'object' ? {id: String(x.id || ''), modo: x.modo === 'inteira' ? 'inteira' : 'filhas'} : null))
    .filter(x => x && x.id);
}
function arvore(l) {
  return (Array.isArray(l) ? l : []).filter(c => c && typeof c === 'object').map(c => ({
    id: String(c.id || novoId()), nome: String(c.nome ?? ''), filhas: arvore(c.filhas || c.subs), usa: normUsa(c.usa)
  }));
}
// Monta a árvore "como o cliente vê". Caminhos reaproveitados viram atalhos: mostram OS MESMOS itens da categoria original.
// Cada nó expandido tem "origens" (ids reais cujos produtos ele mostra). Nós com o mesmo nome no mesmo nível são juntados.
const SEP_ID = '>';
function expandirArvore(lista) {
  const porId = new Map(percorrer(lista).map(x => [x.no.id, x.no]));
  function juntar(filhas, c) {
    const x = filhas.find(f => norm(f.nome) === norm(c.nome));
    if (!x) { filhas.push(c); return; }
    for (const o of c.origens) if (!x.origens.includes(o)) x.origens.push(o);
    for (const g of c.filhas) juntar(x.filhas, g);
  }
  function exp(no, id, virtual, pilha) {
    const filhas = [];
    for (const f of no.filhas) juntar(filhas, exp(f, virtual ? id + SEP_ID + f.id : f.id, virtual, [...pilha, f.id]));
    for (const u of no.usa || []) {
      const alvo = porId.get(u.id);
      if (!alvo || pilha.includes(u.id) || pilha.length > 14) continue;
      const fontes = u.modo === 'inteira' ? [alvo] : alvo.filhas;
      for (const f of fontes) juntar(filhas, exp(f, id + SEP_ID + f.id, true, [...pilha, u.id, f.id]));
    }
    return {id, nome: no.nome, filhas, usa: no.usa || [], virtual, origens: [no.id]};
  }
  return lista.map(c => exp(c, c.id, false, [c.id]));
}
function percorrer(lista, pai = null, nivel = 0, out = []) {
  for (const no of lista) { out.push({no, pai, nivel}); percorrer(no.filhas, no, nivel + 1, out); }
  return out;
}
const idsDe = no => [no.id, ...no.filhas.flatMap(idsDe)];
const origensDe = no => [...(no.origens || [no.id]), ...no.filhas.flatMap(origensDe)];

// Lê o produtos.json em qualquer versão (antiga ou nova) e devolve no formato atual.
function normalizarCatalogo(d) {
  d = d && typeof d === 'object' ? d : {};
  const li = d.loja || {};
  const loja = Object.assign({nome: '', slogan: '', whatsapp: '', instagram: '', rodape: '', logo: ''}, li);
  loja.ocultarNome = !!li.ocultarNome;
  loja.tema = mesclarTema(li.tema);

  const categorias = arvore(d.categorias);
  const reais = new Set(percorrer(categorias).map(x => x.no.id));
  const nosExp = new Set(percorrer(expandirArvore(categorias)).map(x => x.no.id));
  // o produto fica sempre na categoria real (um caminho reaproveitado aponta para ela)
  const real = v => {
    v = String(v || '');
    if (reais.has(v)) return v;
    if (v.includes(SEP_ID)) { const ult = v.slice(v.lastIndexOf(SEP_ID) + 1); if (reais.has(ult)) return ult; }
    return '';
  };
  const acharCat = v => {
    if (!v) return '';
    const r = real(v); if (r) return r;
    if (String(v).includes(SEP_ID)) return '';
    let c = categorias.find(x => norm(x.nome) === norm(v));
    if (!c) { c = {id: novoId(), nome: String(v), filhas: [], usa: []}; categorias.push(c); reais.add(c.id); nosExp.add(c.id); }
    return c.id;
  };
  // listas de "escolher junto" podem apontar para um caminho reaproveitado
  const extraValido = v => { v = String(v || ''); if (nosExp.has(v)) return v; return real(v); };

  const etiquetas = Array.isArray(d.etiquetas)
    ? d.etiquetas.filter(e => e && typeof e === 'object').map(e => ({id: String(e.id || novoId()), nome: String(e.nome ?? '')}))
    : [{id: 'destaque', nome: 'Destaque'}];

  const produtos = (Array.isArray(d.produtos) ? d.produtos : []).map(p => {
    const v = typeof p.valor === 'number' ? p.valor : p.preco;
    const etq = Array.isArray(p.etiquetas) ? p.etiquetas.map(String) : (p.destaque ? ['destaque'] : []);
    return {
      id: String(p.id || novoId()), nome: String(p.nome || ''), descricao: String(p.descricao || ''),
      categoria: real(p.subcategoria) || acharCat(p.categoria),
      unidade: p.unidade === 'GB' ? 'GB' : 'R$',
      valor: typeof v === 'number' && isFinite(v) ? v : null,
      imagens: Array.isArray(p.imagens) ? p.imagens.filter(Boolean) : (p.imagem ? [p.imagem] : []),
      disponivel: p.disponivel !== false,
      etiquetas: etiquetas.filter(e => etq.includes(e.id)).map(e => e.id),
      // "escolher junto": cada entrada é um botão {cat, rotulo} que abre a lista numa nova aba
      extras: (Array.isArray(p.extras) ? p.extras : []).map(e => {
        const o = typeof e === 'string' ? {cat: e, rotulo: ''} : (e && typeof e === 'object' ? e : {});
        return {cat: extraValido(o.cat), rotulo: String(o.rotulo || '').trim()};
      }).filter((x, i, a) => x.cat && a.findIndex(y => y.cat === x.cat) === i),
      tipo: String(p.tipo || '').trim(),             // categoria do item (Ação, Aventura…)
      cod: /^[0-9a-z]{1,6}$/.test(String(p.cod || '')) ? String(p.cod) : '',     // código curto (usado no link do pedido)
      vendidos: Number.isInteger(p.vendidos) && p.vendidos > 0 ? p.vendidos : 0,   // quantas vezes foi pedido (ranking "Mais vendidos")
      // outras categorias onde o MESMO item também aparece
      outras: (Array.isArray(p.outras) ? p.outras : []).map(real).filter((x, i, a) => x && a.indexOf(x) === i),
      // foto do cartão: formato fixo ('4/5'…), 'auto' (usa a proporção da foto) ou '' (padrão da loja)
      formato: FORMATOS_FOTO.some(f => f.v === p.formato) || p.formato === 'auto' ? p.formato : '',
      proporcao: /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(String(p.proporcao || '')) ? String(p.proporcao) : '',
      ajuste: ['contain', 'cover'].includes(p.ajuste) ? p.ajuste : '',
      // versões de armazenamento: {id, nome, gb (espaço livre), valor (preço opcional)}
      armazenamentos: (Array.isArray(p.armazenamentos) ? p.armazenamentos : []).filter(a => a && typeof a === 'object').map(a => ({
        id: String(a.id || novoId()), nome: String(a.nome || '').trim(),
        gb: isFinite(+a.gb) && +a.gb > 0 ? +a.gb : 0,
        valor: a.valor !== null && a.valor !== '' && isFinite(+a.valor) && +a.valor >= 0 ? +a.valor : null
      })).filter(a => a.nome || a.gb)
    };
  });
  produtos.forEach(p => { p.outras = p.outras.filter(c => c !== p.categoria); });
  return {loja, categorias, etiquetas, produtos};
}
// todas as categorias (reais) em que o produto aparece
const catsDe = p => [p.categoria, ...(p.outras || [])].filter(Boolean);
// proporção/ajuste da foto do cartão (o do produto, ou o padrão da loja)
function estiloFoto(p, tema) {
  const ar = p.formato === 'auto' ? (p.proporcao || '') : p.formato;
  const r = [];
  if (ar) r.push('--foto-ar:' + ar);
  if (p.ajuste) r.push('--foto-fit:' + p.ajuste);
  return r.join(';');
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
    '--logo-h': t.logoAltura + 'px', '--foto-ar': t.formatoFoto, '--foto-fit': t.ajusteFoto
  };
  for (const k in v) r.setProperty(k, String(v[k]));
  r.colorScheme = corSobre(c.fundo) === '#ffffff' ? 'dark' : 'light';   // listas e barras de rolagem no modo do tema
  // tamanhos: um conjunto para computador e outro para celular
  const cel = v2 => v2 ?? null;
  let pc = `--esc-tit:${t.escTitulo};--esc-txt:${t.escTexto};`, ce = `--esc-tit:${cel(t.escTituloCel) ?? t.escTitulo};--esc-txt:${cel(t.escTextoCel) ?? t.escTexto};`;
  for (const d of TEXTOS) { const x = t.textos[d.k]; pc += `--e-${d.k}:${x.escala};`; ce += `--e-${d.k}:${x.escalaCel ?? x.escala};`; }
  let css = `:root{${pc}}\n@media (max-width:${LARGURA_CELULAR}px){:root{${ce}}}\n`;
  // regras de cada texto
  for (const d of TEXTOS) {
    const x = t.textos[d.k];
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
