import { NewsItem, EventItem, PodcastItem, MarketMetric, PartnerItem, NewsletterItem, ResourceItem } from './types';

// ==========================================
// CENTRAL DATA SOURCE
// Update this file to add new links, news, events, etc.
// Dates are automatically handled relative to "today" via getDate()
// ==========================================

// Helper for dynamic dates
const getDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const TRANSLATIONS = {
  en: {
    nav: {
      latest: 'Latest',
      startups: 'Startups',
      events: 'Events',
      podcasts: 'Podcasts',
      newsletters: 'Newsletters',
      market: 'Market Analysis',
      partners: 'Partners',
      resources: 'Resources',
      aiAssistant: 'AI Assistant',
      saved: 'Saved Items',
      login: 'Login',
      logout: 'Logout',
      admin: 'Admin Panel'
    },
    common: {
      searchPlaceholder: 'Search...',
      readMore: 'Read Source',
      aiSummary: 'AI Summary',
      aiTranslate: 'Translate to Arabic',
      save: 'Save',
      saved: 'Saved',
      register: 'Register Now',
      listen: 'Listen Episode',
      subscribe: 'Subscribe',
      contact: 'Contact',
      marketInsights: 'AI Market Insights',
      chatTitle: 'Nexus AI Assistant',
      filter: 'Filter',
      apply: 'Apply',
      all: 'All',
      generateAudio: 'Generate Audio',
      playAudio: 'Play Summary'
    },
    sections: {
        latestTitle: 'Global & Egyptian Tech News',
        startupsTitle: 'Startup Ecosystem',
        eventsTitle: 'Tech Events Calendar',
        marketTitle: 'Financial & Market Data',
        podcastsTitle: 'Tech & Business Podcasts',
        newslettersTitle: 'Curated Newsletters',
        partnersTitle: 'Our Partners',
        resourcesTitle: 'Platform Resources & Sources',
        authTitle: 'Welcome to NexusMena',
        aiPageTitle: 'AI Knowledge Assistant'
    }
  },
  ar: {
    nav: {
      latest: 'أحدث الأخبار',
      startups: 'الشركات الناشئة',
      events: 'الفعاليات',
      podcasts: 'بودكاست',
      newsletters: 'النشرات البريدية',
      market: 'تحليل السوق',
      partners: 'الشركاء',
      resources: 'المصادر',
      aiAssistant: 'المساعد الذكي',
      saved: 'المحفوظات',
      login: 'دخول',
      logout: 'خروج',
      admin: 'لوحة التحكم'
    },
    common: {
      searchPlaceholder: 'بحث...',
      readMore: 'اقرأ المصدر',
      aiSummary: 'ملخص ذكي',
      aiTranslate: 'ترجم للإنجليزية',
      save: 'حفظ',
      saved: 'محفوظ',
      register: 'سجل الآن',
      listen: 'استمع للحلقة',
      subscribe: 'اشترك',
      contact: 'تواصل',
      marketInsights: 'رؤى السوق الذكية',
      chatTitle: 'مساعد نيكسوس الذكي',
      filter: 'تصفية',
      apply: 'تطبيق',
      all: 'الكل',
      generateAudio: 'توليد صوت',
      playAudio: 'تشغيل الملخص'
    },
    sections: {
        latestTitle: 'أخبار التكنولوجيا العالمية والمصرية',
        startupsTitle: 'منظومة الشركات الناشئة',
        eventsTitle: 'تقويم الفعاليات التقنية',
        marketTitle: 'البيانات المالية والسوقية',
        podcastsTitle: 'بودكاست التكنولوجيا والأعمال',
        newslettersTitle: 'نشرات بريدية مختارة',
        partnersTitle: 'شركاؤنا',
        resourcesTitle: 'موارد ومنصات المنصة',
        authTitle: 'مرحباً بك في نيكسوس',
        aiPageTitle: 'المساعد المعرفي الذكي'
    }
  }
};

