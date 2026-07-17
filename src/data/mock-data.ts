export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  brand: string;
  image: string;
  featured: boolean;
  specifications: Record<string, string>;
  priceOnRequest?: boolean;
  availability?: "In Stock" | "Limited Stock" | "Out of Stock";
  badge?: string;
  rating?: number;
  reviewCount?: number;
  monthlyInstallment?: number;
  specsSummary?: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
  location?: string;
  purchasedProduct?: string;
  verified?: boolean;
  category?: string;
  featured?: boolean;
}

export interface Brand {
  name: string;
  logo: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryAction: string;
  secondaryAction: string;
  productId: string;
}

export const BRANDS: Brand[] = [
  { name: "Apple", logo: "" },
  { name: "Samsung", logo: "SAMSUNG" },
  { name: "Sony", logo: "SONY" },
  { name: "Google", logo: "Google" },
  { name: "DJI", logo: "DJI" },
];

export const PRODUCTS: Product[] = [
  {
    id: "iphone-15-pro",
    slug: "iphone-15-pro",
    badge: "NEW",
    rating: 4.8,
    reviewCount: 159,
    monthlyInstallment: 60000,
    specsSummary: "Premium Tech",
    title: "iPhone 15 Pro Max",
    tagline: "Titanium masterpiece",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    price: 1450000,
    originalPrice: 1600000,
    currency: "RWF",
    category: "Smartphones",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600",
    featured: true,
    specifications: {
      Processor: "A17 Pro chip with 6-core GPU",
      Camera: "48MP Main | Ultra Wide | Telephoto",
      Material: "Aerospace-grade titanium design",
      Battery: "Up to 29 hours video playback",
    },
  },
  {
    id: "s24-ultra",
    slug: "s24-ultra",
    badge: "BEST SELLER",
    rating: 4.9,
    reviewCount: 100,
    monthlyInstallment: 60000,
    specsSummary: "Premium Tech",
    title: "Galaxy S24 Ultra",
    tagline: "Galaxy AI is here",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    price: 1550000,
    currency: "RWF",
    category: "Smartphones",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1708649290066-5f617003b930?auto=format&fit=crop&q=80&w=600",
    featured: true,
    specifications: {
      Processor: "Snapdragon 8 Gen 3 for Galaxy",
      Camera: "200MP Main | Quad Telephoto",
      Display: "Dynamic AMOLED 2X with Corning Gorilla Armor",
      Stylus: "Built-in S Pen",
    },
  },
  {
    id: "sony-wh1000xm5",
    slug: "sony-wh1000xm5",
    badge: "SALE",
    rating: 4.7,
    reviewCount: 180,
    monthlyInstallment: 60000,
    specsSummary: "Premium Tech",
    title: "Sony WH-1000XM5",
    tagline: "Your world. Nothing else.",
    description: "With two processors controlling eight microphones, Auto NC Optimizer for automatically optimizing noise canceling, and a specially designed driver unit.",
    price: 420000,
    originalPrice: 490000,
    currency: "RWF",
    category: "Audio",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600",
    featured: true,
    specifications: {
      Sound: "Hi-Res Audio Wireless",
      Battery: "Up to 30-hour battery life with quick charging",
      "Noise Cancelling": "Industry-leading Dual Processor",
      Comfort: "Ultra-comfortable, lightweight design",
    },
  },
  {
    id: "pixel-8-pro",
    slug: "pixel-8-pro",
    badge: "LIMITED STOCK",
    rating: 5.0,
    reviewCount: 199,
    monthlyInstallment: 60000,
    specsSummary: "Premium Tech",
    title: "Google Pixel 8 Pro",
    tagline: "The all-pro phone engineered by Google",
    description: "It has the best of Google AI, the most advanced Pixel Camera ever, and can help you get more done, even faster. Plus custom security features.",
    price: 1100000,
    currency: "RWF",
    category: "Smartphones",
    brand: "Google",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600",
    featured: false,
    specifications: {
      Processor: "Google Tensor G3 with Titan M2",
      Camera: "50MP Main | 48MP Ultrawide | 48MP Telephoto",
      Display: "Super Actua display up to 2400 nits",
      Security: "VPN by Google One built-in",
    },
  },
  {
    id: "dji-mini-4-pro",
    slug: "dji-mini-4-pro",
    rating: 4.5,
    reviewCount: 189,
    monthlyInstallment: 60000,
    specsSummary: "Premium Tech",
    title: "DJI Mini 4 Pro",
    tagline: "Mini to the Max",
    description: "Our most advanced mini camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, and ActiveTrack 360°.",
    price: 950000,
    originalPrice: 1080000,
    currency: "RWF",
    category: "Drones",
    brand: "DJI",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600",
    featured: true,
    specifications: {
      Weight: "Under 249 g",
      Resolution: "4K/60fps HDR True Vertical Shooting",
      Sensing: "Omnidirectional Obstacle Sensing",
      Transmission: "20km FHD Video Transmission",
    },
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Titanium. Strong. Light. Pro.",
    subtitle: "NEW IN STOCK",
    description: "Explore the new iPhone 15 Pro Max. Re-engineered with aerospace-grade titanium and powered by the ultra-fast A17 Pro Chip.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1200",
    primaryAction: "Reserve Now",
    secondaryAction: "Explore Features",
    productId: "iphone-15-pro",
  },
  {
    id: "slide-2",
    title: "Intelligence Redefined.",
    subtitle: "FLAGSHIP DISPLAY",
    description: "Unleash the full potential of Galaxy AI with the new Galaxy S24 Ultra. Edit, translate, and capture like a professional.",
    image: "https://images.unsplash.com/photo-1708649290066-5f617003b930?auto=format&fit=crop&q=80&w=1200",
    primaryAction: "Reserve Now",
    secondaryAction: "Learn More",
    productId: "s24-ultra",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Jean K.",
    role: "Tech Consultant",
    rating: 5,
    content: "Received my iPhone quickly. The device was genuine and the support was excellent from the first question to the final delivery.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    location: "Kigali",
    purchasedProduct: "iPhone 16 Pro",
    verified: true,
    category: "Product Quality",
    featured: true,
  },
  {
    id: "2",
    author: "Aline M.",
    role: "Creative Director",
    rating: 5,
    content: "Delivery across Rwanda was fast and the team helped me choose the right accessories without pressure. Very reassuring experience.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    location: "Rubavu",
    purchasedProduct: "AirPods Pro",
    verified: true,
    category: "Delivery",
  },
  {
    id: "3",
    author: "Eric N.",
    role: "Startup Founder",
    rating: 5,
    content: "The team gave thoughtful advice before I ordered, and the after-sales support made me trust them even more.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    location: "Muhanga",
    purchasedProduct: "Galaxy S24",
    verified: true,
    category: "Customer Support",
  },
  {
    id: "4",
    author: "Mireille D.",
    role: "Product Designer",
    rating: 5,
    content: "I loved how the team followed up after purchase. It felt like I had a reliable tech partner, not just a shop.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    location: "Kicukiro",
    purchasedProduct: "Sony Headphones",
    verified: true,
    category: "After Sales",
  },
];

