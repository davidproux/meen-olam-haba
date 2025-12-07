import { Yishuv, Unit, Lead, InvoiceSummary, LeadType, StoredCard, Affiliate } from '../types';
import { LEAD_COST } from '../constants';

// LocalStorage Keys
const KEYS = {
  YISHUVS: 'moh_yishuvs',
  UNITS: 'moh_units',
  LEADS: 'moh_leads',
  INVOICES: 'moh_invoices',
  AFFILIATES: 'moh_affiliates',
};

// --- Seed Data ---

const seedYishuvim: Yishuv[] = [
  {
    id: 'y1',
    name: 'בר יוחאי',
    slug: 'bar-yohai',
    short_description: 'יישוב דתי בגליל ליד מירון, אווירה קסומה ושקטה.',
    long_description: 'יישוב בר יוחאי שוכן למרגלות הר מירון. היישוב ידוע באווירה התורנית שלו, בקרבה לציון רבי שמעון בר יוחאי, ובנופים הגליליים העוצרי נשימה הנשקפים ממנו. במקום קהילה חמה, מגוון בתי כנסת ומקוואות מהודרים, ופעילויות לכל המשפחה.',
    region: 'גליל',
    main_image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800'],
    map_location: { lat: 32.9922, lng: 35.4389, address: 'בר יוחאי' },
    synagogues: ['המרכזי - ספרדי', 'אשכנזי - חב"ד', 'תימני'],
    mikve: ['נשים', 'גברים', 'כלים'],
    gmach: true,
    playgrounds: true,
    grass_area: true,
    attractions_nearby: 'קבר הרשב"י, נחל עמוד, צפת העתיקה',
    supermarket_nearby: 'צרכניה ביישוב, סופר גדול במירון (3 דקות)',
    public_transport: 'קווים ישירים לירושלים ובני ברק',
    nearby_hikes: ['נחל עמוד', 'שביל הפסגה בהר מירון', 'עין שמאי'],
    nearby_graves: ['רבי שמעון בר יוחאי (רשב"י)', 'רבי אלעזר', 'רבי יוסי דמן יוקרת'],
    nearby_attractions: ['פארק הדיג ספסופה', 'טיולי ג’יפים בהרי מירון'],
    nearby_restaurants: ['פיצה מירון', 'מסעדת הרשב"י (בשרי)', 'קפה גרג צומת מירון'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'y2',
    name: 'אור הגנוז',
    slug: 'or-haganuz',
    short_description: 'יישוב תורני בלב הגליל, נוף הרים ואוויר צלול.',
    long_description: 'אור הגנוז הוא יישוב קהילתי חרדי למרגלות הר מירון. המקום מציע שילוב ייחודי של חיי תורה עשירים, נוף גלילי פתוח ושקט נפשי. היישוב מהווה נקודת יציאה מושלמת לטיולים בקברי צדיקים ובנחלי הצפון.',
    region: 'מרום הגליל',
    main_image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800'],
    map_location: { lat: 33.008, lng: 35.435, address: 'אור הגנוז' },
    synagogues: ['בית המדרש המרכזי', 'היכל התורה'],
    mikve: ['נשים', 'גברים'],
    gmach: true,
    playgrounds: true,
    grass_area: true,
    attractions_nearby: 'יער ביריה, מירון, צפת',
    supermarket_nearby: 'מינימרקט יישובי',
    public_transport: 'תחבורה סדירה לצפת ומירון',
    nearby_hikes: ['יער ביריה', 'עין ליאור', 'נחל דישון'],
    nearby_graves: ['רבי יהודה בר אילעי', 'רבי כרוספדאי', 'חלקת מחוקק'],
    nearby_attractions: ['חוות בת יער', 'יקב אור הגנוז'],
    nearby_restaurants: ['קייטרינג הבית', 'פיצה דליית אל כרמל (משלוחים)'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'y3',
    name: 'דולב',
    slug: 'dolev',
    short_description: 'יישוב קהילתי תורני בחבל בנימין, טובל בירוק ומוקף כרמים.',
    long_description: 'דולב הוא יישוב קהילתי דתי במערב בנימין, השוכן בלב אזור ירוק ושופע מעיינות וכרמים. היישוב מצטיין בחיי קהילה תוססים, מוסדות חינוך מצוינים ואווירה משפחתית חמה. בדולב תמצאו בית כנסת מרכזי גדול, מקווה מהודר, וסביבה פסטורלית המזמינה לטיולים בטבע, כולל "מעיין דולב" המפורסם והוואדיות הסמוכים.',
    region: 'בנימין',
    main_image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1595232389108-a539b9070c5b?auto=format&fit=crop&q=80&w=800'],
    map_location: { lat: 31.9333, lng: 35.0833, address: 'דולב' },
    synagogues: ['בית הכנסת המרכזי', 'ספרדי - היכל שלמה', 'אשכנזי - בית אברהם'],
    mikve: ['נשים', 'גברים', 'כלים'],
    gmach: true,
    playgrounds: true,
    grass_area: true,
    attractions_nearby: 'עין בובין (מעיין דולב), נחל דולב, יערות בנימין',
    supermarket_nearby: 'צרכניה גדולה ביישוב',
    public_transport: 'קווים לירושלים ומודיעין עילית',
    nearby_hikes: ['שביל המעיינות', 'וואדי דולב', 'שמורת דלבים'],
    nearby_graves: [],
    nearby_attractions: ['יקב דולב', 'חוות סוסים בנימין'],
    nearby_restaurants: ['פיצה דולב', 'קייטרינג הבית'],
    created_at: new Date().toISOString(),
  }
];

const seedUnits: Unit[] = [
  // --- BAR YOHAI UNITS (y1) ---
  {
    id: 'u1',
    yishuv_id: 'y1',
    name: 'סוויטת הגליל',
    description: 'סוויטה מפנקת לזוגות או משפחות קטנות, עם נוף להר מירון. כניסה נפרדת וגינה מטופחת.',
    address: 'הברוש 12',
    main_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    gallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'],
    living_room: true,
    extra_mattresses: 2,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מקרר', 'קומקום', 'פינת קפה', 'פלטה', 'מיחם'],
    dining_area: true,
    table_count: 1,
    chair_count: 6,
    rooms: 2,
    room_description: 'חדר שינה הורים מרווח + חדר ילדים עם מיטת קומותיים.',
    ac: true,
    bathrooms: ['מקלחת+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['מיחם', 'פלטה', 'נרות'],
    yard: true,
    pool: false,
    jacuzzi: true,
    sport_facilities: false,
    kids_games: true,
    availability: ['כל השנה', 'שבתות', 'חגים'],
    map_location: { lat: 32.9925, lng: 35.4390 },
    payment_terms: 'מקדמה 20% בעת ההזמנה',
    payment_methods: ['מזומן', 'העברה'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '050-0000000',
    website_link: 'https://example.com',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u2',
    yishuv_id: 'y1',
    name: 'אחוזת שלווה',
    description: 'וילה ענקית למשפחות מורחבות, חצר ענקית עם בריכה מחוממת.',
    address: 'הזית 5',
    main_image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
    gallery: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
    living_room: true,
    extra_mattresses: 10,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מקרר', 'תנור חלבי', 'תנור בשרי', 'כיריים גז', 'כיור חלבי', 'כיור בשרי'],
    dining_area: true,
    table_count: 4,
    chair_count: 20,
    rooms: 5,
    room_description: '5 חדרי שינה סגורים.',
    ac: true,
    bathrooms: ['אמבטיה+שירותים', 'מקלחת+שירותים', 'שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['מיחם', 'פלטה', 'נרות', 'ציוד לשבת'],
    yard: true,
    pool: true,
    jacuzzi: true,
    sport_facilities: true,
    kids_games: true,
    availability: ['בין הזמנים', 'שבתות'],
    map_location: { lat: 32.9930, lng: 35.4385 },
    payment_terms: "תשלום מלא בצ'ק אין",
    payment_methods: ['מזומן', 'שוברי מילואים'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '052-0000000',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u3',
    yishuv_id: 'y1',
    name: 'בקתת העץ הרומנטית',
    description: 'צימר עץ כפרי ומבודד בקצה היישוב, מתאים לזוגות המחפשים שקט.',
    address: 'נוף הרים 8',
    main_image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: false,
    extra_mattresses: 0,
    bookshelf_kodesh: false,
    kitchen: true,
    kitchen_details: ['מקרר קטן', 'פינת קפה'],
    dining_area: false,
    table_count: 1,
    chair_count: 2,
    rooms: 1,
    room_description: 'חלל אחד פתוח (סטודיו)',
    ac: true,
    bathrooms: ['מקלחת+שירותים'],
    wifi: false,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['מיחם', 'פלטה'],
    yard: true,
    pool: false,
    jacuzzi: true,
    sport_facilities: false,
    kids_games: false,
    availability: ['כל השנה'],
    map_location: { lat: 32.9928, lng: 35.4395 },
    payment_terms: 'מזומן בלבד',
    payment_methods: ['מזומן'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '055-0000000',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u4',
    yishuv_id: 'y1',
    name: 'פנטהאוז מול המירון',
    description: 'דירת גג מרווחת עם מרפסת ענקית הצופה לקבר הרשב"י.',
    address: 'הצדיק 3',
    main_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 4,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מקרר גדול', 'תנור', 'כיריים'],
    dining_area: true,
    table_count: 2,
    chair_count: 12,
    rooms: 3,
    room_description: '3 חדרי שינה מרווחים',
    ac: true,
    bathrooms: ['אמבטיה+שירותים', 'שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['פלטה', 'מיחם', 'נרות', 'שעוני שבת'],
    yard: false,
    pool: false,
    jacuzzi: false,
    sport_facilities: false,
    kids_games: true,
    availability: ['שבתות', 'חגים'],
    map_location: { lat: 32.9935, lng: 35.4380 },
    payment_terms: 'העברה מראש',
    payment_methods: ['העברה', 'אשראי'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '054-0000000',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },

  // --- OR HAGANUZ UNITS (y2) ---
  {
    id: 'u5',
    yishuv_id: 'y2',
    name: 'אחוזת הגפן',
    description: 'וילת אירוח יוקרתית בלב הכרמים של אור הגנוז.',
    address: 'דרך היין 2',
    main_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 5,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבח כשר למהדרין', 'שני כיורים', 'תנור כפול'],
    dining_area: true,
    table_count: 3,
    chair_count: 15,
    rooms: 4,
    room_description: '4 סוויטות עם שירותים צמודים',
    ac: true,
    bathrooms: ['מקלחת+שירותים', 'מקלחת+שירותים', 'מקלחת+שירותים', 'מקלחת+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['מיחם 40 כוסות', 'פלטה גדולה'],
    yard: true,
    pool: true,
    jacuzzi: true,
    sport_facilities: false,
    kids_games: true,
    availability: ['בין הזמנים', 'שבתות'],
    map_location: { lat: 33.0085, lng: 35.4355 },
    payment_terms: 'מקדמה 50%',
    payment_methods: ['אשראי', 'העברה'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '052-1234567',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u6',
    yishuv_id: 'y2',
    name: 'סוויטת ההר',
    description: 'יחידת אירוח חדשה ומודרנית בקומה שנייה עם נוף פנורמי.',
    address: 'הפסגה 10',
    main_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 2,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מקרר', 'מיקרוגל', 'טוסטר'],
    dining_area: true,
    table_count: 1,
    chair_count: 6,
    rooms: 2,
    room_description: 'חדר שינה + סלון עם ספה נפתחת',
    ac: true,
    bathrooms: ['מקלחת+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['פלטה', 'מיחם'],
    yard: false,
    pool: false,
    jacuzzi: false,
    sport_facilities: false,
    kids_games: false,
    availability: ['כל השנה'],
    map_location: { lat: 33.0090, lng: 35.4360 },
    payment_terms: 'מזומן בהגעה',
    payment_methods: ['מזומן'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '058-9999999',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u7',
    yishuv_id: 'y2',
    name: 'הבית בכפר',
    description: 'בית פרטי נעים ושקט, קרוב לבית הכנסת ולמקווה.',
    address: 'הרימון 4',
    main_image: 'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 6,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבח מלא'],
    dining_area: true,
    table_count: 2,
    chair_count: 10,
    rooms: 3,
    room_description: '3 חדרי שינה',
    ac: true,
    bathrooms: ['אמבטיה+שירותים', 'שירותים'],
    wifi: false,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['ציוד מלא לשבת'],
    yard: true,
    pool: true,
    jacuzzi: false,
    sport_facilities: true,
    kids_games: true,
    availability: ['שבתות וחגים'],
    map_location: { lat: 33.0082, lng: 35.4340 },
    payment_terms: '',
    payment_methods: ['מזומן', 'צק'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '050-1112222',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u8',
    yishuv_id: 'y2',
    name: 'פינה בגליל',
    description: 'יחידת דיור קומפקטית וזולה, מתאימה לזוגות או בחורים.',
    address: 'הגליל 1',
    main_image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: false,
    extra_mattresses: 1,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבחון'],
    dining_area: true,
    table_count: 1,
    chair_count: 4,
    rooms: 1,
    room_description: 'חדר אחד גדול',
    ac: true,
    bathrooms: ['מקלחת+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: false,
    shabbat_equipment: ['פלטה', 'מיחם'],
    yard: true,
    pool: false,
    jacuzzi: false,
    sport_facilities: false,
    kids_games: false,
    availability: ['סופ"ש'],
    map_location: { lat: 33.0080, lng: 35.4350 },
    payment_terms: 'תשלום מראש',
    payment_methods: ['ביט', 'פייבוקס'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '053-3333333',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },

  // --- DOLEV UNITS (y3) ---
  {
    id: 'u9',
    yishuv_id: 'y3',
    name: 'נוף לכרמים',
    description: 'וילה מרהיבה ביישוב דולב, צופה לכרמים ולשקיעה.',
    address: 'הגפן 100',
    main_image: 'https://images.unsplash.com/photo-1600596542815-2250c385528c?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 4,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבח שף כשר', 'אי עבודה', 'מדיח כלים כפול'],
    dining_area: true,
    table_count: 3,
    chair_count: 18,
    rooms: 5,
    room_description: '5 חדרי שינה (יחידת הורים ענקית)',
    ac: true,
    bathrooms: ['אמבטיה+שירותים', 'מקלחת+שירותים', 'שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['ציוד מלא ומפואר'],
    yard: true,
    pool: true,
    jacuzzi: true,
    sport_facilities: true,
    kids_games: true,
    availability: ['שבתות', 'חגים', 'קיץ'],
    map_location: { lat: 31.9335, lng: 35.0835 },
    payment_terms: 'גמיש',
    payment_methods: ['העברה', 'אשראי', 'מזומן'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '050-8888888',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u10',
    yishuv_id: 'y3',
    name: 'צימר המעיין',
    description: 'יחידה זוגית קסומה ליד מעיין דולב, אווירה של טבע ושקט.',
    address: 'הגפן 100',
    main_image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 0,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבחון מאובזר'],
    dining_area: true,
    table_count: 1,
    chair_count: 4,
    rooms: 1,
    room_description: 'חדר שינה + סלון קטן',
    ac: true,
    bathrooms: ['גקוזי+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: false,
    shabbat_equipment: ['פלטה', 'מיחם'],
    yard: true,
    pool: false,
    jacuzzi: true,
    sport_facilities: false,
    kids_games: false,
    availability: ['סופ"ש', 'אמצ"ש'],
    map_location: { lat: 31.9340, lng: 35.0840 },
    payment_terms: 'מקדמה באשראי',
    payment_methods: ['אשראי'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '052-7777777',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u11',
    yishuv_id: 'y3',
    name: 'בית האירוח המרכזי',
    description: 'בית גדול ופשוט למשפחות ברוכות ילדים, במרכז היישוב.',
    address: 'המרכז 5',
    main_image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 8,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבח כשר ופעיל'],
    dining_area: true,
    table_count: 4,
    chair_count: 20,
    rooms: 4,
    room_description: '4 חדרי שינה פונקציונליים',
    ac: true,
    bathrooms: ['מקלחת+שירותים', 'שירותים'],
    wifi: false,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['ציוד רב לשבת'],
    yard: true,
    pool: false,
    jacuzzi: false,
    sport_facilities: true,
    kids_games: true,
    availability: ['שבתות'],
    map_location: { lat: 31.9330, lng: 35.0830 },
    payment_terms: 'נוח',
    payment_methods: ['מזומן', 'צק'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '054-6666666',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u12',
    yishuv_id: 'y3',
    name: 'יחידת הגן',
    description: 'יחידת קרקע נעימה עם יציאה לגינה גדולה וטרמפולינה.',
    address: 'הזית 22',
    main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    living_room: true,
    extra_mattresses: 3,
    bookshelf_kodesh: true,
    kitchen: true,
    kitchen_details: ['מטבחון + כיריים'],
    dining_area: true,
    table_count: 1,
    chair_count: 6,
    rooms: 2,
    room_description: 'חדר הורים + סלון מרווח',
    ac: true,
    bathrooms: ['מקלחת+שירותים'],
    wifi: true,
    tv: false,
    baby_crib: true,
    shabbat_equipment: ['פלטה', 'מיחם'],
    yard: true,
    pool: false,
    jacuzzi: false,
    sport_facilities: false,
    kids_games: true,
    availability: ['כל השנה'],
    map_location: { lat: 31.9325, lng: 35.0825 },
    payment_terms: 'מזומן',
    payment_methods: ['מזומן', 'ביט'],
    whatsapp_link: 'https://wa.me/972500000000',
    phone_number: '053-5555555',
    website_link: '',
    page_views: 0,
    total_clicks: 0,
    clicks_whatsapp: 0,
    clicks_phone: 0,
    clicks_website: 0,
    created_at: new Date().toISOString(),
  }
];

const seedAffiliates: Affiliate[] = [
    {
        id: 'aff1',
        name: 'משה כהן',
        code: 'moshe',
        phone: '050-1234567',
        total_views: 0,
        total_leads: 0,
        created_at: new Date().toISOString()
    }
];

// --- Helper Functions ---

const load = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const save = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize DB if empty OR if missing new seeded content (Migration Logic)
export const initDb = () => {
  // Always load seeds to get fresh images
  const freshYishuvim = seedYishuvim;
  const freshUnits = seedUnits;

  // Load current
  let currentYishuvim = load<Yishuv>(KEYS.YISHUVS);
  let currentUnits = load<Unit>(KEYS.UNITS);
  let currentAffiliates = load<Affiliate>(KEYS.AFFILIATES);

  if (currentYishuvim.length === 0) {
     save(KEYS.YISHUVS, freshYishuvim);
  } else {
     // FORCE UPDATE IMAGES FOR SEEDED DATA
     const updatedYishuvim = currentYishuvim.map(curr => {
        const seed = freshYishuvim.find(s => s.id === curr.id);
        if (seed) {
           return { ...curr, main_image: seed.main_image, gallery: seed.gallery };
        }
        return curr;
     });
     // Dolev check
     const hasDolev = updatedYishuvim.some(y => y.id === 'y3');
     if (!hasDolev) {
        updatedYishuvim.push(freshYishuvim.find(s => s.id === 'y3')!);
     }
     save(KEYS.YISHUVS, updatedYishuvim);
  }

  // Units
  if (currentUnits.length === 0) {
     save(KEYS.UNITS, freshUnits);
  } else {
      const updatedUnits = currentUnits.map(curr => {
        const seed = freshUnits.find(s => s.id === curr.id);
        if (seed) {
           return { ...curr, main_image: seed.main_image, gallery: seed.gallery };
        }
        return curr;
      });
      freshUnits.forEach(seed => {
          if (!updatedUnits.find(u => u.id === seed.id)) {
              updatedUnits.push(seed);
          }
      });
      save(KEYS.UNITS, updatedUnits);
  }

  // Affiliates
  if (currentAffiliates.length === 0) {
      save(KEYS.AFFILIATES, seedAffiliates);
  }
};

// --- CRUD Operations ---

export const getYishuvim = (): Yishuv[] => load(KEYS.YISHUVS);
export const getUnits = (): Unit[] => load(KEYS.UNITS);
export const getLeads = (): Lead[] => load(KEYS.LEADS);
export const getInvoices = (): InvoiceSummary[] => load(KEYS.INVOICES);
export const getAffiliates = (): Affiliate[] => load(KEYS.AFFILIATES);

export const getYishuvBySlug = (slug: string): Yishuv | undefined => {
  return getYishuvim().find(y => y.slug === slug);
};

export const getUnitById = (id: string): Unit | undefined => {
  return getUnits().find(u => u.id === id);
};

export const createYishuv = (yishuv: Yishuv) => {
  const list = getYishuvim();
  list.push(yishuv);
  save(KEYS.YISHUVS, list);
};

export const updateYishuv = (updatedYishuv: Yishuv) => {
  const list = getYishuvim().map(y => y.id === updatedYishuv.id ? updatedYishuv : y);
  save(KEYS.YISHUVS, list);
};

export const createUnit = (unit: Unit) => {
  const units = getUnits();
  units.push(unit);
  save(KEYS.UNITS, units);
};

export const updateUnit = (updatedUnit: Unit) => {
  const units = getUnits().map(u => u.id === updatedUnit.id ? updatedUnit : u);
  save(KEYS.UNITS, units);
};

export const getAffiliateByCode = (code: string): Affiliate | undefined => {
    return getAffiliates().find(a => a.code.toLowerCase() === code.toLowerCase());
};

export const createAffiliate = (aff: Affiliate) => {
    const list = getAffiliates();
    list.push(aff);
    save(KEYS.AFFILIATES, list);
};

export const recordAffiliateView = (affiliateId: string) => {
    const list = getAffiliates();
    const aff = list.find(a => a.id === affiliateId);
    if (aff) {
        aff.total_views = (aff.total_views || 0) + 1;
        save(KEYS.AFFILIATES, list);
    }
};

export const incrementUnitView = (unitId: string) => {
    const units = getUnits();
    const unit = units.find(u => u.id === unitId);
    if (unit) {
        unit.page_views = (unit.page_views || 0) + 1;
        save(KEYS.UNITS, units);
    }
}

// Updated to accept optional affiliateId
export const recordLead = (unitId: string, type: LeadType, affiliateId?: string) => {
  const leads = getLeads();
  const newLead: Lead = {
    id: `l${Date.now()}`,
    unit_id: unitId,
    affiliate_id: affiliateId,
    type,
    timestamp: new Date().toISOString(),
    ip_address: '127.0.0.1', // Mock IP
    device: window.innerWidth < 768 ? 'mobile' : 'desktop',
    cost: LEAD_COST
  };
  leads.push(newLead);
  save(KEYS.LEADS, leads);

  // Update Unit Counters
  const units = getUnits();
  const unitIndex = units.findIndex(u => u.id === unitId);
  if (unitIndex > -1) {
    const unit = units[unitIndex];
    // Robustly handle undefined fields with || 0
    unit.total_clicks = (unit.total_clicks || 0) + 1;
    if (type === 'WhatsApp') unit.clicks_whatsapp = (unit.clicks_whatsapp || 0) + 1;
    if (type === 'Phone') unit.clicks_phone = (unit.clicks_phone || 0) + 1;
    if (type === 'Website') unit.clicks_website = (unit.clicks_website || 0) + 1;
    save(KEYS.UNITS, units);
  }

  // Update Affiliate Lead Counter if applicable
  if (affiliateId) {
      const affiliates = getAffiliates();
      const aff = affiliates.find(a => a.id === affiliateId);
      if (aff) {
          aff.total_leads = (aff.total_leads || 0) + 1;
          save(KEYS.AFFILIATES, affiliates);
      }
  }
};

export const saveCreditCard = (unitId: string, cardData: Omit<StoredCard, 'token' | 'last4' | 'brand'> & { cardNumber: string }) => {
    const units = getUnits();
    const unit = units.find(u => u.id === unitId);
    if (unit) {
        // In a real app, this "token" comes from the payment provider (Cardcom, etc.)
        // We NEVER store the full card number.
        const token = `tok_${Math.random().toString(36).substr(2, 9)}`;
        const last4 = cardData.cardNumber.slice(-4);
        
        // Simple mock brand detection
        const brand = cardData.cardNumber.startsWith('4') ? 'visa' : 
                      cardData.cardNumber.startsWith('5') ? 'mastercard' : 'isracard';

        unit.credit_card = {
            token,
            last4,
            brand: brand as any,
            exp_month: cardData.exp_month,
            exp_year: cardData.exp_year,
            holder_name: cardData.holder_name
        };
        save(KEYS.UNITS, units);
    }
}

export const resetStats = () => {
    const units = getUnits().map(u => ({
        ...u,
        page_views: 0,
        total_clicks: 0,
        clicks_whatsapp: 0,
        clicks_phone: 0,
        clicks_website: 0
    }));
    save(KEYS.UNITS, units);
    save(KEYS.LEADS, []);
    
    // Reset Affiliate stats too
    const affiliates = getAffiliates().map(a => ({
        ...a,
        total_views: 0,
        total_leads: 0
    }));
    save(KEYS.AFFILIATES, affiliates);
};

export const generateInvoiceSummary = (unitId: string, month: string): InvoiceSummary => {
  const leads = getLeads().filter(l => l.unit_id === unitId && l.timestamp.startsWith(month));
  const count = leads.length;
  const cost = count * LEAD_COST;
  
  const existingInvoices = getInvoices();
  // Check if invoice already exists
  const existing = existingInvoices.find(i => i.unit_id === unitId && i.month === month);
  
  if (existing) return existing;

  const newInvoice: InvoiceSummary = {
    id: `inv${Date.now()}`,
    unit_id: unitId,
    month,
    leads_count: count,
    total_cost: cost,
    status: 'Pending',
  };
  
  existingInvoices.push(newInvoice);
  save(KEYS.INVOICES, existingInvoices);
  return newInvoice;
};

export const updateInvoice = (invoice: InvoiceSummary) => {
    const invoices = getInvoices();
    const index = invoices.findIndex(i => i.id === invoice.id);
    if(index > -1) {
        invoices[index] = invoice;
        save(KEYS.INVOICES, invoices);
    }
}