// RESOURCES - Categorized for Page Distribution
export const RESOURCES: ResourceItem[] = [
  // Startups Page Sources
  { id: 'r3', name: 'Wamda', url: 'https://wamda.com', type: 'Startup', description: 'Leading platform for MENA entrepreneurship ecosystem' },
  { id: 'r9', name: 'MENAbytes', url: 'https://www.menabytes.com', type: 'Startup', description: 'Tracking startups and VC in the Middle East' },
  { id: 'r10', name: 'StartupScene', url: 'https://thestartupscene.me', type: 'Startup', description: 'Stories of entrepreneurs and changemakers' },
  { id: 'r7', name: 'Flat6Labs', url: 'https://flat6labs.com', type: 'Startup', description: 'Regional startup accelerator' },
  
  // Latest News Page Sources
  { id: 'r1', name: 'TechCrunch', url: 'https://techcrunch.com', type: 'News', description: 'Top tier global tech news' },
  { id: 'r11', name: 'Crunchbase News', url: 'https://news.crunchbase.com', type: 'News', description: 'Data-driven business journalism' },
  { id: 'r12', name: 'Business Insider', url: 'https://businessinsider.com', type: 'News', description: 'Global business and tech news' },
  { id: 'r13', name: 'Forbes Entrepreneurs', url: 'https://forbes.com/entrepreneurs', type: 'News', description: 'Leading source for reliable business news' },
  { id: 'r5', name: 'The Verge', url: 'https://theverge.com', type: 'News', description: 'Gadgets, science, and tech culture' },
  { id: 'r14', name: 'Wired', url: 'https://wired.com', type: 'News', description: 'How technology affects culture and politics' },
  { id: 'r15', name: 'Fast Company', url: 'https://fastcompany.com', type: 'News', description: 'Progressive business media brand' },
  
  // Others
  { id: 'r2', name: 'Enterprise', url: 'https://enterprise.press', type: 'Newsletter', description: 'Essential Egyptian business news' },
  { id: 'r8', name: 'Apple Podcasts', url: 'https://apple.com/podcasts', type: 'Podcast', description: 'Podcast platform' },
  { id: 'r6', name: 'ITIDA', url: 'https://itida.gov.eg', type: 'Other', description: 'Egypt IT Industry Development Agency' },
  { id: 'r4', name: 'RiseUp', url: 'https://riseupsummit.com', type: 'Event', description: 'Largest entrepreneurship summit in MENA' },
];