// ─── CMS Configurable Interfaces ─────────────────────────────────────────────
export interface CMSHeroContent {
  badge: string;
  headline: string;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  trustRow: string[];
  searchPlaceholder: string;
  popularSearches: string[];
  statistics: { value: string; label: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  orderPriority: number;
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-smartphones",
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest flagship devices and smartphones from top brands.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    productCount: 124,
    featured: true,
    orderPriority: 1,
    seoTitle: "Buy Smartphones in Rwanda | Galaxy Hub",
    seoDescription: "Shop the latest iPhones, Samsung Galaxy, Google Pixel, Tecno, Infinix, and Xiaomi smartphones in Kigali with nationwide delivery.",
  },
  {
    id: "cat-laptops",
    name: "Laptops & Computers",
    slug: "laptops",
    description: "MacBooks, Windows laptops, and modern workspace essentials.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    productCount: 86,
    featured: false,
    orderPriority: 2,
    seoTitle: "Laptops & MacBooks in Rwanda | Galaxy Hub",
    seoDescription: "Find premium MacBooks, Windows laptops, tablets, and computer accessories for work, gaming, or school.",
  },
  {
    id: "cat-accessories",
    name: "Phone Accessories",
    slug: "accessories",
    description: "Cases, chargers, power banks, and essential phone gear.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
    productCount: 342,
    featured: false,
    orderPriority: 3,
    seoTitle: "Phone Accessories & Cases | Galaxy Hub",
    seoDescription: "Protect and power your devices with premium phone cases, screen protectors, chargers, cables, and power banks.",
  },
  {
    id: "cat-creator",
    name: "Creator Gear",
    slug: "creator-gear",
    description: "Ring lights, tripods, microphones, and studio setups.",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800",
    productCount: 45,
    featured: false,
    orderPriority: 4,
    seoTitle: "Content Creator Equipment | Galaxy Hub",
    seoDescription: "Level up your content with professional ring lights, tripods, phone holders, and microphones.",
  },
  {
    id: "cat-audio",
    name: "Audio",
    slug: "audio",
    description: "Premium earbuds, headphones, and wireless speakers.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
    productCount: 78,
    featured: false,
    orderPriority: 5,
    seoTitle: "Premium Audio & Headphones | Galaxy Hub",
    seoDescription: "Experience crisp acoustic output with our collection of premium earbuds, headsets, and portable speakers.",
  },
  {
    id: "cat-smart-devices",
    name: "Smart Devices",
    slug: "smart-devices",
    description: "Smart watches, fitness bands, and connected accessories.",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800",
    productCount: 52,
    featured: false,
    orderPriority: 6,
    seoTitle: "Smart Watches & Devices | Galaxy Hub",
    seoDescription: "Stay connected and track your fitness with our smart watches, bands, and smart home accessories.",
  }
];

