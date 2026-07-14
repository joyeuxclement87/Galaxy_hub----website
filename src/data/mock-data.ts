export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  image: string;
  featured: boolean;
  specifications: Record<string, string>;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
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
    title: "iPhone 15 Pro Max",
    tagline: "Titanium masterpiece",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    price: 1450000,
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
    title: "Sony WH-1000XM5",
    tagline: "Your world. Nothing else.",
    description: "With two processors controlling eight microphones, Auto NC Optimizer for automatically optimizing noise canceling, and a specially designed driver unit.",
    price: 420000,
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
    title: "DJI Mini 4 Pro",
    tagline: "Mini to the Max",
    description: "Our most advanced mini camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, and ActiveTrack 360°.",
    price: 950000,
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
    author: "Karemera Alain",
    role: "Tech Consultant",
    rating: 5,
    content: "The showroom reservation system was absolutely seamless. I walked into the boutique, my reserved iPhone 15 Pro Max was ready, unboxed, and configured in minutes. Outstanding premium service.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "2",
    author: "Umutoni Sandrine",
    role: "Creative Director",
    rating: 5,
    content: "Finding genuine high-end electronics in Kigali can be challenging. Galaxy Hub has built true customer trust. Their curated collection is top-tier and verification is immediate.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
];
