/* LIFE BEACH TENNIS — interações. Os dados ficam em js/dados.js */
(() => {
  'use strict';
  const D = window.LIFE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const real = v => 'R$ ' + v.toLocaleString('pt-BR');
  const zap = txt => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(txt)}`;
  const html = (el, s) => { if (el) el.innerHTML = s; };
  let lenis = null;

  /* ---------- Hora de Brasília ---------- */
  function agoraBSB() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short'
    }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { dia, hora: (+p.hour % 24) + (+p.minute) / 60, data: `${p.year}-${p.month}-${p.day}` };
  }
  const AGORA = agoraBSB();
  const hh = h => String(h).padStart(2, '0') + 'h';

  /* ---------- Status aberto/fechado ---------- */
  (function status() {
    const el = $('#status'); if (!el) return;
    const func = d => D.funcionamento.find(f => f.dias.includes(d));
    const hoje = func(AGORA.dia);
    let txt;
    if (hoje && AGORA.hora >= hoje.abre && AGORA.hora < hoje.fecha) { el.classList.add('aberta'); txt = `Aberta agora · até as ${hh(hoje.fecha)}`; }
    else if (hoje && AGORA.hora < hoje.abre) txt = `Abre hoje às ${hh(hoje.abre)}`;
    else { const am = func((AGORA.dia + 1) % 7); txt = am ? `Abre amanhã às ${hh(am.abre)}` : 'Park Way · Brasília'; }
    $('span', el).textContent = txt;
  })();

  /* ---------- Títulos em palavras ---------- */
  function emPalavras(el) {
    let i = 0;
    const embrulha = no => {
      [...no.childNodes].forEach(f => {
        if (f.nodeType === 3) {
          const frag = document.createDocumentFragment();
          f.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(' '); return; }
            const a = document.createElement('span'); a.className = 'pal';
            const b = document.createElement('span'); b.textContent = t; b.style.setProperty('--i', i++);
            a.append(b); frag.append(a);
          });
          f.replaceWith(frag);
        } else if (f.nodeType === 1) embrulha(f);
      });
    };
    embrulha(el);
  }
  $$('[data-palavras]').forEach(emPalavras);
  $$('[data-encher]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(p => `<span>${p}</span>`).join(' ');
  });

  /* ---------- Faixa ---------- */
  const faixaItens = ['Aulas', 'Day Use', 'Clubinho', 'Wellhub', 'TotalPass', 'Bar e cozinha', 'Eventos', 'Lojinha'];
  html($('#faixa'), Array(4).fill(faixaItens.map(t => `<span>${t}</span>`).join('')).join(''));

  /* ---------- Controle segmentado ---------- */
  function seg(el, opcoes, atual, aoMudar) {
    el.innerHTML = opcoes.map(o => `<button type="button" data-v="${o.v}" aria-pressed="${o.v === atual}">${o.t}</button>`).join('');
    const move = () => {
      const b = $('[aria-pressed="true"]', el); if (!b) return;
      el.style.setProperty('--x', b.offsetLeft + 'px'); el.style.setProperty('--w', b.offsetWidth + 'px');
      el.style.setProperty('--y', b.offsetTop + 'px'); el.style.setProperty('--h', b.offsetHeight + 'px');
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b));
      move(); aoMudar(b.dataset.v);
    });
    addEventListener('resize', move); (document.fonts ? document.fonts.ready : Promise.resolve()).then(move); move();
  }

  /* ---------- Planos ---------- */
  (function planos() {
    const P = D.planos, est = { day: 'com', ciclo: 'mensal', vezes: 0 };
    const elPreco = $('#calcPreco'); let mostrado = P.com.mensal[0], anim;
    function conta(ate) {
      cancelAnimationFrame(anim); const de = mostrado, t0 = performance.now();
      if (reduz) { mostrado = ate; elPreco.textContent = ate; return; }
      const passo = t => { const k = limita((t - t0) / 500), e = 1 - Math.pow(1 - k, 3);
        mostrado = Math.round(de + (ate - de) * e); elPreco.textContent = mostrado; if (k < 1) anim = requestAnimationFrame(passo); };
      anim = requestAnimationFrame(passo); setTimeout(() => { mostrado = ate; elPreco.textContent = ate; }, 700);
    }
    function pinta() {
      const tab = P[est.day], preco = tab[est.ciclo][est.vezes], ciclo = P.ciclos.find(c => c.id === est.ciclo);
      const vezes = est.vezes + 1, porAula = preco / (vezes * 4);
      $('#calcNome').textContent = `${ciclo.nome} · ${vezes}x por semana · ${est.day === 'com' ? 'com' : 'sem'} Day Use`;
      conta(preco);
      const ins = [`Cerca de <b>${real(Math.round(porAula))}</b> por aula, contando 4 semanas no mês.`];
      const dif = tab.mensal[est.vezes] - preco;
      if (dif > 0) ins.push(`<b>${real(dif)} a menos</b> por mês que no plano mensal.`);
      if (est.vezes === 0) ins.push(`Com 2x por semana, cada aula cai para cerca de <b>${real(Math.round(tab[est.ciclo][1] / 8))}</b>.`);
      if (est.day === 'com') ins.push('Day Use incluso: até 2 quadras de segunda a sexta e até 3 no fim de semana.');
      else ins.push(`Por <b>+${real(P.com[est.ciclo][est.vezes] - preco)}</b> por mês você inclui o Day Use.`);
      html($('#calcIns'), ins.map(i => `<li>${i}</li>`).join(''));
      $('#calcBtn').href = zap(`Olá! Tenho interesse no plano ${ciclo.nome.toLowerCase()}, ${vezes}x por semana, ${est.day === 'com' ? 'com' : 'sem'} Day Use (${real(preco)}). Como faço para começar?`);
    }
    seg($('#segDay'), [{ v: 'com', t: 'Com Day Use' }, { v: 'sem', t: 'Sem Day Use' }], est.day, v => { est.day = v; pinta(); });
    seg($('#segCiclo'), P.ciclos.map(c => ({ v: c.id, t: c.nome })), est.ciclo, v => { est.ciclo = v; pinta(); });
    seg($('#segVezes'), [{ v: 0, t: '1x por semana' }, { v: 1, t: '2x por semana' }], 0, v => { est.vezes = +v; pinta(); });
    html($('#calcNotas'), [...P.horariosAulas.map(h => `Aulas: ${h.toLowerCase()}`), `Até ${P.maxAlunos} alunos por aula`].map(t => `<li>${t}</li>`).join(''));
    html($('#clubinho'),
      `<li class="cab">Com Day Use</li>` + P.clubinho.com.map(c => `<li><span>${c.nome}</span><b>${real(c.preco)}</b></li>`).join('') +
      `<li class="cab">Sem Day Use</li>` + P.clubinho.sem.map(c => `<li><span>${c.nome}</span><b>${real(c.preco)}</b></li>`).join(''));
    html($('#juvenis'), P.juvenis.turmas.map(t =>
      `<li class="cab">${t.nome} · ${t.duracao}</li><li><span>1x por semana</span><b>${real(t.precos[0])}</b></li><li><span>2x por semana</span><b>${real(t.precos[1])}</b></li>`).join('') +
      `<li><span><small>${P.juvenis.regras.join(' · ')}</small></span></li>`);
    html($('#bomSaber'), [
      `Taxa de matrícula: ${real(P.matricula)}`,
      `Aula experimental: ${real(P.experimental)}, descontados da primeira mensalidade se você se matricular`,
      `Plano casal: ${P.descontoCasal}% de desconto`,
      `Plano família: ${P.descontoFamilia}% de desconto (cônjuge, filhos e pais), a partir de 3 membros`,
      `Day Use para quem não é aluno: ${real(P.dayUseNaoAluno)}`
    ].map(t => `<li>${t}</li>`).join(''));
    pinta();
  })();

  /* ---------- Day Use ---------- */
  (function dayUse() {
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], ordem = [1, 2, 3, 4, 5, 6, 0];
    const dias = $('#duDias'), slots = $('#duSlots');
    $('#duPreco').textContent = real(D.planos.dayUseNaoAluno);
    $('#duBtn').href = zap('Olá, gostaria de saber como funciona o Day Use');
    dias.innerHTML = ordem.map(d => `<button role="tab" data-d="${d}" class="${d === AGORA.dia ? 'hoje' : ''}" aria-selected="${d === AGORA.dia}">${nomes[d]}</button>`).join('');
    function pinta(d) {
      slots.innerHTML = D.dayUse[d].map((s, i) => {
        const agora = d === AGORA.dia && AGORA.hora >= s.de && AGORA.hora < s.ate;
        const bolas = Array.from({ length: D.totalQuadras }, (_, k) => `<i class="${k < s.quadras ? 'on' : ''}"></i>`).join('');
        return `<li style="--i:${i}" class="${agora ? 'agora' : ''}"><span class="per">${s.periodo}</span><span class="qt">${s.quadras} de ${D.totalQuadras} quadras liberadas</span><span class="bolas" aria-hidden="true">${bolas}</span></li>`;
      }).join('');
    }
    dias.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      $$('button', dias).forEach(x => x.setAttribute('aria-selected', x === b)); pinta(+b.dataset.d); });
    pinta(AGORA.dia);
  })();

  /* ---------- Convênios ---------- */
  (function convenios() {
    const cores = ['#E2B93B', '#F0D36A', '#C9CDD2', '#BFE9F5'];
    html($('#niveis'), D.convenios.planos.map((p, i) => {
      const n = p.checkins.match(/^(\d+).*?(\d+)/);
      return `<article class="nivel" data-rev style="--cor:${cores[i]};--atraso:${i * 80}ms"><h3>${p.nome}</h3><b>${n[1]}<small>check-ins por semana</small></b><p>ou ${n[2]} por mês</p><p>${p.regra}</p></article>`;
    }).join(''));
    const nav = $('#abasNav'), lista = $('#abasLista'), abas = D.convenios.abas;
    nav.innerHTML = abas.map((a, i) => `<button role="tab" data-i="${i}" aria-selected="${i === 0}">${a.nome}</button>`).join('');
    const pinta = i => lista.innerHTML = abas[i].itens.map((t, k) => `<li style="--i:${k}">${t}</li>`).join('');
    nav.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      $$('button', nav).forEach(x => x.setAttribute('aria-selected', x === b)); pinta(+b.dataset.i); });
    pinta(0);
  })();

  /* ---------- Professores ---------- */
  html($('#profTrilho'), D.professores.map((p, i) => `
    <article class="prof" data-rev style="--atraso:${i * 70}ms">
      <div class="prof-foto"><img src="img/prof/${p.id}.webp" alt="Professor ${p.nome} ${p.sobrenome}" loading="lazy" width="480" height="853">
        <div class="prof-ficha" data-lenis-prevent>${p.frase ? `<q>${p.frase}</q>` : ''}<ul>${p.itens.map(t => `<li>${t}</li>`).join('')}</ul></div></div>
      <div class="prof-pe"><h3>${p.nome}<small>${p.sobrenome}</small></h3><button aria-label="Ver formação de ${p.nome}" aria-expanded="false">+</button></div>
    </article>`).join(''));
  $('#profTrilho').addEventListener('click', e => {
    const b = e.target.closest('.prof-pe button'); if (!b) return;
    const c = b.closest('.prof'), ab = c.classList.toggle('aberto'); b.setAttribute('aria-expanded', ab);
  });

  /* ---------- Bar ---------- */
  html($('#pratos'), D.cardapio.map((c, i) => `
    <figure class="prato" data-rev style="--atraso:${i * 90}ms"><img src="${c.img}" alt="${c.nome} ${c.nota}" loading="lazy" width="480" height="853">
    <figcaption><b>${c.nome}</b><span>${c.nota}</span></figcaption></figure>`).join(''));

  /* ---------- Agenda e festa ---------- */
  (function eventos() {
    const sem = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
    const dias = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
    let achouProx = false;
    html($('#agenda'), D.agenda.map((e, i) => {
      const dt = new Date(e.data + 'T12:00:00'), falta = dias(AGORA.data, e.data);
      let cls = falta < 0 ? 'passou' : '', selo = '';
      if (falta >= 0 && !achouProx) { achouProx = true; cls = 'vem'; }
      if (falta === 0) selo = '<span class="conta">É hoje</span>';
      else if (falta > 0 && (e.destaque || cls === 'vem')) selo = `<span class="conta">${falta === 1 ? 'Amanhã' : 'Faltam ' + falta + ' dias'}</span>`;
      return `<li class="${cls}" data-rev style="--atraso:${i * 60}ms"><div class="dia"><small>${sem[dt.getDay()]}</small><b>${dt.getDate()}</b></div><div><h3>${e.titulo}</h3>${e.texto ? `<p>${e.texto}</p>` : ''}${selo}</div></li>`;
    }).join(''));
    const F = D.festa;
    html($('#festaNome'), `${F.nome}<small>${F.resumo}</small>`);
    html($('#festaInc'), F.incluso.map(t => `<li>${t}</li>`).join(''));
    $('#festaCard').textContent = 'No buffet: ' + F.cardapio.join(', ').toLowerCase() + '.';
    $('#festaPreco').textContent = real(F.preco); $('#festaPag').textContent = F.pagamento; $('#festaAviso').textContent = F.aviso;
    $('#festaBtn').href = zap(`Olá! Quero comemorar meu aniversário na Life. Pode me passar as datas disponíveis para o ${F.nome}?`);
  })();

  /* ---------- Lojinha (coleção: palco + lista + variações) ---------- */
  (function loja() {
    const L = D.loja, raizL = $('#loja'), palco = $('#lojaPalco'), img = $('#lojaImg'), lista = $('#lojaLista');
    const n2 = i => String(i + 1).padStart(2, '0');
    const TEMPO = 6500;
    let atual = 0, vari = 0, auto = !reduz, visivel = false, timer, parado = false;
    $('#lojaTotal').textContent = n2(L.length - 1);
    L.forEach(p => p.var.forEach(v => { const i = new Image(); i.src = v.img; }));   // pré-carrega

    lista.innerHTML = L.map((p, i) => `
      <li><button type="button" data-i="${i}" aria-current="false">
        <span class="ll-thumb"><img src="${p.var[0].img}" alt="" loading="lazy"></span>
        <span class="ll-num">${n2(i)}</span><span class="ll-nome">${p.nome}<small>${p.tipo}</small></span>
        <span class="ll-preco">${real(p.preco)}</span><i class="ll-barra" aria-hidden="true"></i>
      </button></li>`).join('');

    const anima = (el, k, op) => (reduz || !el.animate) ? null : el.animate(k, op);

    function pintaVar(trocaImg) {
      const p = L[atual], v = p.var[vari], comCor = p.var.some(x => x.cor);
      $('#lojaVarRot').textContent = comCor ? 'Cor' : 'Modelo';
      $('#lojaVarNome').textContent = v.nome;
      $('#lojaVar').className = comCor ? 'cores' : 'modelos';
      $('#lojaVar').innerHTML = p.var.map((x, k) => comCor
        ? `<button type="button" data-v="${k}" aria-pressed="${k === vari}" aria-label="${x.nome}" style="--c:${x.cor}"></button>`
        : `<button type="button" data-v="${k}" aria-pressed="${k === vari}">${x.nome}</button>`).join('');
      $('#lojaBtn').href = zap(`Olá! Vi a lojinha no site e quero: ${p.nome}${p.var.length > 1 ? ' (' + v.nome.toLowerCase() + ')' : ''}, ${real(p.preco)}. Quais tamanhos vocês têm?`);
      if (trocaImg) {
        const sai = anima(img, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 180, easing: 'ease-in' });
        const poe = () => { img.src = v.img; img.alt = `${p.nome}, ${v.nome}`;
          anima(img, [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }); };
        sai ? sai.onfinish = poe : poe();
      }
    }

    function mostra(i, dir = 1, primeira = false) {
      atual = (i + L.length) % L.length; vari = 0;
      const p = L[atual], v = p.var[0];
      $$('button', lista).forEach((b, k) => b.setAttribute('aria-current', k === atual));
      if (lista.scrollWidth > lista.clientWidth + 4) {           // celular: a faixa de miniaturas acompanha
        const li = lista.children[atual];
        lista.scrollTo({ left: li.offsetLeft - (lista.clientWidth - li.offsetWidth) / 2, behavior: reduz ? 'auto' : 'smooth' });
      }
      $('#lojaPos').textContent = `${n2(atual)} / ${n2(L.length - 1)}`;
      const txt = () => {
        $('#lojaNome').textContent = p.nome; $('#lojaDet').textContent = p.det;
        $('#lojaTipo').textContent = p.tipo; $('#lojaNum').textContent = n2(atual);
        $('#lojaPreco').textContent = p.preco;
        pintaVar(false);
      };
      if (primeira) { txt(); img.src = v.img; img.alt = `${p.nome}, ${v.nome}`; return reinicia(); }
      const x = 70 * dir;
      const sai = anima(img, [{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: `translateX(${-x}px) rotate(${-4 * dir}deg)`, filter: 'blur(6px)' }], { duration: 260, easing: 'ease-in' });
      anima($('#lojaTxt'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 200, easing: 'ease-in' });
      anima($('#lojaNum'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-30}px)` }], { duration: 220, easing: 'ease-in' });
      const entra = () => {
        txt(); img.src = v.img; img.alt = `${p.nome}, ${v.nome}`;
        const ez = 'cubic-bezier(.2,.8,.2,1)';
        anima(img, [{ opacity: 0, transform: `translateX(${x}px) rotate(${4 * dir}deg)`, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 650, easing: ez });
        anima($('#lojaTxt'), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 550, easing: ez, delay: 60 });
        anima($('#lojaNum'), [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: ez });
      };
      sai ? sai.onfinish = entra : entra();
      reinicia();
    }

    // Troca sozinha enquanto a seção está na tela, até a pessoa mexer
    function reinicia() {
      clearTimeout(timer); raizL.classList.remove('rodando');
      if (!auto || !visivel || parado) return;
      void raizL.offsetWidth; raizL.style.setProperty('--tempo', TEMPO + 'ms'); raizL.classList.add('rodando');
      timer = setTimeout(() => mostra(atual + 1, 1), TEMPO);
    }
    const mexeu = () => { auto = false; reinicia(); };
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; reinicia(); }, { threshold: .45 }).observe(raizL);
    raizL.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { parado = true; reinicia(); } });
    raizL.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { parado = false; reinicia(); } });

    lista.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; mexeu(); const i = +b.dataset.i; if (i !== atual) mostra(i, i > atual ? 1 : -1); });
    $$('[data-loja]', palco).forEach(b => b.addEventListener('click', () => { mexeu(); mostra(atual + +b.dataset.loja, +b.dataset.loja); }));
    $('#lojaVar').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; mexeu(); const k = +b.dataset.v; if (k !== vari) { vari = k; pintaVar(true); } });
    addEventListener('keydown', e => {
      if (!visivel || !['ArrowLeft', 'ArrowRight'].includes(e.key) || e.target.closest('input,textarea') || !$('#folha').hidden) return;
      mexeu(); mostra(atual + (e.key === 'ArrowRight' ? 1 : -1), e.key === 'ArrowRight' ? 1 : -1);
    });

    // Arrastar o palco (toque ou mouse) troca de peça
    let x0 = null;
    palco.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; x0 = e.clientX; });
    addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) { mexeu(); mostra(atual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); } });

    // Profundidade com o mouse
    if (fino && !reduz) {
      const fig = $('.loja-fig', palco), luz = $('.loja-luz', palco);
      palco.addEventListener('pointermove', e => { const r = palco.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
        fig.style.translate = `${(nx * 22).toFixed(1)}px ${(ny * 14).toFixed(1)}px`; fig.style.rotate = `${(nx * 2.5).toFixed(2)}deg`;
        luz.style.translate = `${(-nx * 40).toFixed(1)}px ${(-ny * 30).toFixed(1)}px`; });
      palco.addEventListener('pointerleave', () => { fig.style.translate = fig.style.rotate = luz.style.translate = ''; });
    }
    mostra(0, 1, true);
  })();

  /* ---------- Parceiros, local, perguntas, perfil ---------- */
  html($('#parceiros'), Array(2).fill(D.parceiros.map(p => `<div><b>${p[0]}</b><small>${p[1]}</small></div>`).join('')).join(''));
  $('#endereco').textContent = D.endereco + '. Toque para abrir a rota no seu aplicativo.';
  html($('#horas'), D.funcionamento.map(f => `<li class="${f.dias.includes(AGORA.dia) ? 'hoje' : ''}"><span>${f.rotulo}</span><b>${f.texto}</b></li>`).join(''));
  $('#wazeBtn').href = D.waze;
  $('#mapsBtn').href = `https://www.google.com/maps/search/?api=1&query=${D.lat},${D.lon}`;
  html($('#faq'), D.perguntas.map(p => `<details data-rev><summary>${p[0]}</summary><p>${p[1]}</p></details>`).join(''));
  html($('#perfilNum'), [['posts', D.perfil.posts], ['seguidores', D.perfil.seguidores], ['seguindo', D.perfil.seguindo]]
    .map(n => `<li><b>${n[1].toLocaleString('pt-BR')}</b><span>${n[0]}</span></li>`).join(''));
  $('#igBtn').href = `https://www.instagram.com/${D.instagram}/`;
  $('#zapBtn').href = $('#barraZap').href = zap('Olá! Vim pelo site da Life e quero saber mais.');

  /* ---------- Revelações ---------- */
  function ligarRevelacoes() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('[data-rev], [data-palavras]').forEach(el => io.observe(el));
    const ioN = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; ioN.unobserve(e.target);
      const el = e.target, ate = +el.dataset.contar, t0 = performance.now(), fmt = v => el.hasAttribute('data-milhar') ? v.toLocaleString('pt-BR') : v;
      if (reduz) return;
      const passo = t => { const k = limita((t - t0) / 1400), ez = 1 - Math.pow(1 - k, 4); el.textContent = fmt(Math.round(ate * ez)); if (k < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo); setTimeout(() => { el.textContent = fmt(ate); }, 1700);
    }), { threshold: .6 });
    $$('[data-contar]').forEach(el => ioN.observe(el));
    const mapa = $('#mapa');
    new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect();
      const f = document.createElement('iframe'); f.title = 'Mapa: Life Beach Tennis'; f.loading = 'lazy';
      f.src = `https://www.google.com/maps?q=${D.lat},${D.lon}&z=15&output=embed`; mapa.append(f);
    }, { rootMargin: '400px' }).observe(mapa);
  }

  /* ---------- Rolagem: um laço só ---------- */
  const raiz = document.documentElement, topo = $('#topo'), barra = $('#barra'), prog = $('#progresso');
  const palco = $('#day-use'), quadro = $('#quadro'), encher = $$('[data-encher]'), gigante = $('#gigante'), faixa = $('#faixa'), pratos = $$('.prato'), fotos = $$('.foto'), comFaixa = $('#comFaixa');
  let M = {}, yAnt = 0, vel = 0, fx = 0, zoomP = 0;
  const topoDoc = el => el.getBoundingClientRect().top + scrollY;
  function medir() {
    const vh = innerHeight;
    M = { vh, total: raiz.scrollHeight - vh, fixo: innerWidth > 960 && vh >= 680,
      palco: topoDoc(palco), encher: encher.map(e => ({ el: e, top: topoDoc(e), h: e.offsetHeight, pal: $$('span', e) })),
      gig: topoDoc(gigante), faixaL: faixa.scrollWidth / 4,
      com: { top: topoDoc(comFaixa), h: comFaixa.offsetHeight, sobra: Math.max(0, comFaixa.scrollWidth - innerWidth) },
      pratos: innerWidth > 900 ? pratos.map(p => ({ img: $('img', p), top: topoDoc(p), h: p.offsetHeight, k: .1 })).concat(fotos.map(p => ({ img: $('img', p), top: topoDoc(p), h: p.offsetHeight, k: .14 }))) : [] };
    palco.classList.toggle('zoom', !reduz);
  }
  function quadroFrame(y) {
    const vh = M.vh, ini = M.palco - vh * .95, fim = M.fixo ? M.palco : M.palco - vh * .3;
    const alvo = limita((y - ini) / (fim - ini));
    zoomP += (alvo - zoomP) * (lenis ? 1 : .18);
    if (Math.abs(alvo - zoomP) < .001) zoomP = alvo;
    const e = zoomP, de = M.fixo ? .62 : .9;
    quadro.style.setProperty('--zs', (de + (1 - de) * e).toFixed(4));
    quadro.style.setProperty('--zr', ((1 - e) * (M.fixo ? 4 : 1.5)).toFixed(3) + 'deg');
  }
  function frame() {
    const y = scrollY, vh = M.vh;
    vel += ((y - yAnt) - vel) * .2; const desce = y > yAnt; yAnt = y;
    prog.style.transform = `scaleX(${limita(y / (M.total || 1))})`;
    topo.classList.toggle('rolou', y > 30);
    topo.classList.toggle('some', desce && y > 700 && Math.abs(vel) > 1.5 ? true : (!desce && Math.abs(vel) > .5 ? false : topo.classList.contains('some')));
    barra.classList.toggle('on', y > vh * .6);
    if (y < vh * 1.2) raiz.style.setProperty('--sol', (1 + y / vh * .35).toFixed(3));
    if (!reduz) quadroFrame(y);
    M.encher.forEach(o => { const p = limita((y + vh * .82 - o.top) / (o.h + vh * .3)), n = Math.round(p * o.pal.length);
      if (o.n !== n) { o.n = n; o.pal.forEach((s, i) => s.classList.toggle('on', i < n)); } });
    const g = limita((y + vh * .9 - M.gig) / (vh * .55));
    gigante.style.setProperty('--f', limita(g * 1.7).toFixed(3)); gigante.style.setProperty('--f2', limita(g * 1.7 - .7).toFixed(3));
    if (!reduz && M.com.sobra) {                                   // faixa da comunidade anda para o lado enquanto passa pela tela
      const p = limita((y + vh * .6 - M.com.top) / (vh * .6 + M.com.h));   // anda enquanto a faixa atravessa a tela
      comFaixa.style.setProperty('--cx', (-p * M.com.sobra).toFixed(1) + 'px');
    }
    M.pratos.forEach(o => { const p = limita((y + vh - o.top) / (vh + o.h)); o.img.style.setProperty('--par', (-p * o.h * o.k).toFixed(1) + 'px'); });
    if (!reduz && M.faixaL) { fx -= 0.7 + Math.min(14, Math.abs(vel) * .5); if (fx <= -M.faixaL) fx += M.faixaL; faixa.style.transform = `translate3d(${fx.toFixed(1)}px,0,0)`; }
    requestAnimationFrame(frame);
  }

  /* ---------- Trilhos: arrastar e setas ---------- */
  $$('[data-arrastar]').forEach(t => {
    let ini = null, moveu = false;
    t.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('a,button')) return; ini = { x: e.clientX, s: t.scrollLeft }; moveu = false; });
    addEventListener('pointermove', e => { if (!ini) return; const dx = e.clientX - ini.x;
      if (!moveu && Math.abs(dx) > 6) { moveu = true; t.classList.add('arrastando'); }
      if (moveu) t.scrollLeft = ini.s - dx; });
    addEventListener('pointerup', () => { if (!ini) return; ini = null; if (moveu) { t.classList.remove('arrastando'); } });
  });
  $$('[data-seta]').forEach(b => b.addEventListener('click', () => {
    const t = $('#' + b.dataset.alvo), it = t.firstElementChild; if (!it) return;
    t.scrollBy({ left: +b.dataset.seta * (it.offsetWidth + (t.id === 'profTrilho' ? 18 : 0)), behavior: reduz ? 'auto' : 'smooth' });
  }));

  /* ---------- Mouse: ímã, profundidade, vidro ---------- */
  if (fino && !reduz) {
    $$('[data-ima]').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    const arte = $('#heroArte'), camadas = $$('[data-prof]', arte);
    $('.hero').addEventListener('pointermove', e => { const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      camadas.forEach(c => { const k = +c.dataset.prof * 18; c.style.translate = `${(-nx * k).toFixed(1)}px ${(-ny * k).toFixed(1)}px`; }); }, { passive: true });
    camadas.forEach(c => c.style.transition = 'translate .6s cubic-bezier(.2,.8,.2,1)');
    const perfil = $('#perfil');
    perfil.addEventListener('pointermove', e => { const r = perfil.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      perfil.style.transform = `perspective(900px) rotateX(${(-ny * 9).toFixed(2)}deg) rotateY(${(nx * 9).toFixed(2)}deg)`; });
    perfil.addEventListener('pointerleave', () => perfil.style.transform = '');
  }

  /* ---------- Travar a página (folha, stories, menu) ---------- */
  const travar = on => { document.body.classList.toggle('travado', on); if (lenis) on ? lenis.stop() : lenis.start(); };

  /* ---------- Menu e âncoras ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const abreMenu = on => { menu.hidden = !on; menuBtn.setAttribute('aria-expanded', on); travar(on); if (on) topo.classList.remove('some'); };
  menuBtn.addEventListener('click', () => abreMenu(menu.hidden));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const alvo = $(a.getAttribute('href')); if (!alvo) return;
    e.preventDefault(); if (!menu.hidden) abreMenu(false);
    if (lenis) lenis.scrollTo(alvo, { offset: alvo.id === 'day-use' ? 0 : -20, duration: 1.4 });
    else alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' });
  });

  /* ---------- Folha: aula experimental ---------- */
  (function folha() {
    const f = $('#folha'), veu = $('#veu'), nome = $('#fNome'), previa = $('#fPrevia'), est = { nivel: '', periodo: '' };
    const chips = (el, ops, chave) => {
      el.innerHTML = ops.map(o => `<button type="button" aria-pressed="false">${o}</button>`).join('');
      el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
        $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); est[chave] = b.textContent; monta(); });
    };
    const msg = () => {
      const n = nome.value.trim();
      return `Olá!${n ? ' Sou ' + n + '.' : ''} Gostaria de agendar uma aula experimental na Life.` +
        (est.nivel ? ` Nível: ${est.nivel.toLowerCase()}.` : '') + (est.periodo ? ` Horário: ${est.periodo.toLowerCase()}.` : '');
    };
    const monta = () => previa.textContent = msg();
    chips($('#fNivel'), ['Nunca joguei', 'Já joguei algumas vezes', 'Jogo com frequência'], 'nivel');
    chips($('#fPeriodo'), ['Manhã (7h às 10h)', 'Noite (17h às 21h)', 'Tanto faz'], 'periodo');
    nome.addEventListener('input', monta); monta();
    let quem = null;
    const abre = on => { f.hidden = veu.hidden = !on; travar(on); if (on) { quem = document.activeElement; setTimeout(() => fino && nome.focus(), 400); } else if (quem) quem.focus(); };
    $$('[data-abrir-folha]').forEach(b => b.addEventListener('click', () => abre(true)));
    $('[data-fechar]', f).addEventListener('click', () => abre(false)); veu.addEventListener('click', () => abre(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !f.hidden) abre(false); });
    $('#folhaForm').addEventListener('submit', e => { e.preventDefault(); window.open(zap(msg()), '_blank', 'noopener'); });
  })();

  /* ---------- Stories ---------- */
  (function stories() {
    const cx = $('#stories'), img = $('#storiesImg'), barras = $('#storiesBarras'), nome = $('#storiesNome'), S = D.stories; let i = 0, t;
    barras.innerHTML = S.map(() => '<i></i>').join('');
    const mostra = n => {
      if (n >= S.length) return fecha(); i = Math.max(0, n);
      img.src = S[i].img; img.alt = 'Destaque: ' + S[i].nome; nome.textContent = S[i].nome;
      [...barras.children].forEach((b, k) => { b.className = k < i ? 'feito' : ''; if (k === i) { void b.offsetWidth; b.className = 'indo'; } });
      clearTimeout(t); t = setTimeout(() => mostra(i + 1), 5000);
    };
    const fecha = () => { clearTimeout(t); cx.hidden = true; travar(false); };
    $('#abrirStories').addEventListener('click', () => { cx.hidden = false; travar(true); mostra(0); });
    $('.st-prox', cx).addEventListener('click', () => mostra(i + 1)); $('.st-ant', cx).addEventListener('click', () => mostra(i - 1));
    $('[data-fechar-stories]', cx).addEventListener('click', fecha);
    cx.addEventListener('click', e => { if (e.target === cx) fecha(); });
    addEventListener('keydown', e => { if (cx.hidden) return; if (e.key === 'Escape') fecha(); if (e.key === 'ArrowRight') mostra(i + 1); if (e.key === 'ArrowLeft') mostra(i - 1); });
  })();

  /* ---------- Rolagem suave (Lenis), só se a tela render bem ---------- */
  function ligarLenis() {
    if (!window.Lenis || reduz || !fino) return;
    let n = 0, t0 = performance.now();
    (function mede(t) { if (++n < 12) return requestAnimationFrame(mede);
      if ((t - t0) / 12 > 40) return;                       // tela lenta ou painel estrangulado: fica a rolagem nativa
      lenis = new window.Lenis({ lerp: .1, wheelMultiplier: 1 });
      (function roda(tt) { lenis.raf(tt); requestAnimationFrame(roda); })(performance.now());
    })(t0);
  }

  /* ---------- Início ---------- */
  function comeca() {
    medir(); requestAnimationFrame(frame); ligarLenis();
    addEventListener('resize', medir);
    if (document.fonts) document.fonts.ready.then(medir);
    addEventListener('load', medir); setTimeout(medir, 1500);
    const ab = $('#abertura'), sai = () => { ab.classList.add('fora'); setTimeout(ligarRevelacoes, 350); setTimeout(() => ab.remove(), 1500); };
    setTimeout(sai, reduz ? 0 : 1250);
  }
  comeca();
})();