export const CATEGORY_FILTERS: Record<string, { name: string, options: string[] }[]> = {
  "smartphones": [
    { name: "Brand", options: ["Apple", "Samsung", "Google", "Tecno", "Infinix", "Xiaomi"] },
    { name: "Price", options: ["Under 500k", "500k - 1M", "Over 1M"] },
    { name: "Storage", options: ["128GB", "256GB", "512GB", "1TB"] },
    { name: "RAM", options: ["4GB", "8GB", "12GB", "16GB"] },
    { name: "Condition", options: ["New", "Pre-owned"] },
    { name: "Availability", options: ["In Stock", "Pre-order"] },
  ],
  "accessories": [
    { name: "Type", options: ["Cases", "Screen Protectors", "Chargers", "Cables", "Power Banks"] },
    { name: "Brand", options: ["Apple", "Samsung", "Anker", "Spigen", "Baseus"] },
    { name: "Compatibility", options: ["iPhone 15", "iPhone 14", "Galaxy S24", "Galaxy S23"] },
    { name: "Color", options: ["Black", "White", "Clear", "Blue"] },
  ],
  "laptops": [
    { name: "Brand", options: ["Apple", "HP", "Dell", "Lenovo", "Asus"] },
    { name: "Processor", options: ["M3", "M2", "Intel Core i9", "Intel Core i7"] },
    { name: "RAM", options: ["8GB", "16GB", "32GB"] },
    { name: "Storage", options: ["256GB", "512GB", "1TB"] },
  ],
  "creator-gear": [
    { name: "Type", options: ["Ring Lights", "Tripods", "Microphones", "Gimbals"] },
    { name: "Brand", options: ["DJI", "Rode", "Godox", "Ulanzi"] },
    { name: "Price", options: ["Under 50k", "50k - 150k", "Over 150k"] },
  ],
  "audio": [
    { name: "Type", options: ["Earbuds", "Headphones", "Speakers"] },
    { name: "Brand", options: ["Apple", "Sony", "JBL", "Bose"] },
    { name: "Features", options: ["Noise Cancelling", "Water Resistant", "Wireless"] },
  ],
  "smart-devices": [
    { name: "Type", options: ["Smart Watches", "Fitness Bands", "Smart Tags"] },
    { name: "Brand", options: ["Apple", "Samsung", "Garmin", "Xiaomi"] },
    { name: "Compatibility", options: ["iOS", "Android", "Universal"] },
  ]
};

export interface SpotlightSlide {
  id: string;
  category: string;
  title: string;
  image: string;
  features: string[];
  bgAccent: string; // inline CSS for the radial gradient background
}

// ─── CMS Hero Content Mock ────────────────────────────────────────────────────
export const HERO_CMS_CONTENT: CMSHeroContent = {
  badge: "Kigali • Rwanda",
  headline: "Discover Genuine Tech,\nBuilt for Everyday Life.",
  description: "Genuine smartphones, accessories, laptops, creator gear, and smart devices from trusted brands — ready to order and collect in-store or delivered nationwide across Rwanda.",
  primaryBtnText: "Explore Products",
  secondaryBtnText: "Order Now",
  trustRow: ["Genuine Products", "Nationwide Delivery", "Warranty Support"],
  searchPlaceholder: "Search for phones, laptops, earbuds...",
  popularSearches: ["iPhone", "Samsung", "AirPods", "Ring Light", "Tripod", "Laptop"],
  statistics: [
    { value: "500+", label: "Products" },
    { value: "10+", label: "Global Brands" },
    { value: "24H", label: "Order Confirmation" },
    { value: "100%", label: "Genuine Products" },
  ],
};

