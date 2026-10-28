// Pedidos: montar o pedido, gerar o link, o texto do WhatsApp, o PDF (com as capas) e o histórico.
// Usado pelo catálogo (index.html), pela página do pedido (pedido.html) e pelo painel (admin.html).
// Depende de comum.js (percorrer, origensDe, catsDe, norm).
const Pedidos = (() => {
  const brl = v => Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
  const num = v => Number(v).toLocaleString('pt-BR', {maximumFractionDigits: 2});
  const ehGB = p => p.unidade === 'GB';
  const temNum = v => typeof v === 'number' && isFinite(v);

  // ---------- link do pedido (tudo vai no endereço; nada passa por servidor) ----------
  const b64url = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const deB64url = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  // formato curto (v2): "2.<nº>.<itens>.<nome>.<obs>"; cada item = código curto do produto (+ Xqtd, + Vversão)
  const encParte = t => encodeURIComponent(t || '').replace(/\./g, '%2E');
  function codificar(c, produtos) {
    const its = c.it.map(([pid, q, vid]) => {
      const p = produtos.find(x => x.id === pid); if (!p) return '';
      let t = p.cod || ('_' + p.id);
      if (q > 1) t += 'X' + q;
      const vi = vid ? p.armazenamentos.findIndex(a => a.id === vid) : -1;
      if (vi > 0) t += 'V' + vi;
      return t;
    }).filter(Boolean);
    return ['2', c.id, its.join('-'), encParte(c.n), encParte(c.o)].join('.').replace(/\.+$/, '');
  }
  // aceita o texto depois do "#" (formato curto) ou o antigo "p=…"
  function decodificar(h) {
    h = String(h || '').replace(/^#/, '');
    const m = /(?:^|[#&])p=([^&]+)/.exec(h);
    if (m) { try { const c = JSON.parse(deB64url(m[1])); return c && Array.isArray(c.it) ? c : null; } catch (e) { return null; } }
    const ps = h.split('.');
    if (ps[0] !== '2' || !ps[1]) return null;
    try {
      const it = (ps[2] || '').split('-').filter(Boolean).map(t => {
        const mm = /^(_?[0-9a-z]+)(?:X(\d+))?(?:V(\d+))?$/.exec(t); if (!mm) return null;
        return [mm[1].startsWith('_') ? mm[1].slice(1) : 'c:' + mm[1], +(mm[2] || 1), mm[3] ? +mm[3] : 0, null];
      }).filter(Boolean);
      const seg = parseInt(ps[1].slice(0, 6), 36);
      return {v: 2, id: ps[1], t: isFinite(seg) ? seg * 1000 : Date.now(), n: decodeURIComponent(ps[3] || ''), o: decodeURIComponent(ps[4] || ''), it};
    } catch (e) { return null; }
  }
  // nº do pedido = momento em que foi feito (segundos, base 36) + 1 letra aleatória
  const novoNumero = () => Math.floor(Date.now() / 1000).toString(36).toUpperCase() + Math.random().toString(36).slice(2, 3).toUpperCase();

  // ---------- monta o pedido a partir do que o cliente escolheu ----------
  // cat = {loja, categorias (árvore expandida), produtos}; compacto = {id, t, n, o, it: [[produto, qtd, versão, valor]]}
  function montar(cat, c) {
    const nos = percorrer(cat.categorias), porId = new Map(nos.map(x => [x.no.id, x]));
    const caminho = id => { const n = []; let x = porId.get(id); while (x) { n.unshift(x.no.nome); x = x.pai ? porId.get(x.pai.id) : null; } return n.join(' › '); };
    const linhas = c.it.map(([pid, q, vid, vSnap]) => {
      const p = cat.produtos.find(x => x.id === pid || (x.cod && 'c:' + x.cod === pid));
      if (!p) return null;
      const v = (typeof vid === 'number' ? p.armazenamentos[vid] : p.armazenamentos.find(a => a.id === vid)) || (p.armazenamentos.length ? p.armazenamentos[0] : null);
      const valorAtual = v && v.valor !== null ? v.valor : p.valor;
      return {
        id: p.id, nome: p.nome, qtd: Math.max(1, +q || 1), versao: v ? v.nome : '', versaoGB: v ? v.gb : 0,
        unidade: p.unidade, valor: ehGB(p) ? null : (temNum(vSnap) ? vSnap : (temNum(valorAtual) ? valorAtual : null)),
        gb: ehGB(p) && temNum(p.valor) ? p.valor : null, imagem: p.imagens[0] || '', tipo: p.tipo || '',
        grupo: caminho(p.categoria) || 'Outros', adicional: '', _p: p
      };
    }).filter(Boolean);
    // itens que entraram pelo botão "Adicionar …" de outro item escolhido viram "adicionais"
    for (const l of linhas) for (const e of l._p.extras || []) {
      const x = porId.get(e.cat); if (!x) continue;
      const ids = new Set(origensDe(x.no));
      const nome = (e.rotulo || '').replace(/^\s*adicionar\s+/i, '').trim() || x.no.nome;
      for (const o of linhas) if (o !== l && !o.adicional && catsDe(o._p).some(cc => ids.has(cc))) o.adicional = nome;
    }
    let reais = 0, gb = 0, limite = 0, cons = 0;
    for (const l of linhas) {
      if (l.unidade === 'GB') gb += (l.gb || 0) * l.qtd;
      else if (temNum(l.valor)) reais += l.valor * l.qtd; else cons++;
      limite += (l.versaoGB || 0) * l.qtd;
      delete l._p; delete l.versaoGB;
    }
    return {
      id: c.id, data: new Date(c.t || Date.now()).toISOString(), loja: cat.loja.nome || '',
      cliente: {nome: c.n || '', obs: c.o || ''}, itens: linhas,
      totais: {reais, gb, limite, cons, qtd: linhas.reduce((s, l) => s + l.qtd, 0)}
    };
  }

  // ---------- texto do WhatsApp ----------
  function texto(ped, link) {
    const principais = ped.itens.filter(l => !l.adicional), adic = {};
    ped.itens.filter(l => l.adicional).forEach(l => { (adic[l.adicional] = adic[l.adicional] || []).push(l); });
    const linhas = principais.map(l => {
      const nome = l.nome + (l.versao ? ` (${l.versao})` : '');
      if (l.unidade === 'GB') return `• ${nome}${l.gb ? ' — ' + num(l.gb) + ' GB' : ''}`;
      return `• ${l.qtd}x ${nome} — ${temNum(l.valor) ? brl(l.valor * l.qtd) : 'sob consulta'}`;
    });
    for (const [nome, ls] of Object.entries(adic)) {
      const g = ls.reduce((s, l) => s + (l.gb || 0) * l.qtd, 0), n = ls.reduce((s, l) => s + l.qtd, 0);
      linhas.push(`• ${nome} listados no PDF anexado (${n === 1 ? '1 item' : n + ' itens'}${g ? ' · ' + num(g) + ' GB' : ''})`);
    }
    const t = ped.totais;
    let m = `Olá! Vim pelo catálogo${ped.loja ? ' da ' + ped.loja : ''} e tenho interesse em:\n\n${linhas.join('\n')}\n\n`;
    if (t.reais) m += `Total estimado: ${brl(t.reais)}${t.cons ? ' (+ itens sob consulta)' : ''}\n`;
    if (t.gb) m += t.limite ? `Espaço usado: ${num(t.gb)} de ${num(t.limite)} GB\n` : `Total em GB: ${num(t.gb)} GB\n`;
    if (ped.cliente.nome) m += `Nome: ${ped.cliente.nome}\n`;
    if (ped.cliente.obs) m += `Obs.: ${ped.cliente.obs}\n`;
    if (link) m += `\nPedido nº ${ped.id} — completo, com as capas:\n${link}`;
    return m.trim();
  }

  // ---------- PDF (gerador próprio, sem bibliotecas externas) ----------
  const W = 595.28, H = 841.89;
  const CP1252 = {'€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135, 'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142,
    '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159};
  const latin1 = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; };
  class MiniPDF {
    constructor() { this.pgs = []; this.imgs = []; this.ctx = document.createElement('canvas').getContext('2d'); this.novaPagina(); }
    novaPagina() { this.pg = {ops: [], links: []}; this.pgs.push(this.pg); }
    rgb(h) { const n = parseInt(String(h).replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => (v / 255).toFixed(3)).join(' '); }
    enc(s) {
      let o = '';
      for (const ch of String(s).normalize('NFC')) {
        let c = ch.codePointAt(0);
        if (CP1252[ch]) c = CP1252[ch]; else if (c < 32 || (c > 126 && c < 160) || c > 255) c = 63;
        const x = String.fromCharCode(c);
        o += x === '(' || x === ')' || x === '\\' ? '\\' + x : x;
      }
      return o;
    }
    largura(s, tam, neg) { this.ctx.font = `${neg ? 'bold ' : ''}${tam}px Helvetica, Arial, sans-serif`; return this.ctx.measureText(s).width; }
    quebrar(s, tam, neg, max, maxLinhas = 99) {
      const pal = String(s).split(/\s+/).filter(Boolean), ls = []; let cur = '';
      for (const w of pal) {
        const t = cur ? cur + ' ' + w : w;
        if (this.largura(t, tam, neg) <= max || !cur) cur = t; else { ls.push(cur); cur = w; }
      }
      if (cur) ls.push(cur);
      if (ls.length > maxLinhas) { ls.length = maxLinhas; let u = ls[maxLinhas - 1]; while (u && this.largura(u + '…', tam, neg) > max) u = u.slice(0, -1); ls[maxLinhas - 1] = u + '…'; }
      return ls;
    }
    texto(x, y, s, {tam = 10, neg = false, cor = '#111111'} = {}) {
      this.pg.ops.push(`BT /${neg ? 'F2' : 'F1'} ${tam} Tf ${this.rgb(cor)} rg ${x.toFixed(2)} ${(H - y).toFixed(2)} Td (${this.enc(s)}) Tj ET`);
    }
    ret(x, y, w, h, cor) { this.pg.ops.push(`${this.rgb(cor)} rg ${x.toFixed(2)} ${(H - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`); }
    linha(x1, y1, x2, y2, cor = '#cccccc', esp = .6) { this.pg.ops.push(`${this.rgb(cor)} RG ${esp} w ${x1.toFixed(2)} ${(H - y1).toFixed(2)} m ${x2.toFixed(2)} ${(H - y2).toFixed(2)} l S`); }
    imagem(img, x, y, w, h) { const n = this.imgs.push(img); this.pg.ops.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${(H - y - h).toFixed(2)} cm /Im${n} Do Q`); }
    link(x, y, w, h, url) { this.pg.links.push({r: [x, H - y - h, x + w, H - y], url}); }
    blob() {
      const objs = [];                                           // cada objeto: array de partes (string latin1 ou Uint8Array)
      const add = partes => { objs.push(partes); return objs.length; };
      add(['<< /Type /Catalog /Pages 2 0 R >>']); add(['']);     // 1 catálogo, 2 páginas (preenchido depois)
      const f1 = add(['<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>']);
      const f2 = add(['<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>']);
      const imIds = this.imgs.map(im => add([`<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.bytes.length} >>\nstream\n`, im.bytes, '\nendstream']));
      const xobj = imIds.length ? `/XObject << ${imIds.map((id, i) => `/Im${i + 1} ${id} 0 R`).join(' ')} >>` : '';
      const kids = [];
      for (const pg of this.pgs) {
        const conteudo = latin1(pg.ops.join('\n'));
        const cId = add([`<< /Length ${conteudo.length} >>\nstream\n`, conteudo, '\nendstream']);
        const an = pg.links.map(l => add([`<< /Type /Annot /Subtype /Link /Rect [${l.r.map(v => v.toFixed(2)).join(' ')}] /Border [0 0 0] /A << /S /URI /URI (${this.enc(l.url)}) >> >>`]));
        kids.push(add([`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> ${xobj} >> /Contents ${cId} 0 R${an.length ? ` /Annots [${an.map(a => a + ' 0 R').join(' ')}]` : ''} >>`]));
      }
      objs[1] = [`<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`];
      const saida = [latin1('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')], offs = [];
      let pos = saida[0].length;
      objs.forEach((partes, i) => {
        offs.push(pos);
        const bs = [latin1(`${i + 1} 0 obj\n`), ...partes.map(p => typeof p === 'string' ? latin1(p) : p), latin1('\nendobj\n')];
        bs.forEach(b => { saida.push(b); pos += b.length; });
      });
      const xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') +
        `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF`;
      saida.push(latin1(xref));
      return new Blob(saida, {type: 'application/pdf'});
    }
  }
  // carrega uma imagem e devolve um JPEG pequeno (para o PDF não ficar pesado)
  async function jpeg(url, maxLado = 360) {
    if (!url) return null;
    try {
      const r = await fetch(url, {mode: 'cors', cache: 'force-cache'});
      if (!r.ok) return null;
      const bmp = await createImageBitmap(await r.blob());
      const k = Math.min(1, maxLado / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
      const g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
      const px = g.getImageData(1, 1, 1, 1).data;      // cor do canto (fundo da imagem do topo)
      const fundo = '#' + [px[0], px[1], px[2]].map(v => v.toString(16).padStart(2, '0')).join('');
      const b64 = c.toDataURL('image/jpeg', .86).split(',')[1], bin = atob(b64);
      return {bytes: latin1(bin), w: c.width, h: c.height, fundo};
    } catch (e) { return null; }
  }
  // agrupa por categoria (principais primeiro, depois os adicionais)
  function grupos(ped) {
    const gs = [];
    const por = l => (l.adicional ? '1' : '0') + l.grupo;
    for (const l of [...ped.itens.filter(x => !x.adicional), ...ped.itens.filter(x => x.adicional)]) {
      let g = gs.find(x => x.chave === por(l));
      if (!g) {
        const pre = l.adicional && !norm(l.grupo).startsWith(norm(l.adicional)) ? l.adicional + ' — ' : '';
        g = {chave: por(l), nome: l.grupo, adicional: l.adicional, titulo: pre + l.grupo, itens: []}; gs.push(g);
      }
      g.itens.push(l);
    }
    return gs;
  }
  async function pdf(ped, {imagem = p => p, link = '', topo = ''} = {}) {
    const d = new MiniPDF(), M = 36, LW = W - 2 * M;
    const [banner, ...capas] = await Promise.all([jpeg(topo, 1400), ...ped.itens.map(l => jpeg(l.imagem ? imagem(l.imagem) : ''))]);
    const capaDe = new Map(ped.itens.map((l, i) => [l, capas[i]]));
    const azul = '#1f6feb', cinza = '#666666';
    let y;
    const dt = new Date(ped.data), txtNum = `Pedido nº ${ped.id}`, txtData = dt.toLocaleDateString('pt-BR') + ' ' + dt.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    const cabecalho = () => {
      // topo: imagem da loja (logo + nome) à esquerda; "PEDIDO FINALIZADO", nº e data à direita
      const altBarra = banner ? 96 : 64;
      d.ret(0, 0, W, altBarra, banner ? banner.fundo : '#0c111b');
      const etiqueta = 'PEDIDO FINALIZADO', ladoDir = Math.max(d.largura(etiqueta, 9, true) + 16, d.largura(txtNum, 12, true), d.largura(txtData, 9, false));
      if (banner) {
        const maxW = W - 2 * M - ladoDir - 16, h0 = altBarra - 16, s = Math.min(h0 / banner.h, maxW / banner.w);
        d.imagem(banner, M - 6, (altBarra - banner.h * s) / 2, banner.w * s, banner.h * s);
      } else d.texto(M, 34, ped.loja || 'Pedido', {tam: 20, neg: true, cor: '#ffffff'});
      const xd = W - M, yb = altBarra / 2 - 18;
      const we = d.largura(etiqueta, 9, true) + 16;
      d.ret(xd - we, yb, we, 16, '#22c55e');
      d.texto(xd - we + 8, yb + 11.5, etiqueta, {tam: 9, neg: true, cor: '#062611'});
      d.texto(xd - d.largura(txtNum, 12, true), yb + 32, txtNum, {tam: 12, neg: true, cor: '#ffffff'});
      d.texto(xd - d.largura(txtData, 9, false), yb + 46, txtData, {tam: 9, cor: '#9fb2d0'});
      y = altBarra + 24;
    };
    const espaco = h => { if (y + h > H - 50) { d.novaPagina(); cabecalho(); } };
    cabecalho();
    if (ped.cliente.nome) { d.texto(M, y, 'Cliente: ', {tam: 11, neg: true}); d.texto(M + d.largura('Cliente: ', 11, true), y, ped.cliente.nome, {tam: 11}); y += 16; }
    if (ped.cliente.obs) for (const ln of d.quebrar('Obs.: ' + ped.cliente.obs, 10, false, LW)) { d.texto(M, y, ln, {tam: 10, cor: '#333333'}); y += 13; }
    y += 6;
    // cada grupo: título e uma grade de capas (5 por linha)
    const COLS = 5, GAP = 10, CW = (LW - GAP * (COLS - 1)) / COLS, IH = CW * 1.3;
    for (const g of grupos(ped)) {
      espaco(40 + IH);
      d.texto(M, y + 10, g.titulo, {tam: 11, neg: true, cor: azul});
      d.linha(M, y + 15, W - M, y + 15, '#c8d3e6');
      y += 24;
      for (let i = 0; i < g.itens.length; i += COLS) {
        const fila = g.itens.slice(i, i + COLS);
        const textos = fila.map(l => ({
          nome: d.quebrar((l.qtd > 1 ? l.qtd + 'x ' : '') + l.nome + (l.versao ? ` (${l.versao})` : ''), 8.5, true, CW, 3),
          det: [l.tipo, l.unidade === 'GB' ? (l.gb ? num(l.gb) + ' GB' : '') : (temNum(l.valor) ? brl(l.valor * l.qtd) : 'sob consulta')].filter(Boolean).join(' · ')
        }));
        const alt = IH + 8 + Math.max(...textos.map(t => t.nome.length)) * 10.5 + 12;
        espaco(alt);
        fila.forEach((l, k) => {
          const x = M + k * (CW + GAP), cp = capaDe.get(l);
          d.ret(x, y, CW, IH, '#eef1f6');
          if (cp) { const s = Math.min(CW / cp.w, IH / cp.h), w = cp.w * s, h = cp.h * s; d.imagem(cp, x + (CW - w) / 2, y + (IH - h) / 2, w, h); }
          else d.texto(x + 6, y + IH / 2, 'sem foto', {tam: 8, cor: '#999999'});
          let yy = y + IH + 12;
          textos[k].nome.forEach(t => { d.texto(x, yy, t, {tam: 8.5, neg: true}); yy += 10.5; });
          d.texto(x, yy, textos[k].det, {tam: 8, cor: cinza});
        });
        y += alt + 6;
      }
      y += 6;
    }
    // totais
    const t = ped.totais, linhasT = [];
    linhasT.push(['Itens', String(t.qtd)]);
    if (t.reais || !t.gb) linhasT.push(['Total estimado', brl(t.reais) + (t.cons ? ' (+ itens sob consulta)' : '')]);
    if (t.gb) linhasT.push([t.limite ? 'Espaço usado' : 'Total em GB', t.limite ? `${num(t.gb)} de ${num(t.limite)} GB` : num(t.gb) + ' GB']);
    espaco(30 + linhasT.length * 18 + (link ? 16 : 0));
    d.ret(M, y, LW, 14 + linhasT.length * 18, '#f2f5fb');
    let yy = y + 20;
    for (const [k, v] of linhasT) { d.texto(M + 12, yy, k, {tam: 10, cor: '#444444'}); d.texto(W - M - 12 - d.largura(v, 11, true), yy, v, {tam: 11, neg: true}); yy += 18; }
    y += 14 + linhasT.length * 18 + 18;
    if (link) {
      const t1 = 'Ver este pedido online (com as capas): ', t2 = 'abrir o pedido nº ' + ped.id;
      d.texto(M, y, t1, {tam: 9, cor: cinza});
      d.texto(M + d.largura(t1, 9, false), y, t2, {tam: 9, neg: true, cor: azul});
      d.link(M, y - 10, d.largura(t1, 9, false) + d.largura(t2, 9, true), 14, link);
      y += 14;
    }
    // rodapé com número da página
    d.pgs.forEach((pg, i) => {
      d.pg = pg;
      const r = `${ped.loja || ''} · Pedido nº ${ped.id} · página ${i + 1} de ${d.pgs.length}`;
      d.texto(W / 2 - d.largura(r, 8, false) / 2, H - 22, r, {tam: 8, cor: '#999999'});
    });
    return d.blob();
  }

  // ---------- histórico (neste navegador ou num repositório PRIVADO do GitHub) ----------
  const CHAVE_LOCAL = 'catalogo-pedidos';
  const lerLocal = () => { try { return JSON.parse(localStorage.getItem(CHAVE_LOCAL)) || []; } catch (e) { return []; } };
  const gravarLocal = l => { try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(l)); return true; } catch (e) { return false; } };
  const paraB64 = txt => { const b = new TextEncoder().encode(txt); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
  const deB64 = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), c => c.charCodeAt(0)));
  const usaRepo = cfg => !!(cfg && cfg.token && cfg.owner && cfg.pedidosRepo);
  async function ghReq(cfg, metodo, corpo) {
    const url = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.pedidosRepo)}/contents/pedidos.json`;
    const r = await fetch(metodo === 'GET' ? url + '?t=' + Date.now() : url, {
      method: metodo, cache: 'no-store',
      headers: {Authorization: 'Bearer ' + cfg.token, Accept: 'application/vnd.github+json'},
      body: corpo ? JSON.stringify(corpo) : undefined
    });
    if (metodo === 'GET' && r.status === 404) {
      const rr = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.pedidosRepo)}`, {headers: {Authorization: 'Bearer ' + cfg.token}});
      if (!rr.ok) throw new Error(`Não encontrei o repositório privado "${cfg.pedidosRepo}" (ou o token não tem acesso a ele).`);
      return null;
    }
    if (!r.ok) throw new Error(r.status === 401 ? 'Token inválido ou expirado.' : r.status === 403 ? 'O token não tem permissão de escrita no repositório dos pedidos.' : r.status === 409 ? 'O histórico mudou em outro aparelho. Tente de novo.' : 'Erro do GitHub (' + r.status + ').');
    return r.json();
  }
  async function carregar(cfg) {
    if (!usaRepo(cfg)) return {lista: lerLocal(), onde: 'navegador'};
    const f = await ghReq(cfg, 'GET');
    return {lista: f ? JSON.parse(deB64(f.content)) : [], sha: f ? f.sha : null, onde: 'repositorio'};
  }
  async function salvarLista(cfg, lista, sha) {
    if (!usaRepo(cfg)) { gravarLocal(lista); return {onde: 'navegador'}; }
    const corpo = {message: 'Atualiza histórico de pedidos', content: paraB64(JSON.stringify(lista, null, 1) + '\n')};
    if (sha) corpo.sha = sha;
    const r = await ghReq(cfg, 'PUT', corpo);
    return {onde: 'repositorio', sha: r.content.sha};
  }
  async function adicionar(cfg, ped) {
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        const {lista, sha} = await carregar(cfg);
        if (lista.some(p => p.id === ped.id)) return {jaExistia: true, onde: usaRepo(cfg) ? 'repositorio' : 'navegador'};
        lista.unshift(ped);
        return await salvarLista(cfg, lista, sha);
      } catch (e) { if (tentativa || !/mudou/.test(e.message)) throw e; }
    }
  }
  return {codificar, decodificar, novoNumero, montar, texto, pdf, grupos, carregar, salvarLista, adicionar, usaRepo};
})();
