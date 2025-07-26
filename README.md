# معرض زمزم المحسن - Enhanced Zamzam Gallery

<div align="center">
  <img src="./assets/logo.png" alt="Zamzam Gallery Logo" width="120" height="120">
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://suvloapr.manus.space)
  [![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)](https://github.com/zamzam-gallery/enhanced-gallery)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)
</div>

## 🌟 نظرة عامة

معرض زمزم المحسن هو تطبيق ويب متطور لعرض وإدارة الصور والفيديوهات بتقنيات حديثة ومتقدمة. يوفر المعرض تجربة مستخدم فاخرة مع دعم التخزين السحابي والذكاء الاصطناعي.

## ✨ المميزات الرئيسية

### 🎨 التصميم والواجهة
- **تصميم فاخر ومتجاوب** مع دعم الأجهزة المختلفة
- **تأثيرات بصرية متقدمة** مع Glass Morphism
- **دعم كامل للغة العربية** مع اتجاه RTL
- **خلفيات ديناميكية** مع تأثيرات الجسيمات
- **أنماط متعددة** (بنفسجي، أزرق، أخضر، أحمر، برتقالي)

### 📱 أنماط العرض المتقدمة
- **عرض شبكي تقليدي** مع تخطيط متجاوب
- **عرض Masonry** للصور بأحجام مختلفة
- **عرض دوار** للتصفح السريع
- **عرض ثلاثي الأبعاد** مع تقنية WebGL
- **عرض زمني** مرتب حسب التاريخ

### ☁️ التخزين السحابي
- **Google Drive** - تكامل كامل مع API
- **Dropbox** - رفع ومزامنة الملفات
- **OneDrive** - دعم Microsoft Cloud
- **مزامنة تلقائية** للملفات الجديدة
- **نسخ احتياطية** دورية للبيانات

### 🔍 البحث والتصفية
- **بحث متقدم** بالنص والعلامات
- **تصفية ذكية** حسب النوع والتاريخ
- **فرز متعدد** (الأحدث، الأكثر مشاهدة، الأعلى تقييماً)
- **علامات تلقائية** مع الذكاء الاصطناعي

### 🎵 التفاعل والوسائط
- **مشغل فيديو متقدم** مع تحكم كامل
- **عارض صور** مع تكبير وتصغير
- **تأثيرات صوتية** للتفاعلات
- **مشاركة اجتماعية** مع منصات متعددة

### 📊 الإحصائيات والتحليلات
- **إحصائيات مفصلة** للمشاهدات والتفاعل
- **نظام تقييم** بالنجوم
- **تتبع الاستخدام** والأنشطة
- **تقارير دورية** للأداء

## 🚀 التقنيات المستخدمة

### Frontend
- **HTML5** - هيكل الصفحات
- **CSS3** - التصميم والتأثيرات
- **JavaScript ES6+** - المنطق والتفاعل
- **Three.js** - الرسوميات ثلاثية الأبعاد
- **GSAP** - الحركات والانتقالات
- **Particles.js** - تأثيرات الخلفية

### APIs والخدمات
- **Google Drive API** - التخزين السحابي
- **Dropbox API** - مشاركة الملفات
- **Microsoft Graph API** - OneDrive
- **Service Worker** - العمل دون اتصال
- **Web Manifest** - تطبيق ويب تقدمي

### الأدوات والمكتبات
- **Masonry.js** - تخطيط الشبكة
- **ImagesLoaded** - تحميل الصور
- **Lottie** - الرسوم المتحركة
- **Font Awesome** - الأيقونات

## 📦 التثبيت والإعداد

### المتطلبات
- خادم ويب (Apache/Nginx/Python)
- متصفح حديث يدعم ES6+
- اتصال بالإنترنت للخدمات السحابية

### خطوات التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/zamzam-gallery/enhanced-gallery.git
cd enhanced-gallery
```

2. **إعداد الخادم المحلي**
```bash
# باستخدام Python
python3 -m http.server 8080

# أو باستخدام Node.js
npx serve .

# أو باستخدام PHP
php -S localhost:8080
```

3. **فتح المتصفح**
```
http://localhost:8080
```

### إعداد الخدمات السحابية

#### Google Drive
1. إنشاء مشروع في [Google Cloud Console](https://console.cloud.google.com)
2. تفعيل Google Drive API
3. إنشاء OAuth 2.0 credentials
4. إضافة Client ID و API Key في الإعدادات

#### Dropbox
1. إنشاء تطبيق في [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. الحصول على App Key
3. إضافة المفتاح في إعدادات التطبيق

#### OneDrive
1. تسجيل التطبيق في [Azure Portal](https://portal.azure.com)
2. إعداد Microsoft Graph permissions
3. إضافة Client ID في الإعدادات

## 🎯 الاستخدام

### رفع الملفات
1. انقر على زر "رفع ملفات جديدة"
2. اختر طريقة الرفع (محلي/سحابي/رابط)
3. اسحب الملفات أو انقر للاختيار
4. أضف المعلومات والعلامات
5. انقر "رفع الملفات"

### إدارة المعرض
- **التصفية**: استخدم علامات التبويب للتصفية
- **البحث**: اكتب في مربع البحث للعثور على محتوى
- **العرض**: غير نمط العرض من الأزرار العلوية
- **التقييم**: انقر على النجوم لتقييم المحتوى

### الإعدادات
1. انقر على أيقونة الإعدادات
2. اختر علامة التبويب المناسبة
3. عدل الإعدادات حسب تفضيلاتك
4. انقر "حفظ الإعدادات"

## 🔧 التخصيص

### تغيير الألوان
```css
:root {
    --primary-color: #8B5CF6;
    --secondary-color: #7C3AED;
    --accent-color: #10B981;
}
```

### إضافة خطوط جديدة
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;600;700&display=swap');

.font-custom {
    --font-family: 'YourFont', 'Cairo', sans-serif;
}
```

### تخصيص التأثيرات
```javascript
// في ملف script.js
const customEffects = {
    particles: {
        number: { value: 80 },
        color: { value: "#8B5CF6" },
        // المزيد من الإعدادات...
    }
};
```

## 📱 PWA (Progressive Web App)

المعرض يدعم تقنية PWA مما يعني:
- **تثبيت على الجهاز** كتطبيق أصلي
- **العمل دون اتصال** مع Service Worker
- **إشعارات فورية** للتحديثات
- **تحديث تلقائي** للمحتوى

## 🔒 الأمان والخصوصية

- **تشفير البيانات** أثناء النقل
- **مصادقة آمنة** مع OAuth 2.0
- **حماية CSRF** للنماذج
- **تنظيف المدخلات** لمنع XSS
- **سياسة المحتوى** CSP headers

## 🌐 المتصفحات المدعومة

| المتصفح | الإصدار المدعوم |
|---------|----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

## 📈 الأداء

- **تحميل سريع** مع lazy loading
- **ضغط الصور** التلقائي
- **تخزين مؤقت** ذكي
- **تحسين SEO** للمحركات
- **Core Web Vitals** محسنة

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### إرشادات المساهمة
- اتبع معايير الكود الموجودة
- أضف تعليقات واضحة
- اختبر التغييرات قبل الإرسال
- حدث الوثائق عند الحاجة

## 📝 التراخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 👥 الفريق

- **المطور الرئيسي**: Enhanced Zamzam Gallery Team
- **التصميم**: UI/UX Design Team
- **الاختبار**: Quality Assurance Team

## 📞 التواصل والدعم

- **الموقع الرسمي**: [https://suvloapr.manus.space](https://suvloapr.manus.space)
- **البريد الإلكتروني**: support@zamzam-gallery.com
- **المشاكل**: [GitHub Issues](https://github.com/zamzam-gallery/enhanced-gallery/issues)
- **المناقشات**: [GitHub Discussions](https://github.com/zamzam-gallery/enhanced-gallery/discussions)

## 🎉 شكر خاص

شكر خاص لجميع المساهمين والمكتبات مفتوحة المصدر التي جعلت هذا المشروع ممكناً:

- [Three.js](https://threejs.org/) - مكتبة الرسوميات ثلاثية الأبعاد
- [GSAP](https://greensock.com/gsap/) - مكتبة الحركات
- [Particles.js](https://vincentgarreau.com/particles.js/) - تأثيرات الجسيمات
- [Masonry](https://masonry.desandro.com/) - تخطيط الشبكة
- [Font Awesome](https://fontawesome.com/) - الأيقونات

## 📊 الإحصائيات

![GitHub stars](https://img.shields.io/github/stars/zamzam-gallery/enhanced-gallery?style=social)
![GitHub forks](https://img.shields.io/github/forks/zamzam-gallery/enhanced-gallery?style=social)
![GitHub issues](https://img.shields.io/github/issues/zamzam-gallery/enhanced-gallery)
![GitHub pull requests](https://img.shields.io/github/issues-pr/zamzam-gallery/enhanced-gallery)

---

<div align="center">
  <p>صنع بـ ❤️ من فريق معرض زمزم المحسن</p>
  <p>© 2025 Enhanced Zamzam Gallery. جميع الحقوق محفوظة.</p>
</div>

