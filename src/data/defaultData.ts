import { PhaseDetails, GiftSuggestion, PersonProfile, LegalConsent, AppSettings } from '../types/cycle';
import { formatDateToYYYYMMDD } from '../utils/cycleCalculations';

export const PHASE_DETAILS: Record<string, PhaseDetails> = {
  menstrual: {
    key: 'menstrual',
    name: 'Adet Dönemi',
    title: 'Dinlenme & İyileşme Zamanı',
    durationLabel: '1 - 5. Günler',
    color: '#f43f5e',
    textColor: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800',
    summary: 'Östrojen ve progesteron en dip seviyede. Vücut yoğun bir biyolojik yenilenme sürecinde. Kramp, baş ağrısı ve düşük enerji çok doğaldır.',
    hormones: 'Östrojen: Düşük | Progesteron: Düşük',
    energyLevel: 25,
    patienceRequirement: 85,
    whatSheFeels: [
      'Karın altı ve bel bölgesinde kramplar, sancı',
      'Yoğun fiziksel ve zihinsel yorgunluk',
      'Yalnız kalma veya sadece güvenli bir şefkat ihtiyacı',
      'Baş ağrısı ve uykulu hissetme',
      'Ağır kokulara veya ani seslere tahammülsüzlük'
    ],
    whatYouShouldDo: [
      'Sıcak su torbasını veya ısıtıcı bandı hazırlayıp getirin.',
      'Ev işlerini, yemek hazırlığını ve market alışverişini üstlenin.',
      'Soru sormadan bitki çayı (papatya/rezene) ve su ikram edin.',
      'Sadece yanında sessizce oturun, yumuşak bir battaniye örtün.',
      'Duygusal veya fiziksel hiçbir şey için baskı yapmayın.'
    ],
    whatYouShouldAvoid: [
      'Asla "Aşırı abartmıyor musun?" veya "Yine mi regl?" demeyin.',
      'Yorucu davetlere veya kalabalık ortamlara gitmesi için zorlamayın.',
      'Önemli kararlar veya tartışmalı konular açmayın.',
      'Tavsiye vermek yerine sadece şefkat gösterin.'
    ],
    careTips: [
      'Sıcak banyo veya ayak masajı çok iyi gelir.',
      'Magnezyum açısından zengin muz, ceviz ve bitter çikolata ikram edin.',
      'Onu dinleyin ve dinlenmesi için sessiz bir alan yaratın.'
    ]
  },
  follicular: {
    key: 'follicular',
    name: 'Foliküler Evre',
    title: 'Yükselen Enerji & Yaratıcılık',
    durationLabel: '6 - 12. Günler',
    color: '#0ea5e9',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    borderColor: 'border-sky-200 dark:border-sky-800',
    summary: 'Östrojen seviyesi hızla yükseliyor. Beyinde serotonin artışı ile enerji, iyimserlik, merak ve sosyallik tavan yapar.',
    hormones: 'Östrojen: Hızla Yükseliyor | FSH: Aktif',
    energyLevel: 80,
    patienceRequirement: 30,
    whatSheFeels: [
      'Canlı, zinde ve hareketli hissetme',
      'Yeni projelere başlama ve sosyalleşme arzusu',
      'Öğrenmeye açık zihin, yüksek konsantrasyon',
      'Geleceğe dair umutlu ve pozitif ruh hali',
      'Fiziksel dayanıklılıkta belirgin artış'
    ],
    whatYouShouldDo: [
      'Birlikte dışarı çıkın; yürüyüş, seyahat veya yeni mekan planları yapın.',
      'Birlikte spor veya eğlenceli aktivitelere katılın.',
      'Ortak hedefler, tatiller veya ev projeleri üzerine konuşun.',
      'Yaratıcı fikirlerini can kulağıyla dinleyin ve destekleyin.'
    ],
    whatYouShouldAvoid: [
      'Onu evde tutmaya çalışmayın, hareket isteğini sınırlamayın.',
      'Kendi tembelliğinizi ona yansıtmayın.',
      'Coşkusunu veya yeni heveslerini küçümsemeyin.'
    ],
    careTips: [
      'Hafif ve sağlıklı taze sebze/protein yemekleri hazırlayın.',
      'Sürpriz bir hafta sonu kaçamağı planlayın.'
    ]
  },
  ovulation: {
    key: 'ovulation',
    name: 'Yumurtlama Evresi',
    title: 'Zirve Çekicilik & Romantizm',
    durationLabel: '13 - 16. Günler',
    color: '#8b5cf6',
    textColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800',
    summary: 'Östrojen ve testosteron zirveye ulaşır. Kadın vücudunun en ışıltılı, kendine güvenen ve çekici hissettiği günlerdir.',
    hormones: 'LH Zirvesi | Östrojen: Maksimum | Testosteron: Yüksek',
    energyLevel: 95,
    patienceRequirement: 25,
    whatSheFeels: [
      'En yüksek özgüven ve çekicilik hissi',
      'Romantik yakınlık ve flört isteğinde artış',
      'Güçlü iletişim kabiliyeti ve karizma',
      'Hafif kasık batması (mittelschmerz sancısı olabilir)',
      'Ten ve saçlarda doğal parlaklık'
    ],
    whatYouShouldDo: [
      'Romantik bir randevu gecesi (şık akşam yemeği) organize edin.',
      'Nasıl göründüğüne dair içten iltifatlar edin.',
      'Göz teması kurun, flörtöz ve özenli davranın.',
      'Özel hissettirecek küçük sürprizler veya çiçek jesti yapın.'
    ],
    whatYouShouldAvoid: [
      'Randevuları ertelemeyin, enerjisini boşa harcamayın.',
      'İlgisiz veya dikkatsiz görünmeyin.',
      'Övgülerinizi sıradanlaştırmayın.'
    ],
    careTips: [
      'Birlikte dans edin veya canlı bir konsere gidin.',
      'Çiçek veya en sevdiği parfümü hediye etmek için en doğru zaman.'
    ]
  },
  luteal: {
    key: 'luteal',
    name: 'Luteal & PMS Evresi',
    title: 'Hassasiyet & Sabır Bölgesi',
    durationLabel: '17 - 28. Günler',
    color: '#f97316',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    summary: 'Yumurtlama sonrası progesteron yükselir ve döngünün sonlarına doğru aniden düşer. Beyindeki GABA ve serotonin dalgalanması duygusal alınganlık ve tatlı krizlerine yol açar.',
    hormones: 'Progesteron: Önce Zirve Sonra Sert Düşüş | Serotonin: Düşük',
    energyLevel: 45,
    patienceRequirement: 98,
    whatSheFeels: [
      'Ani duygu değişimleri, ağlama isteği, içe kapanma',
      'Belirgin tatlı, çikolata ve karbonhidrat krizleri',
      'Göğüslerde hassasiyet ve vücutta ödem / şişkinlik',
      'En ufak bir söze veya tavra karşı aşırı kırılganlık',
      'Uyku düzensizliği ve genel huzursuzluk'
    ],
    whatYouShouldDo: [
      'Bir numaralı kural: Asla tartışmaya girmeyin, haklı çıkmaya çalışmayın!',
      'En sevdiği çikolataları, atıştırmalıkları stoklayın.',
      'Şikayet ettiğinde çözüm üretmek yerine: "Seni anlıyorum, haklısın" deyin.',
      'Sırt ve omuz masajı yapın, rahatlatıcı müzik açın.',
      'Evdeki düzeni sağlayarak onun yükünü azaltın.'
    ],
    whatYouShouldAvoid: [
      'Asla "Yine regl mi olacaksın?", "PMS misin?" cümlesini kurmayın (Kritik tehlike).',
      'Kilosu, şişkinliği veya iştahı hakkında espri yapmayın.',
      'Eleştirel veya sorgulayıcı geri bildirimlerde bulunmayın.',
      'Haklı olsanız bile tartışmayı uzatmayın.'
    ],
    careTips: [
      'Akşam için en sevdiği yemeği sipariş edin.',
      'Battaniye altında sevdiği bir dizi veya filmi izlemeyi teklif edin.',
      'Yargılamadan dinleyin, fiziksel temasla güven verin.'
    ]
  }
};