export const LATEST_NEWS: NewsItem[] = [
  {
    id: 'n_wired_1',
    title: 'The Rabbit R1 Review: AI in a Box',
    description: 'Wired reviews the latest dedicated AI hardware device, questioning if it can replace your smartphone apps.',
    source: 'Wired',
    url: 'https://wired.com',
    date: getDate(0),
    region: 'Global',
    category: 'Tech',
    sector: 'AI',
    imageUrl: 'https://picsum.photos/800/400?random=40',
    tags: ['Hardware', 'AI', 'Review']
  },
  {
    id: 'n_tc_1',
    title: 'Stripe valuation stays steady at $65B in latest employee tender offer',
    description: 'TechCrunch reports that the payments giant is providing liquidity to employees without raising new capital.',
    source: 'TechCrunch',
    url: 'https://techcrunch.com',
    date: getDate(0),
    region: 'Global',
    category: 'Economy',
    sector: 'Fintech',
    imageUrl: 'https://picsum.photos/800/400?random=41',
    tags: ['Fintech', 'Valuation']
  },
  {
    id: 'n_verge_1',
    title: 'Nothing Phone 3 rumors point to a major AI upgrade',
    description: 'The Verge explores leaks suggesting the next Nothing handset will integrate generative AI directly into the OS.',
    source: 'The Verge',
    url: 'https://theverge.com',
    date: getDate(-1),
    region: 'Global',
    category: 'Tech',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=42',
    tags: ['Mobile', 'AI']
  },
  {
    id: 'n_bi_1',
    title: 'Microsoft’s AI push is changing office productivity forever',
    description: 'Business Insider analyzes how Copilot is being adopted in Fortune 500 companies.',
    source: 'Business Insider',
    url: 'https://businessinsider.com',
    date: getDate(-1),
    region: 'Global',
    category: 'Tech',
    sector: 'SaaS',
    imageUrl: 'https://picsum.photos/800/400?random=43',
    tags: ['Enterprise', 'Microsoft']
  },
  {
    id: 'n_fc_1',
    title: 'The World\'s Most Innovative Companies of 2025',
    description: 'Fast Company releases its annual list, featuring several AI startups disrupting traditional industries.',
    source: 'Fast Company',
    url: 'https://fastcompany.com',
    date: getDate(-2),
    region: 'Global',
    category: 'Tech',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=44',
    tags: ['Innovation', 'Awards']
  },
  {
    id: 'n_forbes_1',
    title: 'How Gen Z Founders are Reshaping the Creator Economy',
    description: 'Forbes Entrepreneurs looks at the new wave of platforms built by and for the next generation.',
    source: 'Forbes',
    url: 'https://forbes.com/entrepreneurs',
    date: getDate(-2),
    region: 'Global',
    category: 'Economy',
    sector: 'E-commerce',
    imageUrl: 'https://picsum.photos/800/400?random=45',
    tags: ['Creator Economy', 'Gen Z']
  },
  {
    id: 'n1',
    title: 'Egypt’s digital exports reach $6.2 billion in 2024',
    titleAr: 'صادرات مصر الرقمية تصل إلى 6.2 مليار دولار في 2024',
    description: 'The ITIDA report confirms a massive surge in outsourcing and digital services exports, positioning Egypt as a global hub.',
    source: 'Enterprise',
    url: 'https://enterprise.press',
    date: getDate(-3),
    region: 'Egypt',
    category: 'Economy',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    tags: ['Economy', 'ITIDA', 'Outsourcing']
  },
];

