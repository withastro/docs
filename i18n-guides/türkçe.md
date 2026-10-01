`# Astro Türkçe Çeviri Kılavuzu ve Terimler Sözlüğü (Glossary)

Merhaba ve hoş geldiniz! Astro dokümantasyonunun Türkçe yerelleştirmesine ve çeviri sürecine katkıda bulunmak istediğiniz için çok mutluyuz. 🚀✨

Bu kılavuz, Astro dokümantasyonunu Türkçeye çeviren ve inceleyen katkıcılar arasında ortak bir dil, tutarlı bir üslup ve standart bir teknik terim birliği oluşturmak amacıyla hazırlanmıştır.

---

## 🎯 Temel İlkelerimiz

1. **Doğal ve Akıcı Teknik Türkçe:** Amacımız harfi harfine (literal) çeviri yapmak değil; okunduğunda Türk yazılımcı topluluğu için anlaşılır, akıcı ve sektörel gerçeklere uygun bir dil kullanmaktır.
2. **Kavram Bütünlüğü:** Astro'nun temel kavramları (Islands Architecture, Client Directives, Content Collections vb.) ilk geçtiği yerde Türkçe karşılığı ve parantez içinde orijinal teknik ismiyle birlikte verilmelidir.
3. **Kod ve Sözdizimi Dokunulmazlığı:** Kod parçacıkları, HTML/JSX etiketleri, paket adları ve konfigürasyon anahtarları asla değiştirilmemelidir.

---

## 📖 Terimler Sözlüğü (Glossary)

Aşağıdaki tablo, Astro belgelerinde sıkça karşılaşılan terimlerin önerilen Türkçe karşılıklarını ve kullanım notlarını içerir:

| Orijinal Terim | Önerilen Türkçe Karşılık | Notlar ve Örnek Kullanım |
| :--- | :--- | :--- |
| **Astro Islands** | Astro Adaları | Bileşen düzeyinde bağımsız çalışan etkileşimli adalar mimarisi. |
| **adapter** | bağdaştırıcı / adaptör | Dağıtım ortamlarına özel entegrasyonlar (örn. Node, Vercel adaptörü). |
| **aside** | uyarı kutusu / bilgi bloğu | \`:::tip\`, \`:::note\`, \`:::caution\` blokları. |
| **asset** | statik varlık / kaynak | Resimler, yazı tipleri ve stil dosyaları. |
| **build** | derleme / inşa etme | Dağıtıma hazır üretim çıktısı oluşturma süreci. |
| **bundle / bundling** | paket / paketleme | Modüllerin tek bir dosyada birleştirilmesi. |
| **client directive** | istemci yönergesi | \`client:load\`, \`client:visible\`, \`client:only\` gibi Astro direktifleri. |
| **component** | bileşen | Astro veya UI çerçeve bileşenleri (örn. React, Vue, Svelte). |
| **content collections** | içerik koleksiyonları | Markdown/MDX içeriklerini tiplerle doğrulayan Astro özelliği. |
| **data fetching** | veri çekme / veri getirme | Dış API'lerden veya dosya sisteminden veri alma işlemi. |
| **deployment** | dağıtım / yayına alma | Uygulamanın canlı sunucuya yüklenmesi. |
| **deprecated** | kullanımdan kaldırılmış / önerilmeyen | Gelecek sürümlerde kaldırılacak olan eski özellikler. |
| **directive** | yönerge / direktif | Özel Astro şablon nitelikleri. |
| **endpoint** | uç nokta (endpoint) | API rotaları (\`.js\` veya \`.ts\` dosyaları). |
| **entry / entries** | girdi / kayıt | İçerik koleksiyonlarındaki her bir belge. |
| **fallback** | yedek / varsayılan seçenek | Çeviri veya veri bulunamadığında devreye giren mekanizma. |
| **frontmatter** | sayfa üstverisi (frontmatter) | Markdown/MDX sayfalarının başındaki \`---\` blokları. |
| **hook** | kanca (hook) | Yaşam döngüsü veya entegrasyon kancaları. |
| **hydration** | hidrasyon / canlandırma | Statik HTML'in istemcide JavaScript ile etkileşimli hale gelmesi. |
| **integration** | entegrasyon | Astro'yu genişleten eklentiler (Tailwind, React, Sitemap vb.). |
| **layout** | sayfa düzeni (layout) | Ortak sayfa iskeletini sağlayan bileşenler. |
| **middleware** | ara yazılım (middleware) | İstek ve yanıt döngüsü arasında çalışan fonksiyonlar. |
| **on-demand rendering** | isteğe bağlı sunucu taraflı işleme | İsteğin geldiği anda sunucuda oluşturulan sayfalar (SSR). |
| **page** | sayfa | \`src/pages\` altındaki rota dosyaları. |
| **partial** | kısmi şablon (partial) | Tam bir HTML belgesi olmayan parça şablonlar. |
| **prerendering** | statik önceden derleme | Derleme zamanında statik HTML olarak üretme. |
| **prop / props** | prop / bileşen özellikleri | Bileşenlere dışarıdan aktarılan parametreler. |
| **recipe** | pratik çözüm / tarif | Belirli bir problemi çözmeye yönelik adım adım rehberler. |
| **routing** | yönlendirme / rota sistemi | Dosya tabanlı sayfa yönlendirme mimarisi. |
| **runtime** | çalışma zamanı (runtime) | Uygulamanın sunucuda veya tarayıcıda çalıştığı an. |
| **scoped styles** | bileşene özel stiller (scoped styles) | Yalnızca tanımlandığı bileşeni etkileyen CSS kuralları. |
| **server-side rendering (SSR)** | sunucu taraflı işleme (SSR) | Sayfaların istemciye gönderilmeden sunucuda oluşturulması. |
| **slot** | yuva (slot) | Bir bileşenin içine dışarıdan içerik yerleştirmeye yarayan alan. |
| **static site generation (SSG)** | statik site oluşturma (SSG) | Sayfaların derleme zamanında tamamen statik oluşturulması. |
| **template** | şablon | HTML veya Astro şablon yapısı. |
| **tutorial** | öğretici / eğitim serisi | Adım adım uygulama geliştirme kılavuzları. |
| **view transitions** | görünüm geçişleri | Sayfalar arası animasyonlu geçiş API'si. |
| **zero-JS / zero JavaScript** | sıfır JavaScript varsayılanı | İstemciye gereksiz JavaScript göndermeme felsefesi. |

---

## 📝 Biçimlendirme ve Çeviri Kuralları

### 1. Kod Blokları ve Değişken İsimleri
- Kod blokları içindeki kod yapısı, fonksiyon isimleri ve değişken adları **asla çevrilmez**.
- Kod içi yorum satırları (\`// açıklama\`), okuyucunun konsepti anlamasını kolaylaştırmak için **Türkçeye çevrilmelidir**.
- Metin içindeki inline kodlar (örn. \`astro.config.mjs\`, \`client:load\`, \`props\`) aynen korunmalıdır.

### 2. Bilgi Kutuları (Asides: Tip, Note, Caution)
Astro özel aside sözdizimi kullanır:
- \`:::tip[İpucu Başlığı]\`, \`:::note[Not Başlığı]\`, \`:::caution[Dikkat Başlığı]\`
- **Kural:** \`:::tip\`, \`:::note\`, \`:::caution\` etiketlerinin kendisi **çevrilmez** (bunlar sistem tarafından otomatik algılanır). Ancak köşeli parantez içindeki başlık ve kutu içeriği Türkçeleştirilir.

### 3. Önveri (Frontmatter)
MDX dosyalarındaki üstveri alanları:
- \`title\` ve \`description\` **değerleri** çevrilir.
- \`title:\`, \`description:\`, \`layout:\`, \`i18nReady:\` gibi anahtar kelimeler **asla çevrilmez**.

### 4. Bağlantılar (Links)
- İç bağlantılarda URL yolları şimdilik İngilizce kalabilir veya planlanan Türkçe yollarla (\`/tr/...\`) uyumlu tutulur.
- Bağlantının görünen metni (anchor text) Türkçeye çevrilir.

---

## 🤝 Topluluk ve İletişim

Çevirilerle ilgili kararsız kaldığınız terimleri veya önerilerinizi tartışmak için:
- [Astro Resmi Discord Sunucusu](https://astro.build/chat) üzerinden \`#docs-i18n\` kanalına katılabilirsiniz.
- GitHub üzerinde yeni bir öneri için Issue veya Pull Request açabilirsiniz.

Astro ekosistemini Türkçe konuşan tüm yazılımcılar için daha erişilebilir kılma yolculuğumuza hoş geldiniz! 🎉
`