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
function drawMap(list) {
  const box = $('#mmap'); if (!box) return;
  loadLeaflet().then((L) => {
    if (!document.body.contains(box)) return;
    if (!mapObj || mapObj.getContainer() !== box) {
      if (mapObj) mapObj.remove();
      mapObj = L.map(box, { scrollWheelZoom: false }).setView([23.6, 58.35], 11);
      const dark = document.documentElement.dataset.mode === 'dark';
      L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, { subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(mapObj);
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

render();
