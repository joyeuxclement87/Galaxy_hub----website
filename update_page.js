const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Update import
content = content.replace(
  'import { PRODUCTS, REVIEWS, Product, HERO_CMS_CONTENT, HERO_SPOTLIGHT_SLIDES, TRENDING_KEYWORDS, QUICK_FILTERS, POPULAR_SEARCH_CARDS, DEALS_QUICK_FILTERS, DEAL_OFFERS } from "@/data/mock-data";',
  'import { PRODUCTS, REVIEWS, Product, HERO_CMS_CONTENT, HERO_SPOTLIGHT_SLIDES, TRENDING_KEYWORDS, QUICK_FILTERS, POPULAR_SEARCH_CARDS, DEALS_QUICK_FILTERS, DEAL_OFFERS, CATEGORIES } from "@/data/mock-data";'
);

// 2. Remove local CATEGORIES
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('// NOTE: In production this data'));
const endIdx = lines.findIndex(l => l.includes('] as const;'));
if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1);
}
content = lines.join('\n');

// 3. Replace section
const newSection = `      {/* ── Shop by Category ─────────────────────────────────────────── */}
      <section id="categories" className="bg-[#FFFEF9] px-6 py-24 md:px-12 border-t border-ocean/5 relative z-20">
        <div className="mx-auto max-w-[1320px] space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
                SHOP BY CATEGORY
              </span>
              <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl lg:text-[44px]">
                Everything Tech.<br />One Place.
              </h2>
              <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
                Explore smartphones, accessories, creator equipment, and smart devices available in Kigali and delivered across Rwanda.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-ocean transition-colors duration-200 hover:text-ocean-dark group font-manrope shrink-0"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Categories Horizontal Scroll Mobile / Grid Desktop */}
          <div 
            className="flex gap-4 overflow-x-auto pb-6 flex-nowrap no-scrollbar md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={\`/products/\${category.slug}\`}
                className={\`group relative overflow-hidden rounded-[32px] bg-[#10233D] shrink-0 w-[280px] h-[360px] md:w-auto \${
                  category.featured ? "md:col-span-2" : "md:col-span-1"
                }\`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300 group-hover:bg-black/30" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end h-full transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="space-y-1">
                    <h3 className="font-clash text-2xl font-bold text-white tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/80 font-manrope">
                      {category.productCount}+ Products
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-white uppercase tracking-wider font-manrope opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>`;

const sections = content.split('<section id="categories"');
if (sections.length > 1) {
  const afterSection = sections[1].substring(sections[1].indexOf('</section>') + '</section>'.length);
  content = sections[0] + newSection + afterSection;
}

fs.writeFileSync('src/app/page.tsx', content);