export const STARTUP_NEWS: NewsItem[] = [
  {
    id: 's_wamda_1',
    title: 'Saudi Arabia\'s Tamer Group acquires Mumzworld',
    description: 'Wamda covers the major acquisition that is set to dominate the mother and child e-commerce vertical in MENA.',
    source: 'Wamda',
    url: 'https://wamda.com',
    date: getDate(0),
    region: 'MENA',
    category: 'Startup',
    sector: 'E-commerce',
    imageUrl: 'https://picsum.photos/800/400?random=50',
    tags: ['Exit', 'Acquisition', 'KSA']
  },
  {
    id: 's_mena_1',
    title: 'Swvl announces new profitability strategy following SPAC challenges',
    description: 'MENAbytes reports on the Dubai-based mobility giant\'s pivot towards sustainable growth in key markets.',
    source: 'MENAbytes',
    url: 'https://menabytes.com',
    date: getDate(-1),
    region: 'Global',
    category: 'Startup',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=51',
    tags: ['Mobility', 'Strategy']
  },
  {
    id: 's_scene_1',
    title: 'Egyptian fashion e-commerce platform "La Reina" raises pre-Series A',
    description: 'StartupScene highlights the funding round led by Algebra Ventures to support local designers.',
    source: 'StartupScene',
    url: 'https://thestartupscene.me',
    date: getDate(-1),
    region: 'Egypt',
    category: 'Startup',
    sector: 'E-commerce',
    imageUrl: 'https://picsum.photos/800/400?random=52',
    tags: ['Fashion', 'Funding']
  },
  {
    id: 's1',
    title: 'Cairo-based fintech "PayFast" raises $10M Series A',
    description: 'The round was led by Flat6Labs and Global Ventures to expand into Saudi Arabia.',
    source: 'Wamda',
    url: 'https://wamda.com',
    date: getDate(-2),
    region: 'Egypt',
    category: 'Startup',
    sector: 'Fintech',
    imageUrl: 'https://picsum.photos/800/400?random=5',
    tags: ['Fintech', 'Funding', 'Series A']
  },
  {
    id: 's_cb_1',
    title: 'Global Venture Funding hits lowest point since 2018',
    description: 'Crunchbase News data shows a continued slowdown in late-stage dealmaking across all major regions.',
    source: 'Crunchbase News',
    url: 'https://news.crunchbase.com',
    date: getDate(-2),
    region: 'Global',
    category: 'Startup',
    sector: 'General',
    imageUrl: 'https://picsum.photos/800/400?random=53',
    tags: ['VC', 'Market Data']
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'RiseUp Summit 2024',
    description: 'The largest entrepreneurship event in the Middle East taking place at the Grand Egyptian Museum.',
    location: 'Giza, Egypt',
    startDate: getDate(30),
    endDate: getDate(32),
    registrationLink: 'https://riseupsummit.com',
    isVirtual: false,
    region: 'Egypt',
    source: 'RiseUp',
    url: 'https://riseupsummit.com',
    imageUrl: 'https://picsum.photos/800/400?random=8',
    date: getDate(30),
    type: 'Conference'
  },
  {
    id: 'e2',
    title: 'Web Summit Lisbon',
    description: 'Where the future goes to be born. The premier global tech conference.',
    location: 'Lisbon, Portugal',
    startDate: getDate(60),
    endDate: getDate(63),
    registrationLink: 'https://websummit.com',
    isVirtual: false,
    region: 'Global',
    source: 'Web Summit',
    url: 'https://websummit.com',
    imageUrl: 'https://picsum.photos/800/400?random=9',
    date: getDate(60),
    type: 'Conference'
  },
  {
    id: 'e3',
    title: 'Google I/O Extended Cairo',
    description: 'Local community event discussing the latest announcements from Google I/O.',
    location: 'AUC New Cairo',
    startDate: getDate(5),
    endDate: getDate(5),
    registrationLink: 'https://gdg.community.dev',
    isVirtual: false,
    region: 'Egypt',
    source: 'GDG Cairo',
    url: 'https://gdg.community.dev',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    date: getDate(5),
    type: 'Meetup'
  },
  {
    id: 'e4',
    title: 'AI Hackathon MENA',
    description: '48 hours of coding to solve regional challenges using Gemini.',
    location: 'Online',
    startDate: getDate(10),
    endDate: getDate(12),
    registrationLink: 'https://hackathon.mena',
    isVirtual: true,
    region: 'MENA',
    source: 'Devpost',
    url: 'https://devpost.com',
    imageUrl: 'https://picsum.photos/800/400?random=25',
    date: getDate(10),
    type: 'Hackathon'
  }
];

