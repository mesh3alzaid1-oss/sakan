// Sakan language switch (Arabic / English). In English mode every Arabic phrase that appears on screen
// is replaced from the dictionary below, and the layout runs left to right.
const EN = {
  // ---------- General ----------
  'في': 'in', 'من': 'of', 'إلى': 'to', 'حتى': 'until', 'منذ': 'since', 'بين:': 'between:', 'من 5': 'of 5', ') في': ') in',
  'سكن': 'Sakan', 'حفظ': 'Save', 'عرض': 'View', 'حذف': 'Delete', 'مسح': 'Clear', 'بحث': 'Search', 'صور': 'photos', 'دفع': 'Paid', 'أمس': 'Yesterday', 'اليوم': 'Today',
  'جديد': 'New', 'جديدة': 'new', 'جديدة ·': 'new ·', 'أخرى': 'Other', 'الكل': 'All', 'عام': 'General', 'نوع': 'Type', 'ميزة': 'Feature', 'منطقة': 'Area', 'اقتراح': 'Suggestion',
  'قبول': 'Accept', 'إغلاق': 'Close', 'إلغاء': 'Cancel', 'تأكيد': 'Confirm', 'تعديل': 'Edit', 'إضافة': 'Add', 'إعادة': 'Reset', 'طباعة': 'Print', 'تجديد': 'Renew', 'تذكير': 'Remind',
  'فاتح': 'Light', 'داكن': 'Dark', 'المظهر': 'Appearance', 'النمط': 'Style', 'ملوّن': 'Vivid', 'قائمة': 'List', 'خريطة': 'Map', 'واتساب': 'WhatsApp', 'رسالة': 'Message', 'الوقت': 'Time',
  'ر.ع.': 'OMR', 'ر.ع.)': 'OMR)', 'ر.ع. ·': 'OMR ·', '/ شهر': '/ month', 'ر.ع. / شهر': 'OMR / month', 'ر.ع. شهريًا': 'OMR a month', 'ريال عُماني': 'Omani rials', 'عُماني': 'Omani', 'ر.ع. متوقع': 'OMR expected',
  'م²': 'm²', 'غرف': 'beds', '+ غرف': '+ beds', 'حمّام': 'bath', 'شهر': 'Month', 'شهران': '2 months', 'أشهر': 'months', '6 أشهر': '6 months', 'سنة': '1 year', 'سنتان': '2 years', 'أسبوع': '1 week', 'أسبوعان': '2 weeks',
  'يومًا': 'days', '· بعد': '· in', 'باقٍ': '', 'لا شيء': 'Nothing', 'لا توجد': 'None', 'لا شيء هنا.': 'Nothing here.', '(تجريبي)': '(demo)', 'تقرير': 'Report', 'إيجار': 'Rent', 'إيصال': 'Receipt',
  'مستحق': 'Due', 'مدفوع': 'Paid', 'دُفع': 'Paid', 'متأخر': 'Late', 'متأخر ·': 'late ·', 'قريبًا': 'due soon', 'عاجل': 'Urgent', 'عادي': 'Normal', 'منشور': 'Live', 'موثّق': 'Verified', 'مؤكدة': 'Confirmed',
  'ساري': 'Active', 'منتهٍ': 'Expired', 'جُدِّد': 'Renewed', 'متوقع': 'expected', 'مؤجرة': 'rented', 'مؤجرة ·': 'rented ·', 'شاغرة': 'vacant', 'شاغرة:': 'vacant:', '· شاغرة': '· vacant', '· شاغرة:': '· vacant:',
  'مشاهدة': 'views', 'مشاهدة ·': 'views ·', 'طلبًا': 'jobs', 'مبانٍ': 'buildings', 'مبانٍ ·': 'buildings ·', 'وحدة': 'units', 'جيد': 'Good', 'ممتاز': 'Excellent', 'يحتاج تحسين': 'Needs work',
  'صباحًا': 'Morning', 'مساءً': 'Evening', 'عطلة نهاية الأسبوع': 'Weekend', 'الساعة': 'at', 'أي عدد': 'Any', 'أو أكثر': 'or more', '★ مميز': '★ Featured', '★ مميز حتى': '★ Featured until',
  '9–11 ص': '9–11 am', '12–2 م': '12–2 pm', '4–6 م': '4–6 pm', 'تقييم)': 'reviews)', 'أُرسل': 'sent', '· أُرسل': '· sent', 'أقربها': 'soonest', 'أقربها:': 'Soonest:', 'محفوظ ✓': 'Saved ✓',
  'لم يدفع': 'Unpaid', 'لم يدفعوا': 'unpaid', 'الكل دفع': 'Everyone paid', 'تم الحفظ': 'Saved', 'تم الدفع': 'Mark paid', 'نُشر': 'posted', 'صدرت': 'Issued', 'أصبح': 'became',
  // ---------- Months, days ----------
  'يناير': 'January', 'فبراير': 'February', 'مارس': 'March', 'أبريل': 'April', 'مايو': 'May', 'يونيو': 'June', 'يوليو': 'July', 'أغسطس': 'August', 'سبتمبر': 'September', 'أكتوبر': 'October', 'نوفمبر': 'November', 'ديسمبر': 'December',
  'ينا': 'Jan', 'فبر': 'Feb', 'مار': 'Mar', 'أبر': 'Apr', 'ماي': 'May', 'يون': 'Jun', 'يول': 'Jul', 'أغس': 'Aug', 'سبت': 'Sep', 'أكت': 'Oct', 'نوف': 'Nov', 'ديس': 'Dec',
  'الأحد': 'Sunday', 'الإثنين': 'Monday', 'الثلاثاء': 'Tuesday', 'الأربعاء': 'Wednesday', 'الخميس': 'Thursday', 'الجمعة': 'Friday', 'السبت': 'Saturday',
  'نوفمبر 2026': 'November 2026', 'نوفمبر 2026 ·': 'November 2026 ·',
  // ---------- Areas, types, features ----------
  'الخوير': 'Al Khuwair', 'القرم': 'Qurum', 'بوشر': 'Bausher', 'الموج': 'Al Mouj', 'المعبيلة': 'Al Maabilah', 'العذيبة': 'Al Azaiba', 'الغبرة': 'Al Ghubrah', 'الخوض': 'Al Khoudh', 'السيب': 'Seeb', 'مطرح': 'Muttrah', 'روي': 'Ruwi',
  'مدينة السلطان قابوس': 'Madinat Sultan Qaboos', 'الحيل': 'Al Hail', 'العامرات': 'Al Amerat', 'الأنصب': 'Al Ansab', 'خليج عُمان': 'Gulf of Oman', 'خريطة مبسطة من سكن': 'Simplified map by Sakan',
  'شقة': 'Apartment', 'استوديو': 'Studio', 'فيلا': 'Villa', 'فيلا توين': 'Twin villa', 'تاون هاوس': 'Townhouse', 'لوفت': 'Loft', 'غرفة': 'Room', 'محل': 'Shop', 'مكتب': 'Office',
  'موقف سيارة': 'Parking', 'مصعد': 'Lift', 'مسبح': 'Pool', 'نادٍ رياضي': 'Gym', 'تكييف مركزي': 'Central AC', 'شرفة': 'Balcony', 'إطلالة بحر': 'Sea view', 'حارس أمن': 'Security guard',
  'قريب من المدارس': 'Near schools', 'يسمح بالعائلات فقط': 'Families only', 'للعزاب': 'Bachelors OK', 'مفروشة': 'Furnished', 'غير مفروشة': 'Unfurnished', '· مفروشة': '· furnished', 'العائلات': 'families', 'المدارس': 'schools', 'المطار': 'airport', 'حديقة': 'garden',
  // ---------- People and places in the sample data ----------
  'سالم العبري': 'Salem Al Abri', 'سالم العبري ·': 'Salem Al Abri ·', 'سالم العبري (مثال)': 'Salem Al Abri (sample)', 'سالم العبري (مثال) &nbsp;·&nbsp;': 'Salem Al Abri (sample) · ',
  'حامد البلوشي': 'Hamed Al Balushi', 'بريا ناير': 'Priya Nair', 'يوسف الرواحي': 'Yousuf Al Rawahi', 'أحمد خان': 'Ahmed Khan', 'مريم الهنائية': 'Maryam Al Hinaiya', 'خالد المعمري': 'Khalid Al Maamari',
  'فاطمة السعدية': 'Fatma Al Saadiya', 'جيمس كارتر': 'James Carter', 'سيف الكندي': 'Saif Al Kindi', 'نورة اللواتية': 'Noora Al Lawatiya', 'راهول ميهتا': 'Rahul Mehta', 'سالمة الحبسية': 'Salma Al Habsiya',
  'محمد': 'Mohammed', 'سعيد': 'Saeed', 'علي': 'Ali', 'عبدالله': 'Abdullah', 'ناصر': 'Nasser', 'هلال': 'Hilal', 'سلطان': 'Sultan', 'بدر': 'Badr', 'خلفان': 'Khalfan', 'ماجد': 'Majid', 'حمد': 'Hamad', 'طلال': 'Talal', 'مازن': 'Mazin', 'زاهر': 'Zaher', 'وليد': 'Waleed',
  'الشكيلي': 'Al Shukaili', 'العامري': 'Al Amri', 'الهاشمي': 'Al Hashmi', 'الفارسي': 'Al Farsi', 'الريامي': 'Al Riyami', 'الشحي': 'Al Shehhi', 'المقبالي': 'Al Maqbali', 'البوسعيدي': 'Al Busaidi', 'الغافري': 'Al Ghafri', 'الحوسني': 'Al Hosni',
  'عبدالله الشكيلي': 'Abdullah Al Shukaili', 'سارة توماس': 'Sarah Thomas', 'راشد البلوشي': 'Rashid Al Balushi', 'عمر السيابي': 'Omar Al Siyabi', 'أنور حسين': 'Anwar Hussain', 'شركة المصاعد الحديثة': 'Modern Lifts Co.', 'محمود النجار': 'Mahmoud Al Najjar',
  'عقارات النخبة (مثال)': 'Elite Properties (sample)', 'محمد الحارثي (مثال)': 'Mohammed Al Harthy (sample)', 'ليلى البوسعيدية (مثال)': 'Layla Al Busaidiya (sample)', 'شركة الواحة العقارية (مثال)': 'Al Waha Real Estate (sample)', 'خالد الريامي (مثال)': 'Khalid Al Riyami (sample)',
  'برج الخوير': 'Khuwair Tower', 'سكن القرم': 'Qurum Residence', 'فلل بوشر': 'Bausher Villas', 'لوفتات الموج': 'Al Mouj Lofts', 'بنك مسقط': 'Bank Muscat',
  // ---------- Navigation and pages ----------
  'نظرة عامة': 'Overview', 'المباني': 'Buildings', 'الإيجار': 'Rent', 'العقود': 'Contracts', 'المالية': 'Finance', 'الصيانة': 'Maintenance', 'السوق': 'Market', 'الإعدادات': 'Settings',
  'الرئيسية': 'Home', 'الدفع': 'Pay', 'طلباتي': 'My requests', 'عقدي': 'My contract', 'الإيصالات': 'Receipts', 'بوابة المستأجر': 'Tenant portal', 'العودة لحساب المالك': 'Back to owner account', 'العودة لحساب المالك (تجربة)': 'Back to owner account (demo)',
  'كل عقاراتك في مكان واحد': 'All your properties in one place', 'سكن · كل عقاراتك في مكان واحد': 'Sakan · All your properties in one place', 'من تطوير CUE': 'Made by CUE', 'الإشعارات': 'Notifications', 'الإشعارات ·': 'Notifications ·',
  // ---------- Overview ----------
  'مساء الخير يا سالم': 'Good evening, Salem', 'مستأجرين لم يدفعوا بعد، و': 'tenants haven\'t paid yet, and', 'طلبات صيانة مفتوحة.': 'open maintenance requests.',
  'الإيجار المحصّل · نوفمبر': 'Rent collected · November', 'التحصيل منخفض · أقل من': 'Low collection · below', 'غير مدفوع': 'Unpaid', 'طلبات مفتوحة': 'Open requests', 'من لم يدفع': 'Who hasn\'t paid', 'كل الإيجارات': 'All rent',
  'الكل دفع هذا الشهر.': 'Everyone paid this month.', 'الوحدات المؤجرة': 'Rented units', 'آخر طلب': 'Latest request', 'فتح الصيانة': 'Open maintenance', 'لا توجد طلبات جديدة': 'No new requests',
  'يحتاج انتباهك': 'Needs your attention', 'عقود تنتهي خلال 60 يومًا': 'Contracts ending within 60 days', 'عقود تنتهي خلال 60 يومًا ·': 'Contracts ending within 60 days ·', 'عقود بانتظار التوقيع': 'Contracts awaiting signature', 'أرسل تذكيرًا للمستأجر': 'Send the tenant a reminder', 'كل العقود موقّعة': 'All contracts signed',
  'معاينات قادمة': 'Upcoming viewings', 'طلبات معاينة جديدة': 'New viewing requests', 'من سوق سكن': 'from Sakan Market', 'صافي الربح ·': 'Net profit ·', 'المالية ←': 'Finance →', 'دخل': 'Income', '− مصروفات': '− expenses',
  // ---------- Rent ----------
  'إضافة مستأجر': 'Add tenant', 'في وحدة شاغرة': 'in a vacant unit', 'تذكير الجميع': 'Remind everyone', 'إدارة الوحدات': 'Manage units', 'المباني والوحدات': 'Buildings and units', 'المحصّل': 'Collected',
  'المستأجر': 'Tenant', 'الوحدة': 'Unit', 'الاستحقاق': 'Due date', 'الحالة': 'Status', 'إجراءات': 'Actions', 'تأكيد الدفع': 'Confirm payment', 'لا يوجد مستأجرون هنا.': 'No tenants here.',
  'إيصال للمراجعة': 'Receipt to review', 'عرض الإيصال': 'View receipt', 'متأخر 12 يومًا': '12 days late', 'متأخر 8 أيام': '8 days late', 'متأخر 5 أيام': '5 days late', 'يستحق بعد يومين': 'Due in 2 days',
  'دُفع 1 نوفمبر': 'Paid 1 November', 'دُفع 2 نوفمبر': 'Paid 2 November', 'دُفع 31 أكتوبر': 'Paid 31 October', 'دُفع 30 أكتوبر': 'Paid 30 October', '28 أكتوبر': '28 October', '1 نوفمبر': '1 November', '1 ديسمبر': '1 December',
  'الاسم': 'Name', 'رقم الهاتف': 'Phone number', 'الإيجار الشهري (ر.ع.)': 'Monthly rent (OMR)', 'تاريخ الاستحقاق': 'Due date', 'حالة الدفع': 'Payment status', 'تعديل بيانات المستأجر': 'Edit tenant details', 'تم حفظ التعديلات': 'Changes saved',
  'إخلاء': 'Move out', 'إخلاء وحذف': 'Move out and delete', 'أصبحت الوحدة شاغرة': 'The unit is now vacant', 'تمت إضافة': 'Added', 'تم تسجيل دفع': 'Payment recorded for', 'سجّله المالك': 'Recorded by owner',
  'لا توجد وحدات شاغرة. أضف وحدة من صفحة المباني.': 'No vacant units. Add a unit from Buildings.', 'لا يمكن التراجع عن هذا.': 'This can\'t be undone.',
  // ---------- Buildings ----------
  'إضافة مبنى': 'Add building', 'اسم المبنى': 'Building name', 'المنطقة': 'Area', 'نوع الوحدات': 'Unit type', 'عدد الوحدات': 'Number of units', 'الإيجار المتوقع لكل وحدة (ر.ع.)': 'Expected rent per unit (OMR)',
  'تم تحصيل': 'Collected', 'لا توجد مبانٍ بعد. أضف أول مبنى.': 'No buildings yet. Add your first one.', 'كل المباني': 'All buildings', 'إضافة وحدة': 'Add unit', 'تعديل المبنى': 'Edit building', 'حذف المبنى': 'Delete building',
  'إعلان للسكان': 'Notice to residents', 'اضغط على أي وحدة لعرض التفاصيل.': 'Tap any unit to see details.', 'لا توجد وحدات. أضف وحدة.': 'No units. Add one.', 'لم يتم العثور على هذا المبنى.': 'Building not found.', 'رجوع للمباني': 'Back to buildings',
  'مستأجر لم يدفع': 'tenants unpaid', 'الهاتف': 'Phone', 'غير مضاف': 'Not added', 'الإيجار الشهري': 'Monthly rent', 'طلبات الصيانة المفتوحة': 'Open maintenance requests', 'تعديل البيانات': 'Edit details', 'إخلاء الوحدة': 'Move out',
  'الإيجار المتوقع': 'Expected rent', 'جاهزة للتأجير': 'Ready to rent', 'عرض إعلانها في السوق': 'View its ad in Market', 'انشر في السوق': 'List in Market', 'تعديل الوحدة': 'Edit unit', 'حذف الوحدة': 'Delete unit',
  'إضافة وحدة إلى': 'Add unit to', 'اسم الوحدة': 'Unit name', 'نوع الوحدة': 'Unit type', 'الإيجار المتوقع (ر.ع.)': 'Expected rent (OMR)', '· الصورة حسب النوع:': '· picture by type:', 'تم حذف الوحدة': 'Unit deleted', 'تم حذف المبنى': 'Building deleted', 'ووحداته ومستأجريه (': 'and its units and tenants (',
  // ---------- Maintenance ----------
  'طلبات المستأجرين': 'Tenant requests', 'قيد التنفيذ': 'In progress', 'قيد التنفيذ ·': 'In progress ·', 'تم الإصلاح': 'Fixed', 'تم الإصلاح ·': 'Fixed ·', 'بدء العمل': 'Start work', 'تم الاستلام': 'Received', 'تم تحديث:': 'Updated:',
  'المكيف لا يبرد': 'AC isn\'t cooling', 'تسرّب ماء تحت مغسلة المطبخ': 'Water leak under the kitchen sink', 'إزعاج من الشقة العلوية': 'Noise from the flat above', 'ريموت بوابة المواقف لا يعمل': 'Parking gate remote not working',
  'المصعد يتوقف بين الطوابق': 'Lift stops between floors', 'إضاءة الحمام تومض': 'Bathroom light flickers', 'عبر الهاتف · سجّلته لينا': 'By phone · logged by Lina', 'في التطبيق · صورتان': 'In the app · 2 photos',
  'راشد · اليوم 4–6 م': 'Rashid · today 4–6 pm', 'شركة المصاعد · الأربعاء': 'Lift company · Wednesday', 'التكلفة 12 ر.ع.': 'Cost 12 OMR', 'التكلفة': 'Cost',
  'إسناد لفني': 'Assign technician', 'الفني': 'Technician', 'تكييف': 'AC', 'سباكة': 'Plumbing', 'كهرباء': 'Electrical', 'أبواب وأقفال': 'Doors and locks', 'إزعاج': 'Noise', 'مصاعد': 'Lifts', 'نجارة وأقفال': 'Carpentry and locks',
  'الرسالة التي تصل للفني على واتساب': 'Message the technician gets on WhatsApp', 'إرسال للفني': 'Send to technician', 'فتح في واتساب': 'Open in WhatsApp', '>فتح في واتساب': '>Open in WhatsApp', 'مرحبًا': 'Hello', '، لدينا طلب صيانة (': ', we have a maintenance request (',
  '، مسقط. هل يناسبك الموعد المحدد؟ — سالم، عبر سكن': ', Muscat. Does the chosen time suit you? — Salem, via Sakan', ') في': ') in', 'أُرسل الطلب إلى': 'Request sent to', 'وأُبلغ المستأجر بالموعد': 'and the tenant was told the time', 'سيزورك': 'Visiting you:', 'لطلب:': 'for:',
  'تكلفة الإصلاح (ر.ع.) · تُضاف تلقائيًا للمصروفات': 'Repair cost (OMR) · added to expenses automatically', 'ملاحظة': 'Note', 'نفّذه': 'Done by', 'إغلاق الطلب': 'Close request', 'تم الإغلاق وأُضيف': 'Closed, and added', 'ر.ع. إلى المصروفات': 'OMR to expenses', 'تم إغلاق الطلب': 'Request closed',
  'تم إصلاح:': 'Fixed:', '. كيف كانت الخدمة؟': '. How was the service?', 'كيف كانت الخدمة؟': 'How was the service?', 'تقييمك:': 'Your rating:', 'شكرًا لتقييمك': 'Thanks for rating',
  // ---------- Settings ----------
  'مربعات زجاجية بألوان زاهية وقائمة جانبية.': 'Glass tiles in bright colours with a side menu.', 'عُماني': 'Omani', 'ألوان الرمل والأخضر والطيني وقائمة علوية.': 'Sand, green and clay colours with a top menu.',
  'تنبيه التحصيل': 'Collection alert', 'يتحوّل مربع «الإيجار المحصّل» في النظرة العامة إلى الأحمر عندما تقل نسبة التحصيل عن:': 'The "Rent collected" box on the Overview turns red when collection drops below:', 'سيظهر التنبيه تحت': 'Alert will show below',
  'شاهد التطبيق كما يراه المستأجر: الدفع، رفع الإيصال، وطلبات الصيانة مع الصور. كل ما يرسله يظهر عندك هنا.': 'See the app as your tenant does: paying, uploading receipts and maintenance requests with photos. Everything they send shows up here.',
  'فتح بوابة المستأجر': 'Open tenant portal', 'البيانات': 'Data', 'تُحفظ تغييراتك في هذا المتصفح فقط.': 'Your changes are saved in this browser only.', 'إعادة البيانات التجريبية': 'Reset sample data', 'إعادة كل البيانات التجريبية؟': 'Reset all sample data?', 'تمت إعادة البيانات': 'Sample data reset',
  'سكن يجمع مبانيك ووحداتك ومستأجريك في شاشة واحدة: من دفع ومن لم يدفع، الوحدات الشاغرة، وطلبات الصيانة. ويمكن ربطه بلينا، المساعدة الصوتية من CUE، لتسجيل طلبات المستأجرين من الهاتف.': 'Sakan puts your buildings, units and tenants on one screen: who paid and who didn\'t, vacant units and maintenance requests. It connects to Lina, the voice assistant from CUE, to log tenant requests by phone.',
  'من تطوير CUE · فريق من مسقط يصمم المواقع والتطبيقات ووكلاء الذكاء الاصطناعي للشركات.': 'Made by CUE · a Muscat team building websites, apps and AI agents for businesses.', 'نسخة تجريبية · كل الأسماء والمبالغ أمثلة.': 'Demo version · all names and amounts are examples.',
  // ---------- Tenant portal ----------
  'تجربة كمستأجر': 'Try as tenant', 'كمستأجر': 'as tenant', 'إيجار نوفمبر 2026': 'Rent November 2026', 'لم يُدفع بعد': 'Not paid yet', 'تم الدفع. شكرًا لك.': 'Paid. Thank you.', 'تم الدفع. مدفوع مقدمًا حتى': 'Paid. Paid ahead until',
  'إيصالك وصل للمالك وهو قيد المراجعة.': 'Your receipt reached the owner and is being reviewed.', '. الرجاء الدفع في أقرب وقت.': '. Please pay as soon as you can.', 'يستحق في': 'Due on', 'ادفع الآن': 'Pay now',
  'طلباتي المفتوحة': 'My open requests', 'طلب صيانة جديد': 'New maintenance request', 'وحدتي': 'My unit', 'آخر طلباتي': 'My latest requests', 'كل الطلبات': 'All requests', 'لا توجد طلبات. إذا تعطل شيء في وحدتك، أرسل طلبًا مع صورة.': 'No requests. If something breaks in your unit, send a request with a photo.',
  'لا يوجد مستأجرون بعد. أضف مستأجرًا من حساب المالك.': 'No tenants yet. Add one from the owner account.', 'لا يوجد مبلغ مستحق': 'Nothing due', 'إيصالك قيد المراجعة': 'Your receipt is being reviewed', 'سيصلك تأكيد عندما يراجعه المالك.': 'You\'ll get a confirmation once the owner reviews it.', 'عرض الإيصال المرفوع': 'View uploaded receipt',
  'المبلغ المستحق ·': 'Amount due ·', 'حساب المالك للتحويل': 'Owner\'s account for transfers', 'البنك': 'Bank', 'اسم الحساب': 'Account name', 'المرجع': 'Reference', 'الدفع بالبطاقة': 'Pay by card', 'فيزا · ماستركارد · Apple Pay': 'Visa · Mastercard · Apple Pay',
  'رفع إيصال تحويل': 'Upload transfer receipt', 'حوّلت المبلغ؟ ارفع صورة الإيصال ليراجعها المالك.': 'Already transferred? Upload a photo of the receipt for the owner to review.', 'لا توجد طلبات بعد.': 'No requests yet.', 'لا توجد إيصالات بعد.': 'No receipts yet.',
  'إيصال إيجار': 'Rent receipt', 'تحويل بنكي': 'Bank transfer', '· صورة مرفقة': '· photo attached', 'قيد المراجعة': 'Under review',
  'عنوان قصير': 'Short title', 'مثال: المكيف لا يبرد': 'e.g. AC isn\'t cooling', 'التفاصيل': 'Details', 'متى بدأت المشكلة؟ وأين بالضبط؟': 'When did it start? Where exactly?', 'أضف صورة (اختياري)': 'Add a photo (optional)', 'الأولوية': 'Priority',
  'خلال يومين إلى ثلاثة': 'Within 2–3 days', 'تسرّب، كهرباء، لا يوجد ماء': 'Leak, electricity, no water', 'إرسال الطلب': 'Send request', 'تم إرسال طلبك للمالك': 'Your request was sent to the owner', '· في التطبيق': '· in the app', '· صورة': '· photo',
  'رفع إيصال التحويل': 'Upload transfer receipt', 'المبلغ المحوّل (ر.ع.)': 'Amount transferred (OMR)', 'اختر صورة الإيصال': 'Choose the receipt photo', 'إرسال للمالك': 'Send to owner', 'لم نتمكن من قراءة الصورة. جرّب صورة أخرى.': 'Couldn\'t read that image. Try another one.', 'تم رفع الإيصال. سيراجعه المالك.': 'Receipt uploaded. The owner will review it.',
  'في النسخة الحقيقية تفتح هنا صفحة دفع آمنة من بوابة دفع عُمانية، ويصل المبلغ لحساب المالك مباشرة ويُسجَّل الإيصال تلقائيًا.': 'In the real version a secure page from an Omani payment gateway opens here; the money goes straight to the owner and the receipt is recorded automatically.',
  'هذه نسخة تجريبية ولن يتم خصم أي مبلغ.': 'This is a demo; nothing will be charged.', 'المبلغ': 'Amount', 'محاكاة دفع ناجح': 'Simulate successful payment', 'بطاقة (تجريبي)': 'Card (demo)', 'بطاقة · دفع مقدم (تجريبي)': 'Card · paid ahead (demo)',
  'كم شهرًا تريد أن تدفع؟': 'How many months do you want to pay?', 'ادفع مقدمًا وارتح من التذكيرات': 'Pay ahead and skip the reminders', 'الأشهر': 'Months', 'الشهر': 'Month', 'أشهر مقدمًا': 'months ahead', 'مدفوع حتى': 'Paid until',
  'سجل الإيجار': 'Rental record', 'أثبت لأي مالك جديد أنك مستأجر ملتزم.': 'Show any new landlord you\'re a reliable tenant.', 'عرض الشهادة': 'View certificate', 'الالتزام بالدفع': 'On-time payments', 'مستأجر منذ': 'Tenant since', 'أشهر مدفوعة': 'Months paid', 'إجمالي المدفوع': 'Total paid',
  'شهادة سجل إيجار': 'Rental record certificate', 'نشهد بأن': 'This certifies that', 'مستأجر في': 'is a tenant at', 'التقييم': 'Rating', 'أشهر مدفوعة عبر سكن': 'Months paid via Sakan', 'يمكن للمؤجّر الجديد التحقق من هذه الشهادة برمز التحقق:': 'A new landlord can verify this certificate with the code:', 'شهادة تجريبية من سكن · الأرقام أمثلة.': 'Demo certificate from Sakan · figures are examples.', 'مشاركة عبر واتساب': 'Share on WhatsApp',
  'إعلانات المبنى': 'Building notices', 'عقدك بانتظار توقيعك': 'Your contract is waiting for your signature', 'مراجعة وتوقيع': 'Review and sign', 'بانتظار توقيعك': 'Waiting for your signature', 'راجع العقد ووقّعه من هاتفك': 'Review and sign the contract on your phone', 'عقد ساري': 'Active contract', 'ينتهي': 'Ends',
  'يومًا · سيرسل لك المالك عرض التجديد هنا': 'days left · the owner will send a renewal offer here', 'لا يوجد عقد مسجّل بعد. سيظهر هنا عندما يرسله المالك.': 'No contract yet. It will appear here when the owner sends it.',
  // ---------- Marketplace ----------
  'ابحث عن سكن': 'Find a home', 'سوق سكن': 'Sakan Market', 'شقق وفلل للإيجار في مسقط، من الملّاك مباشرة.': 'Apartments and villas for rent in Muscat, straight from owners.', 'اعرض وحداتك الشاغرة، واستقبل طلبات المعاينة هنا.': 'List your vacant units and get viewing requests here.',
  'أضف إعلان': 'Add listing', 'صور ووصف وسعر': 'Photos, details, price', 'تصفّح': 'Browse', 'المحفوظة': 'Saved', 'كل الإعلانات': 'All listings', 'إعلاناتي': 'My listings', 'طلب جديد': 'new request', 'إعلانك': 'Your ad',
  'كل المناطق': 'All areas', 'كل الأنواع': 'All types', 'النوع': 'Type', 'غرف النوم': 'Bedrooms', 'أقصى إيجار (ر.ع.)': 'Max rent (OMR)', 'الأثاث': 'Furnishing', 'الترتيب': 'Sort', 'الأحدث': 'Newest', 'الأقل سعرًا': 'Lowest price', 'الأعلى سعرًا': 'Highest price', 'الأكبر مساحة': 'Largest',
  'إعلان': 'listings', 'مسح الفلاتر': 'Clear filters', 'احفظ البحث وأبلغني': 'Save search and alert me', 'اختر فلاتر أولًا': 'Choose filters first', 'تم حفظ البحث. سنبلغك عند نزول إعلان جديد يطابقه.': 'Search saved. We\'ll tell you when a new matching listing appears.',
  'عمليات البحث المحفوظة': 'Saved searches', 'نبلغك عند نزول إعلان جديد يطابقها': 'We alert you when a new match appears', 'الإعلانات المحفوظة': 'Saved listings', 'لم تحفظ أي بحث. اختر فلاتر في «تصفّح» ثم اضغط «احفظ البحث وأبلغني».': 'No saved searches. Choose filters in "Browse" and tap "Save search and alert me".',
  'لم تحفظ أي إعلان بعد. اضغط على القلب في أي إعلان لحفظه.': 'No saved listings yet. Tap the heart on any listing to save it.', 'لا توجد إعلانات بهذه الشروط. جرّب توسيع البحث.': 'No listings match. Try widening your search.', 'أُزيل من المحفوظة': 'Removed from Saved', 'تم الحفظ في «المحفوظة»': 'Saved to "Saved"',
  'لا توجد اقتراحات. جرّب: فيلا، شقة، twin، القرم': 'No suggestions. Try: villa, apartment, twin, Qurum', 'تم تطبيق:': 'Applied:', 'فيلا توين في الموج': 'Twin villa in Al Mouj',
  'صور · اسحب لرؤية المزيد': 'photos · swipe for more', 'المساحة': 'Size', 'الحمّامات': 'Bathrooms', 'على سكن منذ': 'On Sakan since', 'لا توجد تقييمات بعد': 'No reviews yet', '· مستأجر سابق': '· former tenant', 'احجز موعد معاينة': 'Book a viewing', 'واتساب المعلن': 'WhatsApp the owner',
  'ضمن سعر السوق': 'In line with the market', 'أعلى من سعر السوق': 'Above market price', 'أقل من سعر السوق': 'Below market price', 'وحدات مشابهة (': 'Similar units (', ') تؤجَّر عادة بين': ') usually rent for between', 'تقدير سكن من أسعار السوق · تجريبي': 'Sakan market estimate · demo',
  'اليوم': 'Day', 'الوقت المتاح': 'Available times', 'اسمك': 'Your name', 'رقم الهاتف أو واتساب': 'Phone or WhatsApp', 'مرحبًا، أرغب في معاينة الوحدة في الموعد المختار.': 'Hello, I\'d like to view the unit at the chosen time.', 'تأكيد الحجز': 'Confirm booking', 'تم حجز المعاينة:': 'Viewing booked:',
  'موعد واحد محجوز في هذا اليوم': '1 slot already booked this day', 'موعدان محجوزان في هذا اليوم': '2 slots already booked this day', 'مواعيد محجوزة في هذا اليوم': 'slots already booked this day', 'أرغب في معاينة الوحدة.': 'I\'d like to view the unit.', 'طلب معاينة جديد من': 'New viewing request from',
  'المعاينات القادمة': 'Upcoming viewings', 'لا توجد معاينات محجوزة بعد.': 'No viewings booked yet.', 'تم تأكيد الموعد وإبلاغ': 'Time confirmed and told', 'تم تأكيد موعد معاينتك:': 'Your viewing is confirmed:',
  'متوقف مؤقتًا': 'Paused', 'تم التأجير': 'Rented', 'التوثيق قيد المراجعة': 'Verification under review', 'طلب معاينة · نُشر': 'viewing requests · posted', 'إيقاف مؤقت': 'Pause', 'إعادة النشر': 'Republish', '★ ميّز الإعلان': '★ Feature this ad', 'اطلب التوثيق': 'Request verification', 'اعتماد التوثيق (تجريبي)': 'Approve verification (demo)',
  'طلبات المعاينة': 'Viewing requests', 'معاينة:': 'Viewing:', 'رد عبر واتساب': 'Reply on WhatsApp', 'قبول كمستأجر': 'Accept as tenant', 'أصبح مستأجرًا': 'Became a tenant', 'مستأجرًا · أُنشئ عقده للتوقيع': 'a tenant · contract created for signing', 'أُنشئ عقد لـ': 'Contract created for',
  'لا توجد وحدة شاغرة لربط المستأجر بها.': 'No vacant unit to link the tenant to.', 'لم تنشر أي إعلان بعد. اضغط «أضف إعلان»، أو افتح وحدة شاغرة من صفحة المباني واختر «انشر في السوق».': 'You haven\'t posted a listing yet. Tap "Add listing", or open a vacant unit in Buildings and choose "List in Market".',
  'إعلان جديد': 'New listing', 'تعديل الإعلان': 'Edit listing', 'صورة تلقائية حسب النوع · تتغير عند اختيار نوع آخر، ويمكنك رفع صورك بدلًا منها': 'Automatic picture by type · changes when you pick another type, or upload your own photos', 'من وحدتك الشاغرة:': 'From your vacant unit:',
  'أضف حتى 5 صور للوحدة': 'Add up to 5 photos', 'اختر صورًا جديدة لاستبدال الحالية': 'Choose new photos to replace the current ones', 'صور مختارة': 'photos selected', 'عنوان الإعلان': 'Listing title', 'مثال: شقة غرفتين قرب البحر': 'e.g. 2-bedroom flat near the beach', 'الإيجار الشهري (ر.ع.)': 'Monthly rent (OMR)', 'المساحة (م²)': 'Size (m²)',
  'المميزات': 'Features', 'أوقات المعاينة المتاحة': 'Available viewing times', 'يحجز الباحث عن سكن من هذه الأوقات مباشرة، كل يوم عدا الجمعة.': 'Renters book these times directly, every day except Friday.', 'الوصف': 'Description', 'الطابق، القرب من الخدمات، مدة العقد، ما يشمله الإيجار…': 'Floor, nearby services, contract length, what the rent includes…',
  'رقم واتساب للتواصل (اختياري)': 'WhatsApp number for contact (optional)', 'نشر الإعلان': 'Publish listing', 'تم حفظ الإعلان': 'Listing saved', 'تم نشر إعلانك': 'Your listing is live', 'تم نشر إعلانك مع': 'Your listing is live with', 'مساحة المتصفح ممتلئة، نُشر الإعلان بدون الصور.': 'Browser storage is full; the listing was posted without photos.',
  'الإعلان منشور': 'Listing is live', 'تم إيقاف الإعلان مؤقتًا': 'Listing paused', 'حذف إعلان «': 'Delete listing "', 'تم حذف الإعلان': 'Listing deleted', 'أصبح الإعلان موثّقًا': 'Listing is now verified',
  '★ ميّز إعلانك': '★ Feature your listing', 'يظهر أولًا في نتائج البحث وعلى الخريطة': 'Shows first in search results and on the map', 'شارة «مميز» على الصورة': '"Featured" badge on the photo', 'عادة ضعف المشاهدات وطلبات المعاينة': 'Usually twice the views and viewing requests',
  'المدة': 'Duration', 'نسخة تجريبية: لن يتم خصم أي مبلغ. في النسخة الحقيقية يُدفع بالبطاقة.': 'Demo: nothing will be charged. In the real version you pay by card.', 'تمييز الإعلان': 'Feature listing', 'أصبح إعلانك مميزًا حتى': 'Your listing is featured until', '· تجريبي، لم يُخصم أي مبلغ': '· demo, nothing charged',
  'توثيق الإعلان': 'Verify listing', 'الإعلانات الموثّقة تحصل على شارة': 'Verified listings get a', 'وتظهر أعلى في البحث، لأن الباحث يثق أن الوحدة حقيقية والصور مطابقة.': 'badge and rank higher, because renters trust the unit is real and the photos match.',
  'أرفق إثبات الملكية': 'Attach proof of ownership', 'سند الملكية أو عقد إدارة العقار.': 'Title deed or property management contract.', 'زيارة فريق سكن': 'Sakan team visit', 'خلال 48 ساعة لمطابقة الصور والمواصفات.': 'Within 48 hours to check photos and details.', 'تحصل على الشارة': 'You get the badge',
  'وتبقى ما دام الإعلان منشورًا.': 'It stays while the listing is live.', 'أرفق سند الملكية (اختياري في التجربة)': 'Attach the title deed (optional in the demo)', 'إرسال طلب التوثيق': 'Send verification request', 'تم إرسال طلب التوثيق. سيتواصل معك فريق سكن.': 'Verification request sent. The Sakan team will contact you.',
  'تعذر تحميل الخريطة. تأكد من الاتصال بالإنترنت.': 'Couldn\'t load the map. Check your internet connection.',
  // sample listings
  'شقة غرفتين بإطلالة على البحر': '2-bedroom flat with sea view', 'لوفت حديث قرب الموج مارينا': 'Modern loft near Al Mouj Marina', 'فيلا 4 غرف مع حديقة': '4-bedroom villa with garden', 'استوديو مفروش للموظفين': 'Furnished studio for professionals',
  'شقة عائلية 3 غرف': '3-bedroom family flat', 'شقة غرفتين قرب المطار': '2-bedroom flat near the airport', 'فيلا دوبلكس فاخرة': 'Luxury duplex villa', 'شقة غرفة واحدة مفروشة': 'Furnished 1-bedroom flat', 'فيلا توين 4 غرف قرب الشاطئ': '4-bedroom twin villa near the beach',
  'فيلا توين جديدة 3 غرف': 'New 3-bedroom twin villa', 'مكتب إداري في برج تجاري': 'Office in a business tower', 'محل تجاري على شارع رئيسي': 'Shop on a main road',
  'شقة مشمسة في الطابق السابع من سكن القرم، قريبة من حديقة القرم الطبيعية وشاطئ القرم. مطبخ مفتوح وغرفتا نوم مع خزائن. العقد سنوي والدفع شهريًا عبر تطبيق سكن.': 'Sunny 7th-floor flat in Qurum Residence, close to Qurum Natural Park and Qurum Beach. Open kitchen and two bedrooms with wardrobes. Yearly contract, monthly payment through the Sakan app.',
  'لوفت بسقف عالٍ ونوافذ كبيرة، مفروش بالكامل. خطوات من المارينا والمطاعم. مناسب لشخص أو زوجين.': 'High-ceiling loft with big windows, fully furnished. Steps from the marina and restaurants. Suits one person or a couple.',
  'فيلا مستقلة بطابقين في حي هادئ ببوشر، مع حديقة أمامية ومجلس منفصل للرجال. قريبة من المدارس الخاصة ومسقط جراند مول.': 'Two-storey standalone villa in a quiet Bausher neighbourhood, with a front garden and a separate majlis. Close to private schools and Muscat Grand Mall.',
  'استوديو جديد مفروش مع مطبخ صغير، الإنترنت مشمول. قريب من طريق الباطنة السريع.': 'New furnished studio with a kitchenette, internet included. Close to the Batinah Expressway.',
  'شقة واسعة قريبة من جامعة السلطان قابوس، مع غرفة خادمة ومخزن.': 'Spacious flat near Sultan Qaboos University, with a maid\'s room and storage.', 'على بعد 5 دقائق من مطار مسقط الدولي. المبنى جديد ويضم مصعدين.': '5 minutes from Muscat International Airport. New building with two lifts.',
  'فيلا بمسبح خاص وحديقة واسعة في واحدة من أهدأ مناطق مسقط.': 'Villa with a private pool and large garden in one of Muscat\'s quietest areas.', 'في قلب روي قرب المحلات والمواصلات. مفروشة ومجهزة بالأجهزة.': 'In the heart of Ruwi near shops and transport. Furnished with appliances.',
  'فيلا توين بجدار مشترك واحد ومدخل مستقل، مع حديقة صغيرة وسطح. خمس دقائق من شاطئ الموج.': 'Twin villa with one shared wall and its own entrance, a small garden and a roof terrace. Five minutes from Al Mouj beach.',
  'بناء جديد لم يُسكن من قبل، مطبخ مغلق ومجلس وغرفة خادمة.': 'Brand-new and never lived in, with a closed kitchen, majlis and maid\'s room.', 'مكتب بإطلالة على شارع السلطان قابوس، مع غرفة اجتماعات صغيرة.': 'Office overlooking Sultan Qaboos Street, with a small meeting room.',
  'واجهة زجاجية على الشارع الرئيسي، مناسب لمقهى أو صالون.': 'Glass front on the main road, good for a café or salon.',
  'مرحبًا، هل يمكن المعاينة يوم الخميس؟ عائلة من 4 أشخاص.': 'Hello, can we view on Thursday? We\'re a family of 4.', 'هل الإيجار يشمل الكهرباء والماء؟': 'Does the rent include electricity and water?',
  'رد سريع على طلبات الصيانة والشقة نظيفة.': 'Quick to fix things and the flat is clean.', 'تعامل محترف، لكن التأمين أخذ وقت ليُرد.': 'Professional, but the deposit took a while to come back.', 'المالك متعاون جدًا.': 'Very helpful owner.', 'كل شي كان كما في الصور.': 'Everything was just like the photos.',
  'فلل ممتازة والصيانة منتظمة.': 'Excellent villas and regular maintenance.', 'عائشة': 'Aisha', 'جيمس': 'James', 'خالد': 'Khalid', 'منى': 'Mona', 'سارة': 'Sarah', 'أحمد': 'Ahmed', 'راجيش': 'Rajesh',
  // ---------- Contracts ----------
  'عقود إيجار إلكترونية يوقّعها المستأجر من هاتفه، مع تذكير قبل انتهاء كل عقد.': 'Digital leases tenants sign on their phone, with a reminder before each one ends.', 'عقد جديد': 'New contract', 'عقود سارية': 'Active contracts', 'تنتهي خلال 60 يومًا': 'Ending within 60 days',
  'بانتظار توقيع المستأجر': 'Awaiting tenant signature', 'التأمينات المحفوظة': 'Deposits held', 'تنتهي قريبًا': 'Ending soon', 'بانتظار التوقيع': 'Awaiting signature', 'بانتظار التوقيع.': 'awaiting signature.', 'عرض العقد': 'View contract', 'تذكير بالتوقيع': 'Remind to sign', 'لا توجد عقود هنا.': 'No contracts here.',
  'رقم العقد:': 'Contract no.:', 'عقد إيجار': 'Lease agreement', 'سكني': '· residential', 'تجاري': '· commercial', 'أُبرم هذا العقد بتاريخ': 'This agreement was made on', 'المؤجِّر:': 'Landlord:', 'المستأجر:': 'Tenant:', 'العين المؤجَّرة:': 'Property:', '، مسقط.': ', Muscat.',
  'المدة:': 'Term:', 'شهرًا، من': 'months, from', '، قابلة للتجديد باتفاق الطرفين.': ', renewable by agreement of both parties.', 'الأجرة:': 'Rent:', 'ريال عُماني شهريًا، تُدفع مقدمًا في أول كل شهر عبر تطبيق سكن أو بالتحويل البنكي.': 'Omani rials a month, paid in advance on the 1st of each month through the Sakan app or by bank transfer.',
  'التأمين:': 'Deposit:', 'ريال عُماني، يُرد عند نهاية العقد بعد خصم أي أضرار إن وجدت.': 'Omani rials, returned at the end of the lease less any damage.', 'الصيانة:': 'Maintenance:', 'يتحمل المؤجِّر الصيانة الأساسية (التكييف المركزي، السباكة، الكهرباء)، ويُبلَّغ بها عبر التطبيق.': 'The landlord covers essential maintenance (central AC, plumbing, electrical), reported through the app.',
  'الخدمات:': 'Utilities:', 'يتحمل المستأجر فواتير الكهرباء والماء والإنترنت ما لم يُتفق على غير ذلك.': 'The tenant pays electricity, water and internet unless agreed otherwise.', 'الإخلاء:': 'Notice:', 'يلتزم الطرف الراغب في عدم التجديد بإبلاغ الآخر قبل': 'A party that does not wish to renew must notify the other',
  'يومًا من نهاية المدة.': 'days before the end of the term.', 'القانون:': 'Law:', 'يخضع هذا العقد للقوانين المعمول بها في سلطنة عُمان، ويُسجَّل لدى البلدية المختصة.': 'This agreement is governed by the laws of the Sultanate of Oman and registered with the relevant municipality.',
  'توقيع المؤجِّر': 'Landlord signature', 'توقيع المستأجر': 'Tenant signature', 'نموذج تجريبي من سكن · ليس عقدًا قانونيًا · يُنصح بمراجعة الصيغة النهائية مع مستشار قانوني.': 'Sakan demo template · not a legal contract · have the final wording reviewed by a lawyer.',
  'توقيع العقد': 'Sign contract', 'طباعة / حفظ PDF': 'Print / save PDF', 'وقّع العقد': 'Sign the contract', 'ارسم توقيعك بإصبعك أو بالماوس داخل المربع.': 'Draw your signature with your finger or mouse inside the box.', 'قرأت العقد وأوافق على بنوده': 'I\'ve read the contract and agree to its terms', 'تأكيد التوقيع': 'Confirm signature',
  'ارسم توقيعك أولًا': 'Draw your signature first', 'وقّع عقد': 'signed the contract for', 'تم توقيع العقد. أرسلنا نسخة للمالك.': 'Contract signed. We sent a copy to the owner.', 'تجديد عقد': 'Renew contract for', 'الإيجار الجديد (ر.ع.) · الحالي': 'New rent (OMR) · current', '· سعر السوق التقريبي': '· approx. market price',
  'إرسال للتوقيع': 'Send for signature', 'أُرسل عقد التجديد إلى': 'Renewal contract sent to', 'للتوقيع': 'for signing', 'عرض تجديد عقدك جاهز للتوقيع ·': 'Your renewal offer is ready to sign ·', 'عقد إيجارك جاهز للتوقيع من هاتفك': 'Your lease is ready to sign on your phone', 'تذكير: عقد إيجارك بانتظار توقيعك': 'Reminder: your lease is waiting for your signature', 'تم إرسال تذكير بالتوقيع إلى': 'Signing reminder sent to',
  // ---------- Finance and report ----------
  '· الدخل والمصروفات وصافي الربح لكل مبنى.': '· income, expenses and net profit per building.', 'إضافة مصروف': 'Add expense', 'التقرير الشهري': 'Monthly report', 'التقرير الشهري ·': 'Monthly report ·', 'الدخل المحصّل': 'Income collected', 'المصروفات': 'Expenses', 'بندًا هذا الشهر': 'items this month',
  'صافي الربح': 'Net profit', 'هامش': 'Margin', '· يرتفع بـ': '· rises by', 'ر.ع. عند تحصيل المتأخرات': 'OMR once late rent is collected', 'نسبة التحصيل · آخر 12 شهرًا': 'Collection rate · last 12 months', 'تغيير حد التنبيه': 'Change alert level', 'فوق حد التنبيه': 'Above alert level', 'تحت حد التنبيه (!)': 'Below alert level (!)', 'حد التنبيه': 'Alert level',
  'عرض كجدول': 'Show as table', 'النسبة': 'Rate', 'الربح حسب المبنى': 'Profit by building', 'المبنى': 'Building', 'الدخل': 'Income', 'الصافي': 'Net', 'المصروفات حسب النوع': 'Expenses by type', 'لا توجد مصروفات هذا الشهر.': 'No expenses this month.',
  'التاريخ': 'Date', 'البيان': 'Description', 'صيانة': 'Maintenance', 'كهرباء وماء': 'Electricity and water', 'نظافة': 'Cleaning', 'حراسة': 'Security', 'تأمين': 'Insurance', 'رسوم بلدية': 'Municipality fees', 'مثال: تعبئة غاز مكيف': 'e.g. AC gas refill',
  'تمت إضافة المصروف': 'Expense added', 'تم حذف المصروف': 'Expense deleted', 'صيانة دورية للمصعد': 'Routine lift maintenance', 'إنارة الممرات والمواقف': 'Corridor and parking lighting', 'حارس الأمن': 'Security guard', 'تنظيف الممرات': 'Corridor cleaning', 'تعبئة غاز مكيف': 'AC gas refill',
  'تنسيق الحدائق': 'Landscaping', 'إضاءة الحمام · فيلا 5': 'Bathroom light · Villa 5', 'تنظيف المسبح': 'Pool cleaning', 'تأمين المبنى السنوي (قسط)': 'Annual building insurance (instalment)',
  'مشاركة الملخص عبر واتساب': 'Share summary on WhatsApp', 'أُعد في': 'Prepared on', 'الإشغال': 'Occupancy', 'لم يدفع بعد (': 'Not paid yet (', 'الوحدات الشاغرة (': 'Vacant units (', 'تم إصلاحها.': 'fixed.', 'تقرير تجريبي من سكن · الأرقام أمثلة.': 'Demo report from Sakan · figures are examples.',
  'نسبة التحصيل': 'Collection rate', 'المتوقع': 'Expected', 'المحصّل': 'Collected',
  // ---------- Notifications, reminders, notices ----------
  'تصلك أيضًا على واتساب وفي إشعارات الهاتف.': 'You also get these on WhatsApp and as phone notifications.', 'تحديد الكل كمقروء': 'Mark all as read', 'لا توجد إشعارات.': 'No notifications.',
  'أحمد خان رفع إيصال تحويل بمبلغ 300 ر.ع. للمراجعة': 'Ahmed Khan uploaded a 300 OMR transfer receipt to review', 'سجّلت لينا طلب صيانة من مكالمة: المكيف لا يبرد · برج الخوير شقة 12': 'Lina logged a maintenance request from a call: AC isn\'t cooling · Khuwair Tower Apartment 12',
  'طلب معاينة جديد من عبدالله الشكيلي · شقة غرفتين بإطلالة على البحر': 'New viewing request from Abdullah Al Shukaili · 2-bedroom flat with sea view', 'عقد سيف الكندي ينتهي خلال أقل من أسبوعين · جدّده الآن': 'Saif Al Kindi\'s contract ends in under two weeks · renew now',
  'تذكير: إيجار نوفمبر (450 ر.ع.) يستحق بعد يومين': 'Reminder: November rent (450 OMR) is due in 2 days', 'إعلان من الإدارة: تنظيف المسبح يوم السبت من 9 إلى 12 ظهرًا': 'Notice from management: pool cleaning on Saturday from 9 to 12 noon',
  'الرسالة على واتساب': 'The WhatsApp message', '، تذكير لطيف بأن إيجار': ', a friendly reminder that the rent for', 'ر.ع.) لـ': 'OMR) for', '. يمكنك الدفع من تطبيق سكن مباشرة. شكرًا لك — سالم': '. You can pay directly in the Sakan app. Thank you — Salem',
  'القنوات': 'Channels', 'رسالة نصية': 'SMS', 'إشعار التطبيق': 'App notification', 'مكالمة من لينا': 'Call from Lina', 'إرسال التذكير': 'Send reminder', 'أُرسل التذكير إلى': 'Reminder sent to', 'أُرسل التذكير وستتصل لينا بـ': 'Reminder sent and Lina will call', 'تذكير من المالك: إيجار': 'Reminder from the owner: rent for',
  'التذكير التلقائي': 'Automatic reminders', 'يرسل سكن التذكيرات بنفسه على واتساب، فلا تحتاج لملاحقة أحد.': 'Sakan sends reminders on WhatsApp by itself, so you never have to chase anyone.', 'قبل الاستحقاق بـ 3 أيام': '3 days before the due date', 'رسالة لطيفة مع رابط الدفع': 'A friendly message with a payment link',
  'يوم الاستحقاق': 'On the due date', 'تذكير صباحي الساعة 9': 'Morning reminder at 9', 'بعد التأخر بـ 3 أيام': '3 days after it\'s late', 'تذكير أوضح مع إشعار لك': 'A firmer reminder, and you get notified', 'مكالمة من لينا بعد 7 أيام تأخير': 'Call from Lina after 7 days late',
  'لينا تتصل بالمستأجر وتسجل موعد الدفع': 'Lina calls the tenant and logs when they\'ll pay', 'أرسل الآن أيضًا إلى': 'Also send now to', 'حفظ وإرسال': 'Save and send', 'تذكيرات وحُفظ الجدول التلقائي': 'reminders sent and the schedule saved', 'تم حفظ التذكير التلقائي': 'Automatic reminders saved', 'تم إرسال': 'Sent',
  'تم إرسال تذكير إلى': 'Reminder sent to', 'تذكيرات (تجريبي)': 'reminders (demo)', 'إعلان لسكان': 'Notice to residents of', 'انقطاع ماء': 'Water cut', 'انقطاع كهرباء': 'Power cut', 'أمن وسلامة': 'Safety and security', 'العنوان': 'Title', 'مثال: انقطاع الماء يوم الخميس': 'e.g. Water cut on Thursday',
  'الوقت، المدة، وما المطلوب من السكان': 'Time, duration and what residents need to do', 'إرسال للسكان': 'Send to residents', 'إعلان من الإدارة:': 'Notice from management:', 'وصل الإعلان إلى': 'Notice delivered to', 'مستأجرًا على واتساب والتطبيق': 'tenants on WhatsApp and in the app',
  'تنظيف المسبح يوم السبت': 'Pool cleaning on Saturday', 'سيكون المسبح مغلقًا من 9 صباحًا حتى 12 ظهرًا للتنظيف الدوري.': 'The pool will be closed from 9 am to 12 noon for routine cleaning.', 'انقطاع الماء يوم الخميس': 'Water cut on Thursday',
  'ينقطع الماء من 10 صباحًا إلى 2 ظهرًا لصيانة الخزان الرئيسي. نعتذر عن الإزعاج.': 'Water will be off from 10 am to 2 pm for main tank maintenance. Sorry for the inconvenience.',
  // ---------- Misc toasts, dialogs ----------
  'مساحة المتصفح ممتلئة، لم تُحفظ الصورة.': 'Browser storage is full; the image wasn\'t saved.', 'تجربة': 'Demo',
  // ---------- Labels inside attributes, first names, extra pieces ----------
  'صورة': 'Photo', 'ابحث…': 'Search…', 'توقيع': 'Signature', 'بلا حد': 'No limit', 'حذف البحث': 'Delete search', 'صورة الطلب': 'Request photo', 'طريقة العرض': 'View', 'قيّم الخدمة': 'Rate the service', 'عقد الإيجار': 'Lease agreement',
  'نوع المشكلة': 'Problem type', 'مربع التوقيع': 'Signature box', 'موثّق من سكن': 'Verified by Sakan', 'قائمة المالك': 'Owner menu', 'اختر المستأجر': 'Choose tenant', 'قائمة المستأجر': 'Tenant menu', 'ابحث في القائمة': 'Search the list', 'خريطة الإعلانات': 'Listings map',
  'صورة من المستأجر': 'Photo from the tenant', 'تصفية المستأجرين': 'Filter tenants', 'نسبة التحصيل الشهرية لآخر 12 شهرًا': 'Monthly collection rate for the last 12 months', 'مثال: فيلا توين، twin، إطلالة بحر، القرم': 'e.g. twin villa, sea view, Qurum, pool',
  'في النسخة الحقيقية يعتمده فريق سكن بعد الزيارة': 'In the real version the Sakan team approves it after a visit', 'حفظ الإعلان': 'Save listing', 'إزالة من المحفوظة': 'Remove from saved', 'الإشعارات · ': 'Notifications · ',
  'مريم': 'Maryam', 'حامد': 'Hamed', 'سالم': 'Salem', 'بريا': 'Priya', 'يوسف': 'Yousuf', 'فاطمة': 'Fatma', 'سيف': 'Saif', 'نورة': 'Noora', 'راهول': 'Rahul', 'سالمة': 'Salma',
  'مسقط': 'Muscat', 'مصروفات': 'Expenses', 'حسب': 'by', 'ينتهي بعد': 'Ends in', 'المبلغ المستحق': 'Amount due', 'عرض تجديد عقدك جاهز للتوقيع': 'Your renewal offer is ready to sign', 'مستأجرين لم يدفعوا بعد، و': 'tenants haven\'t paid yet, and ',
  'صورة تلقائية': 'Automatic picture', 'و': ' and '
};
const AR_RX = /[؀-ۿ]/;
let LANG = 'ar';
try { LANG = localStorage.getItem('sakan-lang') || 'ar'; } catch (e) {}
let TR_RX = null;
function trText(s) {
  if (!s || !AR_RX.test(s)) return s;
  if (!TR_RX) {
    const L = '\\u0621-\\u064A\\u066E-\\u06D3', isL = /[\u0621-\u064A\u066E-\u06D3]/;
    Object.keys(EN).forEach((k) => { if (/ ·$/.test(k) && EN[k.slice(0, -2)]) delete EN[k]; });
    const keys = Object.keys(EN).sort((a, b) => b.length - a.length).map((k) => (isL.test(k[0]) ? `(?<![${L}])` : '') + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (isL.test(k[k.length - 1]) ? `(?![${L}\\u064B-\\u0652])` : ''));
    TR_RX = new RegExp(keys.join('|'), 'g');
  }
  return s.replace(TR_RX, (m) => (m in EN ? EN[m] : m)).replace(/،/g, ',').replace(/؟/g, '?').replace(/[«»]/g, '"').replace(/٪/g, '%').replace(/←/g, '→').replace(/ {2,}/g, ' ');
}
const TR_ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
function trNode(root) {
  if (LANG !== 'en' || !root) return;
  if (root.nodeType === 3) { const v = root.nodeValue; if (AR_RX.test(v)) root.nodeValue = trText(v); return; }
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const v = n.nodeValue; if (AR_RX.test(v)) n.nodeValue = trText(v); }
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    TR_ATTRS.forEach((a) => { const v = el.getAttribute(a); if (v && AR_RX.test(v)) el.setAttribute(a, trText(v)); });
    if ((el.tagName === 'INPUT' && /^(text|tel|search)$/.test(el.type)) || el.tagName === 'TEXTAREA') { if (el.value && AR_RX.test(el.value)) el.value = trText(el.value); }
  });
}
const trObs = new MutationObserver((muts) => {
  trObs.disconnect();
  muts.forEach((m) => { if (m.type === 'characterData') trNode(m.target); else if (m.type === 'attributes') trNode(m.target); else m.addedNodes.forEach(trNode); });
  trObserve();
});
function trObserve() { trObs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'placeholder'] }); }
function applyLang() {
  const en = LANG === 'en';
  document.documentElement.lang = en ? 'en' : 'ar';
  document.documentElement.dir = en ? 'ltr' : 'rtl';
  document.querySelectorAll('[data-lang]').forEach((b) => { b.textContent = en ? 'عربي' : 'English'; b.setAttribute('aria-label', en ? 'التبديل إلى العربية' : 'Switch to English'); b.lang = en ? 'ar' : 'en'; });
  if (en) { document.title = 'Sakan · All your properties in one place'; trNode(document.body); trObserve(); }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  try { localStorage.setItem('sakan-lang', LANG === 'en' ? 'ar' : 'en'); } catch (err) {}
  location.reload();
});
applyLang();
render();