export const INITIAL_PROFILES: PersonProfile[] = [
  {
    id: 'profile-1',
    name: 'Eşim (Ayşe)',
    relationship: 'Eşim',
    avatarColor: 'bg-rose-500',
    lastPeriodStartDate: (() => {
      // Set to 8 days ago for a lively initial experience (Day 9 - Follicular phase)
      const d = new Date();
      d.setDate(d.getDate() - 8);
      return formatDateToYYYYMMDD(d);
    })(),
    cycleLength: 28,
    periodDuration: 5,
    notes: 'Karanfil ve papatya çayı seviyor. Regl ilk 2 günü sıcak su torbası şart. PMS zamanı bitter çikolata krizine girer.',
    favoriteSnacks: 'Bitter Çikolata (%70), Antep Fıstığı, Çilek',
    specialNeeds: 'İlk 2 gün bel ağrısı çok oluyor, ağır kaldırmaması gerekiyor.',
    symptomsLogs: [],
    createdAt: new Date().toISOString(),
    isPrimary: true,
  }
];

export const GIFT_SUGGESTIONS: GiftSuggestion[] = [
  {
    id: 'gift-1',
    title: 'Sıcak Su Torbası & Papatya Çayı Kiti',
    category: 'Konfor & Rahatlık',
    phase: 'menstrual',
    description: 'Yumuşacık peluş kılıflı sıcak su torbası ve taze demlenmiş papatya çayı. Kas spazmlarını doğal yolla rahatlatır.',
    priceLevel: 'Ekonomik',
    tags: ['Ağrı Kesici', 'Rahatlama', 'Sıcaklık']
  },
  {
    id: 'gift-2',
    title: 'Kraliyet Masajı & Sırt Dinlendirme',
    category: 'Hizmet & Destek',
    phase: 'menstrual',
    description: 'Lavanta aromaterapi yağı ile 20 dakikalık nazik bel ve ayak masajı. Konuşmadan, sadece rahatlatma odaklı.',
    priceLevel: 'Ücretsiz',
    tags: ['Masaj', 'Sıfır Maliyet', 'Derin Sevgi']
  },
  {
    id: 'gift-3',
    title: 'VIP Acil Durum Çikolata & Atıştırmalık Sepeti',
    category: 'Tatlı & Atıştırmalık',
    phase: 'luteal',
    description: 'En sevdiği çikolatalar, tuzlu cipsler, jelibonlar ve taze çilekten oluşan kişisel moral kutusu.',
    priceLevel: 'Ekonomik',
    tags: ['Tatlı Krizi', 'PMS Kurtarıcı', 'Moral']
  },
  {
    id: 'gift-4',
    title: 'Bütün Ev İşlerini Devralma Kuponu',
    category: 'Hizmet & Destek',
    phase: 'all',
    description: 'Bulaşık, çamaşır, yemek ve temizlik işlerini tek bir kelime ettirmeden tamamen üstlenmek.',
    priceLevel: 'Ücretsiz',
    tags: ['Ev İşleri', 'Huzur', 'Gerçek Destek']
  },
  {
    id: 'gift-5',
    title: 'Mum Işığında Şık Akşam Yemeği',
    category: 'Romantizm & İlgi',
    phase: 'ovulation',
    description: 'Özenle seçilmiş şık bir restoranda masa ayırtın veya evde mum ışığında iki kişilik özel bir sofra kurun.',
    priceLevel: 'Orta',
    tags: ['Randevu', 'Özgüven', 'Flört']
  },
  {
    id: 'gift-6',
    title: 'Taze Çiçek Buketi (Nedensizce)',
    category: 'Sürpriz Hediye',
    phase: 'follicular',
    description: 'Özel bir gün beklemeden, sadece aklınıza geldiği için kapısına gelen taze şakayık veya gül buketi.',
    priceLevel: 'Orta',
    tags: ['Çiçek', 'Tebessüm', 'Sürpriz']
  },
  {
    id: 'gift-7',
    title: 'Kokusuz & Sıcak Battaniye Sinema Gecesi',
    category: 'Konfor & Rahatlık',
    phase: 'luteal',
    description: 'Filmi onun seçtiği, telefonların bir kenara bırakıldığı, sınırsız patlamış mısır eşliğinde ev sineması.',
    priceLevel: 'Ücretsiz',
    tags: ['Dizi/Film', 'Sarılma', 'Sıcak Yuva']
  },
  {
    id: 'gift-8',
    title: 'İpek Uyku Maskesi ve Lavanta Yastık Spreyi',
    category: 'Konfor & Rahatlık',
    phase: 'menstrual',
    description: 'Uykusuz geçen ağrılı gecelerde deliksiz ve huzurlu uyumasını sağlayan birinci sınıf ipek göz bandı.',
    priceLevel: 'Ekonomik',
    tags: ['Derin Uyku', 'Konfor', 'Hassas Ten']
  }
];

