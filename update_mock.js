const fs = require('fs');

let content = fs.readFileSync('src/data/mock-data.ts', 'utf-8');

content = content.replace(
  `export interface Product {
  id: string;
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
}`,
  `export interface Product {
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
}`
);

const generateRandomRating = () => (Math.random() * (5 - 4.5) + 4.5).toFixed(1);
const generateRandomReviews = () => Math.floor(Math.random() * 200) + 10;
const badges = ["NEW", "BEST SELLER", "SALE", "LIMITED STOCK", undefined, undefined, undefined];

content = content.replace(/export const PRODUCTS: Product\[\] = \[([\s\S]*?)\];/g, (match, p1) => {
  let index = 0;
  let modifiedP1 = p1.replace(/id: "(.*?)",/g, (m, idValue) => {
    const slug = idValue;
    const badge = badges[index % badges.length];
    const badgeStr = badge ? `\n    badge: "${badge}",` : "";
    const rating = generateRandomRating();
    const reviewCount = generateRandomReviews();
    const monthlyInstallment = 60000;
    const specsSummary = "Premium Tech";
    index++;
    return 'id: "' + idValue + '",\n' +
    '    slug: "' + slug + '",' + badgeStr + '\n' +
    '    rating: ' + rating + ',\n' +
    '    reviewCount: ' + reviewCount + ',\n' +
    '    monthlyInstallment: ' + monthlyInstallment + ',\n' +
    '    specsSummary: "' + specsSummary + '",';
  });
  return 'export const PRODUCTS: Product[] = [' + modifiedP1 + '];';
});

fs.writeFileSync('src/data/mock-data.ts', content);