// ─── CMS Carousel Slides Mock ──────────────────────────────────────────────────
export const HERO_SPOTLIGHT_SLIDES: SpotlightSlide[] = [
  {
    id: "smartphones",
    category: "SMARTPHONE",
    title: "iPhone 16 Pro",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=900",
    features: ["256GB", "Super Retina", "Fast Charging", "In Stock"],
    bgAccent: "radial-gradient(circle, rgba(15, 112, 201, 0.12) 0%, transparent 62%)",
  },
  {
    id: "phone-cases",
    category: "PHONE CASES",
    title: "MagSafe Silicone Case",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
    features: ["Shockproof", "Slim Fit", "MagSafe OK", "Multiple Colors"],
    bgAccent: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 62%)",
  },
  {
    id: "laptops",
    category: "LAPTOPS",
    title: "MacBook Air M3",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=900",
    features: ["16GB RAM", "512GB SSD", "Liquid Retina", "All-Day Battery"],
    bgAccent: "radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 62%)",
  },
  {
    id: "ring-lights",
    category: "RING LIGHTS",
    title: "18\" Studio Ring Light",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=900",
    features: ["Adjustable Brightness", "USB Powered", "Content Creator", "Available Now"],
    bgAccent: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 62%)",
  },
  {
    id: "camera-tripods",
    category: "CAMERA TRIPODS",
    title: "Carbon Fiber Tripod",
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=900",
    features: ["360° Ball Head", "Carbon Fiber", "Lightweight", "Max Height 1.7m"],
    bgAccent: "radial-gradient(circle, rgba(107, 114, 128, 0.08) 0%, transparent 62%)",
  },
  {
    id: "bluetooth-speakers",
    category: "BLUETOOTH SPEAKERS",
    title: "JBL Flip 6",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=900",
    features: ["IP67 Waterproof", "12H Playtime", "PartyBoost", "Deep Bass"],
    bgAccent: "radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 62%)",
  },
  {
    id: "earbuds",
    category: "EARBUDS",
    title: "AirPods Pro 2",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900",
    features: ["Active ANC", "H2 Chip", "Adaptive Audio", "USB-C Case"],
    bgAccent: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 62%)",
  },
  {
    id: "headphones",
    category: "HEADPHONES",
    title: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=900",
    features: ["Industry-Leading ANC", "30H Battery", "Hi-Res Audio", "Speak-to-Chat"],
    bgAccent: "radial-gradient(circle, rgba(15, 112, 201, 0.10) 0%, transparent 62%)",
  },
];

export interface PopularSearchCard {
  keyword: string;
  count: number;
  image: string;
  category: string; // for dynamic filtering
}

export const TRENDING_KEYWORDS = [
  "iPhone 16 Pro",
  "Samsung S25 Ultra",
  "AirPods Pro",
  "MacBook Air",
  "Ring Light",
  "JBL Speaker",
  "Power Bank",
];

export const QUICK_FILTERS = [
  "All",
  "Phones",
  "Accessories",
  "Audio",
  "Computers",
  "Creator Gear",
  "Gaming",
  "Smart Home",
];

export const POPULAR_SEARCH_CARDS: PopularSearchCard[] = [
  {
    keyword: "iPhone",
    count: 24,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300",
    category: "Phones",
  },
  {
    keyword: "Samsung Galaxy",
    count: 18,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300",
    category: "Phones",
  },
  {
    keyword: "MacBook",
    count: 12,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=300",
    category: "Computers",
  },
  {
    keyword: "AirPods",
    count: 8,
    image: "https://images.unsplash.com/photo-1588449668338-d1347b11a4e1?auto=format&fit=crop&q=80&w=300",
    category: "Audio",
  },
  {
    keyword: "JBL Speakers",
    count: 15,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=300",
    category: "Audio",
  },
  {
    keyword: "Phone Cases",
    count: 42,
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=300",
    category: "Accessories",
  },
  {
    keyword: "Ring Lights",
    count: 9,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=300",
    category: "Creator Gear",
  },
  {
    keyword: "Camera Tripods",
    count: 7,
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=300",
    category: "Creator Gear",
  },
  {
    keyword: "Power Banks",
    count: 14,
    image: "https://images.unsplash.com/photo-1609592424085-f5b2257d7620?auto=format&fit=crop&q=80&w=300",
    category: "Accessories",
  },
  {
    keyword: "Smart Watches",
    count: 11,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=300",
    category: "Accessories",
  },
  {
    keyword: "Gaming Accessories",
    count: 19,
    image: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&q=80&w=300",
    category: "Gaming",
  },
  {
    keyword: "Bluetooth Earbuds",
    count: 16,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300",
    category: "Audio",
  },
];