export const PODCASTS: PodcastItem[] = [
  // ARABIC PODCASTS
  {
    id: 'p1',
    title: 'سوالف بيزنس - Swalf Business',
    titleAr: 'سوالف بيزنس',
    description: 'مقابلات مع رواد أعمال ناجحين من المنطقة العربية ومناقشة تحديات السوق.',
    duration: '50 min',
    region: 'MENA',
    source: 'Apple Podcasts',
    url: 'https://apple.com',
    date: getDate(-1),
    imageUrl: 'https://picsum.photos/800/400?random=27',
    summaryPoints: ['رحلة الريادة', 'التحديات المالية', 'التوظيف'],
    language: 'ar',
    topic: 'Entrepreneurship'
  },
  {
    id: 'p_ar_2',
    title: 'بودكاست دبي للمستقبل',
    titleAr: 'بودكاست دبي للمستقبل',
    description: 'حوارات حول مستقبل التكنولوجيا والذكاء الاصطناعي في المنطقة.',
    duration: '30 min',
    region: 'MENA',
    source: 'Dubai Future',
    url: 'https://dubaifuture.ae',
    date: getDate(-3),
    imageUrl: 'https://picsum.photos/800/400?random=31',
    summaryPoints: ['المدن الذكية', 'الذكاء الاصطناعي', 'مستقبل العمل'],
    language: 'ar',
    topic: 'AI'
  },
  {
    id: 'p_ar_3',
    title: 'خمسة بيزنس',
    titleAr: 'خمسة بيزنس',
    description: 'نصائح عملية لرواد الأعمال وأصحاب الشركات الناشئة في مصر.',
    duration: '15 min',
    region: 'Egypt',
    source: 'SoundCloud',
    url: 'https://soundcloud.com',
    date: getDate(-5),
    imageUrl: 'https://picsum.photos/800/400?random=32',
    summaryPoints: ['التسويق الرقمي', 'إدارة الفريق', 'المبيعات'],
    language: 'ar',
    topic: 'Business'
  },
  {
    id: 'p_ar_4',
    title: 'تك بالعربي',
    titleAr: 'تك بالعربي',
    description: 'أحدث أخبار التقنية والهواتف الذكية وتطبيقات الذكاء الاصطناعي.',
    duration: '40 min',
    region: 'MENA',
    source: 'Anghami',
    url: 'https://anghami.com',
    date: getDate(-2),
    imageUrl: 'https://picsum.photos/800/400?random=33',
    summaryPoints: ['مراجعات هواتف', 'تطبيقات جديدة', 'أمن المعلومات'],
    language: 'ar',
    topic: 'Tech'
  },

  // ENGLISH PODCASTS
  {
    id: 'p2',
    title: 'Recode Decode: Kara Swisher on AI Ethics',
    description: 'A deep dive into the ethical implications of AGI with top researchers.',
    duration: '60 min',
    region: 'Global',
    source: 'Apple Podcasts',
    url: 'https://apple.com/podcasts',
    date: getDate(-2),
    imageUrl: 'https://picsum.photos/800/400?random=12',
    summaryPoints: ['Bias in algorithms', 'Regulation needs', 'Human-AI alignment'],
    language: 'en',
    topic: 'AI'
  },
  {
    id: 'p_en_1',
    title: 'Masters of Scale',
    description: 'Legendary Silicon Valley investor Reid Hoffman tests his theories on how businesses scale.',
    duration: '45 min',
    region: 'Global',
    source: 'Spotify',
    url: 'https://spotify.com',
    date: getDate(-4),
    imageUrl: 'https://picsum.photos/800/400?random=34',
    summaryPoints: ['Blitzscaling', 'Network effects', 'Company culture'],
    language: 'en',
    topic: 'Startup'
  },
  {
    id: 'p_en_2',
    title: 'The Vergecast',
    description: 'The flagship podcast of The Verge, covering gadgets, software, and tech news.',
    duration: '55 min',
    region: 'Global',
    source: 'The Verge',
    url: 'https://theverge.com',
    date: getDate(-1),
    imageUrl: 'https://picsum.photos/800/400?random=35',
    summaryPoints: ['Gadget reviews', 'Big Tech antitrust', 'Social media trends'],
    language: 'en',
    topic: 'Tech'
  },
  {
    id: 'p_en_3',
    title: 'HBR IdeaCast',
    description: 'A weekly podcast featuring the leading thinkers in business and management.',
    duration: '25 min',
    region: 'Global',
    source: 'HBR',
    url: 'https://hbr.org',
    date: getDate(-6),
    imageUrl: 'https://picsum.photos/800/400?random=36',
    summaryPoints: ['Leadership', 'Strategy', 'Productivity'],
    language: 'en',
    topic: 'Business'
  },
  {
    id: 'p3',
    title: 'The Egyptian Startup Story: Vezeeta',
    description: 'How Vezeeta managed to scale across MENA and navigate the economic downturn.',
    duration: '45 min',
    region: 'Egypt',
    source: 'Spotify',
    url: 'https://spotify.com',
    date: getDate(-5),
    imageUrl: 'https://picsum.photos/800/400?random=11',
    summaryPoints: ['Early challenges', 'Series D insights', 'Digital health future'],
    language: 'en',
    topic: 'Entrepreneurship'
  },
];

