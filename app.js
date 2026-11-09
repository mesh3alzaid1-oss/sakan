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

/* ---------- Sheet (form / confirm) ---------- */
let sheetSave = null;
function openForm(title, fields, onSave, saveText = 'حفظ') {
  sheetSave = onSave;
  const f = fields.map((x) => {
    const id = 'f-' + x.key;
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
    : `<div><span class="mut">${esc(b.name)}</span><h2 style="font-size:22px">${esc(u.label)} · شاغرة</h2></div>
       <div class="kvs">${info('الإيجار المتوقع', `<span class="num">${fmt(u.rent)}</span> ر.ع.`)}${info('الحالة', 'جاهزة للتأجير')}</div>
       <div class="bars"><button class="btn" data-add-tenant="${u.id}">إضافة مستأجر</button><button class="btn soft" data-edit-unit="${u.id}">تعديل الوحدة</button><button class="btn danger" data-del-unit="${u.id}">حذف الوحدة</button><button class="btn soft" data-close>إغلاق</button></div>`;
  $('#sheet').innerHTML = `<div class="panel pop" role="dialog" aria-modal="true" aria-label="${esc(u.label)}">${body}</div>`;
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
function addTenant(unitId) {
  const opts = vacantOptions();
  if (!opts.length) { toast('لا توجد وحدات شاغرة. أضف وحدة من صفحة المباني.'); return; }
  const u = unitOf(unitId || opts[0].value);
  openForm('إضافة مستأجر', [
    { key: 'name', label: 'الاسم', required: true },
    { key: 'phone', label: 'رقم الهاتف', type: 'tel', placeholder: '+968' },
    { key: 'unitId', label: 'الوحدة', type: 'select', options: opts, value: u.id },
    { key: 'rent', label: 'الإيجار الشهري (ر.ع.)', type: 'number', value: u.rent, required: true },
    { key: 'due', label: 'تاريخ الاستحقاق', value: '1 ديسمبر' }
  ], (v) => {
    const t = { id: uid('t'), unitId: v.unitId, name: v.name.trim(), phone: v.phone.trim(), rent: Number(v.rent), due: v.due, status: 'due', note: 'مستحق', receipts: [] };
    db.tenants.push(t); unitOf(v.unitId).tenantId = t.id; toast('تمت إضافة ' + t.name);
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
    <section class="tile c hero s2 r2">
      <span class="lbl">الإيجار المحصّل · نوفمبر</span>
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
  </div>`;
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
      <span class="lbl">${esc(b.area)}</span>
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
      ? `<button type="button" class="unit${sel}" data-unit="${u.id}" aria-pressed="${!!sel}"><b>${esc(u.label)}</b><span>${esc(tn.name)}</span><span class="mut" style="font-size:13px"><span class="num">${fmt(tn.rent)}</span> ر.ع.</span>${pill(tn)}</button>`
      : `<button type="button" class="unit vacant${sel}" data-unit="${u.id}" aria-pressed="${!!sel}"><b>${esc(u.label)}</b><span class="mut">شاغرة</span><span class="mut" style="font-size:13px"><span class="num">${fmt(u.rent)}</span> ر.ع. متوقع</span></button>`;
  }).join('');
  const detail = '';
  return `<div class="tools"><a class="back" href="#buildings"><span class="ico" aria-hidden="true">${ICON.back}</span>كل المباني</a><div class="bars"><button class="btn" data-add-unit="${id}">إضافة وحدة</button><button class="btn soft" data-edit-building="${id}">تعديل المبنى</button><button class="btn danger" data-del-building="${id}">حذف المبنى</button></div></div>
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
      ${list.map((j) => `<article class="job">${j.photo ? `<img class="thumb" style="width:100%;height:150px" src="${esc(j.photo)}" alt="صورة من المستأجر">` : ''}<b>${esc(j.title)}${j.urgent ? ' <span class="pill late">عاجل</span>' : ''}</b>${j.desc ? `<span style="font-size:14px">${esc(j.desc)}</span>` : ''}<span class="mut" style="font-size:13px">${esc(place(j.unitId))}</span><span class="mut" style="font-size:13px">${esc(j.from)}</span>${NEXT[s] ? `<button class="btn" style="align-self:flex-start" data-move="${j.id}">${NEXT_LABEL[s]}</button>` : ''}</article>`).join('') || '<p class="mut">لا شيء هنا.</p>'}</section>`;
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
function readImage(file) {
  return new Promise((res) => {
    if (!file || !file.size || !/^image\//.test(file.type)) return res(null);
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 900 / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.7));
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
    <section class="tile c ${st === 'paid' ? 'hero' : 't2'} s2 r2">
      <span class="lbl">إيجار ${CUR}</span>
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

const CATS = [['تكييف', '❄️'], ['سباكة', '🚿'], ['كهرباء', '💡'], ['أبواب وأقفال', '🔑'], ['إزعاج', '🔊'], ['أخرى', '➕']];
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
    <div class="cats" role="radiogroup" aria-label="نوع المشكلة">${CATS.map(([c, i], k) => `<label><input type="radio" name="cat" value="${c}" ${k === 0 ? 'checked' : ''}><span><i aria-hidden="true">${i}</i>${c}</span></label>`).join('')}</div>
    <label for="f-title">عنوان قصير<input id="f-title" name="title" placeholder="مثال: المكيف لا يبرد" required></label>
    <label for="f-desc">التفاصيل<textarea id="f-desc" name="desc" placeholder="متى بدأت المشكلة؟ وأين بالضبط؟"></textarea></label>
    <label class="drop" for="f-photo"><span class="ph" aria-hidden="true">📷</span><span id="photoTxt">أضف صورة (اختياري)</span><input id="f-photo" name="photo" type="file" accept="image/*"></label>
    <label for="f-urgent">الأولوية<select id="f-urgent" name="urgent"><option value="no">عادي</option><option value="yes">عاجل</option></select></label>
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
    <label class="drop" for="f-photo"><span class="ph" aria-hidden="true">🧾</span><span id="photoTxt">اختر صورة الإيصال</span><input id="f-photo" name="photo" type="file" accept="image/*" required></label>
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

/* ---------- Router ---------- */
function route() {
  const h = location.hash.slice(1);
  if (h.startsWith('building-')) return ['buildings', building(h.slice(9))];
  const pages = { overview, rent, buildings, maintenance, prefs, 't-home': tHome, 't-pay': tPay, 't-requests': tRequests, 't-receipts': tReceipts };
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
  const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = getComputedStyle(document.documentElement).getPropertyValue('--sheet').trim() || '#0C0C0E';
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if ('close' in d) { closeSheet(); openUnitId = null; return; }
  if (d.setTheme) { document.documentElement.dataset.mode = d.setTheme; save('sakan-theme', d.setTheme); }
  else if (d.setStyle) { document.documentElement.dataset.style = d.setStyle; save('sakan-style', d.setStyle); }
  else if (d.filter) { rentFilter = d.filter; }
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
      { key: 'area', label: 'المنطقة', placeholder: 'مثال: العذيبة' },
      { key: 'kind', label: 'نوع الوحدات', type: 'select', value: 'شقة', options: ['شقة', 'فيلا', 'لوفت', 'محل', 'مكتب'].map((x) => ({ value: x, label: x })) },
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
      { key: 'rent', label: 'الإيجار المتوقع (ر.ع.)', type: 'number', value: 350, required: true }
    ], (v) => { const id = uid(bb.id + '-u'); db.units.push({ id, buildingId: bb.id, label: v.label.trim(), rent: Number(v.rent), tenantId: null }); selUnit = id; toast('تمت إضافة ' + v.label); });
    return;
  }
  else if (d.editUnit) {
    const u = unitOf(d.editUnit);
    openForm('تعديل الوحدة', [
      { key: 'label', label: 'اسم الوحدة', value: u.label, required: true },
      { key: 'rent', label: 'الإيجار المتوقع (ر.ع.)', type: 'number', value: u.rent, required: true }
    ], (v) => { u.label = v.label.trim(); u.rent = Number(v.rent); toast('تم الحفظ'); });
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
      { key: 'area', label: 'المنطقة', value: bb.area }
    ], (v) => { bb.name = v.name.trim(); bb.area = v.area.trim(); toast('تم الحفظ'); });
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
  else if ('reset' in d) { confirmBox('إعادة كل البيانات التجريبية؟', () => { db = seed(); toast('تمت إعادة البيانات'); }, 'إعادة'); return; }
  else return;
  render();
});

document.addEventListener('submit', (e) => {
  if (e.target.id !== 'sheetForm') return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(e.target).entries());
  const fn = sheetSave; closeSheet();
  if (fn) {
    const r = fn(v);
    if (r && r.then) { r.then(() => { if (!persist()) toast('مساحة المتصفح ممتلئة، لم تُحفظ الصورة.'); render(); }); return; }
    persist(); render(); const u = openUnitId && unitOf(openUnitId); if (u && location.hash.startsWith('#building-')) openUnit(u.id); else openUnitId = null; }
});
document.addEventListener('change', (e) => {
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
render();