export const LEGAL_DOCS = {
  terms: {
    title: 'Kullanıcı Hizmet Sözleşmesi',
    lastUpdated: '18 Ekim 2026',
    content: `1. GENEL BİLGİLENDİRME
Sympathy ("Uygulama"), eşlerin ve partnerlerin menstrual döngü evreleri, PMS süreçleri ve hormonal değişimler konusunda karşılıklı farkındalık kazanmalarını, sağlıklı iletişim kurmalarını ve birbirlerine uygun desteği sağlamalarını kolaylaştırmak amacıyla tasarlanmış bir yaşam asistanıdır.

2. HİZMETİN KAPSAMI VE NİTELİĞİ
Bu uygulama bir arkadaşlık, evlilik ve ilişki destek aracıdır. Uygulama içerisinde sunulan döngü tahminleri, öneriler, hediye fikirleri ve psikolojik yaklaşımlar genel bilgilendirme amacıyla hazırlanmıştır. 

3. KULLANICI SORUMLULUĞU
Kullanıcı, sisteme girdiği tarih ve bilgilerin doğruluğundan bizzat sorumludur. Döngü hesaplamaları biyolojik bireysel farklılıklar, stres, ilaç kullanımı veya hormonal dalgalanmalar nedeniyle değişiklik gösterebilir.

4. FİKRİ MÜLKİYET
Uygulamanın arayüz tasarımları, metinleri, algoritması ve rehber içerikleri telif hakkı ile korunmaktadır. İzinsiz kopyalanamaz veya ticari amaçla çoğaltılamaz.`
  },
  privacy: {
    title: 'KVKK ve Gizlilik Politikası',
    lastUpdated: '18 Ekim 2026',
    content: `1. VERİLERİNİZİN YEREL GİZLİLİK PRENSİBİ (%100 ÇEVRİMDIŞI VE YEREL SAKLAMA)
Kişisel verilerinizin mahremiyeti bizim için en yüksek önceliktir. Sympathy uygulamasına girdiğiniz hiçbir veri (isimler, döngü tarihleri, ilişkiler, özel notlar, semptomlar) harici bir sunucuya, üçüncü taraf şirketlere veya reklam ağlarına ASLA iletilmez.

2. VERİLER NEREDE TUTULUR?
Tüm profil ve döngü kayıtları yalnızca kullandığınız cihazın yerel tarayıcı belleğinde (localStorage) şifreli biçimde muhafaza edilir. Uygulama verilerinizi temizlediğinizde bu kayıtlar cihazınızdan kalıcı olarak silinir.

3. ÇEREZLER VE İZLEME
Uygulamada kullanıcıyı takip eden pazarlama çerezleri, profil çıkarma algoritmaları veya harici analitik kodları bulunmamaktadır.

4. HAKLARINIZ (6698 SAYILI KVKK KAPSAMINDA)
Verilerinizi dilediğiniz zaman uygulama içi ayarlardan tek tıkla silebilir, güncelleyebilir veya dışa aktarabilirsiniz.`
  },
  medical: {
    title: 'Medikal Bilgilendirme ve Tıbbi Feragatname',
    lastUpdated: '18 Ekim 2026',
    content: `ÖNEMLİ TIBBİ UYARI:
Sympathy bir tıbbi tanı, tedavi, doğum kontrolü veya klinik takip yazılımı DEĞİLDİR.

1. DOĞUM KONTROLÜ OLARAK KULLANILAMAZ
Uygulamada gösterilen yumurtlama (ovülasyon) ve doğurganlık günleri yalnızca ortalama istatistiki algoritmalara dayanır. Hamilelikten korunma veya gebelik planlama yöntemi olarak kesin güvenilirlik taahhüt etmez.

2. DOKTOR TAVSİYESİ YERİNE GEÇMEZ
Şiddetli kramplar, düzensiz kanamalar, anormal ağrılar veya şüpheli belirtiler durumunda mutlaka bir Kadın Hastalıkları ve Doğum Uzmanına (Jinekolog) başvurulmalıdır. Uygulama hiçbir zaman uzman hekim tavsiyesinin yerini alamaz.

3. SORUMLULUK SINIRLAMASI
Uygulamada yer alan önerilerin (bitki çayı, sıcak su torbası, masaj vb.) uygulanması kullanıcının kendi inisiyatifindedir; herhangi bir tıbbi alerji veya rahatsızlık durumunda hekime danışılmalıdır.`
  }
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  pmsAlertDaysBefore: 3,
  periodAlertDaysBefore: 1,
  dailyAdviceEnabled: true,
  deviceStyle: 'standard',
};

export const DEFAULT_LEGAL_CONSENT: LegalConsent = {
  termsAccepted: false,
  privacyAccepted: false,
  medicalAccepted: false,
};