export const NEWSLETTERS: NewsletterItem[] = [
  {
    id: 'nl1',
    title: 'TLDR Tech',
    description: 'Keep up with tech in 5 minutes. The most important stories in tech, science, and coding.',
    source: 'TLDR',
    url: 'https://tldr.tech',
    date: getDate(0),
    region: 'Global',
    imageUrl: 'https://picsum.photos/800/400?random=28',
    frequency: 'Daily',
    subscribeLink: 'https://tldr.tech'
  },
  {
    id: 'nl2',
    title: 'Enterprise Egypt',
    description: 'The essential morning read for business and finance in Egypt.',
    source: 'Enterprise',
    url: 'https://enterprise.press',
    date: getDate(0),
    region: 'Egypt',
    imageUrl: 'https://picsum.photos/800/400?random=29',
    frequency: 'Daily',
    subscribeLink: 'https://enterprise.press/subscribe'
  },
  {
    id: 'nl3',
    title: 'The Hustle',
    description: 'Business and tech news that is actually enjoyable to read.',
    source: 'The Hustle',
    url: 'https://thehustle.co',
    date: getDate(0),
    region: 'Global',
    imageUrl: 'https://picsum.photos/800/400?random=30',
    frequency: 'Daily',
    subscribeLink: 'https://thehustle.co/join'
  }
];

export const MARKET_DATA_INDICES: MarketMetric[] = [
  { name: 'EGX 30', value: 28500.45, change: 1.2, trend: 'up', currency: 'pts', type: 'Index' },
  { name: 'NASDAQ', value: 16340.20, change: 0.8, trend: 'up', currency: 'USD', type: 'Index' },
  { name: 'S&P 500', value: 5200.10, change: 0.3, trend: 'up', currency: 'USD', type: 'Index' },
  { name: 'Tadawul', value: 12500.00, change: -0.2, trend: 'down', currency: 'SAR', type: 'Index' }
];

export const MARKET_DATA_CRYPTO: MarketMetric[] = [
  { name: 'Bitcoin', value: 64200.00, change: -1.5, trend: 'down', currency: 'USD', type: 'Crypto' },
  { name: 'Ethereum', value: 3200.50, change: 0.5, trend: 'up', currency: 'USD', type: 'Crypto' },
  { name: 'Solana', value: 145.20, change: 2.1, trend: 'up', currency: 'USD', type: 'Crypto' }
];

export const MARKET_DATA_CURRENCY: MarketMetric[] = [
  { name: 'USD/EGP', value: 47.85, change: -0.1, trend: 'neutral', currency: 'EGP', type: 'Currency' },
  { name: 'EUR/EGP', value: 51.20, change: 0.2, trend: 'up', currency: 'EGP', type: 'Currency' },
  { name: 'SAR/EGP', value: 12.75, change: 0.0, trend: 'neutral', currency: 'EGP', type: 'Currency' }
];

export const PARTNERS: PartnerItem[] = [
  { 
    id: 'pt1', 
    name: 'ITIDA', 
    logo: 'https://picsum.photos/200/200?random=20', 
    website: 'https://itida.gov.eg', 
    type: 'Egypt',
    description: 'Information Technology Industry Development Agency',
    contactEmail: 'info@itida.gov.eg',
    services: ['Grants', 'Training', 'Export Support']
  },
  { 
    id: 'pt2', 
    name: 'TechCrunch', 
    logo: 'https://picsum.photos/200/200?random=21', 
    website: 'https://techcrunch.com', 
    type: 'Global',
    description: 'Leading technology media property, dedicated to obsessively profiling startups.',
    contactEmail: 'partners@techcrunch.com',
    services: ['Media Coverage', 'Events', 'Advertising']
  },
  { 
    id: 'pt3', 
    name: 'Flat6Labs', 
    logo: 'https://picsum.photos/200/200?random=22', 
    website: 'https://flat6labs.com', 
    type: 'Egypt',
    description: 'MENA’s leading seed and early stage venture capital firm.',
    contactEmail: 'cairo@flat6labs.com',
    services: ['Investment', 'Mentorship', 'Office Space']
  },
  { 
    id: 'pt4', 
    name: 'Plug and Play', 
    logo: 'https://picsum.photos/200/200?random=23', 
    website: 'https://plugandplaytechcenter.com', 
    type: 'Global',
    description: 'The ultimate innovation platform, connecting startups to corporations.',
    contactEmail: 'egypt@pnptc.com',
    services: ['Corporate Innovation', 'Acceleration', 'Investment']
  },
];