// Sakan owner app. Sample data, saved only in this browser.
const STORE = 'sakan-data-v2';
const STATUS = {
  paid: { cls: 'ok', text: 'دُفع' },
  due: { cls: 'due', text: 'مستحق' },
  receipt: { cls: 'due', text: 'إيصال للمراجعة' },
  late: { cls: 'late', text: 'متأخر' }
};
const TONES = ['hero', 't2', 't3', 'b4'];
const svg = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  add: svg('<circle cx="10" cy="8" r="4"></circle><path d="M3 21c0-4 3-6 7-6s7 2 7 6"></path><path d="M19 8v6M16 11h6"></path>'),
  bell: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"></path><path d="M10 21h4"></path>'),
  grid: svg('<rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect>'),
  back: svg('<path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path>')
};
const TAB_ORDER = ['all', 'paid', 'unpaid', 'late'];
let prevTab = 'all';
let openUnitId = null;

function seed() {
  const blds = [
    { id: 'b1', name: 'برج الخوير', area: 'الخوير', kind: 'شقة', count: 18, rent: 340, vacant: [6] },
    { id: 'b2', name: 'سكن القرم', area: 'القرم', kind: 'شقة', count: 12, rent: 390, vacant: [11, 12] },
    { id: 'b3', name: 'فلل بوشر', area: 'بوشر', kind: 'فيلا', count: 8, rent: 620, vacant: [8] },
    { id: 'b4', name: 'لوفتات الموج', area: 'الموج', kind: 'لوفت', count: 10, rent: 460, vacant: [9, 10] }
  ];
  const named = {
    'b1-4': ['حامد البلوشي', 380, '28 أكتوبر', 'late', 'متأخر 12 يومًا'],
    'b2-7': ['بريا ناير', 420, '1 نوفمبر', 'late', 'متأخر 8 أيام'],
    'b3-3': ['يوسف الرواحي', 650, '4 نوفمبر', 'late', 'متأخر 5 أيام'],
    'b1-15': ['أحمد خان', 300, '5 نوفمبر', 'receipt', 'إيصال للمراجعة'],
    'b4-2': ['مريم الهنائية', 450, '11 نوفمبر', 'due', 'يستحق بعد يومين'],
    'b1-2': ['خالد المعمري', 340, '1 نوفمبر', 'paid', 'دُفع 1 نوفمبر'],
    'b2-1': ['فاطمة السعدية', 390, '1 نوفمبر', 'paid', 'دُفع 31 أكتوبر'],
    'b4-4': ['جيمس كارتر', 480, '3 نوفمبر', 'paid', 'دُفع 2 نوفمبر'],
    'b1-9': ['سيف الكندي', 320, '1 نوفمبر', 'paid', 'دُفع 1 نوفمبر'],
    'b3-1': ['نورة اللواتية', 600, '1 نوفمبر', 'paid', 'دُفع 30 أكتوبر'],
    'b1-12': ['راهول ميهتا', 320, '1 نوفمبر', 'paid', 'دُفع 1 نوفمبر'],
    'b2-5': ['سالمة الحبسية', 360, '1 نوفمبر', 'paid', 'دُفع 2 نوفمبر']
  };
  const first = ['محمد', 'سعيد', 'علي', 'عبدالله', 'ناصر', 'هلال', 'سلطان', 'بدر', 'خلفان', 'ماجد', 'حمد', 'طلال', 'مازن', 'زاهر', 'وليد'];
  const last = ['الشكيلي', 'العامري', 'الهاشمي', 'الفارسي', 'الريامي', 'الشحي', 'المقبالي', 'البوسعيدي', 'الغافري', 'الحوسني'];
  const buildings = [], units = [], tenants = [];
  let g = 0;
  blds.forEach((b) => {
    buildings.push({ id: b.id, name: b.name, area: b.area, kind: b.kind });
    for (let n = 1; n <= b.count; n++) {
      const uid = `${b.id}-${n}`;
      const unit = { id: uid, buildingId: b.id, label: `${b.kind} ${n}`, rent: b.rent + ((n * 7) % 5) * 10, tenantId: null };
      units.push(unit);
      if (b.vacant.includes(n)) continue;
      const tid = 't' + uid;
      const x = named[uid];
      if (x) tenants.push({ id: tid, unitId: uid, name: x[0], phone: '', rent: x[1], due: x[2], status: x[3], note: x[4] });
      else { tenants.push({ id: tid, unitId: uid, name: `${first[g % 15]} ${last[(g * 7) % 10]}`, phone: '', rent: unit.rent, due: '1 نوفمبر', status: 'paid', note: 'دُفع 1 نوفمبر' }); g++; }
      unit.tenantId = tid;
    }
  });
  const jobs = [
    { id: 'j1', title: 'المكيف لا يبرد', unitId: 'b1-12', from: 'عبر الهاتف · سجّلته لينا', status: 'new' },
    { id: 'j2', title: 'تسرّب ماء تحت مغسلة المطبخ', unitId: 'b2-3', from: 'في التطبيق · صورتان', status: 'new' },
    { id: 'j3', title: 'إزعاج من الشقة العلوية', unitId: 'b4-1', from: 'واتساب', status: 'new' },
    { id: 'j4', title: 'ريموت بوابة المواقف لا يعمل', unitId: 'b4-6', from: 'راشد · اليوم 4–6 م', status: 'progress' },
    { id: 'j5', title: 'المصعد يتوقف بين الطوابق', unitId: 'b1-1', from: 'شركة المصاعد · الأربعاء', status: 'progress' },
    { id: 'j6', title: 'إضاءة الحمام تومض', unitId: 'b3-5', from: 'التكلفة 12 ر.ع.', status: 'done' }
  ];
  return { buildings, units, tenants, jobs };
}

let db;
try { db = JSON.parse(localStorage.getItem(STORE)) || seed(); } catch (e) { db = seed(); }
function persist() { try { localStorage.setItem(STORE, JSON.stringify(db)); return true; } catch (e) { return false; } }
function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
let alertAt = 90;
try { alertAt = Number(localStorage.getItem('sakan-alert')) || 90; } catch (e) {}

let rentFilter = 'all';
let selUnit = null;
const $ = (s, r = document) => r.querySelector(s);
const fmt = (n) => Number(n).toLocaleString('en-US');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const unitOf = (id) => db.units.find((u) => u.id === id);
const bOf = (id) => db.buildings.find((b) => b.id === id);
const tOf = (id) => db.tenants.find((t) => t.id === id);
const place = (unitId) => { const u = unitOf(unitId); if (!u) return '—'; const b = bOf(u.buildingId); return `${b ? b.name : ''} · ${u.label}`; };
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2000); }
const pill = (t) => `<span class="pill ${STATUS[t.status].cls}">${esc(t.note || STATUS[t.status].text)}</span>`;

function totals(list = db.tenants) {
  const expected = list.reduce((a, t) => a + Number(t.rent), 0);
  const collected = list.filter((t) => t.status === 'paid').reduce((a, t) => a + Number(t.rent), 0);
  const unpaid = list.filter((t) => t.status !== 'paid');
  return { expected, collected, pct: expected ? Math.round((collected / expected) * 100) : 0, unpaid, late: unpaid.filter((t) => t.status === 'late').length };
}

