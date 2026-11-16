// Sakan demo features (loaded after app.js). Everything is sample data saved in this browser.
window.EXTRA_PAGES = window.EXTRA_PAGES || {};

/* ================= Marketplace: map ================= */
const AREA_LL = {
  'الخوير': [23.588, 58.43], 'القرم': [23.615, 58.48], 'بوشر': [23.563, 58.405], 'الموج': [23.617, 58.276], 'المعبيلة': [23.625, 58.13],
  'العذيبة': [23.598, 58.365], 'الغبرة': [23.594, 58.395], 'الخوض': [23.565, 58.19], 'السيب': [23.672, 58.185], 'مطرح': [23.618, 58.565],
  'روي': [23.597, 58.545], 'مدينة السلطان قابوس': [23.602, 58.452], 'الحيل': [23.635, 58.225], 'العامرات': [23.52, 58.5], 'الأنصب': [23.565, 58.36]
};
function llOf(l) {
  const c = AREA_LL[l.area] || [23.59, 58.4];
  let h = 0; for (const ch of String(l.id)) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return [c[0] + (((h % 97) / 97) - 0.5) * 0.014, c[1] + ((((h >> 7) % 89) / 89) - 0.5) * 0.018];
}
let LF = null, mapObj = null, mapLayer = null;
function loadLeaflet() {
  if (LF) return LF;
  LF = new Promise((res, rej) => {
    const c = document.createElement('link'); c.rel = 'stylesheet'; c.href = 'vendor/leaflet/leaflet.css'; document.head.appendChild(c);
    const s = document.createElement('script'); s.src = 'vendor/leaflet/leaflet.js'; s.onload = () => res(window.L); s.onerror = () => { LF = null; rej(); }; document.head.appendChild(s);
  });
  return LF;
}
/* Background: CARTO tiles, then OpenStreetMap tiles, then a built-in drawing of Muscat that needs no internet */
const COAST = [[24.05, 57.40], [23.90, 57.70], [23.80, 57.90], [23.74, 58.00], [23.70, 58.10], [23.68, 58.17], [23.655, 58.24], [23.636, 58.28], [23.622, 58.33], [23.613, 58.37], [23.612, 58.42], [23.618, 58.455], [23.624, 58.48], [23.636, 58.50], [23.632, 58.53], [23.626, 58.56], [23.62, 58.59], [23.60, 58.612], [23.57, 58.63], [23.52, 58.70], [23.46, 58.78], [23.30, 58.90], [23.10, 59.10]];
const ROADS = [
  [[23.70, 58.02], [23.66, 58.15], [23.625, 58.26], [23.60, 58.33], [23.592, 58.40], [23.597, 58.46], [23.594, 58.52], [23.60, 58.56]],
  [[23.63, 58.05], [23.59, 58.18], [23.565, 58.30], [23.553, 58.40], [23.56, 58.48], [23.57, 58.55]],
  [[23.592, 58.40], [23.55, 58.41], [23.50, 58.43]], [[23.597, 58.46], [23.56, 58.48], [23.52, 58.50]]
];
function offlineBase(L, map, box) {
  box.classList.add('offline');
  const dark = document.documentElement.dataset.mode === 'dark';
  const sea = [...COAST, [22.90, 59.60], [25.00, 59.60], [25.00, 57.00], [24.20, 57.00]];
  const g = L.layerGroup().addTo(map);
  L.polygon(sea, { stroke: false, fillColor: dark ? '#0F2A30' : '#BFDDE6', fillOpacity: 1, interactive: false }).addTo(g);
  L.polyline(COAST, { color: dark ? '#2E5A5E' : '#8FC1CF', weight: 2, interactive: false }).addTo(g);
  ROADS.forEach((r, i) => L.polyline(r, { color: dark ? 'rgba(255,240,215,.16)' : '#FFFFFF', weight: i < 2 ? 4 : 2.5, interactive: false }).addTo(g));
  Object.entries(AREA_LL).forEach(([n, c]) => L.marker(c, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'arealbl', html: `<span>${esc(n)}</span>`, iconSize: null }) }).addTo(g));
  L.marker([23.78, 58.35], { interactive: false, keyboard: false, icon: L.divIcon({ className: 'arealbl sea', html: '<span>خليج عُمان</span>', iconSize: null }) }).addTo(g);
  map.attributionControl.addAttribution('خريطة مبسطة من سكن');
}
function addBase(L, map, box) {
  const dark = document.documentElement.dataset.mode === 'dark';
  const sources = [
    [`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' }, ''],
    ['https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }, dark ? 'osmdark' : '']
  ];
  let i = 0;
  const next = () => {
    if (!document.body.contains(box)) return;
    if (i >= sources.length) { offlineBase(L, map, box); return; }
    const [url, opts, cls] = sources[i++];
    let ok = false, done = false, errs = 0;
    const layer = L.tileLayer(url, opts).addTo(map);
    if (cls) box.classList.add(cls);
    const fail = () => { if (ok || done) return; done = true; map.removeLayer(layer); if (cls) box.classList.remove(cls); next(); };
    layer.on('tileload', () => { ok = true; });
    layer.on('tileerror', () => { if (++errs >= 3) fail(); });
    setTimeout(fail, 6000);
  };
  next();
}
function drawMap(list) {
  const box = $('#mmap'); if (!box) return;
  loadLeaflet().then((L) => {
    if (!document.body.contains(box)) return;
    if (!mapObj || mapObj.getContainer() !== box) {
      if (mapObj) mapObj.remove();
      mapObj = L.map(box, { scrollWheelZoom: false }).setView([23.6, 58.35], 11);
      addBase(L, mapObj, box);
      mapLayer = L.layerGroup().addTo(mapObj);
    }
    mapLayer.clearLayers();
    const pts = [];
    list.forEach((l) => {
      const ll = llOf(l); pts.push(ll);
      const m = L.marker(ll, { title: `${l.title} · ${fmt(l.rent)} ر.ع.`, icon: L.divIcon({ className: 'pinm' + (l.featured ? ' feat' : '') + (mkt.saved.includes(l.id) ? ' fav' : ''), html: `<span>${fmt(l.rent)}</span>`, iconSize: null }) });
      m.on('click', () => openListing(l.id)); m.addTo(mapLayer);
    });
    if (pts.length) mapObj.fitBounds(pts, { padding: [50, 50], maxZoom: 13 });
    setTimeout(() => mapObj && mapObj.invalidateSize(), 60);
  }).catch(() => { box.innerHTML = '<p class="mut" style="padding:20px">تعذر تحميل الخريطة. تأكد من الاتصال بالإنترنت.</p>'; });
}
function afterRender(page) {
  if ($('#mmap')) drawMap(mResults(page.startsWith('t-'))[2]);
  if (typeof afterRender2 === 'function') afterRender2(page);
}

/* ================= Marketplace: featured, verification, accept as tenant ================= */
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
function featureForm(l) {
  const plans = [[7, 'أسبوع', 5], [14, 'أسبوعان', 9], [30, 'شهر', 15]];
  sheetSave = (v) => { l.featured = true; l.featUntil = addDays(Number(v.plan)); persistM(); toast('أصبح إعلانك مميزًا حتى ' + l.featUntil + ' · تجريبي، لم يُخصم أي مبلغ'); };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>★ ميّز إعلانك</h2><span class="mut" style="font-size:13px">${esc(l.title)}</span>
    <ul class="ticks"><li>يظهر أولًا في نتائج البحث وعلى الخريطة</li><li>شارة «مميز» على الصورة</li><li>عادة ضعف المشاهدات وطلبات المعاينة</li></ul>
    <fieldset class="prio"><legend>المدة</legend><div class="pcards">${plans.map(([d, n, p], i) => `<label><input type="radio" name="plan" value="${d}" ${i === 1 ? 'checked' : ''}><span class="pc"><b>${n}</b><b class="num" style="font-size:20px">${p} ر.ع.</b><small>حتى ${addDays(d)}</small></span></label>`).join('')}</div></fieldset>
    <p class="mut" style="margin:0;font-size:12px">نسخة تجريبية: لن يتم خصم أي مبلغ. في النسخة الحقيقية يُدفع بالبطاقة.</p>
    <div class="acts"><button class="btn" type="submit">تمييز الإعلان</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function verifyForm(l) {
  sheetSave = () => { l.verifyPending = true; persistM(); toast('تم إرسال طلب التوثيق. سيتواصل معك فريق سكن.'); };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>توثيق الإعلان</h2><span class="mut" style="font-size:13px">${esc(l.title)}</span>
    <p style="margin:0">الإعلانات الموثّقة تحصل على شارة ${vBadge({ verified: true })} وتظهر أعلى في البحث، لأن الباحث يثق أن الوحدة حقيقية والصور مطابقة.</p>
    <ol class="steps2"><li><b>أرفق إثبات الملكية</b><span>سند الملكية أو عقد إدارة العقار.</span></li><li><b>زيارة فريق سكن</b><span>خلال 48 ساعة لمطابقة الصور والمواصفات.</span></li><li><b>تحصل على الشارة</b><span>وتبقى ما دام الإعلان منشورًا.</span></li></ol>
    <label class="drop" for="f-photo"><span class="ph" aria-hidden="true">${LI(I_RCPT)}</span><span id="photoTxt">أرفق سند الملكية (اختياري في التجربة)</span><input id="f-photo" name="photo" type="file" accept="image/*,.pdf"></label>
    <div class="acts"><button class="btn" type="submit">إرسال طلب التوثيق</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function acceptInquiry(l, x) {
  const u = l.unitId && unitOf(l.unitId);
  const unitId = u && !u.tenantId ? u.id : null;
  if (!unitId && !vacantOptions().length) { toast('لا توجد وحدة شاغرة لربط المستأجر بها.'); return; }
  addTenant(unitId, { title: 'قبول ' + x.name + ' كمستأجر', name: x.name, phone: x.phone, rent: l.rent, onDone: (t) => { x.status = 'accepted'; x.seen = true; l.status = 'rented'; t.fromListing = l.id; toast(`أصبح ${t.name} مستأجرًا · أُنشئ عقده للتوقيع`); } });
}

/* ================= Click handlers for the new marketplace buttons ================= */
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.mkView) { mf.view = d.mkView; render(); }
  else if ('ssSave' in d) {
    const f = {}; FKEYS.forEach((k) => { f[k] = mf[k]; });
    mkt.searches = mkt.searches || [];
    mkt.searches.unshift({ id: uid('s'), label: searchLabel(f), f, seen: searchHits({ f }).map((l) => l.id) });
    persistM(); toast('تم حفظ البحث. سنبلغك عند نزول إعلان جديد يطابقه.'); render();
  }
  else if (d.ssRun) { const s = mkt.searches.find((x) => x.id === d.ssRun); if (!s) return; FKEYS.forEach((k) => { mf[k] = s.f[k] || ''; }); s.seen = searchHits(s).map((l) => l.id); persistM(); mf.tab = 'browse'; render(); }
  else if (d.ssDel) { mkt.searches = mkt.searches.filter((x) => x.id !== d.ssDel); persistM(); render(); }
  else if (d.vwOk) {
    const [lid, qid] = d.vwOk.split('|'); const l = lOf(lid); const x = l && l.inquiries.find((q) => q.id === qid); if (!x) return;
    x.status = 'confirmed'; x.seen = true; persistM();
    if (typeof notify === 'function' && x.by) notify(x.by, `تم تأكيد موعد معاينتك: ${l.title} · ${x.slot.day} ${x.slot.time}`, '#t-market');
    toast('تم تأكيد الموعد وإبلاغ ' + x.name); render();
  }
  else if (d.mkFeat) { closeSheet(); featureForm(lOf(d.mkFeat)); }
  else if (d.mkVerify) { closeSheet(); verifyForm(lOf(d.mkVerify)); }
  else if (d.mkApprove) { const l = lOf(d.mkApprove); l.verified = true; l.verifyPending = false; persistM(); toast('أصبح الإعلان موثّقًا'); render(); }
  else if (d.mkAccept) { const [lid, qid] = d.mkAccept.split('|'); const l = lOf(lid); const x = l && l.inquiries.find((q) => q.id === qid); if (x) acceptInquiry(l, x); }
});


/* ================= Owner data: contracts, expenses, technicians, history ================= */
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d, 12); };
const arDate = (s) => { const d = fromIso(s); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const daysTo = (s) => Math.round((fromIso(s) - new Date(new Date().toDateString())) / 86400000);
const EXP_CATS = ['صيانة', 'كهرباء وماء', 'نظافة', 'حراسة', 'تأمين', 'رسوم بلدية', 'أخرى'];
function seedOwnerExtras() {
  const now = new Date();
  const soon = { 'tb1-9': 12, 'tb2-1': 34, 'tb3-1': 51, 'tb1-2': 58 };
  db.contracts = db.contracts || [];
  db.tenants.forEach((t, i) => {
    if (db.contracts.some((c) => c.tenantId === t.id)) return;
    const end = new Date(now); end.setDate(end.getDate() + (soon[t.id] ?? (70 + ((i * 37) % 280))));
    const start = new Date(end); start.setFullYear(start.getFullYear() - 1); start.setDate(start.getDate() + 1);
    const sent = t.id === 'tb4-2' || t.id === 'tb4-4';
    if (sent) {
      const ns = new Date(now.getFullYear(), now.getMonth() + 1, 1, 12), ne = new Date(ns); ne.setFullYear(ne.getFullYear() + 1); ne.setDate(ne.getDate() - 1);
      const os = new Date(ns); os.setFullYear(os.getFullYear() - 1); const oe = new Date(ns); oe.setDate(oe.getDate() - 1);
      db.contracts.push({ id: 'co' + t.id, tenantId: t.id, unitId: t.unitId, start: iso(os), end: iso(oe), rent: t.rent, deposit: t.rent, status: 'renewed', signedAt: iso(os) });
      db.contracts.push({ id: 'c' + t.id, tenantId: t.id, unitId: t.unitId, start: iso(ns), end: iso(ne), rent: t.rent, deposit: t.rent, status: 'sent', signedAt: '' });
      return;
    }
    db.contracts.push({ id: 'c' + t.id, tenantId: t.id, unitId: t.unitId, start: iso(start), end: iso(end), rent: t.rent, deposit: t.rent, status: 'signed', signedAt: iso(start) });
  });
  if (!db.expenses) {
    const m = (d) => iso(new Date(now.getFullYear(), now.getMonth() + (d < 0 ? -1 : 0), Math.abs(d) || 1, 12));
    db.expenses = [
      ['b1', 'صيانة', 180, 3, 'صيانة دورية للمصعد'], ['b1', 'كهرباء وماء', 95, 5, 'إنارة الممرات والمواقف'], ['b1', 'حراسة', 220, 1, 'حارس الأمن'],
      ['b2', 'نظافة', 80, 2, 'تنظيف الممرات'], ['b2', 'صيانة', 45, 9, 'تعبئة غاز مكيف'], ['b3', 'صيانة', 120, 6, 'تنسيق الحدائق'], ['b3', 'صيانة', 12, 10, 'إضاءة الحمام · فيلا 5'],
      ['b4', 'صيانة', 150, 4, 'تنظيف المسبح'], ['b4', 'حراسة', 200, 1, 'حارس الأمن'], ['b4', 'تأمين', 260, 7, 'تأمين المبنى السنوي (قسط)'],
      ['b1', 'صيانة', 140, -6, 'صيانة دورية للمصعد'], ['b1', 'حراسة', 220, -1, 'حارس الأمن'], ['b2', 'نظافة', 80, -2, 'تنظيف الممرات'], ['b3', 'صيانة', 120, -5, 'تنسيق الحدائق'], ['b4', 'حراسة', 200, -1, 'حارس الأمن'], ['b4', 'صيانة', 150, -4, 'تنظيف المسبح']
    ].map(([bid, cat, amount, day, note], i) => ({ id: 'e' + i, bid, cat, amount, date: m(day), note }));
  }
  if (!db.techs) db.techs = [
    { id: 'k1', name: 'راشد البلوشي', trade: 'تكييف', rating: 4.9, jobs: 38 }, { id: 'k2', name: 'عمر السيابي', trade: 'سباكة', rating: 4.7, jobs: 25 },
    { id: 'k3', name: 'أنور حسين', trade: 'كهرباء', rating: 4.8, jobs: 31 }, { id: 'k4', name: 'شركة المصاعد الحديثة', trade: 'مصاعد', rating: 4.5, jobs: 12 },
    { id: 'k5', name: 'محمود النجار', trade: 'نجارة وأقفال', rating: 4.6, jobs: 17 }
  ];
  if (!db.history) {
    const pcts = [97, 95, 92, 98, 86, 94, 99, 96, 89, 97, 95];
    const exp = db.tenants.reduce((a, t) => a + Number(t.rent), 0);
    db.history = pcts.map((p, i) => { const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1); return { m: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, short: MONTHS[d.getMonth()], exp: Math.round(exp * (0.94 + i * 0.005)), pct: p }; });
  }
  if (typeof seedNotes === 'function') seedNotes();
  persist();
}
seedOwnerExtras();
const contractOf = (tid) => db.contracts.filter((c) => c.tenantId === tid && c.status !== 'renewed').slice(-1)[0];
const expiring = () => db.contracts.filter((c) => c.status === 'signed' && tOf(c.tenantId) && daysTo(c.end) <= 60 && daysTo(c.end) >= 0).sort((a, b) => a.end.localeCompare(b.end));
const awaiting = () => db.contracts.filter((c) => c.status === 'sent' && tOf(c.tenantId));
function onTenantAdded(t) {
  const s = new Date(); s.setDate(1); s.setMonth(s.getMonth() + 1);
  const e = new Date(s); e.setFullYear(e.getFullYear() + 1); e.setDate(e.getDate() - 1);
  db.contracts.push({ id: uid('c'), tenantId: t.id, unitId: t.unitId, start: iso(s), end: iso(e), rent: t.rent, deposit: t.rent, status: 'sent', signedAt: '' });
  if (typeof notify === 'function') notify(t.id, 'عقد إيجارك جاهز للتوقيع من هاتفك', '#t-contract');
  persist();
}

/* ================= Contracts page ================= */
let cFilter = 'all';
const CST = { signed: ['ok', 'ساري'], sent: ['due', 'بانتظار التوقيع'], renewed: ['new', 'جُدِّد'], ended: ['late', 'منتهٍ'] };
function cStatus(c) { if (c.status === 'signed' && daysTo(c.end) < 0) return ['late', 'منتهٍ']; if (c.status === 'signed' && daysTo(c.end) <= 60) return ['late', `ينتهي بعد ${daysTo(c.end)} يومًا`]; return CST[c.status]; }
function contractsPage() {
  const all = db.contracts.filter((c) => c.status !== 'renewed' && tOf(c.tenantId));
  const exp = expiring(), aw = awaiting();
  const list = cFilter === 'soon' ? exp : cFilter === 'sent' ? aw : all.slice().sort((a, b) => a.end.localeCompare(b.end));
  const tab = (k, n, c) => `<button type="button" data-cfilter="${k}" class="${cFilter === k ? 'on' : ''}" aria-pressed="${cFilter === k}">${n} <span class="num">${c}</span></button>`;
  return `<div class="tools"><div><h1>العقود</h1><span class="mut">عقود إيجار إلكترونية يوقّعها المستأجر من هاتفه، مع تذكير قبل انتهاء كل عقد.</span></div><button class="btn" data-c-new>عقد جديد</button></div>
    <div class="grid" style="grid-auto-rows:auto;margin-bottom:16px">
      <section class="tile c hero"><span class="lbl">عقود سارية</span><span class="val num">${all.filter((c) => c.status === 'signed').length}</span></section>
      <section class="tile c ${exp.length ? 't2 alert' : 't2'}"><span class="lbl">تنتهي خلال 60 يومًا</span><span class="val num">${exp.length}</span>${exp[0] ? `<span style="font-size:13px;font-weight:600">أقربها: ${esc(tOf(exp[0].tenantId).name)} · ${arDate(exp[0].end)}</span>` : ''}</section>
      <section class="tile c t3"><span class="lbl">بانتظار توقيع المستأجر</span><span class="val num">${aw.length}</span></section>
      <section class="tile gray"><span class="lbl">التأمينات المحفوظة</span><span class="val"><span class="num">${fmt(all.reduce((a, c) => a + Number(c.deposit || 0), 0))}</span> ر.ع.</span></section>
    </div>
    <div class="tabs mtabs">${tab('all', 'الكل', all.length)}${tab('soon', 'تنتهي قريبًا', exp.length)}${tab('sent', 'بانتظار التوقيع', aw.length)}</div>
    <section class="tile"><div class="tbl fade"><table><thead><tr><th>المستأجر</th><th>الوحدة</th><th>المدة</th><th>الإيجار</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>
    ${list.map((c) => { const t = tOf(c.tenantId); const [cls, txt] = cStatus(c); return `<tr><td data-label="المستأجر"><span class="v"><b>${esc(t.name)}</b></span></td><td data-label="الوحدة" class="mut"><span class="v">${esc(place(c.unitId))}</span></td><td data-label="المدة"><span class="v">${arDate(c.start)} ← ${arDate(c.end)}</span></td><td data-label="الإيجار"><span class="v"><span class="num">${fmt(c.rent)}</span> ر.ع.</span></td><td data-label="الحالة"><span class="v"><span class="pill ${cls}">${txt}</span></span></td><td class="rowacts"><button class="btn soft small" data-c-view="${c.id}">عرض العقد</button>${c.status === 'sent' ? ` <button class="btn soft small" data-c-nudge="${c.id}">تذكير بالتوقيع</button>` : ''}${c.status === 'signed' && daysTo(c.end) <= 60 ? ` <button class="btn small" data-c-renew="${c.id}">تجديد</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="6" class="mut">لا توجد عقود هنا.</td></tr>'}
    </tbody></table></div></section>`;
}
function contractDoc(c) {
  const t = tOf(c.tenantId), u = unitOf(c.unitId), b = u && bOf(u.buildingId);
  const months = Math.round((fromIso(c.end) - fromIso(c.start)) / (30.44 * 86400000));
  return `<article class="doc" id="doc">
    <header><span class="rlogo"><svg class="mark" width="30" height="30" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26"/><path class="cup" d="M28 51a22 22 0 0 0 44 0"/><path class="dot" d="M50 25l8 8-8 8-8-8z"/></svg>سكن</span><span>رقم العقد: <span class="num">${esc(c.id.toUpperCase().slice(0, 10))}</span></span></header>
    <h2>عقد إيجار ${esc(b && b.kind === 'محل' ? 'تجاري' : 'سكني')}</h2>
    <p>أُبرم هذا العقد بتاريخ ${arDate(c.start)} بين:</p>
    <p><b>المؤجِّر:</b> سالم العبري (مثال) &nbsp;·&nbsp; <b>المستأجر:</b> ${esc(t ? t.name : '')}${t && t.phone ? ` · <span class="num" dir="ltr">${esc(t.phone)}</span>` : ''}</p>
    <ol>
      <li><b>العين المؤجَّرة:</b> ${esc(u ? u.label : '')} في ${esc(b ? b.name : '')}، ${esc(b ? b.area : '')}، مسقط.</li>
      <li><b>المدة:</b> <span class="num">${months}</span> شهرًا، من ${arDate(c.start)} إلى ${arDate(c.end)}، قابلة للتجديد باتفاق الطرفين.</li>
      <li><b>الأجرة:</b> <span class="num">${fmt(c.rent)}</span> ريال عُماني شهريًا، تُدفع مقدمًا في أول كل شهر عبر تطبيق سكن أو بالتحويل البنكي.</li>
      <li><b>التأمين:</b> <span class="num">${fmt(c.deposit)}</span> ريال عُماني، يُرد عند نهاية العقد بعد خصم أي أضرار إن وجدت.</li>
      <li><b>الصيانة:</b> يتحمل المؤجِّر الصيانة الأساسية (التكييف المركزي، السباكة، الكهرباء)، ويُبلَّغ بها عبر التطبيق.</li>
      <li><b>الخدمات:</b> يتحمل المستأجر فواتير الكهرباء والماء والإنترنت ما لم يُتفق على غير ذلك.</li>
      <li><b>الإخلاء:</b> يلتزم الطرف الراغب في عدم التجديد بإبلاغ الآخر قبل <span class="num">60</span> يومًا من نهاية المدة.</li>
      <li><b>القانون:</b> يخضع هذا العقد للقوانين المعمول بها في سلطنة عُمان، ويُسجَّل لدى البلدية المختصة.</li>
    </ol>
    <div class="sigs"><div><span class="mut">توقيع المؤجِّر</span><span class="sig owner">سالم العبري</span><small>${arDate(c.start)}</small></div>
      <div><span class="mut">توقيع المستأجر</span>${c.sig ? `<img class="sig" src="${esc(c.sig)}" alt="توقيع ${esc(t ? t.name : '')}">` : c.status === 'signed' ? `<span class="sig">${esc(t ? t.name : '')}</span>` : '<span class="sig wait">بانتظار التوقيع</span>'}<small>${c.signedAt ? arDate(c.signedAt) : ''}</small></div></div>
    <footer>نموذج تجريبي من سكن · ليس عقدًا قانونيًا · يُنصح بمراجعة الصيغة النهائية مع مستشار قانوني.</footer>
  </article>`;
}
function viewContract(id, tenantSide) {
  const c = db.contracts.find((x) => x.id === id); if (!c) return;
  sheetSave = null;
  const acts = tenantSide && c.status === 'sent' ? `<button class="btn" data-c-sign="${c.id}">توقيع العقد</button>` : !tenantSide && c.status === 'sent' ? `<button class="btn soft" data-c-nudge="${c.id}">تذكير بالتوقيع</button>` : '';
  $('#sheet').innerHTML = `<div class="panel pop wide" role="dialog" aria-modal="true" aria-label="عقد الإيجار">${contractDoc(c)}<div class="bars">${acts}<button class="btn soft" data-print-doc>طباعة / حفظ PDF</button><button class="btn soft" data-close>إغلاق</button></div></div>`;
  $('#sheet').hidden = false;
}
function signContract(id) {
  const c = db.contracts.find((x) => x.id === id); if (!c) return;
  sheetSave = () => {
    const cv = window._sigCanvas; if (!cv || !cv._drawn) { toast('ارسم توقيعك أولًا'); return; }
    c.sig = cv.toDataURL('image/png'); c.status = 'signed'; c.signedAt = iso(new Date());
    if (typeof notify === 'function') notify('owner', `${tOf(c.tenantId).name} وقّع عقد ${place(c.unitId)}`, '#contracts');
    toast('تم توقيع العقد. أرسلنا نسخة للمالك.');
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>وقّع العقد</h2><p class="mut" style="margin:0">ارسم توقيعك بإصبعك أو بالماوس داخل المربع.</p>
    <canvas id="sigpad" class="sigpad" width="640" height="240" aria-label="مربع التوقيع"></canvas>
    <label class="chk"><input type="checkbox" required> قرأت العقد وأوافق على بنوده</label>
    <div class="acts"><button class="btn" type="submit">تأكيد التوقيع</button><button class="btn soft" type="button" data-sig-clear>مسح</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
  const cv = $('#sigpad'), g = cv.getContext('2d'); window._sigCanvas = cv;
  g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#0C0C0E';
  let down = false;
  const pt = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)]; };
  cv.addEventListener('pointerdown', (e) => { down = true; cv.setPointerCapture(e.pointerId); const [x, y] = pt(e); g.beginPath(); g.moveTo(x, y); });
  cv.addEventListener('pointermove', (e) => { if (!down) return; const [x, y] = pt(e); g.lineTo(x, y); g.stroke(); cv._drawn = true; });
  cv.addEventListener('pointerup', () => { down = false; });
}
function renewForm(id) {
  const c = db.contracts.find((x) => x.id === id); const t = tOf(c.tenantId);
  const f = fair({ type: kindOf(unitOf(c.unitId) || {}), area: (bOf((unitOf(c.unitId) || {}).buildingId) || {}).area, beds: 2, rent: c.rent });
  openForm('تجديد عقد ' + t.name, [
    { key: 'rent', label: `الإيجار الجديد (ر.ع.) · الحالي ${fmt(c.rent)} · سعر السوق التقريبي ${fmt(f.lo)}–${fmt(f.hi)}`, type: 'number', value: c.rent, required: true },
    { key: 'months', label: 'المدة', type: 'pick', value: '12', options: [['6', '6 أشهر'], ['12', 'سنة'], ['24', 'سنتان']].map(([value, label]) => ({ value, label })) }
  ], (v) => {
    const s = fromIso(c.end); s.setDate(s.getDate() + 1); const e = new Date(s); e.setMonth(e.getMonth() + Number(v.months)); e.setDate(e.getDate() - 1);
    c.status = 'renewed';
    db.contracts.push({ id: uid('c'), tenantId: c.tenantId, unitId: c.unitId, start: iso(s), end: iso(e), rent: Number(v.rent), deposit: c.deposit, status: 'sent', signedAt: '' });
    if (Number(v.rent) !== Number(c.rent)) t.nextRent = Number(v.rent);
    if (typeof notify === 'function') notify(t.id, `عرض تجديد عقدك جاهز للتوقيع · ${fmt(v.rent)} ر.ع. شهريًا`, '#t-contract');
    toast('أُرسل عقد التجديد إلى ' + t.name + ' للتوقيع');
  }, 'إرسال للتوقيع');
}
window.EXTRA_PAGES.contracts = contractsPage;

/* ================= Finance page ================= */
const monthKey = (d = new Date()) => iso(d).slice(0, 7);
const curExpenses = () => db.expenses.filter((e) => e.date.slice(0, 7) === monthKey());
function trendChart() {
  const t = totals();
  const rows = [...db.history.slice(-11), { m: CUR, short: MONTHS[new Date().getMonth()], exp: t.expected, pct: t.pct, live: true }];
  const W = 760, H = 250, P = { l: 8, r: 42, t: 30, b: 30 }, bw = (W - P.l - P.r) / rows.length;
  const y = (p) => P.t + (H - P.t - P.b) * (1 - p / 100);
  const bars = rows.map((r, i) => {
    const low = r.pct < alertAt, x = W - P.r - (i + 1) * bw + 5, w = bw - 10, top = y(r.pct);
    const col = Math.round(r.exp * r.pct / 100);
    return `<g class="bar ${low ? 'low' : ''}${r.live ? ' live' : ''}" tabindex="0" role="img" aria-label="${r.m}: ${r.pct}% · ${fmt(col)} من ${fmt(r.exp)} ر.ع.">
      <rect class="hit" x="${x - 4}" y="${P.t}" width="${w + 8}" height="${H - P.t - P.b}"/>
      <path d="M${x} ${H - P.b}V${top + 4}a4 4 0 0 1 4-4h${w - 8}a4 4 0 0 1 4 4V${H - P.b}Z"/>
      ${low ? `<text class="flagt" x="${x + w / 2}" y="${top - 6}" text-anchor="middle">!</text>` : ''}
      <text class="xl" x="${x + w / 2}" y="${H - 10}" text-anchor="middle">${r.short.slice(0, 3)}</text>
      <foreignObject x="${Math.min(Math.max(x + w / 2 - 95, 0), W - 190)}" y="${Math.max(top - 62, 0)}" width="190" height="58"><div class="tip" xmlns="http://www.w3.org/1999/xhtml"><b>${r.m}</b><span><span class="num">${r.pct}%</span> · <span class="num">${fmt(col)}</span> ر.ع.</span></div></foreignObject>
    </g>`;
  }).join('');
  const grid = [0, 50, 100].map((p) => `<line class="gl" x1="${P.l}" x2="${W - P.r}" y1="${y(p)}" y2="${y(p)}"/><text class="yl" x="${W - P.r + 6}" y="${y(p) + 4}" text-anchor="start">${p}%</text>`).join('');
  return `<figure class="trend"><div class="svgwrap"><svg viewBox="0 0 ${W} ${H}" role="group" aria-label="نسبة التحصيل الشهرية لآخر 12 شهرًا">${grid}<line class="thr" x1="${P.l}" x2="${W - P.r}" y1="${y(alertAt)}" y2="${y(alertAt)}"/>${bars}</svg></div>
    <figcaption><span class="lg"><i class="ok"></i>فوق حد التنبيه</span><span class="lg"><i class="low"></i>تحت حد التنبيه (!)</span><span class="lg"><i class="thr"></i>حد التنبيه <span class="num">${alertAt}%</span></span></figcaption>
    <details><summary>عرض كجدول</summary><table class="mini"><thead><tr><th>الشهر</th><th>النسبة</th><th>المحصّل</th><th>المتوقع</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.m}</td><td class="num">${r.pct}%</td><td class="num">${fmt(Math.round(r.exp * r.pct / 100))}</td><td class="num">${fmt(r.exp)}</td></tr>`).join('')}</tbody></table></details></figure>`;
}
function buildingFin() {
  const ex = curExpenses();
  return db.buildings.map((b) => {
    const ts = db.tenants.filter((t) => unitOf(t.unitId)?.buildingId === b.id);
    const inc = totals(ts).collected, out = ex.filter((e) => e.bid === b.id).reduce((a, e) => a + Number(e.amount), 0);
    return { b, inc, out, net: inc - out };
  });
}
function financePage() {
  const t = totals(); const ex = curExpenses(); const out = ex.reduce((a, e) => a + Number(e.amount), 0);
  const rows = buildingFin(); const maxInc = Math.max(1, ...rows.map((r) => r.inc));
  const byCat = EXP_CATS.map((c) => [c, ex.filter((e) => e.cat === c).reduce((a, e) => a + Number(e.amount), 0)]).filter(([, v]) => v);
  return `<div class="tools"><div><h1>المالية</h1><span class="mut">${CUR} · الدخل والمصروفات وصافي الربح لكل مبنى.</span></div><div class="bars"><button class="btn soft" data-exp-add>إضافة مصروف</button><a class="btn" style="text-decoration:none" href="#report">التقرير الشهري</a></div></div>
    <div class="grid" style="grid-auto-rows:auto;margin-bottom:16px">
      <section class="tile c hero"><span class="lbl">الدخل المحصّل</span><span class="val"><span class="num">${fmt(t.collected)}</span> ر.ع.</span><span style="font-size:13px;font-weight:600">من <span class="num">${fmt(t.expected)}</span> متوقع</span></section>
      <section class="tile c t3"><span class="lbl">المصروفات</span><span class="val"><span class="num">${fmt(out)}</span> ر.ع.</span><span style="font-size:13px;font-weight:600">${ex.length} بندًا هذا الشهر</span></section>
      <section class="tile c t2 s2"><span class="lbl">صافي الربح</span><span class="val"><span class="num">${fmt(t.collected - out)}</span> ر.ع.</span><span style="font-size:13px;font-weight:600">هامش <span class="num">${t.collected ? Math.round(((t.collected - out) / t.collected) * 100) : 0}%</span> · يرتفع بـ <span class="num">${fmt(t.expected - t.collected)}</span> ر.ع. عند تحصيل المتأخرات</span></section>
    </div>
    <section class="tile" style="margin-bottom:16px"><div class="head" style="margin:0"><h2>نسبة التحصيل · آخر 12 شهرًا</h2><a href="#prefs">تغيير حد التنبيه</a></div>${trendChart()}</section>
    <div class="cols2">
      <section class="tile"><h2>الربح حسب المبنى</h2><div class="tbl"><table><thead><tr><th>المبنى</th><th>الدخل</th><th>المصروفات</th><th>الصافي</th></tr></thead><tbody>${rows.map((r) => `<tr><td data-label="المبنى"><span class="v"><b>${esc(r.b.name)}</b><span class="hbar" aria-hidden="true"><i style="width:${Math.round((r.inc / maxInc) * 100)}%"></i><em style="width:${Math.round((r.out / maxInc) * 100)}%"></em></span></span></td><td data-label="الدخل"><span class="v num">${fmt(r.inc)}</span></td><td data-label="المصروفات"><span class="v num">${fmt(r.out)}</span></td><td data-label="الصافي"><span class="v"><b class="num">${fmt(r.net)}</b></span></td></tr>`).join('')}</tbody></table></div>
        <div class="lgrow"><span class="lg"><i class="ok"></i>الدخل</span><span class="lg"><i class="out"></i>المصروفات</span></div></section>
      <section class="tile"><h2>المصروفات حسب النوع</h2>${byCat.map(([c, v]) => `<div class="catrow"><span>${esc(c)}</span><span class="cbar" aria-hidden="true"><i style="width:${Math.round((v / Math.max(...byCat.map((x) => x[1]))) * 100)}%"></i></span><b class="num">${fmt(v)}</b></div>`).join('') || '<p class="mut">لا توجد مصروفات هذا الشهر.</p>'}</section>
    </div>
    <section class="tile" style="margin-top:16px"><div class="head" style="margin:0"><h2>مصروفات ${CUR}</h2><button class="btn soft small" data-exp-add>إضافة</button></div>
      <div class="tbl"><table><thead><tr><th>التاريخ</th><th>المبنى</th><th>النوع</th><th>البيان</th><th>المبلغ</th><th></th></tr></thead><tbody>${ex.slice().sort((a, b) => b.date.localeCompare(a.date)).map((e) => `<tr><td data-label="التاريخ"><span class="v">${arDate(e.date)}</span></td><td data-label="المبنى"><span class="v">${esc((bOf(e.bid) || {}).name || '—')}</span></td><td data-label="النوع"><span class="v"><span class="chip">${esc(e.cat)}</span></span></td><td data-label="البيان"><span class="v">${esc(e.note)}</span></td><td data-label="المبلغ"><span class="v"><span class="num">${fmt(e.amount)}</span> ر.ع.</span></td><td class="rowacts"><button class="btn danger small" data-exp-del="${e.id}">حذف</button></td></tr>`).join('')}</tbody></table></div></section>`;
}
function addExpense(pre = {}) {
  openForm('إضافة مصروف', [
    { key: 'bid', label: 'المبنى', type: 'pick', value: pre.bid || db.buildings[0]?.id, options: db.buildings.map((b) => ({ value: b.id, label: b.name })) },
    { key: 'cat', label: 'النوع', type: 'pick', value: pre.cat || 'صيانة', options: EXP_CATS.map((x) => ({ value: x, label: x })) },
    { key: 'amount', label: 'المبلغ (ر.ع.)', type: 'number', value: pre.amount || '', required: true },
    { key: 'note', label: 'البيان', value: pre.note || '', placeholder: 'مثال: تعبئة غاز مكيف' }
  ], (v) => { db.expenses.push({ id: uid('e'), bid: v.bid, cat: v.cat, amount: Number(v.amount), date: iso(new Date()), note: v.note.trim() || v.cat }); toast('تمت إضافة المصروف'); });
}
window.EXTRA_PAGES.finance = financePage;

/* ================= Monthly report (printable) ================= */
function reportPage() {
  const t = totals(); const ex = curExpenses(); const out = ex.reduce((a, e) => a + Number(e.amount), 0);
  const rows = buildingFin(); const jobs = db.jobs; const vac = db.units.filter((u) => !u.tenantId);
  const text = `تقرير ${CUR} · سكن\nالتحصيل: ${t.pct}% (${fmt(t.collected)} من ${fmt(t.expected)} ر.ع.)\nالمصروفات: ${fmt(out)} ر.ع.\nصافي الربح: ${fmt(t.collected - out)} ر.ع.\nلم يدفع: ${t.unpaid.length} · شاغرة: ${vac.length}`;
  return `<div class="tools noprint"><a class="back" href="#finance"><span class="ico" aria-hidden="true">${ICON.back}</span>المالية</a><div class="bars"><a class="btn soft" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(text)}">مشاركة الملخص عبر واتساب</a><button class="btn" data-print>طباعة / حفظ PDF</button></div></div>
  <article class="doc report">
    <header><span class="rlogo"><svg class="mark" width="30" height="30" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26"/><path class="cup" d="M28 51a22 22 0 0 0 44 0"/><path class="dot" d="M50 25l8 8-8 8-8-8z"/></svg>سكن</span><span>أُعد في ${arDate(iso(new Date()))}</span></header>
    <h2>التقرير الشهري · ${CUR}</h2><p class="mut" style="margin-top:-6px">سالم العبري · ${db.buildings.length} مبانٍ · ${db.units.length} وحدة</p>
    <div class="kpis"><div><span>نسبة التحصيل</span><b class="num">${t.pct}%</b></div><div><span>الدخل المحصّل</span><b><span class="num">${fmt(t.collected)}</span> ر.ع.</b></div><div><span>المصروفات</span><b><span class="num">${fmt(out)}</span> ر.ع.</b></div><div><span>صافي الربح</span><b><span class="num">${fmt(t.collected - out)}</span> ر.ع.</b></div></div>
    <h3>حسب المبنى</h3><table class="mini"><thead><tr><th>المبنى</th><th>الإشغال</th><th>الدخل</th><th>المصروفات</th><th>الصافي</th></tr></thead><tbody>${rows.map((r) => { const us = db.units.filter((u) => u.buildingId === r.b.id); return `<tr><td>${esc(r.b.name)}</td><td class="num">${us.filter((u) => u.tenantId).length}/${us.length}</td><td class="num">${fmt(r.inc)}</td><td class="num">${fmt(r.out)}</td><td class="num"><b>${fmt(r.net)}</b></td></tr>`; }).join('')}</tbody></table>
    <h3>لم يدفع بعد (${t.unpaid.length})</h3><table class="mini"><tbody>${t.unpaid.map((x) => `<tr><td>${esc(x.name)}</td><td>${esc(place(x.unitId))}</td><td class="num">${fmt(x.rent)} ر.ع.</td><td>${esc(x.note)}</td></tr>`).join('') || '<tr><td>الكل دفع</td></tr>'}</tbody></table>
    <h3>العقود</h3><p>${expiring().length} عقود تنتهي خلال 60 يومًا · ${awaiting().length} بانتظار التوقيع.</p>
    <h3>الصيانة</h3><p>${jobs.filter((j) => j.status === 'new').length} جديدة · ${jobs.filter((j) => j.status === 'progress').length} قيد التنفيذ · ${jobs.filter((j) => j.status === 'done').length} تم إصلاحها.</p>
    <h3>الوحدات الشاغرة (${vac.length})</h3><p>${vac.map((u) => esc(place(u.id))).join('، ') || 'لا توجد'}</p>
    <footer>تقرير تجريبي من سكن · الأرقام أمثلة.</footer>
  </article>`;
}
window.EXTRA_PAGES.report = reportPage;

/* ================= Technicians ================= */
function assignTech(jid) {
  const j = db.jobs.find((x) => x.id === jid); if (!j) return;
  const guess = { 'تكييف': 'k1', 'سباكة': 'k2', 'كهرباء': 'k3', 'أبواب وأقفال': 'k5' }[j.cat] || (/مكيف|تبريد/.test(j.title) ? 'k1' : /مصعد/.test(j.title) ? 'k4' : /ماء|تسرب|تسرّب|مغسلة/.test(j.title) ? 'k2' : /إضاءة|كهرب/.test(j.title) ? 'k3' : 'k1');
  const days = nextDays(3);
  sheetSave = (v) => {
    const k = db.techs.find((x) => x.id === v.tech); const d = days.find((x) => dayKey(x) === v.day) || days[0];
    j.tech = k.id; j.visit = `${dayLbl(d)} · ${v.time}`; j.status = 'progress'; j.from = `${k.name} · ${dayLbl(d)} ${v.time}`;
    if (typeof notify === 'function' && j.unitId) { const t = db.tenants.find((x) => x.unitId === j.unitId); if (t) notify(t.id, `سيزورك ${k.name} (${k.trade}) ${dayLbl(d)} الساعة ${v.time} لطلب: ${j.title}`, '#t-requests'); }
    toast(`أُرسل الطلب إلى ${k.name} وأُبلغ المستأجر بالموعد`);
  };
  const msg = (k) => `مرحبًا ${k.name}، لدينا طلب صيانة (${j.title}) في ${place(j.unitId)}، مسقط. هل يناسبك الموعد المحدد؟ — سالم، عبر سكن`;
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>إسناد لفني</h2><span class="mut" style="font-size:13px">${esc(j.title)} · ${esc(place(j.unitId))}</span>
    <fieldset class="prio"><legend>الفني</legend><div class="techs">${db.techs.map((k) => `<label><input type="radio" name="tech" value="${k.id}" ${k.id === guess ? 'checked' : ''}><span><b>${esc(k.name)}</b><small>${esc(k.trade)} · ★ <span class="num">${k.rating}</span> · <span class="num">${k.jobs}</span> طلبًا</small></span></label>`).join('')}</div></fieldset>
    <div class="row2"><fieldset class="prio"><legend>اليوم</legend><div class="chipsel days">${days.map((d, i) => `<label><input type="radio" name="day" value="${dayKey(d)}" ${i === 0 ? 'checked' : ''}><span><small>${WD[d.getDay()]}</small><b class="num">${d.getDate()}</b></span></label>`).join('')}</div></fieldset>
    <fieldset class="prio"><legend>الوقت</legend><div class="chipsel times">${['9–11 ص', '12–2 م', '4–6 م'].map((x, i) => `<label><input type="radio" name="time" value="${x}" ${i === 2 ? 'checked' : ''}><span>${x}</span></label>`).join('')}</div></fieldset></div>
    <div class="wa"><span class="mut" style="font-size:12px">الرسالة التي تصل للفني على واتساب</span><div class="bubble" id="waMsg">${esc(msg(db.techs.find((k) => k.id === guess)))}</div></div>
    <div class="acts"><button class="btn" type="submit">إرسال للفني</button><a class="btn soft" id="waOpen" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg(db.techs.find((k) => k.id === guess)))}">فتح في واتساب</a><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
  $('#sheetForm').addEventListener('change', (e) => { if (e.target.name !== 'tech') return; const m = msg(db.techs.find((k) => k.id === e.target.value)); $('#waMsg').textContent = m; $('#waOpen').href = 'https://wa.me/?text=' + encodeURIComponent(m); });
}
function finishJob(j) {
  const u = unitOf(j.unitId);
  openForm('تم الإصلاح · ' + j.title, [
    { key: 'cost', label: 'تكلفة الإصلاح (ر.ع.) · تُضاف تلقائيًا للمصروفات', type: 'number', value: '' },
    { key: 'note', label: 'ملاحظة', value: j.tech ? 'نفّذه ' + (db.techs.find((k) => k.id === j.tech) || {}).name : '' }
  ], (v) => {
    j.status = 'done'; const c = Number(v.cost) || 0;
    if (c) { j.from = `التكلفة ${c} ر.ع.`; db.expenses.push({ id: uid('e'), bid: u ? u.buildingId : db.buildings[0].id, cat: 'صيانة', amount: c, date: iso(new Date()), note: `${j.title} · ${u ? u.label : ''}` }); }
    if (typeof notify === 'function') { const t = db.tenants.find((x) => x.unitId === j.unitId); if (t) notify(t.id, `تم إصلاح: ${j.title}. كيف كانت الخدمة؟`, '#t-requests'); }
    toast(c ? `تم الإغلاق وأُضيف ${c} ر.ع. إلى المصروفات` : 'تم إغلاق الطلب');
  }, 'إغلاق الطلب');
}

/* ================= Overview additions ================= */
function ownerExtras() {
  const exp = expiring(), aw = awaiting(), up = upcomingViewings(), inq = mkt.listings.filter((l) => l.mine).reduce((a, l) => a + l.inquiries.filter((x) => !x.seen).length, 0);
  const ex = curExpenses().reduce((a, e) => a + Number(e.amount), 0), t = totals();
  const item = (href, n, title, sub, hot) => `<a class="todo${hot ? ' hot' : ''}" href="${href}"><b class="num">${n}</b><span><b>${title}</b><small>${sub}</small></span></a>`;
  return `<div class="grid" style="grid-auto-rows:auto;margin-top:16px">
    <section class="tile s2"><div class="head" style="margin:0"><h2>يحتاج انتباهك</h2></div><div class="todos">
      ${item('#contracts', exp.length, 'عقود تنتهي خلال 60 يومًا', exp[0] ? `أقربها ${esc(tOf(exp[0].tenantId).name)} · بعد ${daysTo(exp[0].end)} يومًا` : 'لا شيء', exp.length)}
      ${item('#contracts', aw.length, 'عقود بانتظار التوقيع', aw.length ? 'أرسل تذكيرًا للمستأجر' : 'كل العقود موقّعة', false)}
      ${item('#market', up.length, 'معاينات قادمة', up[0] ? `${esc(up[0].x.name)} · ${esc(up[0].x.slot.day)} ${esc(up[0].x.slot.time)}` : 'لا توجد', false)}
      ${item('#market', inq, 'طلبات معاينة جديدة', 'من سوق سكن', inq)}
    </div></section>
    <a class="tile s2" href="#finance" style="text-decoration:none;color:inherit"><div class="head" style="margin:0"><h2>صافي الربح · ${CUR}</h2><span class="mut" style="font-size:13px">المالية ←</span></div>
      <span class="val"><span class="num">${fmt(t.collected - ex)}</span> ر.ع.</span><span class="mut" style="font-size:13px">دخل <span class="num">${fmt(t.collected)}</span> − مصروفات <span class="num">${fmt(ex)}</span></span>
      <div class="spark" aria-hidden="true">${[...db.history.slice(-11).map((h) => h.pct), t.pct].map((p) => `<i class="${p < alertAt ? 'low' : ''}" style="height:${Math.max(8, p - 60) * 2.2}%"></i>`).join('')}</div></a>
  </div>`;
}

/* ================= Click handlers (owner) ================= */
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.move) { const j = db.jobs.find((x) => x.id === d.move); if (j && j.status === 'progress') { e.stopImmediatePropagation(); finishJob(j); } }
}, true);
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.cfilter) { cFilter = d.cfilter; render(); }
  else if (d.cView) viewContract(d.cView, document.body.classList.contains('tenant'));
  else if (d.cRenew) renewForm(d.cRenew);
  else if (d.cSign) { closeSheet(); signContract(d.cSign); }
  else if ('sigClear' in d) { const cv = $('#sigpad'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); cv._drawn = false; }
  else if (d.cNudge) { const c = db.contracts.find((x) => x.id === d.cNudge); const t = tOf(c.tenantId); if (typeof notify === 'function') notify(t.id, 'تذكير: عقد إيجارك بانتظار توقيعك', '#t-contract'); toast('تم إرسال تذكير بالتوقيع إلى ' + t.name); }
  else if ('cNew' in d) { const free = db.tenants.filter((t) => !contractOf(t.id)); if (free.length) { onTenantAdded(free[0]); toast('أُنشئ عقد لـ ' + free[0].name); render(); } else { addTenant(); } }
  else if ('printDoc' in d) { if ($('#sheet').hidden) { window.print(); return; } document.body.classList.add('printdoc'); window.print(); setTimeout(() => document.body.classList.remove('printdoc'), 500); }
  else if ('expAdd' in d) addExpense();
  else if (d.expDel) { db.expenses = db.expenses.filter((x) => x.id !== d.expDel); persist(); toast('تم حذف المصروف'); render(); }
  else if (d.tech) assignTech(d.tech);
});