export interface DealOffer {
  slug: string;
  title: string;
  description: string;
  badge: string;
  badgeType: "accent" | "red"; // styling for tag
  discountText: string;
  ctaText: string;
  image: string;
  size: "large" | "medium" | "small";
  category: string; // for filtering
}

export const DEALS_QUICK_FILTERS = [
  "All Deals",
  "Phones",
  "Accessories",
  "Bundles",
  "Students",
  "Creators",
  "Audio",
  "Gaming",
];

export const DEAL_OFFERS: DealOffer[] = [
  {
    slug: "iphone-sale",
    title: "iPhone Collection",
    description: "Upgrade to the latest iPhones and get selected accessories at up to 20% off.",
    badge: "SAVE UP TO 20%",
    badgeType: "red",
    discountText: "Save 20%",
    ctaText: "Shop Collection",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600",
    size: "large",
    category: "Phones",
  },
  {
    slug: "magsafe-bundle",
    title: "Galaxy Cases",
    description: "Protect your devices. Buy 2 case accessories, get 1 completely free.",
    badge: "LIMITED OFFER",
    badgeType: "accent",
    discountText: "Buy 2 Get 1 Free",
    ctaText: "Explore Cases",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=500",
    size: "medium",
    category: "Accessories",
  },
  {
    slug: "creator-bundle",
    title: "Creator Studio Kit",
    description: "Professional ring light + carbon fiber tripod + premium phone clip bundle package.",
    badge: "BEST SELLER",
    badgeType: "accent",
    discountText: "Bundle Discount",
    ctaText: "View Bundle",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=500",
    size: "medium",
    category: "Creators",
  },
  {
    slug: "student-offers",
    title: "Student Laptop Deals",
    description: "Special academic discounts on sleek notebooks, laptops, and carrying sleeves.",
    badge: "STUDENTS",
    badgeType: "accent",
    discountText: "Save 15%",
    ctaText: "View Laptops",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
    size: "small",
    category: "Students",
  },
  {
    slug: "audio-sale",
    title: "Wireless Audio Sale",
    description: "Crisp acoustic output. Exclusive offers on earbuds, headsets, and portable speakers.",
    badge: "HOT OFFER",
    badgeType: "red",
    discountText: "From 45,000 RWF",
    ctaText: "Discover Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400",
    size: "small",
    category: "Audio",
  },
  {
    slug: "gaming-essentials",
    title: "Gaming Essentials",
    description: "Premium gaming mice, customizable keyboards, and high-fidelity headsets.",
    badge: "NEW ARRIVAL",
    badgeType: "accent",
    discountText: "Up to 10% Off",
    ctaText: "Gear Up",
    image: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&q=80&w=400",
    size: "small",
    category: "Gaming",
  },
];

// ─── Creator Essentials Section Data ───────────────────────────────────────

export interface CreatorCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  count: number;
}

export const CREATOR_CATEGORIES: CreatorCategory[] = [
  {
    id: "ring-lights",
    name: "Ring Lights",
    description: "Professional lighting for videos, photos, and live streams.",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=600",
    slug: "creator-gear",
    count: 18,
  },
  {
    id: "tripods",
    name: "Camera Tripods",
    description: "Stable setups for photography and content creation.",
    image: "https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&q=80&w=600",
    slug: "creator-gear",
    count: 14,
  },
  {
    id: "phone-holders",
    name: "Phone Holders",
    description: "Flexible mounts for filming anywhere, anytime.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600",
    slug: "creator-gear",
    count: 22,
  },
  {
    id: "microphones",
    name: "Microphones",
    description: "Crystal-clear audio for videos, podcasts, and calls.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600",
    slug: "creator-gear",
    count: 11,
  },
  {
    id: "power-banks",
    name: "Power Banks",
    description: "Keep your devices powered through long shooting days.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=600",
    slug: "accessories",
    count: 26,
  },
];

export const CREATOR_BUNDLE = {
  name: "Starter Creator Kit",
  description: "Ring Light + Tripod + Microphone. Everything you need to launch your creative journey.",
  items: ["Ring Light", "Carbon Fiber Tripod", "Lavalier Microphone"],
  startingPrice: 85000,
  currency: "RWF",
  image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800",
};