/* ---------- Black and green picker (replaces native selects for type and area) ---------- */
function picker(name, items, cur, opts = {}) {
  const list = items.map((x) => (Array.isArray(x) ? x : [x, x]));
  const now = list.find(([v]) => String(v) === String(cur)) || list[0];
  const attrs = opts.mf ? `data-mf="${opts.mf}"` : `name="${name}"`;
  return `<div class="pick" data-pick>
    <input type="hidden" ${attrs} value="${esc(now[0])}">
    <button type="button" class="pickbtn" ${opts.id ? `id="${opts.id}"` : ''} aria-haspopup="listbox" aria-expanded="false"><span class="pv">${esc(now[1])}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
    <div class="picklist" role="listbox" hidden>${list.length > 8 ? '<input class="pickq" type="search" placeholder="ابحث…" aria-label="ابحث في القائمة">' : ''}${list.map(([v, t]) => `<button type="button" role="option" data-pv="${esc(v)}" aria-selected="${String(v) === String(now[0])}" class="${String(v) === String(now[0]) ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>
  </div>`;
}
function closePickers(except) { document.querySelectorAll('.pick.open').forEach((p) => { if (p !== except) { p.classList.remove('open'); p.querySelector('.picklist').hidden = true; p.querySelector('.pickbtn').setAttribute('aria-expanded', 'false'); } }); }
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.pickbtn'), opt = e.target.closest('.picklist [data-pv]');
  if (btn) {
    const p = btn.closest('.pick'), open = !p.classList.contains('open'); closePickers(p);
    p.classList.toggle('open', open); p.querySelector('.picklist').hidden = !open; btn.setAttribute('aria-expanded', open);
    if (open) { const on = p.querySelector('.picklist .on'); const q = p.querySelector('.pickq'); if (q) { q.value = ''; q.dispatchEvent(new Event('input')); q.focus(); } else if (on) on.focus(); if (on) on.scrollIntoView({ block: 'nearest' }); }
    return;
  }
  if (opt) {
    const p = opt.closest('.pick'), inp = p.querySelector('input[type=hidden]');
    p.querySelectorAll('[data-pv]').forEach((o) => { o.classList.toggle('on', o === opt); o.setAttribute('aria-selected', o === opt); });
    p.querySelector('.pv').textContent = opt.textContent; inp.value = opt.dataset.pv;
    closePickers(); p.querySelector('.pickbtn').focus();
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  if (!e.target.closest('.pick')) closePickers();
}, true);
document.addEventListener('input', (e) => {
  if (!e.target.classList.contains('pickq')) return;
  const q = norm(e.target.value);
  e.target.closest('.picklist').querySelectorAll('[data-pv]').forEach((o) => { o.hidden = !!q && !norm(o.textContent + ' ' + (AREA_EN[o.dataset.pv] || '')).includes(q); });
});
document.addEventListener('keydown', (e) => {
  const p = e.target.closest && e.target.closest('.pick.open'); if (!p) return;
  const opts = [...p.querySelectorAll('[data-pv]:not([hidden])')]; const i = opts.indexOf(document.activeElement);
  if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); closePickers(); p.querySelector('.pickbtn').focus(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); (opts[i + 1] || opts[0])?.focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1])?.focus(); }
  else if (e.key === 'Enter' && e.target.classList.contains('pickq')) { e.preventDefault(); opts[0]?.click(); }
}, true);

/* ---------- Sheet (form / confirm) ---------- */
let sheetSave = null;
function openForm(title, fields, onSave, saveText = 'حفظ') {
  sheetSave = onSave;
  const f = fields.map((x) => {
    const id = 'f-' + x.key;
    if (x.type === 'pick') return `<label>${x.label}${picker(x.key, x.options.map((o) => [o.value, o.label]), x.value)}</label>`;
    if (x.type === 'select') return `<label for="${id}">${x.label}<select id="${id}" name="${x.key}">${x.options.map((o) => `<option value="${esc(o.value)}" ${o.value === x.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select></label>`;
    return `<label for="${id}">${x.label}<input id="${id}" name="${x.key}" type="${x.type || 'text'}" value="${esc(x.value ?? '')}" ${x.required ? 'required' : ''} ${x.type === 'number' ? 'min="0"' : ''} placeholder="${esc(x.placeholder || '')}"></label>`;
  }).join('');
  $('#sheet').innerHTML = `<form class="panel" id="sheetForm"><h2>${esc(title)}</h2>${f}<div class="acts"><button class="btn" type="submit">${saveText}</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
  const first = $('#sheet input, #sheet select'); if (first) first.focus();
}
function confirmBox(msg, onYes, yes = 'حذف') {
  sheetSave = onYes;
  $('#sheet').innerHTML = `<form class="panel" id="sheetForm"><h2>${esc(msg)}</h2><p class="mut" style="margin:0">لا يمكن التراجع عن هذا.</p><div class="acts"><button class="btn danger" type="submit">${yes}</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function closeSheet() { $('#sheet').hidden = true; $('#sheet').innerHTML = ''; sheetSave = null; }

function openUnit(id) {
  const u = unitOf(id); if (!u) return;
  openUnitId = id; sheetSave = null;
  const b = bOf(u.buildingId);
  const tn = u.tenantId && tOf(u.tenantId);
  const jobs = db.jobs.filter((j) => j.unitId === id && j.status !== 'done');
  const info = (k, v) => `<div class="kv"><span class="mut">${k}</span><b>${v}</b></div>`;
  const body = tn
    ? `<div class="tools" style="margin:0"><div><span class="mut">${esc(b.name)} · ${esc(u.label)}</span><h2 style="font-size:22px">${esc(tn.name)}</h2></div>${pill(tn)}</div>
       <div class="kvs">${info('الهاتف', `<span class="num" dir="ltr">${esc(tn.phone || 'غير مضاف')}</span>`)}${info('الإيجار الشهري', `<span class="num">${fmt(tn.rent)}</span> ر.ع.`)}${info('الاستحقاق', esc(tn.due))}${info('حالة الدفع', esc(STATUS[tn.status].text))}</div>
       <div><span class="mut" style="font-size:13px">طلبات الصيانة المفتوحة</span>${jobs.length ? jobs.map((j) => `<div class="row" style="padding:8px 0">${esc(j.title)}</div>`).join('') : '<p style="margin:4px 0 0">لا توجد</p>'}</div>
       <div class="bars">${tn.status !== 'paid' ? `<button class="btn" data-pay="${tn.id}">تم الدفع</button><button class="btn soft" data-remind="${tn.id}">تذكير</button>` : ''}<button class="btn soft" data-edit="${tn.id}">تعديل البيانات</button><button class="btn danger" data-del="${tn.id}">إخلاء الوحدة</button><button class="btn soft" data-close>إغلاق</button></div>`
    : `<div><span class="mut">${esc(b.name)} · ${esc(kindOf(u))}</span><h2 style="font-size:22px">${esc(u.label)} · شاغرة</h2></div>
       <div class="kvs">${info('الإيجار المتوقع', `<span class="num">${fmt(u.rent)}</span> ر.ع.`)}${info('الحالة', 'جاهزة للتأجير')}</div>
       <div class="bars"><button class="btn" data-add-tenant="${u.id}">إضافة مستأجر</button>${(() => { const l = mkt.listings.find((x) => x.unitId === u.id && x.status !== 'rented'); return l ? `<button class="btn soft" data-mk-open="${l.id}">عرض إعلانها في السوق</button>` : `<button class="btn soft" data-mk-unit="${u.id}">انشر في السوق</button>`; })()}<button class="btn soft" data-edit-unit="${u.id}">تعديل الوحدة</button><button class="btn danger" data-del-unit="${u.id}">حذف الوحدة</button><button class="btn soft" data-close>إغلاق</button></div>`;
  $('#sheet').innerHTML = `<div class="panel pop" role="dialog" aria-modal="true" aria-label="${esc(u.label)}"><img class="shead" src="${unitArt(u)}" alt="${esc(kindOf(u))}">${body}</div>`;
  $('#sheet').hidden = false;
}

function moveIndicator() {
  const box = $('.segtabs'); if (!box) return;
  const ind = $('.ind', box);
  const at = (k) => box.querySelector(`[data-filter="${k}"]`);
  const place = (el) => { ind.style.left = el.offsetLeft + 'px'; ind.style.width = el.offsetWidth + 'px'; };
  const from = at(prevTab) || at(rentFilter), to = at(rentFilter);
  ind.style.transition = 'none'; place(from); void ind.offsetWidth; ind.style.transition = '';
  requestAnimationFrame(() => place(to));
  prevTab = rentFilter;
}

const vacantOptions = () => db.units.filter((u) => !u.tenantId).map((u) => ({ value: u.id, label: place(u.id) }));
function addTenant(unitId, pre = {}) {
  const opts = vacantOptions();
  if (!opts.length) { toast('لا توجد وحدات شاغرة. أضف وحدة من صفحة المباني.'); return; }
  const u = unitOf(unitId || opts[0].value);
  openForm(pre.title || 'إضافة مستأجر', [
    { key: 'name', label: 'الاسم', required: true, value: pre.name || '' },
    { key: 'phone', label: 'رقم الهاتف', type: 'tel', placeholder: '+968', value: pre.phone || '' },
    { key: 'unitId', label: 'الوحدة', type: 'select', options: opts, value: u.id },
    { key: 'rent', label: 'الإيجار الشهري (ر.ع.)', type: 'number', value: pre.rent || u.rent, required: true },
    { key: 'due', label: 'تاريخ الاستحقاق', value: '1 ديسمبر' }
  ], (v) => {
    const t = { id: uid('t'), unitId: v.unitId, name: v.name.trim(), phone: v.phone.trim(), rent: Number(v.rent), due: v.due, status: 'due', note: 'مستحق', receipts: [] };
    db.tenants.push(t); unitOf(v.unitId).tenantId = t.id; toast('تمت إضافة ' + t.name);
    mkt.listings.forEach((l) => { if (l.unitId === v.unitId && l.status !== 'rented') l.status = 'rented'; });
    if (pre.onDone) pre.onDone(t);
    persistM();
    if (typeof onTenantAdded === 'function') onTenantAdded(t);
  });
}
function editTenant(id) {
  const t = tOf(id);
  openForm('تعديل بيانات المستأجر', [
    { key: 'name', label: 'الاسم', value: t.name, required: true },
    { key: 'phone', label: 'رقم الهاتف', type: 'tel', value: t.phone, placeholder: '+968' },
    { key: 'rent', label: 'الإيجار الشهري (ر.ع.)', type: 'number', value: t.rent, required: true },
    { key: 'due', label: 'تاريخ الاستحقاق', value: t.due },
    { key: 'status', label: 'حالة الدفع', type: 'select', value: t.status, options: Object.entries(STATUS).map(([k, s]) => ({ value: k, label: s.text })) }
  ], (v) => {
    Object.assign(t, { name: v.name.trim(), phone: v.phone.trim(), rent: Number(v.rent), due: v.due });
    if (v.status !== t.status) { t.status = v.status; t.note = STATUS[v.status].text; }
    toast('تم حفظ التعديلات');
  });
}
function removeTenant(id) {
  const t = tOf(id);
  confirmBox(`إخلاء ${t.name} من ${place(t.unitId)}؟`, () => {
    const u = unitOf(t.unitId); if (u) u.tenantId = null;
    db.tenants = db.tenants.filter((x) => x.id !== id); toast('أصبحت الوحدة شاغرة');
  }, 'إخلاء وحذف');
}
function markPaid(id, method = 'سجّله المالك') {
  const t = tOf(id); const rs = receiptsOf(t);
  const r = rs.find((x) => x.month === CUR);
  if (r) r.status = 'ok'; else rs.push({ id: uid('r'), month: CUR, amount: t.rent, date: today(), method, status: 'ok' });
  t.status = 'paid'; t.note = 'دُفع ' + today(); toast('تم تسجيل دفع ' + t.name);
}

/* ---------- Pages ---------- */
function overview() {
  const t = totals();
  const filled = Math.round(t.pct / 10);
  const blocks = Array.from({ length: 10 }, (_, i) => `<span style="opacity:${i < filled ? 1 : .2}"></span>`).join('');
  const rows = t.unpaid.slice(0, 4).map((x) => `<div class="row"><span class="grow"><b>${esc(x.name)}</b> <span class="mut">· ${esc(place(x.unitId))}</span></span><span><span class="num">${fmt(x.rent)}</span> ر.ع.</span>${pill(x)}</div>`).join('');
  const vac = db.units.filter((u) => !u.tenantId);
  const rented = db.units.length - vac.length;
  const newest = db.jobs.find((j) => j.status === 'new');
  const open = db.jobs.filter((j) => j.status !== 'done');
  return `<div class="grid">
    <section class="tile s2" style="justify-content:center">
      <span class="mut">نوفمبر 2026 · ${db.buildings.length} مبانٍ</span>
      <h1>مساء الخير يا سالم</h1>
      <span class="mut">${t.unpaid.length} مستأجرين لم يدفعوا بعد، و${open.length} طلبات صيانة مفتوحة.</span>
    </section>
    <section class="tile c hero s2 r2${t.pct < alertAt ? ' alert' : ''}">
      <span class="lbl">الإيجار المحصّل · نوفمبر${t.pct < alertAt ? ` <span class="flag">التحصيل منخفض · أقل من ${alertAt}%</span>` : ''}</span>
      <div><div class="big">${t.pct}%</div><div style="font-size:20px;font-weight:600"><span class="num">${fmt(t.collected)}</span> من <span class="num">${fmt(t.expected)}</span> ر.ع.</div></div>
      <div class="blocks" aria-hidden="true">${blocks}</div>
    </section>
    <section class="tile c t2"><span class="lbl">غير مدفوع</span><span class="val"><span class="num">${fmt(t.expected - t.collected)}</span> ر.ع.</span><span style="font-size:13px;font-weight:600">${t.late} متأخر · ${t.unpaid.length - t.late} قريبًا</span></section>
    <section class="tile c t3"><span class="lbl">طلبات مفتوحة</span><span class="val num">${open.length}</span><span style="font-size:13px;font-weight:600">${db.jobs.filter((j) => j.status === 'new').length} جديدة</span></section>
    <section class="tile s2"><div class="head" style="margin:0"><h2>من لم يدفع</h2><a href="#rent">كل الإيجارات</a></div>${rows || '<p class="mut">الكل دفع هذا الشهر.</p>'}</section>
    <section class="tile gray"><span class="lbl">الوحدات المؤجرة</span><span class="val num" dir="ltr" style="text-align:right">${rented} / ${db.units.length}</span>
      <span style="font-size:13px;font-weight:600">${vac.length} شاغرة:</span>
      <div class="chips">${vac.slice(0, 8).map((u) => `<a class="chip" href="#building-${u.buildingId}" style="color:inherit;text-decoration:none">${esc(place(u.id))}</a>`).join('')}${vac.length > 8 ? `<span class="chip">+${vac.length - 8}</span>` : ''}${vac.length ? '' : '<span class="chip">لا توجد</span>'}</div></section>
    <section class="tile t4"><span style="opacity:.8">آخر طلب</span>${newest ? `<b>${esc(newest.title)}</b><span style="opacity:.8;font-size:13px">${esc(place(newest.unitId))}</span><a href="#maintenance" style="color:inherit;font-weight:600">فتح الصيانة</a>` : '<b>لا توجد طلبات جديدة</b>'}</section>
  </div>${typeof ownerExtras === 'function' ? ownerExtras() : ''}`;
}

function rent() {
  const t = totals();
  const list = db.tenants.filter((x) => rentFilter === 'all' || (rentFilter === 'unpaid' ? x.status !== 'paid' : x.status === rentFilter))
    .sort((a, b) => (a.status === 'paid') - (b.status === 'paid'));
  const count = (s) => db.tenants.filter((x) => (s === 'unpaid' ? x.status !== 'paid' : x.status === s)).length;
  const tab = (k, n) => `<button type="button" role="tab" data-filter="${k}" class="${rentFilter === k ? 'on' : ''}" aria-selected="${rentFilter === k}">${n}</button>`;
  const rows = list.map((x) => {
    const pay = x.status === 'paid' ? '' : `<button class="btn small" data-pay="${x.id}">${x.status === 'receipt' ? 'تأكيد الدفع' : 'تم الدفع'}</button> <button class="btn soft small" data-remind="${x.id}">تذكير</button>`;
    const rv = x.status === 'receipt' && reviewReceipt(x);
    const view = rv && rv.img ? ` <button class="btn soft small" data-view-rc="${rv.id}">عرض الإيصال</button>` : '';
    return `<tr><td data-label="المستأجر"><span class="v"><b>${esc(x.name)}</b></span></td><td data-label="الوحدة" class="mut"><span class="v">${esc(place(x.unitId))}</span></td><td data-label="الإيجار"><span class="v"><span class="num">${fmt(x.rent)}</span> ر.ع.</span></td><td data-label="الاستحقاق"><span class="v">${esc(x.due)}</span></td><td data-label="الحالة"><span class="v">${pill(x)}</span></td><td class="rowacts">${pay}${view} <button class="btn soft small" data-edit="${x.id}">تعديل</button> <button class="btn danger small" data-del="${x.id}">حذف</button></td></tr>`;
  }).join('');
  return `<div class="tools">
      <div class="segtabs" role="tablist" aria-label="تصفية المستأجرين"><span class="ind" aria-hidden="true"></span>${tab('all', 'الكل <span class="num">' + db.tenants.length + '</span>')}${tab('paid', 'دفع <span class="num">' + count('paid') + '</span>')}${tab('unpaid', 'لم يدفع <span class="num">' + count('unpaid') + '</span>')}${tab('late', 'متأخر <span class="num">' + count('late') + '</span>')}</div>
      <div class="acts">
        <button class="act main" data-add-tenant><span class="ico" aria-hidden="true">${ICON.add}</span><span><b>إضافة مستأجر</b><small>في وحدة شاغرة</small></span></button>
        <button class="act" data-remind-all><span class="ico" aria-hidden="true">${ICON.bell}</span><span><b>تذكير الجميع</b><small><span class="num">${t.unpaid.length}</span> لم يدفعوا</small></span></button>
        <a class="act" href="#buildings"><span class="ico" aria-hidden="true">${ICON.grid}</span><span><b>إدارة الوحدات</b><small>المباني والوحدات</small></span></a>
      </div>
    </div>
    <div class="grid" style="grid-auto-rows:auto;margin-bottom:16px">
      <section class="tile c hero s2" style="min-height:120px"><span class="lbl">المحصّل</span><span class="val"><span class="num">${fmt(t.collected)}</span> ر.ع.</span></section>
      <section class="tile c t2 s2" style="min-height:120px"><span class="lbl">غير مدفوع</span><span class="val"><span class="num">${fmt(t.expected - t.collected)}</span> ر.ع.</span></section>
    </div>
    <section class="tile"><div class="tbl fade"><table><thead><tr><th>المستأجر</th><th>الوحدة</th><th>الإيجار</th><th>الاستحقاق</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>${rows || '<tr><td colspan="6" class="mut">لا يوجد مستأجرون هنا.</td></tr>'}</tbody></table></div></section>`;
}

function buildings() {
  const cards = db.buildings.map((b, i) => {
    const us = db.units.filter((u) => u.buildingId === b.id);
    const ts = db.tenants.filter((t) => unitOf(t.unitId)?.buildingId === b.id);
    const t = totals(ts);
    const rented = us.filter((u) => u.tenantId).length;
    return `<a class="tile c ${TONES[i % 4]}" href="#building-${b.id}">
      <img class="bimg" src="${bldArt(b)}" alt="" loading="lazy">
      <span class="lbl">${esc(b.area)} · ${esc(b.kind)}</span>
      <span style="font-family:var(--display);font-size:26px;line-height:1.7">${esc(b.name)}</span>
      <span style="font-weight:600"><span class="num">${rented}</span> من <span class="num">${us.length}</span> مؤجرة · <span class="num">${us.length - rented}</span> شاغرة</span>
      <div class="bar" aria-hidden="true"><i style="width:${us.length ? Math.round((rented / us.length) * 100) : 0}%"></i></div>
      <span style="font-size:13px;font-weight:600">تم تحصيل <span class="num">${fmt(t.collected)}</span> من <span class="num">${fmt(t.expected)}</span> ر.ع. · ${t.unpaid.length} لم يدفع</span>
    </a>`;
  }).join('');
  return `<div class="tools"><h1>المباني</h1><button class="btn" data-add-building>إضافة مبنى</button></div><div class="bgrid">${cards || '<p class="mut">لا توجد مبانٍ بعد. أضف أول مبنى.</p>'}</div>`;
}

function building(id) {
  const b = bOf(id);
  if (!b) return `<p class="mut">لم يتم العثور على هذا المبنى. <a href="#buildings">رجوع للمباني</a></p>`;
  const us = db.units.filter((u) => u.buildingId === id);
  const ts = db.tenants.filter((t) => unitOf(t.unitId)?.buildingId === id);
  const t = totals(ts);
  const rented = us.filter((u) => u.tenantId).length;
  const tone = TONES[db.buildings.indexOf(b) % 4];
  const cards = us.map((u) => {
    const tn = u.tenantId && tOf(u.tenantId);
    const sel = selUnit === u.id ? ' sel' : '';
    return tn
      ? `<button type="button" class="unit${sel}" data-unit="${u.id}" aria-pressed="${!!sel}"><img class="uimg" src="${unitArt(u)}" alt=""><b>${esc(u.label)}</b><span>${esc(tn.name)}</span><span class="mut" style="font-size:13px"><span class="num">${fmt(tn.rent)}</span> ر.ع.</span>${pill(tn)}</button>`
      : `<button type="button" class="unit vacant${sel}" data-unit="${u.id}" aria-pressed="${!!sel}"><img class="uimg" src="${unitArt(u)}" alt=""><b>${esc(u.label)}</b><span class="mut">شاغرة</span><span class="mut" style="font-size:13px"><span class="num">${fmt(u.rent)}</span> ر.ع. متوقع</span></button>`;
  }).join('');
  const detail = '';
  return `<div class="tools"><a class="back" href="#buildings"><span class="ico" aria-hidden="true">${ICON.back}</span>كل المباني</a><div class="bars"><button class="btn" data-add-unit="${id}">إضافة وحدة</button><button class="btn soft" data-ann="${id}">إعلان للسكان</button><button class="btn soft" data-edit-building="${id}">تعديل المبنى</button><button class="btn danger" data-del-building="${id}">حذف المبنى</button></div></div>
    <div class="grid" style="grid-auto-rows:auto;margin-bottom:16px">
      <section class="tile c ${tone} s2"><span class="lbl">${esc(b.area)}</span><span style="font-family:var(--display);font-size:28px;line-height:1.7">${esc(b.name)}</span><span style="font-weight:600"><span class="num">${rented}</span> من <span class="num">${us.length}</span> مؤجرة</span></section>
      <section class="tile"><span class="mut">المحصّل</span><span class="val"><span class="num">${fmt(t.collected)}</span> ر.ع.</span><span class="mut">من <span class="num">${fmt(t.expected)}</span></span></section>
      <section class="tile gray"><span class="lbl">شاغرة</span><span class="val num">${us.length - rented}</span><span style="font-size:13px">${t.unpaid.length} مستأجر لم يدفع</span></section>
    </div>
    ${detail}
    <p class="mut" style="margin:0 0 10px">اضغط على أي وحدة لعرض التفاصيل.</p>
    <div class="ugrid">${cards || '<p class="mut">لا توجد وحدات. أضف وحدة.</p>'}</div>`;
}

const NEXT = { new: 'progress', progress: 'done' };
const NEXT_LABEL = { new: 'بدء العمل', progress: 'تم الإصلاح' };
function maintenance() {
  const col = (s, title) => {
    const list = db.jobs.filter((j) => j.status === s);
    return `<section class="tile"><div class="head" style="margin:0"><h2>${title}</h2><span class="pill ${s === 'done' ? 'ok' : s === 'new' ? 'new' : 'due'}">${list.length}</span></div>
      ${list.map((j) => `<article class="job">${j.photo ? `<img class="thumb" style="width:100%;height:150px" src="${esc(j.photo)}" alt="صورة من المستأجر">` : ''}<b>${esc(j.title)}${j.urgent ? ' <span class="pill late">عاجل</span>' : ''}</b>${j.desc ? `<span style="font-size:14px">${esc(j.desc)}</span>` : ''}<span class="mut" style="font-size:13px">${esc(place(j.unitId))}</span><span class="mut" style="font-size:13px">${esc(j.from)}</span>${j.tech && db.techs ? `<span class="techline">${svgI('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4z"/>', 15)} ${esc((db.techs.find((k) => k.id === j.tech) || {}).name || '')}${j.visit ? ' · ' + esc(j.visit) : ''}</span>` : ''}<div class="bars">${NEXT[s] ? `<button class="btn" data-move="${j.id}">${NEXT_LABEL[s]}</button>` : ''}${s !== 'done' && !j.tech ? `<button class="btn soft" data-tech="${j.id}">إسناد لفني</button>` : ''}</div></article>`).join('') || '<p class="mut">لا شيء هنا.</p>'}</section>`;
  };
  return `<div class="tools"><h1>طلبات المستأجرين</h1></div><div class="cols">${col('new', 'جديد')}${col('progress', 'قيد التنفيذ')}${col('done', 'تم الإصلاح')}</div>`;
}

function prefs() {
  const st = document.documentElement.dataset.style, th = document.documentElement.dataset.mode;
  const opt = (k, name, desc, colors) => `<button type="button" class="tile opt ${st === k ? 'on' : ''}" data-set-style="${k}" aria-pressed="${st === k}"><b style="font-size:17px">${name}</b><span class="mut">${desc}</span><span class="sw">${colors.map((c) => `<span style="background:${c}"></span>`).join('')}</span></button>`;
  return `<div class="tools"><h1>الإعدادات</h1></div>
  <section class="tile" style="margin-bottom:16px"><h2>النمط</h2>
    <div class="choice">${opt('vivid', 'ملوّن', 'مربعات زجاجية بألوان زاهية وقائمة جانبية.', ['#C6F36B', '#2DD4BF', '#60A5FA'])}${opt('omani', 'عُماني', 'ألوان الرمل والأخضر والطيني وقائمة علوية.', ['#34503F', '#B4532A', '#CDBE9E'])}</div></section>
  <section class="tile" style="margin-bottom:16px"><h2>المظهر</h2>
    <div class="seg" style="max-width:260px"><button type="button" data-set-theme="light" class="${th === 'light' ? 'on' : ''}">فاتح</button><button type="button" data-set-theme="dark" class="${th === 'dark' ? 'on' : ''}">داكن</button></div></section>
  <section class="tile" style="margin-bottom:16px"><h2>تنبيه التحصيل</h2><p class="mut" style="margin:0">يتحوّل مربع «الإيجار المحصّل» في النظرة العامة إلى الأحمر عندما تقل نسبة التحصيل عن:</p>
    <div class="seg" style="max-width:340px">${[70, 80, 90, 95].map((n) => `<button type="button" data-set-alert="${n}" class="${alertAt === n ? 'on' : ''}"><span class="num">${n}</span>%</button>`).join('')}</div></section>
  <section class="tile" style="margin-bottom:16px"><h2>بوابة المستأجر</h2><p class="mut" style="margin:0">شاهد التطبيق كما يراه المستأجر: الدفع، رفع الإيصال، وطلبات الصيانة مع الصور. كل ما يرسله يظهر عندك هنا.</p><a class="btn" style="align-self:flex-start;text-decoration:none" href="#t-home">فتح بوابة المستأجر</a></section>
  <section class="tile" style="margin-bottom:16px"><h2>البيانات</h2><p class="mut" style="margin:0">تُحفظ تغييراتك في هذا المتصفح فقط.</p><button class="btn danger" style="align-self:flex-start" data-reset>إعادة البيانات التجريبية</button></section>
  <section class="tile about"><span class="logo"><svg class="mark" width="34" height="34" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26"/><path class="cup" d="M28 51a22 22 0 0 0 44 0"/><path class="dot" d="M50 25l8 8-8 8-8-8z"/></svg><span class="brand" style="padding:0">سكن</span></span><b style="font-size:18px">كل عقاراتك في مكان واحد</b><p style="margin:0;max-width:60ch">سكن يجمع مبانيك ووحداتك ومستأجريك في شاشة واحدة: من دفع ومن لم يدفع، الوحدات الشاغرة، وطلبات الصيانة. ويمكن ربطه بلينا، المساعدة الصوتية من CUE، لتسجيل طلبات المستأجرين من الهاتف.</p><span class="mut" style="font-size:13px">من تطوير CUE · فريق من مسقط يصمم المواقع والتطبيقات ووكلاء الذكاء الاصطناعي للشركات.</span><span class="mut" style="font-size:12px">نسخة تجريبية · كل الأسماء والمبالغ أمثلة.</span></section>`;
}

/* ---------- Receipts and payments (shared by owner and tenant) ---------- */
const CUR = 'نوفمبر 2026';
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const today = () => { const d = new Date(); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
function receiptsOf(t) {
  if (!t.receipts) {
    t.receipts = ['سبتمبر', 'أكتوبر'].map((m) => ({ id: uid('r'), month: m + ' 2026', amount: t.rent, date: '1 ' + m, method: 'تحويل بنكي', status: 'ok' }));
    if (t.status === 'paid') t.receipts.push({ id: uid('r'), month: CUR, amount: t.rent, date: (t.note || '').replace('دُفع ', '') || '1 نوفمبر', method: 'تحويل بنكي', status: 'ok' });
  }
  return t.receipts;
}
const reviewReceipt = (t) => receiptsOf(t).find((r) => r.month === CUR && r.status === 'review');
function readImage(file, max = 900, q = 0.7) {
  return new Promise((res) => {
    if (!file || !file.size || !/^image\//.test(file.type)) return res(null);
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', q));
      };
      img.onerror = () => res(null); img.src = r.result;
    };
    r.onerror = () => res(null); r.readAsDataURL(file);
  });
}
function showImage(src, title, extra = '') {
  sheetSave = null;
  $('#sheet').innerHTML = `<div class="panel pop" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2><img class="shot" src="${esc(src)}" alt="${esc(title)}"><div class="bars">${extra}<button class="btn soft" data-close>إغلاق</button></div></div>`;
  $('#sheet').hidden = false;
}

/* ---------- Tenant portal ---------- */
let meId = null;
try { meId = localStorage.getItem('sakan-tenant'); } catch (e) {}
function me() {
  let t = meId && tOf(meId);
  if (!t) { t = tOf('tb4-2') || db.tenants[0]; meId = t ? t.id : null; }
  return t;
}
function whoSel() {
  const t = me();
  const list = [...db.tenants].sort((a, b) => (a.status === 'paid') - (b.status === 'paid'));
  return `<label class="who">تجربة كمستأجر<select id="who" aria-label="اختر المستأجر">${list.map((x) => `<option value="${x.id}" ${t && x.id === t.id ? 'selected' : ''}>${esc(x.name)} · ${esc(place(x.unitId))}</option>`).join('')}</select></label>`;
}
const STEP = { new: 1, progress: 2, done: 3 };
const STEP_TXT = { new: 'تم الاستلام', progress: 'قيد التنفيذ', done: 'تم الإصلاح' };
function jobCard(j) {
  const n = STEP[j.status];
  return `<article class="jobrow">${j.photo ? `<img class="thumb" src="${esc(j.photo)}" alt="صورة الطلب">` : ''}<div class="grow">
    <div class="tools" style="margin:0"><b>${esc(j.title)}</b><span class="pill ${j.status === 'done' ? 'ok' : j.status === 'new' ? 'new' : 'due'}">${STEP_TXT[j.status]}</span></div>
    ${j.desc ? `<span style="font-size:14px">${esc(j.desc)}</span>` : ''}
    <span class="mut" style="font-size:12px">${esc([j.cat, j.date, j.urgent ? 'عاجل' : ''].filter(Boolean).join(' · ') || j.from)}</span>
    <div class="steps" aria-hidden="true"><span class="${n >= 1 ? 'on' : ''}"></span><span class="${n >= 2 ? 'on' : ''}"></span><span class="${n >= 3 ? 'on' : ''}"></span></div>
    <div class="steplbl" aria-hidden="true"><span>تم الاستلام</span><span>قيد التنفيذ</span><span>تم الإصلاح</span></div>
  </div></article>`;
}
const noTenant = () => `<div class="tools"><h1>بوابة المستأجر</h1></div><section class="tile empty">لا يوجد مستأجرون بعد. أضف مستأجرًا من حساب المالك.<a class="switch" href="#overview">العودة لحساب المالك</a></section>`;

function tHome() {
  const t = me(); if (!t) return noTenant();
  const u = unitOf(t.unitId), b = u && bOf(u.buildingId);
  const jobs = db.jobs.filter((j) => j.unitId === t.unitId);
  const open = jobs.filter((j) => j.status !== 'done');
  const st = t.status;
  const msg = st === 'paid' ? 'تم الدفع. شكرًا لك.' : st === 'receipt' ? 'إيصالك وصل للمالك وهو قيد المراجعة.' : st === 'late' ? `${esc(t.note)}. الرجاء الدفع في أقرب وقت.` : `يستحق في ${esc(t.due)}.`;
  const cta = st === 'paid' ? `<a class="btn" style="align-self:flex-start;text-decoration:none" href="#t-receipts">عرض الإيصال</a>` : st === 'receipt' ? '' : `<a class="btn" style="align-self:flex-start;text-decoration:none" href="#t-pay">ادفع الآن</a>`;
  return `<div class="tools"><div><span class="mut">${esc(place(t.unitId))}</span><h1>مرحبًا ${esc(t.name.split(' ')[0])}</h1></div>${whoSel()}</div>
  <div class="grid">
    <section class="tile c ${st === 'paid' ? 'hero' : st === 'receipt' ? 't3' : 't2 alert'} s2 r2">
      <span class="lbl">إيجار ${CUR}${st === 'due' || st === 'late' ? ` <span class="flag">${st === 'late' ? 'متأخر' : 'لم يُدفع بعد'}</span>` : ''}</span>
      <div><div class="big" style="font-size:clamp(64px,8vw,112px)"><span class="num">${fmt(t.rent)}</span></div><div style="font-size:20px;font-weight:600">ريال عُماني</div></div>
      <span style="font-weight:600">${msg}</span>${cta}
    </section>
    <section class="tile c t3"><span class="lbl">طلباتي المفتوحة</span><span class="val num">${open.length}</span><button class="btn" style="align-self:flex-start" data-new-req>طلب صيانة جديد</button></section>
    <section class="tile gray"><span class="lbl">وحدتي</span><span class="val" style="font-size:22px">${esc(u ? u.label : '—')}</span><span style="font-size:13px;font-weight:600">${esc(b ? b.name : '')}${b && b.area ? ' · ' + esc(b.area) : ''}</span></section>
    <section class="tile s4"><div class="head" style="margin:0"><h2>آخر طلباتي</h2><a href="#t-requests">كل الطلبات</a></div>
      ${jobs.slice(-2).reverse().map(jobCard).join('<hr style="border:0;border-top:1px solid var(--line);margin:6px 0">') || '<p class="mut" style="margin:0">لا توجد طلبات. إذا تعطل شيء في وحدتك، أرسل طلبًا مع صورة.</p>'}</section>
  </div>
  <a class="switch" href="#overview" style="max-width:260px;margin-top:16px">العودة لحساب المالك (تجربة)</a>`;
}

function tPay() {
  const t = me(); if (!t) return noTenant();
  const head = `<div class="tools"><h1>الدفع</h1>${whoSel()}</div>`;
  if (t.status === 'paid') return head + `<section class="tile c hero" style="min-height:160px"><span class="lbl">${CUR}</span><span class="val">لا يوجد مبلغ مستحق</span><a class="btn" style="align-self:flex-start;text-decoration:none" href="#t-receipts">الإيصالات</a></section>`;
  if (t.status === 'receipt') {
    const r = reviewReceipt(t);
    return head + `<section class="tile c t3" style="min-height:160px"><span class="lbl">${CUR}</span><span class="val">إيصالك قيد المراجعة</span><span style="font-weight:600">سيصلك تأكيد عندما يراجعه المالك.</span>${r && r.img ? `<button class="btn soft" style="align-self:flex-start" data-view-rc="${r.id}">عرض الإيصال المرفوع</button>` : ''}</section>`;
  }
  return head + `<div class="grid" style="grid-auto-rows:auto;margin-bottom:16px">
      <section class="tile c t2 s2"><span class="lbl">المبلغ المستحق · ${CUR}</span><span class="val"><span class="num">${fmt(t.rent)}</span> ر.ع.</span><span style="font-weight:600">${esc(t.status === 'late' ? t.note : 'يستحق في ' + t.due)} · ${esc(place(t.unitId))}</span></section>
      <section class="tile s2"><h2>حساب المالك للتحويل</h2><div class="bank"><span>البنك</span><b>بنك مسقط</b><span>اسم الحساب</span><b>سالم العبري (مثال)</b><span>IBAN</span><b class="num" dir="ltr" style="text-align:right">OM00 0000 0000 0000 0000 000</b><span>المرجع</span><b>${esc(place(t.unitId))}</b></div></section>
    </div>
    <div class="methods">
      <button type="button" class="method main" data-card><b>الدفع بالبطاقة</b><span class="mut">فيزا · ماستركارد · Apple Pay</span></button>
      <button type="button" class="method" data-transfer><b>رفع إيصال تحويل</b><span class="mut">حوّلت المبلغ؟ ارفع صورة الإيصال ليراجعها المالك.</span></button>
    </div>`;
}

function tRequests() {
  const t = me(); if (!t) return noTenant();
  const jobs = db.jobs.filter((j) => j.unitId === t.unitId).sort((a, b) => STEP[a.status] - STEP[b.status]);
  return `<div class="tools"><h1>طلباتي</h1><div class="bars">${whoSel()}<button class="btn" data-new-req>طلب صيانة جديد</button></div></div>
    <div class="cols" style="grid-template-columns:minmax(0,1fr)">${jobs.map((j) => `<section class="tile">${jobCard(j)}</section>`).join('') || '<section class="tile empty">لا توجد طلبات بعد.</section>'}</div>`;
}

function tReceipts() {
  const t = me(); if (!t) return noTenant();
  const rs = [...receiptsOf(t)].reverse();
  const logo = '<svg class="mark" width="34" height="34" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26"/><path class="cup" d="M28 51a22 22 0 0 0 44 0"/><path class="dot" d="M50 25l8 8-8 8-8-8z"/></svg>';
  return `<div class="tools"><h1>الإيصالات</h1><div class="bars">${whoSel()}<button class="btn soft" data-print>طباعة</button></div></div>
    <div class="receipts">${rs.map((r) => `<button type="button" class="rc" ${r.img ? `data-view-rc="${r.id}"` : 'tabindex="-1"'}>
      <span class="rlogo">${logo}سكن</span>
      <span class="lblr">إيصال إيجار</span>
      <b style="font-size:20px">${esc(r.month)}</b>
      <span style="font-size:14px">${esc(t.name)} · ${esc(place(t.unitId))}</span>
      <span style="font-size:12px;color:#55585F">${esc(r.method)} · ${esc(r.date)}${r.img ? ' · صورة مرفقة' : ''}</span>
      <span class="amt ${r.status === 'review' ? 'wait' : ''}"><span class="num">${fmt(r.amount)}</span> ر.ع. · ${r.status === 'review' ? 'قيد المراجعة' : 'مدفوع'}</span>
    </button>`).join('') || '<section class="tile empty">لا توجد إيصالات بعد.</section>'}</div>`;
}

const LI = (d) => `<b class="dw" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg><em></em></b>`;
const CATS = [
  ['تكييف', '<path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11"/><path d="M9 3.5l3 2 3-2M9 20.5l3-2 3 2"/>'],
  ['سباكة', '<path d="M12 3c3.5 4.2 6 7.4 6 10.5A6 6 0 0 1 6 13.5C6 10.4 8.5 7.2 12 3z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'],
  ['كهرباء', '<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z"/>'],
  ['أبواب وأقفال', '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>'],
  ['إزعاج', '<path d="M4 9.5v5h4l5 4.5v-14L8 9.5z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>'],
  ['أخرى', '<circle cx="5.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18.5" cy="12" r="1.6"/>']
];
const I_CAM = '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>';
const I_RCPT = '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>';
const svgI = (d, s = 18, w = 2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const PRIO = [
  ['no', 'عادي', 'خلال يومين إلى ثلاثة', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ['yes', 'عاجل', 'تسرّب، كهرباء، لا يوجد ماء', '<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z"/>']
];
function newRequest() {
  const t = me(); if (!t) return;
  sheetSave = async (v) => {
    const photo = await readImage(v.photo);
    const cat = v.cat || 'أخرى';
    db.jobs.push({ id: uid('j'), title: (v.title || '').trim() || cat, cat, desc: (v.desc || '').trim(), unitId: t.unitId, by: t.id, from: `${t.name} · في التطبيق${photo ? ' · صورة' : ''}`, status: 'new', photo, urgent: v.urgent === 'yes', date: today() });
    toast('تم إرسال طلبك للمالك');
    if (location.hash !== '#t-requests') location.hash = '#t-requests';
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>طلب صيانة جديد</h2>
    <div class="cats" role="radiogroup" aria-label="نوع المشكلة">${CATS.map(([c, i], k) => `<label><input type="radio" name="cat" value="${c}" ${k === 0 ? 'checked' : ''}><span>${LI(i)}${c}</span></label>`).join('')}</div>
    <label for="f-title">عنوان قصير<input id="f-title" name="title" placeholder="مثال: المكيف لا يبرد" required></label>
    <label for="f-desc">التفاصيل<textarea id="f-desc" name="desc" placeholder="متى بدأت المشكلة؟ وأين بالضبط؟"></textarea></label>
    <label class="drop" for="f-photo"><span class="ph" aria-hidden="true">${LI(I_CAM)}</span><span id="photoTxt">أضف صورة (اختياري)</span><input id="f-photo" name="photo" type="file" accept="image/*"></label>
    <fieldset class="prio"><legend>الأولوية</legend><div class="pcards">${PRIO.map(([v, t, h, d], k) => `<label><input type="radio" name="urgent" value="${v}" ${k === 0 ? 'checked' : ''}><span class="pc ${v === 'yes' ? 'hot' : ''}"><b class="ic">${svgI(d)}</b><b>${t}</b><small>${h}</small></span></label>`).join('')}</div></fieldset>
    <div class="acts"><button class="btn" type="submit">إرسال الطلب</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function uploadTransfer() {
  const t = me(); if (!t) return;
  sheetSave = async (v) => {
    const img = await readImage(v.photo);
    if (!img) { toast('لم نتمكن من قراءة الصورة. جرّب صورة أخرى.'); return; }
    receiptsOf(t).push({ id: uid('r'), month: CUR, amount: Number(v.amount) || t.rent, date: today(), method: 'تحويل بنكي', status: 'review', img });
    t.status = 'receipt'; t.note = 'إيصال للمراجعة';
    toast('تم رفع الإيصال. سيراجعه المالك.');
    location.hash = '#t-home';
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>رفع إيصال التحويل</h2>
    <label for="f-amount">المبلغ المحوّل (ر.ع.)<input id="f-amount" name="amount" type="number" min="0" value="${t.rent}" required></label>
    <label class="drop" for="f-photo"><span class="ph" aria-hidden="true">${LI(I_RCPT)}</span><span id="photoTxt">اختر صورة الإيصال</span><input id="f-photo" name="photo" type="file" accept="image/*" required></label>
    <div class="acts"><button class="btn" type="submit">إرسال للمالك</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function cardPay() {
  const t = me(); if (!t) return;
  sheetSave = () => { markPaid(t.id, 'بطاقة (تجريبي)'); location.hash = '#t-receipts'; };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>الدفع بالبطاقة</h2>
    <p style="margin:0">في النسخة الحقيقية تفتح هنا صفحة دفع آمنة من بوابة دفع عُمانية، ويصل المبلغ لحساب المالك مباشرة ويُسجَّل الإيصال تلقائيًا.</p>
    <p class="mut" style="margin:0">هذه نسخة تجريبية ولن يتم خصم أي مبلغ.</p>
    <div class="kvs"><div class="kv"><span class="mut">المبلغ</span><b><span class="num">${fmt(t.rent)}</span> ر.ع.</b></div><div class="kv"><span class="mut">الوحدة</span><b>${esc(place(t.unitId))}</b></div></div>
    <div class="acts"><button class="btn" type="submit">محاكاة دفع ناجح</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
}
function findReceipt(rid) { for (const t of db.tenants) { const r = (t.receipts || []).find((x) => x.id === rid); if (r) return [t, r]; } return []; }

/* ---------- Marketplace ---------- */
const MSTORE = 'sakan-market-v1';
const AREAS = ['الخوير', 'القرم', 'بوشر', 'الموج', 'المعبيلة', 'العذيبة', 'الغبرة', 'الخوض', 'السيب', 'مطرح', 'روي', 'مدينة السلطان قابوس', 'الحيل', 'العامرات', 'الأنصب'];
const LTYPES = ['شقة', 'استوديو', 'فيلا', 'فيلا توين', 'تاون هاوس', 'لوفت', 'غرفة', 'محل', 'مكتب'];
const UKINDS = ['شقة', 'استوديو', 'فيلا', 'فيلا توين', 'تاون هاوس', 'لوفت', 'غرفة', 'محل', 'مكتب'];
const FEATS = ['موقف سيارة', 'مصعد', 'مسبح', 'نادٍ رياضي', 'تكييف مركزي', 'شرفة', 'إطلالة بحر', 'حارس أمن', 'قريب من المدارس', 'يسمح بالعائلات فقط', 'للعزاب'];
const PAL = [
  { sky1: '#9ED8F0', sky2: '#F6E9D6', wall: '#EFE3CF', wall2: '#D9C6A6', trim: '#C2A77E', win: '#4E7D93', ground: '#D8C39C', wallIn: '#EFE6D8', floor: '#C9A57A', accent: '#2F6F5E', accent2: '#E3B04B', rug: '#B4532A', leaf: '#3F7A4A' },
  { sky1: '#F7C6A3', sky2: '#FCEBD9', wall: '#F6F1E8', wall2: '#E2D3BC', trim: '#B98E5E', win: '#33566B', ground: '#E4CFA8', wallIn: '#E8EEF0', floor: '#B88B62', accent: '#2C4A6B', accent2: '#C6F36B', rug: '#D9C6A6', leaf: '#4C8A54' },
  { sky1: '#B9E3E8', sky2: '#F3EEE2', wall: '#E9D7BD', wall2: '#CDB28C', trim: '#A9805A', win: '#5C6F7A', ground: '#D2B98F', wallIn: '#F3E7DA', floor: '#A9774F', accent: '#B4532A', accent2: '#2DD4BF', rug: '#34503F', leaf: '#356B44' },
  { sky1: '#A7C7F2', sky2: '#EEF3F6', wall: '#FFFFFF', wall2: '#DDE3E6', trim: '#8FA3AD', win: '#2D4B5E', ground: '#D9CBB0', wallIn: '#EDE9E3', floor: '#8C6A4F', accent: '#5B5F97', accent2: '#F2B8A0', rug: '#E9D7BD', leaf: '#4F8F5B' },
  { sky1: '#FAD6A5', sky2: '#FFF4E4', wall: '#E7C9A1', wall2: '#C9A274', trim: '#8E6A45', win: '#3F5A55', ground: '#D9B98A', wallIn: '#F5EDE1', floor: '#C08F5E', accent: '#6B8E5A', accent2: '#B4532A', rug: '#F0D2A8', leaf: '#3E7346' }
];
const sky = (p) => `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky1}"/><stop offset="1" stop-color="${p.sky2}"/></linearGradient></defs>`;
const palm = (x, p) => `<path d="M${x} 500C${x + 8} 420 ${x + 2} 360 ${x + 10} 300" stroke="#7A5A3A" stroke-width="10" fill="none" stroke-linecap="round"/><g fill="${p.leaf}" transform="translate(${x + 10} 300)"><path d="M0 0Q-50-30-90 0Q-40-15 0 0Z"/><path d="M0 0Q50-35 90-5Q40-15 0 0Z"/><path d="M0 0Q-20-55-60-65Q-15-35 0 0Z"/><path d="M0 0Q25-55 70-60Q20-35 0 0Z"/><path d="M0 0Q0-50 5-75Q8-40 0 0Z"/></g>`;
const ART = {
  facade(p) {
    let w = '';
    for (let r = 0; r < 6; r++) { for (let c = 0; c < 5; c++) w += `<rect x="${250 + c * 64}" y="${168 + r * 52}" width="40" height="30" rx="3" fill="${p.win}" opacity=".9"/>`; w += `<rect x="236" y="${202 + r * 52}" width="328" height="5" fill="${p.trim}"/>`; }
    return `${sky(p)}<rect width="800" height="600" fill="url(#s)"/><circle cx="660" cy="110" r="46" fill="#FFF3C9" opacity=".9"/><rect x="150" y="260" width="80" height="240" fill="${p.wall2}"/><rect x="570" y="300" width="100" height="200" fill="${p.wall2}"/><rect x="220" y="140" width="360" height="360" fill="${p.wall}"/><rect x="210" y="128" width="380" height="16" fill="${p.trim}"/>${w}<rect x="370" y="440" width="60" height="60" fill="${p.accent}"/><rect x="0" y="500" width="800" height="100" fill="${p.ground}"/>${palm(90, p)}${palm(690, p)}`;
  },
  villa(p) {
    let cr = ''; for (let i = 0; i < 12; i++) cr += `<rect x="${172 + i * 39}" y="214" width="22" height="18" fill="${p.wall}"/>`;
    let cr2 = ''; for (let i = 0; i < 8; i++) cr2 += `<rect x="${252 + i * 38}" y="134" width="20" height="18" fill="${p.wall}"/>`;
    const arch = (x, y, w, h, f) => `<path d="M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}Z" fill="${f}"/>`;
    return `${sky(p)}<rect width="800" height="600" fill="url(#s)"/><circle cx="130" cy="100" r="40" fill="#FFF3C9" opacity=".9"/>${cr2}<rect x="250" y="150" width="300" height="90" fill="${p.wall}"/>${cr}<rect x="170" y="230" width="460" height="230" fill="${p.wall}"/>${arch(210, 290, 60, 110, p.win)}${arch(300, 290, 60, 110, p.win)}${arch(440, 290, 60, 110, p.win)}${arch(530, 290, 60, 110, p.win)}${arch(370, 320, 60, 140, '#6B4A2E')}${arch(300, 170, 40, 55, p.win)}${arch(460, 170, 40, 55, p.win)}<rect x="0" y="440" width="800" height="70" fill="${p.wall2}"/><rect x="340" y="440" width="120" height="70" fill="${p.trim}"/><g fill="#D9468F" opacity=".85"><circle cx="60" cy="440" r="16"/><circle cx="85" cy="430" r="13"/><circle cx="110" cy="442" r="15"/><circle cx="700" cy="438" r="15"/><circle cx="725" cy="430" r="12"/><circle cx="745" cy="444" r="14"/></g><rect x="0" y="510" width="800" height="90" fill="${p.ground}"/>${palm(640, p)}`;
  },
  living(p) {
    return `${sky(p)}<rect width="800" height="600" fill="${p.wallIn}"/><rect y="430" width="800" height="170" fill="${p.floor}"/><rect y="424" width="800" height="8" fill="${p.trim}"/><rect x="470" y="90" width="250" height="230" rx="6" fill="url(#s)"/><path d="M470 90h250v230H470zM595 90v230M470 205h250" stroke="#FFFFFF" stroke-width="10" fill="none"/><rect x="448" y="78" width="30" height="280" rx="8" fill="${p.accent2}" opacity=".85"/><rect x="712" y="78" width="30" height="280" rx="8" fill="${p.accent2}" opacity=".85"/><rect x="170" y="140" width="150" height="100" rx="4" fill="#FFFFFF"/><path d="M182 228l40-50 30 34 22-22 34 38z" fill="${p.accent}" opacity=".7"/><circle cx="290" cy="164" r="10" fill="${p.accent2}"/><ellipse cx="290" cy="525" rx="250" ry="42" fill="${p.rug}" opacity=".8"/><rect x="90" y="300" width="330" height="90" rx="28" fill="${p.accent}"/><rect x="66" y="355" width="378" height="72" rx="24" fill="${p.accent}"/><rect x="66" y="355" width="378" height="72" rx="24" fill="#000" opacity=".12"/><rect x="118" y="318" width="84" height="54" rx="16" fill="${p.accent2}"/><rect x="300" y="318" width="84" height="54" rx="16" fill="#FFFFFF" opacity=".85"/><rect x="90" y="425" width="10" height="22" fill="#4A3524"/><rect x="410" y="425" width="10" height="22" fill="#4A3524"/><rect x="200" y="470" width="180" height="16" rx="8" fill="#5E4330"/><rect x="215" y="486" width="8" height="40" fill="#5E4330"/><rect x="357" y="486" width="8" height="40" fill="#5E4330"/><path d="M600 520h64l-9 62h-46z" fill="#B4532A"/><g fill="${p.leaf}"><ellipse cx="632" cy="470" rx="22" ry="52"/><ellipse cx="600" cy="490" rx="16" ry="40" transform="rotate(-30 600 490)"/><ellipse cx="664" cy="490" rx="16" ry="40" transform="rotate(30 664 490)"/></g>`;
  },
  bedroom(p) {
    return `${sky(p)}<rect width="800" height="600" fill="${p.wallIn}"/><rect y="450" width="800" height="150" fill="${p.floor}"/><rect y="444" width="800" height="8" fill="${p.trim}"/><rect x="40" y="110" width="130" height="190" rx="6" fill="url(#s)"/><path d="M40 110h130v190H40zM105 110v190" stroke="#FFFFFF" stroke-width="8" fill="none"/><rect x="330" y="120" width="140" height="90" rx="4" fill="#FFFFFF"/><circle cx="400" cy="165" r="28" fill="${p.accent2}" opacity=".8"/><rect x="220" y="240" width="360" height="160" rx="22" fill="${p.accent}"/><rect x="196" y="350" width="408" height="110" rx="18" fill="#FFFFFF"/><rect x="196" y="392" width="408" height="92" rx="16" fill="${p.accent2}"/><rect x="196" y="392" width="408" height="14" fill="#FFFFFF" opacity=".5"/><rect x="246" y="318" width="120" height="50" rx="16" fill="#F7F3EC"/><rect x="434" y="318" width="120" height="50" rx="16" fill="#F7F3EC"/><rect x="110" y="380" width="70" height="80" rx="6" fill="#8A6A4A"/><rect x="620" y="380" width="70" height="80" rx="6" fill="#8A6A4A"/><path d="M128 380h34l-8-40h-18z" fill="${p.accent2}"/><rect x="143" y="340" width="4" height="0" fill="#000"/><path d="M638 380h34l-8-40h-18z" fill="${p.accent2}"/><ellipse cx="400" cy="540" rx="230" ry="30" fill="${p.rug}" opacity=".6"/>`;
  },
  twin(p) {
    const half = (x, door) => {
      let cr = ''; for (let i = 0; i < 6; i++) cr += `<rect x="${x + 6 + i * 44}" y="226" width="24" height="18" fill="${p.wall}"/>`;
      let cr2 = ''; for (let i = 0; i < 4; i++) cr2 += `<rect x="${x + 56 + i * 44}" y="148" width="22" height="16" fill="${p.wall}"/>`;
      const arch = (ax, ay, w, h, f) => `<path d="M${ax} ${ay + h}V${ay + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${ay + h}Z" fill="${f}"/>`;
      return `${cr2}<rect x="${x + 50}" y="162" width="190" height="84" fill="${p.wall}"/>${cr}<rect x="${x}" y="242" width="280" height="218" fill="${p.wall}"/>${arch(x + 30, 300, 54, 100, p.win)}${arch(x + 196, 300, 54, 100, p.win)}${arch(x + 112, 322, 56, 138, door)}${arch(x + 90, 180, 38, 52, p.win)}${arch(x + 162, 180, 38, 52, p.win)}`;
    };
    return `${sky(p)}<rect width="800" height="600" fill="url(#s)"/><circle cx="700" cy="90" r="38" fill="#FFF3C9" opacity=".9"/>${half(120, '#6B4A2E')}${half(400, p.accent)}<rect x="396" y="150" width="8" height="310" fill="${p.trim}"/><rect x="0" y="440" width="800" height="70" fill="${p.wall2}"/><rect x="200" y="440" width="90" height="70" fill="${p.trim}"/><rect x="510" y="440" width="90" height="70" fill="${p.trim}"/><g fill="#D9468F" opacity=".85"><circle cx="40" cy="440" r="15"/><circle cx="66" cy="432" r="12"/><circle cx="760" cy="440" r="15"/><circle cx="734" cy="432" r="12"/></g><rect x="0" y="510" width="800" height="90" fill="${p.ground}"/>${palm(40, p)}`;
  },
  loft(p) {
    let g = ''; for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) g += `<rect x="${430 + c * 76}" y="${40 + r * 92}" width="68" height="84" fill="url(#s)"/>`;
    return `${sky(p)}<rect width="800" height="600" fill="${p.wallIn}"/><rect x="420" y="30" width="316" height="390" fill="#1E1E22"/>${g}<rect y="440" width="800" height="160" fill="${p.floor}"/><rect y="434" width="800" height="8" fill="#1E1E22"/><path d="M40 440L40 300L180 300L180 250L300 250" stroke="#1E1E22" stroke-width="8" fill="none"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${60 + i * 46}" y="${400 - i * 30}" width="46" height="10" fill="#1E1E22"/>`).join('')}<path d="M520 0v120M620 0v120" stroke="#1E1E22" stroke-width="3"/><path d="M498 140h44l-6-22h-32zM598 140h44l-6-22h-32z" fill="${p.accent2}"/><rect x="250" y="340" width="300" height="80" rx="24" fill="${p.accent}"/><rect x="230" y="385" width="340" height="62" rx="22" fill="${p.accent}"/><rect x="230" y="385" width="340" height="62" rx="22" fill="#000" opacity=".14"/><rect x="280" y="355" width="74" height="46" rx="14" fill="${p.accent2}"/><ellipse cx="400" cy="530" rx="240" ry="38" fill="${p.rug}" opacity=".75"/><path d="M660 520h56l-8 60h-40z" fill="#1E1E22"/><g fill="${p.leaf}"><ellipse cx="688" cy="470" rx="20" ry="50"/><ellipse cx="660" cy="492" rx="14" ry="36" transform="rotate(-30 660 492)"/><ellipse cx="716" cy="492" rx="14" ry="36" transform="rotate(30 716 492)"/></g>`;
  },
  office(p) {
    let g = ''; for (let c = 0; c < 6; c++) for (let r = 0; r < 9; r++) g += `<rect x="${256 + c * 48}" y="${92 + r * 44}" width="42" height="38" fill="${p.win}" opacity="${0.55 + ((c + r) % 3) * 0.15}"/>`;
    return `${sky(p)}<rect width="800" height="600" fill="url(#s)"/><circle cx="130" cy="110" r="42" fill="#FFF3C9" opacity=".9"/><rect x="120" y="260" width="110" height="240" fill="${p.wall2}"/><rect x="580" y="220" width="120" height="280" fill="${p.wall2}"/><rect x="240" y="76" width="320" height="424" fill="${p.wall}"/>${g}<path d="M256 92L380 92L256 300Z" fill="#FFFFFF" opacity=".18"/><rect x="230" y="64" width="340" height="14" fill="${p.trim}"/><rect x="360" y="450" width="80" height="50" fill="${p.accent}"/><rect x="0" y="500" width="800" height="100" fill="${p.ground}"/>${palm(70, p)}${palm(720, p)}`;
  },
  shop(p) {
    return `${sky(p)}<rect width="800" height="600" fill="url(#s)"/><rect x="120" y="150" width="560" height="350" fill="${p.wall}"/><rect x="100" y="140" width="600" height="20" fill="${p.trim}"/><rect x="150" y="190" width="500" height="60" rx="6" fill="${p.accent}"/><rect x="170" y="280" width="200" height="220" fill="${p.win}" opacity=".85"/><rect x="430" y="280" width="200" height="220" fill="${p.win}" opacity=".85"/><path d="M150 250h500l-20 30H170z" fill="${p.accent2}"/><rect x="0" y="500" width="800" height="100" fill="${p.ground}"/>${palm(60, p)}`;
  }
};
const artCache = {};
function artURI(kind, k) {
  const key = kind + k;
  if (!artCache[key]) artCache[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">${(ART[kind] || ART.living)(PAL[k % PAL.length])}</svg>`);
  return artCache[key];
}
const OUTSIDE = { 'فيلا': 'villa', 'فيلا توين': 'twin', 'تاون هاوس': 'twin', 'محل': 'shop', 'مكتب': 'office', 'لوفت': 'loft', 'استوديو': 'facade', 'غرفة': 'bedroom' };
const outsideArt = (type) => OUTSIDE[type] || 'facade';
function artFor(type, k) {
  const a = outsideArt(type);
  if (a === 'shop' || a === 'office') return [[a, k], ['living', k]];
  if (a === 'loft') return [['loft', k], ['facade', k], ['bedroom', k]];
  if (a === 'bedroom') return [['bedroom', k], ['living', k], ['facade', k]];
  return [[a, k], ['living', k], ['bedroom', k]];
}
const hashK = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % PAL.length; };
const kindOf = (u) => u.kind || (bOf(u.buildingId) || {}).kind || 'شقة';
const unitArt = (u) => artURI(outsideArt(kindOf(u)) === 'bedroom' ? 'bedroom' : outsideArt(kindOf(u)), hashK(u.buildingId));
const bldArt = (b) => artURI(outsideArt(b.kind) === 'loft' ? 'facade' : outsideArt(b.kind), hashK(b.id));
const imgsOf = (l) => (l.photos && l.photos.length ? l.photos : (l.art || []).map(([a, k]) => artURI(a, k)));

function seedMarket() {
  let n = 0;
  const L = (o) => Object.assign({ id: 'l' + (++n), status: 'active', photos: [], inquiries: [], views: 0, feats: [], mine: false, owner: 'سالم العبري', phone: '', furnished: 'no', baths: 1 }, o, { art: artFor(o.type, o.k || 0) });
  const q = (name, msg, when, date, seen = false) => ({ id: uid('q'), name, phone: '', msg, when, date, seen, demo: true });
  return {
    saved: [],
    listings: [
      L({ title: 'شقة غرفتين بإطلالة على البحر', type: 'شقة', area: 'القرم', rent: 390, beds: 2, baths: 2, size: 110, k: 1, mine: true, unitId: 'b2-11', date: '14 نوفمبر', views: 128, feats: ['إطلالة بحر', 'موقف سيارة', 'مصعد', 'شرفة'], desc: 'شقة مشمسة في الطابق السابع من سكن القرم، قريبة من حديقة القرم الطبيعية وشاطئ القرم. مطبخ مفتوح وغرفتا نوم مع خزائن. العقد سنوي والدفع شهريًا عبر تطبيق سكن.', inquiries: [q('عبدالله الشكيلي', 'مرحبًا، هل يمكن المعاينة يوم الخميس؟ عائلة من 4 أشخاص.', 'مساءً', '15 نوفمبر'), q('سارة توماس', 'Is the flat still available from 1 December?', 'صباحًا', '13 نوفمبر', true)] }),
      L({ title: 'لوفت حديث قرب الموج مارينا', type: 'لوفت', area: 'الموج', rent: 460, beds: 1, baths: 1, size: 85, k: 3, mine: true, unitId: 'b4-9', furnished: 'yes', date: '12 نوفمبر', views: 87, feats: ['مسبح', 'نادٍ رياضي', 'حارس أمن', 'موقف سيارة'], desc: 'لوفت بسقف عالٍ ونوافذ كبيرة، مفروش بالكامل. خطوات من المارينا والمطاعم. مناسب لشخص أو زوجين.', inquiries: [q('راهول ميهتا', 'هل الإيجار يشمل الكهرباء والماء؟', 'عطلة نهاية الأسبوع', '14 نوفمبر')] }),
      L({ title: 'فيلا 4 غرف مع حديقة', type: 'فيلا', area: 'بوشر', rent: 620, beds: 4, baths: 4, size: 320, k: 4, mine: true, unitId: 'b3-8', date: '10 نوفمبر', views: 203, feats: ['موقف سيارة', 'قريب من المدارس', 'يسمح بالعائلات فقط', 'تكييف مركزي'], desc: 'فيلا مستقلة بطابقين في حي هادئ ببوشر، مع حديقة أمامية ومجلس منفصل للرجال. قريبة من المدارس الخاصة ومسقط جراند مول.' }),
      L({ title: 'استوديو مفروش للموظفين', type: 'استوديو', area: 'المعبيلة', rent: 160, beds: 0, baths: 1, size: 45, k: 0, owner: 'عقارات النخبة (مثال)', furnished: 'yes', date: '15 نوفمبر', views: 64, feats: ['للعزاب', 'موقف سيارة'], desc: 'استوديو جديد مفروش مع مطبخ صغير، الإنترنت مشمول. قريب من طريق الباطنة السريع.' }),
      L({ title: 'شقة عائلية 3 غرف', type: 'شقة', area: 'الخوض', rent: 280, beds: 3, baths: 2, size: 140, k: 2, owner: 'محمد الحارثي (مثال)', date: '13 نوفمبر', views: 51, feats: ['قريب من المدارس', 'يسمح بالعائلات فقط', 'موقف سيارة'], desc: 'شقة واسعة قريبة من جامعة السلطان قابوس، مع غرفة خادمة ومخزن.' }),
      L({ title: 'شقة غرفتين قرب المطار', type: 'شقة', area: 'العذيبة', rent: 300, beds: 2, baths: 2, size: 105, k: 3, owner: 'ليلى البوسعيدية (مثال)', date: '11 نوفمبر', views: 39, feats: ['مصعد', 'شرفة', 'موقف سيارة'], desc: 'على بعد 5 دقائق من مطار مسقط الدولي. المبنى جديد ويضم مصعدين.' }),
      L({ title: 'فيلا دوبلكس فاخرة', type: 'فيلا', area: 'مدينة السلطان قابوس', rent: 850, beds: 5, baths: 5, size: 420, k: 1, owner: 'شركة الواحة العقارية (مثال)', date: '9 نوفمبر', views: 176, feats: ['مسبح', 'تكييف مركزي', 'حارس أمن', 'قريب من المدارس'], desc: 'فيلا بمسبح خاص وحديقة واسعة في واحدة من أهدأ مناطق مسقط.' }),
      L({ title: 'شقة غرفة واحدة مفروشة', type: 'شقة', area: 'روي', rent: 190, beds: 1, baths: 1, size: 60, k: 4, owner: 'خالد الريامي (مثال)', furnished: 'yes', date: '8 نوفمبر', views: 44, feats: ['مصعد', 'للعزاب'], desc: 'في قلب روي قرب المحلات والمواصلات. مفروشة ومجهزة بالأجهزة.' }),
      L({ title: 'فيلا توين 4 غرف قرب الشاطئ', type: 'فيلا توين', area: 'الموج', rent: 700, beds: 4, baths: 5, size: 360, k: 2, owner: 'شركة الواحة العقارية (مثال)', date: '15 نوفمبر', views: 92, feats: ['موقف سيارة', 'تكييف مركزي', 'يسمح بالعائلات فقط', 'قريب من المدارس'], desc: 'فيلا توين بجدار مشترك واحد ومدخل مستقل، مع حديقة صغيرة وسطح. خمس دقائق من شاطئ الموج.' }),
      L({ title: 'فيلا توين جديدة 3 غرف', type: 'فيلا توين', area: 'الأنصب', rent: 450, beds: 3, baths: 4, size: 280, k: 0, owner: 'محمد الحارثي (مثال)', date: '14 نوفمبر', views: 58, feats: ['موقف سيارة', 'يسمح بالعائلات فقط'], desc: 'بناء جديد لم يُسكن من قبل، مطبخ مغلق ومجلس وغرفة خادمة.' }),
      L({ title: 'مكتب إداري في برج تجاري', type: 'مكتب', area: 'الخوير', rent: 400, beds: 0, baths: 1, size: 75, k: 3, owner: 'عقارات النخبة (مثال)', date: '6 نوفمبر', views: 21, feats: ['مصعد', 'موقف سيارة', 'حارس أمن'], desc: 'مكتب بإطلالة على شارع السلطان قابوس، مع غرفة اجتماعات صغيرة.' }),
      L({ title: 'محل تجاري على شارع رئيسي', type: 'محل', area: 'الغبرة', rent: 520, beds: 0, baths: 1, size: 90, k: 2, owner: 'عقارات النخبة (مثال)', date: '7 نوفمبر', views: 29, feats: ['موقف سيارة'], desc: 'واجهة زجاجية على الشارع الرئيسي، مناسب لمقهى أو صالون.' })
    ]
  };
}
let mkt;
try { mkt = JSON.parse(localStorage.getItem(MSTORE)) || seedMarket(); } catch (e) { mkt = seedMarket(); }
(() => { // add newer sample ads to older saved data, and refresh drawn images
  const fresh = seedMarket();
  fresh.listings.forEach((f) => { if (!f.mine && !mkt.listings.some((l) => l.title === f.title)) mkt.listings.push(f); });
  mkt.listings.forEach((l) => { if (!l.photos || !l.photos.length) l.art = artFor(l.type, (l.art && l.art[0] && l.art[0][1]) || 0); });
})();
function persistM() { try { localStorage.setItem(MSTORE, JSON.stringify(mkt)); return true; } catch (e) { return false; } }
const lOf = (id) => mkt.listings.find((l) => l.id === id);
const mf = { tab: 'browse', q: '', area: '', type: '', max: '', beds: '', furn: '', sort: 'new', view: 'list' };
const MI = {
  bed: svgI('<path d="M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="11.5" r="1.5"/>', 16),
  bath: svgI('<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M7 19l-1 2M17 19l1 2"/>', 16),
  size: svgI('<path d="M4 9V4h5M20 15v5h-5M4 4l7 7M20 20l-7-7"/>', 16),
  pin: svgI('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>', 16),
  heart: svgI('<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>', 20)
};
const specs = (l) => `<span class="specs">${l.type === 'محل' || l.type === 'مكتب' ? '' : `<span>${MI.bed}${Number(l.beds) ? `<span class="num">${l.beds}</span> غرف` : 'استوديو'}</span>`}<span>${MI.bath}<span class="num">${l.baths}</span> حمّام</span>${l.size ? `<span>${MI.size}<span class="num">${l.size}</span> م²</span>` : ''}</span>`;
const LSTATUS = { active: ['ok', 'منشور'], paused: ['due', 'متوقف مؤقتًا'], rented: ['new', 'تم التأجير'] };
const waLink = (p) => { let d = String(p || '').replace(/\D/g, ''); if (!d) return ''; if (d.length === 8) d = '968' + d; return 'https://wa.me/' + d; };

/* ---------- Marketplace extras: badges, owner ratings, fair price, viewing slots, saved searches ---------- */
const WD = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const TIMES = ['09:00', '10:00', '11:00', '16:00', '17:00', '18:30', '20:00'];
const DEF_TIMES = ['10:00', '16:00', '18:30'];
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayLbl = (d) => `${WD[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
function nextDays(n = 7) { const out = []; const d = new Date(); d.setHours(12); while (out.length < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 5) out.push(new Date(d)); } return out; }
const OWNERS = {
  'سالم العبري': { r: 4.8, n: 23, since: 2019, rev: [['عائشة', 5, 'رد سريع على طلبات الصيانة والشقة نظيفة.'], ['جيمس', 5, 'Very fair landlord, contract was clear.']] },
  'عقارات النخبة (مثال)': { r: 4.3, n: 41, since: 2016, rev: [['خالد', 4, 'تعامل محترف، لكن التأمين أخذ وقت ليُرد.']] },
  'محمد الحارثي (مثال)': { r: 4.6, n: 9, since: 2021, rev: [['منى', 5, 'المالك متعاون جدًا.']] },
  'ليلى البوسعيدية (مثال)': { r: 4.9, n: 14, since: 2020, rev: [['سارة', 5, 'كل شي كان كما في الصور.']] },
  'شركة الواحة العقارية (مثال)': { r: 4.5, n: 57, since: 2012, rev: [['أحمد', 4, 'فلل ممتازة والصيانة منتظمة.']] },
  'خالد الريامي (مثال)': { r: 4.1, n: 6, since: 2022, rev: [['راجيش', 4, 'Good location, owner replies on WhatsApp.']] }
};
const stars = (r) => `<span class="stars" aria-label="${r} من 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${r >= i - 0.25 ? 'on' : r >= i - 0.75 ? 'half' : ''}">★</i>`).join('')}</span>`;
const AREA_F = { 'القرم': 1.2, 'الموج': 1.3, 'مدينة السلطان قابوس': 1.35, 'الخوير': 1.05, 'بوشر': 1.05, 'العذيبة': 1, 'الغبرة': 0.95, 'الخوض': 0.85, 'المعبيلة': 0.75, 'السيب': 0.8, 'الحيل': 0.85, 'مطرح': 0.85, 'روي': 0.9, 'العامرات': 0.75, 'الأنصب': 0.9 };
function fair(l) {
  const b = Number(l.beds) || 0, s = Number(l.size) || 0;
  const base = { 'استوديو': 175, 'غرفة': 115, 'لوفت': 340, 'شقة': 140 + 90 * Math.max(1, b), 'فيلا': 260 + 85 * Math.max(2, b), 'فيلا توين': 230 + 80 * Math.max(2, b), 'تاون هاوس': 220 + 75 * Math.max(2, b), 'محل': 5.6 * (s || 80), 'مكتب': 5.2 * (s || 70) }[l.type] || 300;
  const mid = base * (AREA_F[l.area] || 1) * (l.furnished === 'yes' ? 1.12 : 1);
  const r10 = (x) => Math.round(x / 10) * 10;
  return { lo: r10(mid * 0.9), hi: r10(mid * 1.1), mid: r10(mid) };
}
function fairNote(l) {
  if (!l.rent || !l.area || !l.type) return '';
  const f = fair(l), r = Number(l.rent);
  const [cls, txt] = r < f.lo ? ['good', 'أقل من سعر السوق'] : r > f.hi ? ['high', 'أعلى من سعر السوق'] : ['ok', 'ضمن سعر السوق'];
  return `<div class="fair ${cls}"><b>${txt}</b><span>وحدات مشابهة (${esc(l.type)} في ${esc(l.area)}) تؤجَّر عادة بين <span class="num">${fmt(f.lo)}</span> و<span class="num">${fmt(f.hi)}</span> ر.ع.</span><span class="fbar" aria-hidden="true"><i style="inset-inline-start:${Math.max(2, Math.min(98, ((r - f.lo * 0.8) / (f.hi * 1.2 - f.lo * 0.8)) * 100))}%"></i></span><small>تقدير سكن من أسعار السوق · تجريبي</small></div>`;
}
const vBadge = (l) => (l.verified ? `<span class="vbadge" title="موثّق من سكن">${svgI('<path d="M12 2l2.4 2.1 3.2-.3.7 3.1 2.8 1.6-1.3 2.9 1.3 2.9-2.8 1.6-.7 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.7-3.1-2.8-1.6 1.3-2.9-1.3-2.9 2.8-1.6.7-3.1 3.2.3z"/><path d="M8.5 12l2.3 2.3 4.7-4.6"/>', 16)}موثّق</span>` : '');
// one-time additions for older saved data and the sample ads
(() => {
  const X = {
    'شقة غرفتين بإطلالة على البحر': { verified: true }, 'لوفت حديث قرب الموج مارينا': { verified: true }, 'فيلا 4 غرف مع حديقة': { verified: true },
    'فيلا دوبلكس فاخرة': { verified: true, featured: true, featUntil: '30 نوفمبر' }, 'فيلا توين 4 غرف قرب الشاطئ': { verified: true, featured: true, featUntil: '25 نوفمبر' }, 'شقة غرفتين قرب المطار': { verified: true }
  };
  mkt.listings.forEach((l) => {
    if (l.times) return;
    Object.assign(l, { verified: false, featured: false, times: DEF_TIMES.slice() }, X[l.title] || {});
  });
  if (!mkt.searches) {
    mkt.searches = [{ id: 's1', label: 'فيلا توين في الموج', f: { q: '', area: 'الموج', type: 'فيلا توين', max: '', beds: '', furn: '' }, seen: [] }];
    const l1 = mkt.listings.find((l) => l.title === 'شقة غرفتين بإطلالة على البحر');
    const days = nextDays(3);
    if (l1 && l1.inquiries[0]) l1.inquiries[0].slot = { key: dayKey(days[1]) + ' 18:30', day: dayLbl(days[1]), time: '18:30' };
    if (l1 && l1.inquiries[1]) l1.inquiries[1].slot = { key: dayKey(days[0]) + ' 10:00', day: dayLbl(days[0]), time: '10:00' };
  }
  persistM();
})();
const FKEYS = ['q', 'area', 'type', 'max', 'beds', 'furn'];
const hasFilters = (f) => FKEYS.some((k) => f[k]);
function applyFilters(list, f) {
  const q = (f.q || '').trim();
  if (q) list = list.filter((l) => matchQ(l, q));
  if (f.area) list = list.filter((l) => l.area === f.area);
  if (f.type) list = list.filter((l) => l.type === f.type);
  if (f.beds) list = list.filter((l) => Number(l.beds) >= Number(f.beds));
  if (f.max) list = list.filter((l) => Number(l.rent) <= Number(f.max));
  if (f.furn) list = list.filter((l) => l.furnished === f.furn);
  return list;
}
const searchLabel = (f) => [f.type, f.area && 'في ' + f.area, f.q && `«${f.q}»`, f.beds && f.beds + '+ غرف', f.max && 'حتى ' + f.max + ' ر.ع.', f.furn && (f.furn === 'yes' ? 'مفروشة' : 'غير مفروشة')].filter(Boolean).join(' · ') || 'كل الإعلانات';
const searchHits = (s) => applyFilters(mkt.listings.filter((l) => l.status === 'active'), s.f);
const searchNew = (s) => searchHits(s).filter((l) => !s.seen.includes(l.id)).length;
function upcomingViewings() {
  const now = dayKey(new Date());
  const out = [];
  mkt.listings.filter((l) => l.mine && l.status !== 'rented').forEach((l) => l.inquiries.forEach((x) => { if (x.slot && x.slot.key >= now && x.status !== 'declined') out.push({ l, x }); }));
  return out.sort((a, b) => a.x.slot.key.localeCompare(b.x.slot.key));
}

function lcard(l, ten) {
  const fav = mkt.saved.includes(l.id);
  const tags = [l.featured ? '<span class="ltag feat">★ مميز</span>' : '', l.mine && !ten ? '<span class="ltag">إعلانك</span>' : ''].join('');
  return `<article class="lcard${l.featured ? ' isfeat' : ''}"><button type="button" class="lopen" data-mk-open="${l.id}"><span class="lph"><img src="${esc(imgsOf(l)[0] || '')}" alt="" loading="lazy"><span class="lprice"><span class="num">${fmt(l.rent)}</span> ر.ع. <small>/ شهر</small></span>${tags ? `<span class="ltags">${tags}</span>` : ''}</span>
    <span class="lbd"><b>${esc(l.title)}</b><span class="mut" style="font-size:13px;display:inline-flex;gap:4px;align-items:center;flex-wrap:wrap">${MI.pin}${esc(l.area)} · ${esc(l.type)}${l.furnished === 'yes' ? ' · مفروشة' : ''}${vBadge(l)}</span>${specs(l)}</span></button>
    ${ten || !l.mine ? `<button type="button" class="lfav ${fav ? 'on' : ''}" data-mk-fav="${l.id}" aria-pressed="${fav}" aria-label="${fav ? 'إزالة من المحفوظة' : 'حفظ الإعلان'}">${MI.heart}</button>` : ''}</article>`;
}
function mResults(ten) {
  let list = mkt.listings.filter((l) => l.status === 'active' && (mf.tab !== 'saved' || mkt.saved.includes(l.id)));
  if (mf.tab !== 'saved') list = applyFilters(list, mf);
  const by = { new: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.ts || 0) - (a.ts || 0) || mkt.listings.indexOf(a) - mkt.listings.indexOf(b), cheap: (a, b) => a.rent - b.rent, dear: (a, b) => b.rent - a.rent, big: (a, b) => (b.size || 0) - (a.size || 0) };
  list.sort(by[mf.sort] || by.new);
  const empty = mf.tab === 'saved' ? 'لم تحفظ أي إعلان بعد. اضغط على القلب في أي إعلان لحفظه.' : 'لا توجد إعلانات بهذه الشروط. جرّب توسيع البحث.';
  return [list.length, list.map((l) => lcard(l, ten)).join('') || `<section class="tile empty" style="grid-column:1/-1">${empty}</section>`, list];
}
function savedSearches() {
  const ss = mkt.searches || [];
  return `<section class="tile ssearch"><div class="head" style="margin:0"><h2>عمليات البحث المحفوظة</h2><span class="mut" style="font-size:13px">نبلغك عند نزول إعلان جديد يطابقها</span></div>
    ${ss.map((s) => { const n = searchNew(s), all = searchHits(s).length; return `<div class="srow"><span class="sicn">${svgI('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>', 18)}</span><span class="grow"><b>${esc(s.label)}</b><span class="mut" style="font-size:13px"><span class="num">${all}</span> إعلان${n ? ` · <span class="pill new">${n} جديد</span>` : ''}</span></span><button class="btn small" data-ss-run="${s.id}">عرض</button><button class="btn soft small" data-ss-del="${s.id}" aria-label="حذف البحث">حذف</button></div>`; }).join('') || '<p class="mut" style="margin:0">لم تحفظ أي بحث. اختر فلاتر في «تصفّح» ثم اضغط «احفظ البحث وأبلغني».</p>'}</section>`;
}
function market(ten) {
  if (ten && mf.tab === 'mine') mf.tab = 'browse';
  if (!ten && mf.tab === 'saved') mf.tab = 'browse';
  const active = mkt.listings.filter((l) => l.status === 'active');
  const mine = mkt.listings.filter((l) => l.mine);
  const fresh = mine.reduce((a, l) => a + l.inquiries.filter((x) => !x.seen).length, 0);
  const ssNew = (mkt.searches || []).reduce((a, s) => a + searchNew(s), 0);
  const tabs = ten ? [['browse', 'تصفّح', active.length], ['saved', 'المحفوظة', mkt.saved.filter((id) => lOf(id)?.status === 'active').length, ssNew, 'جديد']] : [['browse', 'كل الإعلانات', active.length], ['mine', 'إعلاناتي', mine.length, fresh, 'طلب جديد']];
  const head = `<div class="tools"><div><h1>${ten ? 'ابحث عن سكن' : 'سوق سكن'}</h1><span class="mut">${ten ? 'شقق وفلل للإيجار في مسقط، من الملّاك مباشرة.' : 'اعرض وحداتك الشاغرة، واستقبل طلبات المعاينة هنا.'}</span></div>${ten ? '' : `<button class="act main" data-mk-new><span class="ico" aria-hidden="true">${svgI('<path d="M12 5v14M5 12h14"/>')}</span><span><b>أضف إعلان</b><small>صور ووصف وسعر</small></span></button>`}</div>
    <div class="tabs mtabs" role="tablist">${tabs.map(([k, n, c, f, w]) => `<button type="button" role="tab" data-mk-tab="${k}" class="${mf.tab === k ? 'on' : ''}" aria-selected="${mf.tab === k}">${n}<span class="num">${c}</span>${f ? ` <span class="pill new" style="margin-inline-start:6px">${f} ${w}</span>` : ''}</button>`).join('')}</div>`;
  if (mf.tab === 'mine') return head + myListings();
  const opt = (v, label, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(label)}</option>`;
  const [n, cards] = mResults(ten);
  const isMap = mf.view === 'map';
  if (mf.tab === 'saved') return head + savedSearches() + `<div class="head"><h2>الإعلانات المحفوظة</h2><span class="mut"><span class="num">${n}</span> إعلان</span></div><div class="lgrid" id="mres">${cards}</div>`;
  return head + `<section class="tile filters">
      <div class="fld q"><label for="mq">بحث</label><div class="sbox"><input id="mq" type="search" data-mf="q" value="${esc(mf.q)}" placeholder="مثال: فيلا توين، twin، إطلالة بحر، القرم" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="sugg" aria-autocomplete="list"><div class="sugg" id="sugg" role="listbox" hidden></div></div></div>
      <div class="fld"><span>المنطقة</span>${picker('area', [['', 'كل المناطق'], ...AREAS], mf.area, { mf: 'area' })}</div>
      <div class="fld"><span>النوع</span>${picker('type', [['', 'كل الأنواع'], ...LTYPES], mf.type, { mf: 'type' })}</div>
      <label class="fld">غرف النوم<select data-mf="beds">${opt('', 'أي عدد', mf.beds)}${[1, 2, 3, 4].map((a) => opt(a, a + ' أو أكثر', mf.beds)).join('')}</select></label>
      <label class="fld">أقصى إيجار (ر.ع.)<input type="number" min="0" step="10" inputmode="numeric" data-mf="max" value="${esc(mf.max)}" placeholder="بلا حد"></label>
      <label class="fld">الأثاث<select data-mf="furn">${opt('', 'الكل', mf.furn)}${opt('yes', 'مفروشة', mf.furn)}${opt('no', 'غير مفروشة', mf.furn)}</select></label>
      <label class="fld">الترتيب<select data-mf="sort">${opt('new', 'الأحدث', mf.sort)}${opt('cheap', 'الأقل سعرًا', mf.sort)}${opt('dear', 'الأعلى سعرًا', mf.sort)}${opt('big', 'الأكبر مساحة', mf.sort)}</select></label>
    </section>
    <div class="mbar"><div class="mcount mut"><span id="mcount"><span class="num">${n}</span> إعلان</span>${hasFilters(mf) ? ' · <button type="button" class="clearf" data-mk-clear>مسح الفلاتر</button>' : ''}</div>
      <div class="bars">${ten && mf.tab === 'browse' ? `<button class="btn soft small" data-ss-save ${hasFilters(mf) ? '' : 'disabled title="اختر فلاتر أولًا"'}>${svgI('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>', 16)} احفظ البحث وأبلغني</button>` : ''}
      <div class="seg vseg" role="group" aria-label="طريقة العرض"><button type="button" data-mk-view="list" class="${isMap ? '' : 'on'}" aria-pressed="${!isMap}">قائمة</button><button type="button" data-mk-view="map" class="${isMap ? 'on' : ''}" aria-pressed="${isMap}">خريطة</button></div></div></div>
    ${isMap ? '<div class="mmap" id="mmap" role="region" aria-label="خريطة الإعلانات"></div>' : ''}
    <div class="lgrid" id="mres" ${isMap ? 'hidden' : ''}>${cards}</div>`;
}
function myListings() {
  const mine = mkt.listings.filter((l) => l.mine).sort((a, b) => (a.status === 'rented') - (b.status === 'rented'));
  if (!mine.length) return `<section class="tile empty">لم تنشر أي إعلان بعد. اضغط «أضف إعلان»، أو افتح وحدة شاغرة من صفحة المباني واختر «انشر في السوق».</section>`;
  const up = upcomingViewings();
  const viewings = `<section class="tile" style="margin-bottom:14px"><div class="head" style="margin:0"><h2>المعاينات القادمة</h2><span class="pill new">${up.length}</span></div>
    ${up.length ? `<div class="vlist">${up.map(({ l, x }) => `<div class="vrow"><span class="vdate"><b>${esc(x.slot.day.split(' ')[0])}</b><span class="num">${esc(x.slot.day.split(' ').slice(1).join(' '))}</span></span><span class="grow"><b>${esc(x.name)} · <span class="num">${esc(x.slot.time)}</span></b><span class="mut" style="font-size:13px">${esc(l.title)}</span></span>${x.status === 'confirmed' ? '<span class="pill ok">مؤكدة</span>' : `<button class="btn small" data-vw-ok="${l.id}|${x.id}">تأكيد</button>`}</div>`).join('')}</div>` : '<p class="mut" style="margin:0">لا توجد معاينات محجوزة بعد.</p>'}</section>`;
  return viewings + `<div class="mylist">${mine.map((l) => {
    const [cls, txt] = LSTATUS[l.status];
    const inq = l.inquiries.slice().reverse();
    return `<section class="tile"><div class="mine"><img src="${esc(imgsOf(l)[0] || '')}" alt=""><div class="grow">
      <div class="tools" style="margin:0"><b style="font-size:17px">${esc(l.title)}</b><span class="bars">${l.featured ? '<span class="pill feat">★ مميز حتى ' + esc(l.featUntil || '') + '</span>' : ''}${l.verified ? '<span class="pill ok">موثّق</span>' : l.verifyPending ? '<span class="pill due">التوثيق قيد المراجعة</span>' : ''}<span class="pill ${cls}">${txt}</span></span></div>
      <span class="mut" style="font-size:13px">${esc(l.area)} · ${esc(l.type)} · <span class="num">${fmt(l.rent)}</span> ر.ع. / شهر${l.unitId && unitOf(l.unitId) ? ' · ' + esc(place(l.unitId)) : ''}</span>
      <span style="font-size:13px;font-weight:600"><span class="num">${l.views}</span> مشاهدة · <span class="num">${l.inquiries.length}</span> طلب معاينة · نُشر ${esc(l.date)}</span>
      <div class="bars" style="margin-top:6px"><button class="btn small" data-mk-open="${l.id}">عرض</button><button class="btn soft small" data-mk-edit="${l.id}">تعديل</button>${l.status === 'active' && !l.featured ? `<button class="btn soft small" data-mk-feat="${l.id}">★ ميّز الإعلان</button>` : ''}${!l.verified && !l.verifyPending ? `<button class="btn soft small" data-mk-verify="${l.id}">اطلب التوثيق</button>` : ''}${l.verifyPending ? `<button class="btn soft small" data-mk-approve="${l.id}" title="في النسخة الحقيقية يعتمده فريق سكن بعد الزيارة">اعتماد التوثيق (تجريبي)</button>` : ''}<button class="btn soft small" data-mk-toggle="${l.id}">${l.status === 'active' ? 'إيقاف مؤقت' : 'إعادة النشر'}</button><button class="btn danger small" data-mk-del="${l.id}">حذف</button></div>
      ${inq.length ? `<div class="inqs"><span class="mut" style="font-size:12px;font-weight:600">طلبات المعاينة</span>${inq.map((x) => `<div class="inq ${x.seen ? '' : 'new'}"><b>${esc(x.name)}${x.seen ? '' : ' <span class="pill new">جديد</span>'}${x.status === 'accepted' ? ' <span class="pill ok">أصبح مستأجرًا</span>' : ''}</b><span>${esc(x.msg)}</span><span class="mut">${x.slot ? `معاينة: ${esc(x.slot.day)} · <span class="num">${esc(x.slot.time)}</span>` : esc(x.when || '')} · أُرسل ${esc(x.date)}${x.phone ? ` · <span class="num" dir="ltr">${esc(x.phone)}</span>` : ''}</span>
        <div class="bars" style="margin-top:4px">${x.phone && waLink(x.phone) ? `<a class="btn small" style="text-decoration:none" href="${waLink(x.phone)}" target="_blank" rel="noopener">رد عبر واتساب</a>` : ''}${x.status !== 'accepted' && l.status !== 'rented' ? `<button class="btn soft small" data-mk-accept="${l.id}|${x.id}">قبول كمستأجر</button>` : ''}</div></div>`).join('')}</div>` : ''}
    </div></div></section>`;
  }).join('')}</div>`;
}
function openListing(id) {
  const l = lOf(id); if (!l) return;
  const ten = document.body.classList.contains('tenant');
  const own = l.mine && !ten;
  if (!own) { l.views++; } else l.inquiries.forEach((x) => { x.seen = true; });
  persistM();
  sheetSave = null; openUnitId = null;
  const imgs = imgsOf(l);
  const info = (k, v) => `<div class="kv"><span class="mut">${k}</span><b>${v}</b></div>`;
  const fav = mkt.saved.includes(l.id);
  const wa = !own && l.phone && waLink(l.phone);
  const ow = OWNERS[l.owner] || { r: 0, n: 0 };
  const acts = own
    ? `<button class="btn" data-mk-edit="${l.id}">تعديل الإعلان</button>${l.status === 'active' && !l.featured ? `<button class="btn soft" data-mk-feat="${l.id}">★ ميّز الإعلان</button>` : ''}<button class="btn soft" data-mk-toggle="${l.id}">${l.status === 'active' ? 'إيقاف مؤقت' : 'إعادة النشر'}</button><button class="btn danger" data-mk-del="${l.id}">حذف</button>`
    : `<button class="btn" data-mk-ask="${l.id}">احجز موعد معاينة</button>${wa ? `<a class="btn soft" style="text-decoration:none" href="${wa}" target="_blank" rel="noopener">واتساب المعلن</a>` : ''}<button class="btn soft" data-mk-fav="${l.id}">${fav ? 'محفوظ ✓' : 'حفظ'}</button>`;
  $('#sheet').innerHTML = `<div class="panel pop" role="dialog" aria-modal="true" aria-label="${esc(l.title)}">
    <div class="gal">${imgs.map((s, i) => `<img src="${esc(s)}" alt="صورة ${i + 1} من ${imgs.length}">`).join('')}</div>
    ${imgs.length > 1 ? `<span class="mut galhint">${imgs.length} صور · اسحب لرؤية المزيد</span>` : ''}
    <div class="tools" style="margin:0;align-items:flex-start"><div><span class="mut" style="font-size:13px;display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap">${esc(l.area)} · ${esc(l.type)}${vBadge(l)}${l.featured ? '<span class="pill feat">★ مميز</span>' : ''}</span><h2 style="font-size:21px;line-height:1.6">${esc(l.title)}</h2></div><span class="lpr"><span class="num">${fmt(l.rent)}</span> <small class="mut" style="font-size:13px">ر.ع. / شهر</small></span></div>
    ${fairNote(l)}
    <div class="kvs">${l.type === 'محل' || l.type === 'مكتب' ? '' : info('غرف النوم', Number(l.beds) ? `<span class="num">${l.beds}</span>` : 'استوديو')}${info('الحمّامات', `<span class="num">${l.baths}</span>`)}${info('المساحة', l.size ? `<span class="num">${l.size}</span> م²` : '—')}${info('الأثاث', l.furnished === 'yes' ? 'مفروشة' : 'غير مفروشة')}</div>
    ${l.desc ? `<p style="margin:0;white-space:pre-line">${esc(l.desc)}</p>` : ''}
    ${(l.feats || []).length ? `<div class="feats">${l.feats.map((f) => `<span class="chip">${esc(f)}</span>`).join('')}</div>` : ''}
    <div class="owner"><div class="tools" style="margin:0"><span><b>${esc(l.owner)}</b> ${l.verified ? vBadge(l) : ''}<br><span class="mut" style="font-size:12px">${ow.since ? 'على سكن منذ ' + ow.since + ' · ' : ''}نُشر ${esc(l.date)} · <span class="num">${l.views}</span> مشاهدة</span></span>${ow.n ? `<span class="rating">${stars(ow.r)}<b class="num">${ow.r}</b><small class="mut">(${ow.n} تقييم)</small></span>` : '<span class="mut" style="font-size:12px">لا توجد تقييمات بعد</span>'}</div>
      ${(ow.rev || []).map(([n, r, t]) => `<div class="review">${stars(r)}<span>«${esc(t)}»</span><small class="mut">${esc(n)} · مستأجر سابق</small></div>`).join('')}</div>
    <div class="bars">${acts}<button class="btn soft" data-close>إغلاق</button></div></div>`;
  $('#sheet').hidden = false;
}
function askViewing(id) {
  const l = lOf(id); if (!l) return;
  const t = document.body.classList.contains('tenant') ? me() : null;
  const days = nextDays(6);
  const taken = new Set(l.inquiries.map((x) => x.slot && x.slot.key).filter(Boolean));
  const times = (l.times && l.times.length ? l.times : DEF_TIMES);
  sheetSave = (v) => {
    const d = days.find((x) => dayKey(x) === v.day) || days[0];
    const slot = { key: dayKey(d) + ' ' + v.time, day: dayLbl(d), time: v.time };
    l.inquiries.push({ id: uid('q'), name: v.name.trim(), phone: v.phone.trim(), msg: v.msg.trim() || 'أرغب في معاينة الوحدة.', when: slot.day + ' ' + slot.time, slot, date: today(), seen: false, by: t ? t.id : '' });
    persistM(); toast(`تم حجز المعاينة: ${slot.day} الساعة ${slot.time}`);
    if (typeof notify === 'function') notify('owner', `طلب معاينة جديد من ${v.name.trim()} · ${l.title} · ${slot.day} ${slot.time}`, '#market');
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>احجز موعد معاينة</h2><span class="mut" style="font-size:13px">${esc(l.title)} · ${esc(l.area)}</span>
    <fieldset class="prio"><legend>اليوم</legend><div class="chipsel days">${days.map((d, i) => `<label><input type="radio" name="day" value="${dayKey(d)}" ${i === 0 ? 'checked' : ''}><span><small>${WD[d.getDay()]}</small><b class="num">${d.getDate()}</b><small>${MONTHS[d.getMonth()]}</small></span></label>`).join('')}</div></fieldset>
    <fieldset class="prio"><legend>الوقت المتاح</legend><div class="chipsel times" id="slotTimes">${times.map((x, i) => `<label><input type="radio" name="time" value="${x}" ${i === 0 ? 'checked' : ''}><span class="num">${x}</span></label>`).join('')}</div><small class="mut" id="slotNote"></small></fieldset>
    <label for="f-name">اسمك<input id="f-name" name="name" required value="${esc(t ? t.name : '')}"></label>
    <label for="f-phone">رقم الهاتف أو واتساب<input id="f-phone" name="phone" type="tel" required placeholder="+968" value="${esc(t ? t.phone : '')}"></label>
    <label for="f-msg">رسالة<textarea id="f-msg" name="msg">مرحبًا، أرغب في معاينة الوحدة في الموعد المختار.</textarea></label>
    <div class="acts"><button class="btn" type="submit">تأكيد الحجز</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
  const sync = () => { const dk = ($('#sheetForm input[name=day]:checked') || {}).value; let firstFree = null; let n = 0; document.querySelectorAll('#slotTimes input').forEach((i) => { const busy = taken.has(dk + ' ' + i.value); i.disabled = busy; i.closest('label').classList.toggle('busy', busy); if (busy) { n++; if (i.checked) i.checked = false; } else if (!firstFree) firstFree = i; }); if (!document.querySelector('#slotTimes input:checked') && firstFree) firstFree.checked = true; $('#slotNote').textContent = n === 1 ? 'موعد واحد محجوز في هذا اليوم' : n === 2 ? 'موعدان محجوزان في هذا اليوم' : n ? `${n} مواعيد محجوزة في هذا اليوم` : ''; };
  $('#sheetForm').addEventListener('change', (e) => { if (e.target.name === 'day') sync(); });
  sync();
}
function listingForm(id, unitId) {
  const l = id ? lOf(id) : null;
  const u = !l && unitId ? unitOf(unitId) : null;
  const b = u && bOf(u.buildingId);
  const d = l || { title: u ? `${u.label} في ${b.name}` : '', type: u ? kindOf(u) : 'شقة', area: (b && AREAS.includes(b.area) && b.area) || 'الخوير', rent: u ? u.rent : '', beds: 2, baths: 2, size: '', furnished: 'no', feats: [], desc: '', phone: '', unitId: unitId || '' };
  openUnitId = null;
  const sel = (name, items, cur) => `<select id="f-${name}" name="${name}">${items.map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(cur) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  sheetSave = async (v) => {
    const files = v.$all('photos').filter((f) => f && f.size).slice(0, 5);
    const photos = [];
    for (const f of files) { const p = await readImage(f, 800, 0.62); if (p) photos.push(p); }
    const k = u ? hashK(u.buildingId) : l ? ((l.art && l.art[0] && l.art[0][1]) || 0) : Math.floor(Math.random() * PAL.length);
    const data = { title: v.title.trim(), type: v.type, area: v.area, rent: Number(v.rent), beds: Number(v.beds), baths: Number(v.baths), size: Number(v.size) || 0, furnished: v.furnished, feats: v.$all('feats'), desc: v.desc.trim(), phone: v.phone.trim(), times: v.$all('times').length ? v.$all('times') : DEF_TIMES.slice() };
    if (l) {
      Object.assign(l, data);
      if (photos.length) l.photos = photos; l.art = artFor(l.type, k);
      toast('تم حفظ الإعلان');
    } else {
      mkt.listings.unshift(Object.assign({ id: uid('l'), status: 'active', mine: true, verified: false, featured: false, owner: 'سالم العبري', inquiries: [], views: 0, date: today(), ts: Date.now(), unitId: v.unitId || '', photos, art: artFor(data.type, k) }, data));
      mf.tab = 'mine';
      toast(photos.length ? 'تم نشر إعلانك مع ' + photos.length + ' صور' : 'تم نشر إعلانك');
    }
    if (!persistM()) { if (l) l.photos = []; else mkt.listings[0].photos = []; persistM(); toast('مساحة المتصفح ممتلئة، نُشر الإعلان بدون الصور.'); }
    if (location.hash !== '#market') location.hash = '#market';
  };
  $('#sheet').innerHTML = `<form class="panel pop" id="sheetForm"><h2>${l ? 'تعديل الإعلان' : 'إعلان جديد'}</h2>
    ${l && l.photos.length ? '' : `<figure class="apre"><img id="artPre" src="${artURI(artFor(d.type, u ? hashK(u.buildingId) : 0)[0][0], u ? hashK(u.buildingId) : 0)}" alt=""><figcaption>صورة تلقائية حسب النوع · تتغير عند اختيار نوع آخر، ويمكنك رفع صورك بدلًا منها</figcaption></figure>`}
    ${u ? `<span class="mut" style="font-size:13px">من وحدتك الشاغرة: ${esc(place(u.id))}</span><input type="hidden" name="unitId" value="${esc(u.id)}">` : ''}
    <label class="drop" for="f-photos"><span class="ph" aria-hidden="true">${LI(I_CAM)}</span><span id="photosTxt">${l && l.photos.length ? 'اختر صورًا جديدة لاستبدال الحالية' : 'أضف حتى 5 صور للوحدة'}</span><input id="f-photos" name="photos" type="file" accept="image/*" multiple></label>
    <label for="f-title">عنوان الإعلان<input id="f-title" name="title" required value="${esc(d.title)}" placeholder="مثال: شقة غرفتين قرب البحر"></label>
    <div class="row2"><label>النوع${picker('type', LTYPES, d.type)}</label><label>المنطقة${picker('area', AREAS, d.area)}</label></div>
    <div class="row3"><label for="f-rent">الإيجار الشهري (ر.ع.)<input id="f-rent" name="rent" type="number" min="1" required value="${esc(d.rent)}"></label><label for="f-size">المساحة (م²)<input id="f-size" name="size" type="number" min="0" value="${esc(d.size || '')}"></label><label for="f-furnished">الأثاث${sel('furnished', [['no', 'غير مفروشة'], ['yes', 'مفروشة']], d.furnished)}</label></div>
    <div id="fairHint">${fairNote(d)}</div>
    <div class="row2"><label for="f-beds">غرف النوم${sel('beds', [[0, 'استوديو'], 1, 2, 3, 4, 5, 6].map((x) => (Array.isArray(x) ? x : [x, x])), d.beds)}</label><label for="f-baths">الحمّامات${sel('baths', [1, 2, 3, 4, 5, 6].map((x) => [x, x]), d.baths)}</label></div>
    <fieldset class="prio"><legend>المميزات</legend><div class="checks">${FEATS.map((f) => `<label><input type="checkbox" name="feats" value="${esc(f)}" ${(d.feats || []).includes(f) ? 'checked' : ''}>${esc(f)}</label>`).join('')}</div></fieldset>
    <fieldset class="prio"><legend>أوقات المعاينة المتاحة</legend><div class="checks">${TIMES.map((x) => `<label><input type="checkbox" name="times" value="${x}" ${(d.times || DEF_TIMES).includes(x) ? 'checked' : ''}><span class="num">${x}</span></label>`).join('')}</div><small class="mut">يحجز الباحث عن سكن من هذه الأوقات مباشرة، كل يوم عدا الجمعة.</small></fieldset>
    <label for="f-desc">الوصف<textarea id="f-desc" name="desc" placeholder="الطابق، القرب من الخدمات، مدة العقد، ما يشمله الإيجار…">${esc(d.desc)}</textarea></label>
    <label for="f-phone">رقم واتساب للتواصل (اختياري)<input id="f-phone" name="phone" type="tel" placeholder="+968" value="${esc(d.phone || '')}"></label>
    <div class="acts"><button class="btn" type="submit">${l ? 'حفظ' : 'نشر الإعلان'}</button><button class="btn soft" type="button" data-close>إلغاء</button></div></form>`;
  $('#sheet').hidden = false;
  previewK = u ? hashK(u.buildingId) : (l && l.art && l.art[0] ? l.art[0][1] : 0);
}
let previewK = 0;
document.addEventListener('input', (e) => {
  const f = e.target.closest('#sheetForm'); if (!f) return;
  if (['rent', 'type', 'area', 'beds', 'furnished', 'size'].includes(e.target.name) && $('#fairHint')) { const v = Object.fromEntries(new FormData(f).entries()); $('#fairHint').innerHTML = fairNote(v); }
  if (e.target.name !== 'type') return;
  const pre = $('#artPre'); if (pre) pre.src = artURI(artFor(e.target.value, previewK)[0][0], previewK);
});
function refreshResults() {
  const box = $('#mres'); if (!box) return;
  const [n, cards, list] = mResults(document.body.classList.contains('tenant'));
  box.innerHTML = cards;
  const mc = $('.mcount'); if (mc) mc.innerHTML = `<span id="mcount"><span class="num">${n}</span> إعلان</span>${hasFilters(mf) ? ' · <button type="button" class="clearf" data-mk-clear>مسح الفلاتر</button>' : ''}`;
  const sv = $('[data-ss-save]'); if (sv) { sv.disabled = !hasFilters(mf); sv.title = sv.disabled ? 'اختر فلاتر أولًا' : ''; }
  if ($('#mmap') && typeof drawMap === 'function') drawMap(list);
}
document.addEventListener('input', (e) => { const k = e.target.dataset && e.target.dataset.mf; if (!k) return; mf[k] = e.target.value; refreshResults(); if (k === 'q') showSugg(e.target.value); });

/* ---------- Search: Arabic + English aliases and suggestions ---------- */
const norm = (s) => String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
const AREA_EN = { 'الخوير': 'khuwair alkhuwair al khuwair', 'القرم': 'qurum alqurum al qurum', 'بوشر': 'bausher bawshar bowsher', 'الموج': 'mouj almouj al mouj wave', 'المعبيلة': 'maabela mabela mabelah maabilah', 'العذيبة': 'azaiba athaiba azaibah', 'الغبرة': 'ghubra ghubrah alghubra', 'الخوض': 'khoudh alkhoudh al khoud khod', 'السيب': 'seeb alseeb as seeb', 'مطرح': 'muttrah mutrah matrah', 'روي': 'ruwi', 'مدينة السلطان قابوس': 'madinat sultan qaboos msq mq qaboos', 'الحيل': 'hail alhail al hail', 'العامرات': 'amerat amarat al amerat', 'الأنصب': 'ansab alansab al ansab' };
const ALIAS = [
  ['twin villa twin villas twin house semi detached semidetached توين تؤام توأم', 'فيلا توين'], ['townhouse town house تاون', 'تاون هاوس'], ['villa house فله فلة', 'فيلا'], ['apartment apt flat شقه', 'شقة'], ['studio ستديو', 'استوديو'],
  ['loft', 'لوفت'], ['room bedroom', 'غرفة'], ['shop store retail', 'محل'], ['office', 'مكتب'], ['pool swimming', 'مسبح'], ['sea beach view بحر شاطئ', 'إطلالة بحر'],
  ['gym fitness', 'نادٍ رياضي'], ['parking garage', 'موقف سيارة'], ['lift elevator', 'مصعد'], ['furnished', 'مفروشة'], ['family families عائلة', 'العائلات'], ['bachelor single عزاب', 'للعزاب'],
  ['balcony', 'شرفة'], ['garden yard', 'حديقة'], ['school schools', 'المدارس'], ['airport', 'المطار'], ['security guard', 'حارس أمن'], ['central ac air conditioning', 'تكييف مركزي']
];
const aliasesOf = (tok) => { const t = norm(tok); const out = [t]; if (t.length < 2) return out; ALIAS.forEach(([keys, ar]) => { if (keys.split(' ').some((k) => norm(k).startsWith(t) || (t.length > 3 && t.startsWith(norm(k))))) out.push(norm(ar)); }); Object.entries(AREA_EN).forEach(([ar, en]) => { if (en.split(' ').some((k) => k.startsWith(t))) out.push(norm(ar)); }); return out; };
function matchQ(l, q) {
  const hay = norm([l.title, l.area, l.type, l.desc, l.furnished === 'yes' ? 'مفروشة' : '', (l.feats || []).join(' ')].join(' '));
  return norm(q).split(' ').every((tok) => aliasesOf(tok).some((a) => hay.includes(a)));
}
function suggestions(q) {
  const t = norm(q); if (!t) return [];
  const act = mkt.listings.filter((l) => l.status === 'active');
  const cnt = (f) => act.filter(f).length;
  const hit = (label, extra = '') => { const h = norm(label + ' ' + extra); return t.split(' ').every((tok) => h.includes(tok) || aliasesOf(tok).some((a) => a !== tok && norm(label).includes(a))); };
  const out = [];
  LTYPES.forEach((x) => { const en = ALIAS.find(([, ar]) => ar === x)?.[0] || ''; if (hit(x, en)) out.push({ kind: 'type', v: x, label: x, tag: 'نوع', n: cnt((l) => l.type === x) }); });
  AREAS.forEach((x) => { if (hit(x, AREA_EN[x])) out.push({ kind: 'area', v: x, label: x, tag: 'منطقة', n: cnt((l) => l.area === x) }); });
  if (out.some((o) => o.kind === 'type')) { const ty = out.find((o) => o.kind === 'type').v; AREAS.forEach((a) => { const n = cnt((l) => l.type === ty && l.area === a); if (n) out.push({ kind: 'combo', v: ty, a, label: `${ty} في ${a}`, tag: 'اقتراح', n }); }); }
  FEATS.forEach((x) => { const en = ALIAS.find(([, ar]) => x.includes(ar))?.[0] || ''; if (hit(x, en)) out.push({ kind: 'feat', v: x, label: x, tag: 'ميزة', n: cnt((l) => (l.feats || []).includes(x)) }); });
  act.forEach((l) => { if (matchQ(l, q)) out.push({ kind: 'listing', v: l.id, label: l.title, tag: `${l.area} · ${fmt(l.rent)} ر.ع.`, n: -1, img: imgsOf(l)[0] }); });
  return out.filter((o) => o.n !== 0).slice(0, 8);
}
let suggIdx = -1;
function showSugg(q) {
  const box = $('#sugg'), inp = $('#mq'); if (!box) return;
  const list = suggestions(q); suggIdx = -1;
  if (!list.length) { box.hidden = true; inp.setAttribute('aria-expanded', 'false'); if (norm(q)) { box.hidden = false; box.innerHTML = '<div class="snone">لا توجد اقتراحات. جرّب: فيلا، شقة، twin، القرم</div>'; } return; }
  box.innerHTML = list.map((o, i) => `<button type="button" role="option" id="sg${i}" data-sg="${i}">${o.img ? `<img src="${esc(o.img)}" alt="">` : `<span class="sic">${o.kind === 'area' ? MI.pin : o.kind === 'feat' ? svgI('<path d="M5 12l4 4 10-10"/>', 16) : svgI('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 16)}</span>`}<span class="sl"><b>${esc(o.label)}</b><small>${esc(o.tag)}</small></span>${o.n > 0 ? `<span class="sn"><span class="num">${o.n}</span></span>` : ''}</button>`).join('');
  box._list = list; box.hidden = false; inp.setAttribute('aria-expanded', 'true');
}
function pickSugg(i) {
  const box = $('#sugg'); const o = box && box._list && box._list[i]; if (!o) return;
  box.hidden = true;
  if (o.kind === 'listing') { openListing(o.v); return; }
  mf.q = '';
  if (o.kind === 'type') mf.type = o.v;
  else if (o.kind === 'area') mf.area = o.v;
  else if (o.kind === 'combo') { mf.type = o.v; mf.area = o.a; }
  else if (o.kind === 'feat') mf.q = o.v;
  render(); toast('تم تطبيق: ' + o.label);
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sg]'); if (b) { pickSugg(Number(b.dataset.sg)); return; }
  if (!e.target.closest('.sbox')) { const box = $('#sugg'); if (box) box.hidden = true; }
});
document.addEventListener('focusin', (e) => { if (e.target.id === 'mq' && e.target.value) showSugg(e.target.value); });
document.addEventListener('keydown', (e) => {
  if (e.target.id !== 'mq') return;
  const box = $('#sugg'); if (!box || box.hidden || !box._list) { if (e.key === 'Escape') e.stopImmediatePropagation(); return; }
  const n = box._list.length;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); suggIdx = (suggIdx + (e.key === 'ArrowDown' ? 1 : -1) + n) % n; box.querySelectorAll('[data-sg]').forEach((x, i) => x.classList.toggle('on', i === suggIdx)); e.target.setAttribute('aria-activedescendant', 'sg' + suggIdx); }
  else if (e.key === 'Enter') { e.preventDefault(); if (suggIdx >= 0) pickSugg(suggIdx); else box.hidden = true; }
  else if (e.key === 'Escape') { e.stopImmediatePropagation(); box.hidden = true; }
}, true);
document.addEventListener('change', (e) => {
  if (e.target.id !== 'f-photos') return;
  const fs = [...(e.target.files || [])].slice(0, 5), box = e.target.closest('.drop'); if (!box) return;
  const ph = box.querySelector('.ph, .many'); const wrap = document.createElement('span'); wrap.className = 'many';
  fs.forEach((f) => { const i = document.createElement('img'); i.alt = ''; i.src = URL.createObjectURL(f); wrap.appendChild(i); });
  if (ph && fs.length) ph.replaceWith(wrap);
  const tx = $('#photosTxt'); if (tx) tx.textContent = fs.length ? `${fs.length} صور مختارة` : 'أضف حتى 5 صور للوحدة';
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (d.mkTab) { mf.tab = d.mkTab; render(); }
  else if ('mkClear' in d) { Object.assign(mf, { q: '', area: '', type: '', max: '', beds: '', furn: '' }); render(); }
  else if (d.mkOpen) openListing(d.mkOpen);
  else if ('mkNew' in d) listingForm();
  else if (d.mkUnit) { closeSheet(); listingForm(null, d.mkUnit); }
  else if (d.mkEdit) { closeSheet(); listingForm(d.mkEdit); }
  else if (d.mkAsk) { closeSheet(); askViewing(d.mkAsk); }
  else if (d.mkFav) {
    const i = mkt.saved.indexOf(d.mkFav); if (i >= 0) mkt.saved.splice(i, 1); else mkt.saved.push(d.mkFav);
    persistM(); toast(i >= 0 ? 'أُزيل من المحفوظة' : 'تم الحفظ في «المحفوظة»');
    const inSheet = b.closest('#sheet'); render(); if (inSheet) openListing(d.mkFav);
  }
  else if (d.mkToggle) { const l = lOf(d.mkToggle); l.status = l.status === 'active' ? 'paused' : 'active'; persistM(); closeSheet(); toast(l.status === 'active' ? 'الإعلان منشور' : 'تم إيقاف الإعلان مؤقتًا'); render(); }
  else if (d.mkDel) { const l = lOf(d.mkDel); confirmBox(`حذف إعلان «${l.title}»؟`, () => { mkt.listings = mkt.listings.filter((x) => x.id !== l.id); mkt.saved = mkt.saved.filter((x) => x !== l.id); persistM(); toast('تم حذف الإعلان'); }); }
});

/* ---------- Router ---------- */
function route() {
  const h = location.hash.slice(1);
  if (h.startsWith('building-')) return ['buildings', building(h.slice(9))];
  const pages = { overview, rent, buildings, maintenance, prefs, 't-home': tHome, 't-pay': tPay, 't-requests': tRequests, 't-receipts': tReceipts, market: () => market(false), 't-market': () => market(true) }
  Object.assign(pages, window.EXTRA_PAGES || {});
  const p = pages[h] ? h : 'overview';
  return [p, pages[p]()];
}
function render() {
  const [page, html] = route();
  const ten = page.startsWith('t-');
  document.body.classList.toggle('tenant', ten);
  const mt = $('#mtag'); if (mt) mt.textContent = ten ? 'بوابة المستأجر' : 'كل عقاراتك في مكان واحد';
  $('#view').innerHTML = html;
  moveIndicator();
  document.querySelectorAll('.links a').forEach((a) => a.classList.toggle('on', a.dataset.page === page));
  document.querySelectorAll('.side [data-set-theme], .mhead [data-set-theme]').forEach((b) => b.classList.toggle('on', b.dataset.setTheme === document.documentElement.dataset.mode));
  if (typeof afterRender === 'function') afterRender(page);
  const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = getComputedStyle(document.documentElement).getPropertyValue('--sheet').trim() || '#0C0C0E';
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if ('close' in d) { closeSheet(); openUnitId = null; return; }
  if (d.setTheme) { document.documentElement.dataset.mode = d.setTheme; save('sakan-theme', d.setTheme); }
  else if (d.setStyle) { document.documentElement.dataset.style = d.setStyle; save('sakan-style', d.setStyle); }
  else if (d.filter) { rentFilter = d.filter; }
  else if (d.setAlert) { alertAt = Number(d.setAlert); save('sakan-alert', d.setAlert); toast('سيظهر التنبيه تحت ' + alertAt + '%'); }
  else if (d.pay) { const inSheet = b.closest('#sheet') && !openUnitId; markPaid(d.pay); persist(); if (inSheet) closeSheet(); render(); if (openUnitId) openUnit(openUnitId); return; }
  else if ('newReq' in d) { newRequest(); return; }
  else if ('transfer' in d) { uploadTransfer(); return; }
  else if ('card' in d) { cardPay(); return; }
  else if ('print' in d) { window.print(); return; }
  else if (d.viewRc) {
    const [t, r] = findReceipt(d.viewRc); if (!r || !r.img) return;
    const ownerSide = !document.body.classList.contains('tenant') && r.status === 'review';
    showImage(r.img, `إيصال ${t.name} · ${r.month}`, ownerSide ? `<button class="btn" data-pay="${t.id}">تأكيد الدفع</button>` : '');
    return;
  }
  else if (d.remind) { toast('تم إرسال تذكير إلى ' + tOf(d.remind).name + ' (تجريبي)'); return; }
  else if ('remindAll' in d) { toast('تم إرسال ' + totals().unpaid.length + ' تذكيرات (تجريبي)'); return; }
  else if ('addTenant' in d) { if (!d.addTenant) openUnitId = null; addTenant(d.addTenant); return; }
  else if (d.edit) { editTenant(d.edit); return; }
  else if (d.del) { removeTenant(d.del); return; }
  else if (d.unit) { selUnit = d.unit; render(); openUnit(d.unit); return; }
  else if (d.move) { const j = db.jobs.find((x) => x.id === d.move); j.status = NEXT[j.status]; persist(); toast('تم تحديث: ' + j.title); }
  else if ('addBuilding' in d) {
    openForm('إضافة مبنى', [
      { key: 'name', label: 'اسم المبنى', required: true },
      { key: 'area', label: 'المنطقة', type: 'pick', value: 'الخوير', options: AREAS.map((x) => ({ value: x, label: x })) },
      { key: 'kind', label: 'نوع الوحدات', type: 'pick', value: 'شقة', options: UKINDS.map((x) => ({ value: x, label: x })) },
      { key: 'count', label: 'عدد الوحدات', type: 'number', value: 6, required: true },
      { key: 'rent', label: 'الإيجار المتوقع لكل وحدة (ر.ع.)', type: 'number', value: 350, required: true }
    ], (v) => {
      const id = uid('b'); db.buildings.push({ id, name: v.name.trim(), area: v.area.trim(), kind: v.kind });
      for (let n = 1; n <= Math.min(200, Number(v.count) || 0); n++) db.units.push({ id: id + '-' + n, buildingId: id, label: `${v.kind} ${n}`, rent: Number(v.rent), tenantId: null });
      toast('تمت إضافة ' + v.name); location.hash = '#building-' + id;
    });
    return;
  }
  else if (d.addUnit) {
    const bb = bOf(d.addUnit), n = db.units.filter((u) => u.buildingId === bb.id).length + 1;
    openForm('إضافة وحدة إلى ' + bb.name, [
      { key: 'label', label: 'اسم الوحدة', value: `${bb.kind} ${n}`, required: true },
      { key: 'kind', label: 'نوع الوحدة', type: 'pick', value: bb.kind, options: UKINDS.map((x) => ({ value: x, label: x })) },
      { key: 'rent', label: 'الإيجار المتوقع (ر.ع.)', type: 'number', value: 350, required: true }
    ], (v) => { const id = uid(bb.id + '-u'); db.units.push({ id, buildingId: bb.id, kind: v.kind, label: v.label.trim(), rent: Number(v.rent), tenantId: null }); selUnit = id; toast('تمت إضافة ' + v.label + ' · الصورة حسب النوع: ' + v.kind); });
    return;
  }
  else if (d.editUnit) {
    const u = unitOf(d.editUnit);
    openForm('تعديل الوحدة', [
      { key: 'label', label: 'اسم الوحدة', value: u.label, required: true },
      { key: 'kind', label: 'نوع الوحدة', type: 'pick', value: kindOf(u), options: UKINDS.map((x) => ({ value: x, label: x })) },
      { key: 'rent', label: 'الإيجار المتوقع (ر.ع.)', type: 'number', value: u.rent, required: true }
    ], (v) => { u.label = v.label.trim(); u.kind = v.kind; u.rent = Number(v.rent); toast('تم الحفظ'); });
    return;
  }
  else if (d.delUnit) {
    const u = unitOf(d.delUnit);
    confirmBox(`حذف ${u.label}؟`, () => { db.units = db.units.filter((x) => x.id !== u.id); selUnit = null; openUnitId = null; toast('تم حذف الوحدة'); });
    return;
  }
  else if (d.editBuilding) {
    const bb = bOf(d.editBuilding);
    openForm('تعديل المبنى', [
      { key: 'name', label: 'اسم المبنى', value: bb.name, required: true },
      { key: 'area', label: 'المنطقة', type: 'pick', value: bb.area, options: (AREAS.includes(bb.area) ? AREAS : [bb.area, ...AREAS]).map((x) => ({ value: x, label: x })) },
      { key: 'kind', label: 'نوع الوحدات', type: 'pick', value: bb.kind, options: UKINDS.map((x) => ({ value: x, label: x })) }
    ], (v) => { bb.name = v.name.trim(); bb.area = v.area.trim(); bb.kind = v.kind; toast('تم الحفظ'); });
    return;
  }
  else if (d.delBuilding) {
    const bb = bOf(d.delBuilding);
    const n = db.tenants.filter((t) => unitOf(t.unitId)?.buildingId === bb.id).length;
    confirmBox(`حذف ${bb.name} ووحداته ومستأجريه (${n})؟`, () => {
      const ids = new Set(db.units.filter((u) => u.buildingId === bb.id).map((u) => u.id));
      db.tenants = db.tenants.filter((t) => !ids.has(t.unitId));
      db.units = db.units.filter((u) => !ids.has(u.id));
      db.jobs = db.jobs.filter((j) => !ids.has(j.unitId));
      db.buildings = db.buildings.filter((x) => x.id !== bb.id);
      toast('تم حذف المبنى'); location.hash = '#buildings';
    });
    return;
  }
  else if ('reset' in d) { confirmBox('إعادة كل البيانات التجريبية؟', () => { db = seed(); if (typeof seedOwnerExtras === 'function') seedOwnerExtras(); mkt = seedMarket(); persistM(); toast('تمت إعادة البيانات'); }, 'إعادة'); return; }
  else return;
  render();
});

document.addEventListener('submit', (e) => {
  if (e.target.id !== 'sheetForm') return;
  e.preventDefault();
  const fd = new FormData(e.target);
  const v = Object.fromEntries(fd.entries()); v.$all = (k) => fd.getAll(k);
  const fn = sheetSave; closeSheet();
  if (fn) {
    const r = fn(v);
    if (r && r.then) { r.then(() => { if (!persist()) toast('مساحة المتصفح ممتلئة، لم تُحفظ الصورة.'); render(); }); return; }
    persist(); render(); const u = openUnitId && unitOf(openUnitId); if (u && location.hash.startsWith('#building-')) openUnit(u.id); else openUnitId = null; }
});
document.addEventListener('change', (e) => {
  if (e.target.dataset && e.target.dataset.mf) return;
  if (e.target.id === 'who') { meId = e.target.value; save('sakan-tenant', meId); render(); return; }
  if (e.target.id === 'f-photo') {
    const f = e.target.files && e.target.files[0], box = e.target.closest('.drop'); if (!f || !box) return;
    const old = box.querySelector('img, .ph'); const img = document.createElement('img'); img.alt = ''; img.src = URL.createObjectURL(f);
    if (old) old.replaceWith(img); const tx = $('#photoTxt'); if (tx) tx.textContent = f.name;
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#sheet').hidden) { closeSheet(); openUnitId = null; } });
$('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') { closeSheet(); openUnitId = null; } });
window.addEventListener('hashchange', () => { selUnit = null; openUnitId = null; closeSheet(); render(); window.scrollTo(0, 0); });
// first render happens at the end of features.js