/* ================= Notifications ================= */
const nowTime = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
function notify(to, text, link = '') { db.notes = db.notes || []; db.notes.unshift({ id: uid('n'), to, text, link, date: today(), time: nowTime(), read: false }); persist(); updateBell(); }
function seedNotes() {
  if (db.notes) return;
  const n = (to, text, link, date, time, read = false) => ({ id: uid('n'), to, text, link, date, time, read });
  db.notes = [
    n('owner', 'أحمد خان رفع إيصال تحويل بمبلغ 300 ر.ع. للمراجعة', '#rent', today(), '09:12'),
    n('owner', 'سجّلت لينا طلب صيانة من مكالمة: المكيف لا يبرد · برج الخوير شقة 12', '#maintenance', today(), '08:40'),
    n('owner', 'طلب معاينة جديد من عبدالله الشكيلي · شقة غرفتين بإطلالة على البحر', '#market', today(), '07:55'),
    n('owner', 'عقد سيف الكندي ينتهي خلال أقل من أسبوعين · جدّده الآن', '#contracts', 'أمس', '18:20', true),
    n('tb4-2', 'تذكير: إيجار نوفمبر (450 ر.ع.) يستحق بعد يومين', '#t-pay', today(), '09:00'),
    n('tb4-2', 'عقد إيجارك جاهز للتوقيع من هاتفك', '#t-contract', 'أمس', '16:10'),
    n('tb4-2', 'إعلان من الإدارة: تنظيف المسبح يوم السبت من 9 إلى 12 ظهرًا', '#t-home', 'أمس', '11:00', true)
  ];
  db.anns = db.anns || [
    { id: 'a1', bid: 'b4', kind: 'صيانة', title: 'تنظيف المسبح يوم السبت', text: 'سيكون المسبح مغلقًا من 9 صباحًا حتى 12 ظهرًا للتنظيف الدوري.', date: 'أمس' },
    { id: 'a2', bid: 'b1', kind: 'انقطاع ماء', title: 'انقطاع الماء يوم الخميس', text: 'ينقطع الماء من 10 صباحًا إلى 2 ظهرًا لصيانة الخزان الرئيسي. نعتذر عن الإزعاج.', date: 'اليوم' }
  ];
  db.autoRemind = db.autoRemind || { before: true, due: true, after: true, lina: false };
  persist();
}
seedNotes();
const myNotes = () => { const ten = document.body.classList.contains('tenant'); const who = ten ? (me() || {}).id : 'owner'; return (db.notes || []).filter((x) => x.to === who); };
function updateBell() { const n = myNotes().filter((x) => !x.read).length; document.querySelectorAll('.bdot').forEach((b) => { b.textContent = n || ''; b.hidden = !n; }); document.querySelectorAll('[data-bell]').forEach((b) => b.setAttribute('aria-label', n ? `الإشعارات · ${n} جديدة` : 'الإشعارات')); }
function openBell() {
  const list = myNotes();
  sheetSave = null;
  $('#sheet').innerHTML = `<div class="panel pop" role="dialog" aria-modal="true" aria-label="الإشعارات"><div class="tools" style="margin:0"><h2>الإشعارات</h2>${list.some((x) => !x.read) ? '<button class="btn soft small" data-note-all>تحديد الكل كمقروء</button>' : ''}</div>
    <p class="mut" style="margin:0;font-size:13px">تصلك أيضًا على واتساب وفي إشعارات الهاتف.</p>
    <div class="notes">${list.map((x) => `<button type="button" class="note ${x.read ? '' : 'unread'}" data-note-go="${x.id}"><span class="ndot" aria-hidden="true"></span><span class="grow"><span>${esc(x.text)}</span><small class="mut">${esc(x.date)} · <span class="num">${esc(x.time)}</span></small></span></button>`).join('') || '<p class="mut">لا توجد إشعارات.</p>'}</div>
    <div class="bars"><button class="btn soft" data-close>إغلاق</button></div></div>`;
  $('#sheet').hidden = false;
}
function remindSheet(id) {
  const t = tOf(id); if (!t) return;
  const msg = `مرحبًا ${t.name.split(' ')[0]}، تذكير لطيف بأن إيجار ${CUR} (${fmt(t.rent)} ر.ع.) لـ ${place(t.unitId)} ${t.status === 'late' ? 'متأخر' : 'يستحق في ' + t.due}. يمكنك الدفع من تطبيق سكن مباشرة. شكرًا لك — سالم`;
  sheetSave = (v) => {
    notify(t.id, `تذكير من المالك: إيجار ${CUR} (${fmt(t.rent)} ر.ع.) ${t.status === 'late' ? 'متأخر' : 'مستحق'}`, '#t-pay');
    toast(v.lina ? `أُرسل التذكير وستتصل لينا بـ ${t.name} (تجريبي)` : `أُرسل التذكير إلى ${t.name} (تجريبي)`);
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>تذكير ${esc(t.name)}</h2><span class="mut" style="font-size:13px">${esc(place(t.unitId))} · ${pill(t)}</span>
    <div class="wa"><span class="mut" style="font-size:12px">الرسالة على واتساب</span><div class="bubble">${esc(msg)}</div></div>
    <fieldset class="prio"><legend>القنوات</legend><div class="checks"><label><input type="checkbox" name="wa" checked> واتساب</label><label><input type="checkbox" name="sms"> رسالة نصية</label><label><input type="checkbox" name="app" checked> إشعار التطبيق</label><label><input type="checkbox" name="lina"> مكالمة من لينا</label></div></fieldset>
    <div class="acts"><button class="btn" type="submit">إرسال التذكير</button><a class="btn soft" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/${t.phone ? waLink(t.phone).split('/').pop() : ''}?text=${encodeURIComponent(msg)}">فتح في واتساب</a><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function remindAllSheet() {
  const un = totals().unpaid; const a = db.autoRemind;
  sheetSave = (v) => {
    db.autoRemind = { before: !!v.before, due: !!v.due, after: !!v.after, lina: !!v.lina };
    if (v.now) un.forEach((t) => notify(t.id, `تذكير من المالك: إيجار ${CUR} (${fmt(t.rent)} ر.ع.)`, '#t-pay'));
    toast(v.now ? `أُرسل ${un.length} تذكيرات وحُفظ الجدول التلقائي` : 'تم حفظ التذكير التلقائي');
  };
  const ck = (k, t, s) => `<label class="tog"><input type="checkbox" name="${k}" ${a[k] ? 'checked' : ''}><span><b>${t}</b><small>${s}</small></span></label>`;
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>التذكير التلقائي</h2><p class="mut" style="margin:0">يرسل سكن التذكيرات بنفسه على واتساب، فلا تحتاج لملاحقة أحد.</p>
    <div class="togs">${ck('before', 'قبل الاستحقاق بـ 3 أيام', 'رسالة لطيفة مع رابط الدفع')}${ck('due', 'يوم الاستحقاق', 'تذكير صباحي الساعة 9')}${ck('after', 'بعد التأخر بـ 3 أيام', 'تذكير أوضح مع إشعار لك')}${ck('lina', 'مكالمة من لينا بعد 7 أيام تأخير', 'لينا تتصل بالمستأجر وتسجل موعد الدفع')}</div>
    <label class="chk"><input type="checkbox" name="now" checked> أرسل الآن أيضًا إلى <span class="num">${un.length}</span> لم يدفعوا</label>
    <div class="acts"><button class="btn" type="submit">حفظ وإرسال</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}

/* ================= Announcements ================= */
function annForm(bid) {
  const b = bOf(bid);
  openForm('إعلان لسكان ' + b.name, [
    { key: 'kind', label: 'النوع', type: 'pick', value: 'عام', options: ['عام', 'انقطاع ماء', 'انقطاع كهرباء', 'صيانة', 'أمن وسلامة'].map((x) => ({ value: x, label: x })) },
    { key: 'title', label: 'العنوان', required: true, placeholder: 'مثال: انقطاع الماء يوم الخميس' },
    { key: 'text', label: 'التفاصيل', placeholder: 'الوقت، المدة، وما المطلوب من السكان' }
  ], (v) => {
    db.anns = db.anns || []; db.anns.unshift({ id: uid('a'), bid, kind: v.kind, title: v.title.trim(), text: v.text.trim(), date: 'اليوم' });
    const ts = db.tenants.filter((t) => unitOf(t.unitId)?.buildingId === bid);
    ts.forEach((t) => notify(t.id, `إعلان من الإدارة: ${v.title.trim()}`, '#t-home'));
    toast(`وصل الإعلان إلى ${ts.length} مستأجرًا على واتساب والتطبيق`);
  }, 'إرسال للسكان');
}

/* ================= Tenant pages ================= */
let payMonths = 1;
const monthsAhead = (n) => { const d = new Date(); return Array.from({ length: n }, (_, i) => { const x = new Date(d.getFullYear(), d.getMonth() + i, 1); return `${MONTHS[x.getMonth()]} ${x.getFullYear()}`; }); };
window.EXTRA_PAGES['t-pay'] = () => {
  const t = me(); let html = tPay(); if (!t || t.status === 'paid' || t.status === 'receipt') return html;
  const opts = [1, 2, 3, 6];
  const ms = monthsAhead(payMonths);
  const sel = `<section class="tile" style="margin-bottom:16px"><div class="head" style="margin:0"><h2>كم شهرًا تريد أن تدفع؟</h2><span class="mut" style="font-size:13px">ادفع مقدمًا وارتح من التذكيرات</span></div>
    <div class="seg mseg">${opts.map((n) => `<button type="button" data-pay-months="${n}" class="${payMonths === n ? 'on' : ''}" aria-pressed="${payMonths === n}">${n === 1 ? 'شهر' : n === 2 ? 'شهران' : n + ' أشهر'}</button>`).join('')}</div>
    <div class="paysum"><span>${ms.length > 1 ? `${ms[0]} ← ${ms[ms.length - 1]}` : ms[0]}</span><b><span class="num">${fmt(t.rent * payMonths)}</span> ر.ع.</b></div></section>`;
  return html.replace('<div class="methods">', sel + '<div class="methods">');
};
function cardPayMulti() {
  const t = me(); if (!t) return;
  const n = payMonths, ms = monthsAhead(n);
  sheetSave = () => {
    markPaid(t.id, 'بطاقة (تجريبي)');
    const rs = receiptsOf(t);
    ms.slice(1).forEach((m) => rs.push({ id: uid('r'), month: m, amount: t.rent, date: today(), method: 'بطاقة · دفع مقدم (تجريبي)', status: 'ok' }));
    if (n > 1) { t.paidUntil = ms[n - 1]; t.note = 'مدفوع حتى ' + ms[n - 1]; }
    notify('owner', `${t.name} دفع ${n > 1 ? n + ' أشهر مقدمًا' : 'إيجار ' + CUR} · ${fmt(t.rent * n)} ر.ع.`, '#rent');
    payMonths = 1; location.hash = '#t-receipts';
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>الدفع بالبطاقة</h2>
    <p style="margin:0">في النسخة الحقيقية تفتح هنا صفحة دفع آمنة من بوابة دفع عُمانية، ويصل المبلغ لحساب المالك مباشرة ويُسجَّل الإيصال تلقائيًا.</p>
    <p class="mut" style="margin:0">هذه نسخة تجريبية ولن يتم خصم أي مبلغ.</p>
    <div class="kvs"><div class="kv"><span class="mut">المبلغ</span><b><span class="num">${fmt(t.rent * n)}</span> ر.ع.</b></div><div class="kv"><span class="mut">${n > 1 ? 'الأشهر' : 'الشهر'}</span><b>${n > 1 ? `${ms[0]} ← ${ms[n - 1]}` : ms[0]}</b></div></div>
    <div class="acts"><button class="btn" type="submit">محاكاة دفع ناجح</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function record(t) {
  const rs = receiptsOf(t).filter((r) => r.status === 'ok');
  const c = db.contracts && db.contracts.filter((x) => x.tenantId === t.id).sort((a, b) => a.start.localeCompare(b.start))[0];
  const late = t.status === 'late' ? 1 : 0;
  const onTime = Math.round(((rs.length) / Math.max(1, rs.length + late)) * 100);
  return { since: c ? arDate(c.start) : '—', paid: rs.reduce((a, r) => a + Number(r.amount), 0), months: rs.length, onTime };
}
function recordDoc(t) {
  const r = record(t), score = r.onTime >= 95 ? 'ممتاز' : r.onTime >= 80 ? 'جيد' : 'يحتاج تحسين';
  return `<article class="doc" id="doc"><header><span class="rlogo"><svg class="mark" width="30" height="30" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26"/><path class="cup" d="M28 51a22 22 0 0 0 44 0"/><path class="dot" d="M50 25l8 8-8 8-8-8z"/></svg>سكن</span><span>صدرت ${arDate(iso(new Date()))}</span></header>
    <h2>شهادة سجل إيجار</h2><p style="text-align:center">نشهد بأن <b>${esc(t.name)}</b> مستأجر في ${esc(place(t.unitId))} منذ ${r.since}.</p>
    <div class="kpis"><div><span>الالتزام بالدفع</span><b class="num">${r.onTime}%</b></div><div><span>التقييم</span><b>${score}</b></div><div><span>أشهر مدفوعة عبر سكن</span><b class="num">${r.months}</b></div><div><span>إجمالي المدفوع</span><b><span class="num">${fmt(r.paid)}</span> ر.ع.</b></div></div>
    <p>يمكن للمؤجّر الجديد التحقق من هذه الشهادة برمز التحقق: <b class="num" dir="ltr">SKN-${esc(t.id.toUpperCase().slice(-5))}-${r.months}${r.onTime}</b></p>
    <footer>شهادة تجريبية من سكن · الأرقام أمثلة.</footer></article>`;
}
window.EXTRA_PAGES['t-receipts'] = () => {
  const t = me(); let html = tReceipts(); if (!t) return html;
  const r = record(t);
  const tile = `<section class="tile rec" style="margin-bottom:16px"><div class="tools" style="margin:0"><div><h2>سجل الإيجار</h2><span class="mut" style="font-size:13px">أثبت لأي مالك جديد أنك مستأجر ملتزم.</span></div><button class="btn" data-rec-view>عرض الشهادة</button></div>
    <div class="kvs"><div class="kv"><span class="mut">الالتزام بالدفع</span><b class="num">${r.onTime}%</b></div><div class="kv"><span class="mut">مستأجر منذ</span><b>${r.since}</b></div><div class="kv"><span class="mut">أشهر مدفوعة</span><b class="num">${r.months}</b></div><div class="kv"><span class="mut">إجمالي المدفوع</span><b><span class="num">${fmt(r.paid)}</span> ر.ع.</b></div></div></section>`;
  return html.replace('<div class="receipts">', tile + '<div class="receipts">');
};
window.EXTRA_PAGES['t-contract'] = () => {
  const t = me(); if (!t) return noTenant();
  const c = contractOf(t.id);
  if (!c) return `<div class="tools"><h1>عقدي</h1>${whoSel()}</div><section class="tile empty">لا يوجد عقد مسجّل بعد. سيظهر هنا عندما يرسله المالك.</section>`;
  const d = daysTo(c.end);
  const banner = c.status === 'sent' ? `<section class="tile c t2 alert" style="margin-bottom:16px"><span class="lbl">بانتظار توقيعك</span><span class="val" style="font-size:24px">راجع العقد ووقّعه من هاتفك</span><button class="btn" style="align-self:flex-start" data-c-sign="${c.id}">توقيع العقد</button></section>`
    : `<section class="tile c hero" style="margin-bottom:16px"><span class="lbl">عقد ساري</span><span class="val" style="font-size:24px">ينتهي ${arDate(c.end)}</span><span style="font-weight:600">${d <= 60 ? `باقٍ <span class="num">${d}</span> يومًا · سيرسل لك المالك عرض التجديد هنا` : `باقٍ <span class="num">${d}</span> يومًا`}</span></section>`;
  return `<div class="tools"><h1>عقدي</h1><div class="bars">${whoSel()}<button class="btn soft" data-print-doc>طباعة / حفظ PDF</button></div></div>${banner}<div id="sheetless">${contractDoc(c)}</div>`;
};
function jobCard(j) {
  const n = STEP[j.status];
  const k = j.tech && db.techs && db.techs.find((x) => x.id === j.tech);
  return `<article class="jobrow">${j.photo ? `<img class="thumb" src="${esc(j.photo)}" alt="صورة الطلب">` : ''}<div class="grow">
    <div class="tools" style="margin:0"><b>${esc(j.title)}</b><span class="pill ${j.status === 'done' ? 'ok' : j.status === 'new' ? 'new' : 'due'}">${STEP_TXT[j.status]}</span></div>
    ${j.desc ? `<span style="font-size:14px">${esc(j.desc)}</span>` : ''}
    <span class="mut" style="font-size:12px">${esc([j.cat, j.date, j.urgent ? 'عاجل' : ''].filter(Boolean).join(' · ') || j.from)}</span>
    ${k ? `<span class="techline">${esc(k.name)} · ${esc(k.trade)}${j.visit ? ' · ' + esc(j.visit) : ''}</span>` : ''}
    <div class="steps" aria-hidden="true"><span class="${n >= 1 ? 'on' : ''}"></span><span class="${n >= 2 ? 'on' : ''}"></span><span class="${n >= 3 ? 'on' : ''}"></span></div>
    <div class="steplbl" aria-hidden="true"><span>تم الاستلام</span><span>قيد التنفيذ</span><span>تم الإصلاح</span></div>
    ${j.status === 'done' && document.body.classList.contains('tenant') ? `<div class="rate" role="group" aria-label="قيّم الخدمة"><span class="mut" style="font-size:13px">${j.rating ? 'تقييمك:' : 'كيف كانت الخدمة؟'}</span>${[1, 2, 3, 4, 5].map((i) => `<button type="button" data-rate="${j.id}|${i}" class="${(j.rating || 0) >= i ? 'on' : ''}" aria-label="${i} من 5">★</button>`).join('')}</div>` : ''}
  </div></article>`;
}
window.EXTRA_PAGES['t-home'] = () => {
  const t = me(); let html = tHome(); if (!t) return html;
  const u = unitOf(t.unitId); const anns = (db.anns || []).filter((a) => u && a.bid === u.buildingId).slice(0, 2);
  const c = contractOf(t.id);
  const extra = (c && c.status === 'sent' ? `<section class="tile s2 c t3"><span class="lbl">عقدك بانتظار توقيعك</span><span style="font-weight:600">من ${arDate(c.start)} إلى ${arDate(c.end)} · <span class="num">${fmt(c.rent)}</span> ر.ع. شهريًا</span><a class="btn" style="align-self:flex-start;text-decoration:none" href="#t-contract">مراجعة وتوقيع</a></section>` : '')
    + (anns.length ? `<section class="tile ${c && c.status === 'sent' ? 's2' : 's4'} ann"><div class="head" style="margin:0"><h2>إعلانات المبنى</h2></div>${anns.map((a) => `<div class="annrow"><span class="pill ${/انقطاع/.test(a.kind) ? 'late' : 'new'}">${esc(a.kind)}</span><span class="grow"><b>${esc(a.title)}</b><span style="font-size:13px">${esc(a.text)}</span><small class="mut">${esc(a.date)}</small></span></div>`).join('')}</section>` : '');
  if (t.paidUntil) html = html.replace('تم الدفع. شكرًا لك.', `تم الدفع. مدفوع مقدمًا حتى ${esc(t.paidUntil)}.`);
  return html.replace('<section class="tile s4">', extra + '<section class="tile s4">');
};
function afterRender2() { updateBell(); }

/* ================= Click handlers (round 3) ================= */
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.remind) { e.stopImmediatePropagation(); remindSheet(d.remind); }
  else if ('remindAll' in d) { e.stopImmediatePropagation(); remindAllSheet(); }
  else if ('card' in d) { e.stopImmediatePropagation(); cardPayMulti(); }
  else if ('transfer' in d) { e.stopImmediatePropagation(); uploadTransfer(); const f = $('#f-amount'); if (f) f.value = (me().rent * payMonths); }
}, true);
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if ('bell' in d) openBell();
  else if (d.noteGo) { const x = db.notes.find((n) => n.id === d.noteGo); if (x) { x.read = true; persist(); closeSheet(); updateBell(); if (x.link && location.hash !== x.link) location.hash = x.link; } }
  else if ('noteAll' in d) { myNotes().forEach((x) => { x.read = true; }); persist(); updateBell(); openBell(); }
  else if (d.ann) annForm(d.ann);
  else if (d.payMonths) { payMonths = Number(d.payMonths); render(); }
  else if ('recView' in d) { const t = me(); sheetSave = null; $('#sheet').innerHTML = `<div class="panel pop wide" role="dialog" aria-modal="true" aria-label="شهادة سجل إيجار">${recordDoc(t)}<div class="bars"><button class="btn" data-print-doc>طباعة / حفظ PDF</button><a class="btn soft" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`شهادة سجل إيجار من سكن · ${t.name} · الالتزام بالدفع ${record(t).onTime}% · رمز التحقق SKN-${t.id.toUpperCase().slice(-5)}`)}">مشاركة عبر واتساب</a><button class="btn soft" data-close>إغلاق</button></div></div>`; $('#sheet').hidden = false; }
  else if (d.rate) { const [jid, n] = d.rate.split('|'); const j = db.jobs.find((x) => x.id === jid); if (j) { j.rating = Number(n); persist(); toast('شكرًا لتقييمك'); render(); } }
});

render();
