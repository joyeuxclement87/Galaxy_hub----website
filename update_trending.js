const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

const newSection = `      {/* ── Trending Products ─────────────────────────────────────────── */}
      <section id="products" className="mx-auto max-w-[1320px] space-y-10 px-6 py-24 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-accent font-manrope">
              TRENDING NOW
            </span>
            <h2 className="font-clash text-3xl font-bold leading-tight text-[#10233D] sm:text-4xl">
              Popular Tech Picks
            </h2>
            <p className="text-sm leading-relaxed text-[#10233D]/65 font-manrope">
              Discover the devices and accessories customers are choosing most from Galaxy Hub.
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

        {/* Navigation & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ocean/5 pb-4">
          <div 
            className="flex items-center gap-2 overflow-x-auto flex-nowrap whitespace-nowrap no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {["All", "Smartphones", "Laptops", "Audio", "Accessories", "Creator Gear", "Deals"].map((tab) => {
              const isActive = tab === "All" ? (selectedCategory === "All" && !showDealsOnly) : 
                               tab === "Deals" ? showDealsOnly : 
                               (selectedCategory === tab && !showDealsOnly);
                               
              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === "All") {
                      setSelectedCategory("All");
                      setShowDealsOnly(false);
                    } else if (tab === "Deals") {
                      setShowDealsOnly(true);
                    } else {
                      setSelectedCategory(tab);
                      setShowDealsOnly(false);
                    }
                  }}
                  className={\`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 font-manrope cursor-pointer \${
                    isActive
                      ? "bg-ocean text-white shadow-md shadow-ocean/20"
                      : "bg-transparent text-ocean/50 hover:text-ocean hover:bg-ocean/5"
                  }\`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ocean/50 font-medium font-manrope">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-bold text-[#10233D] focus:ring-0 outline-none cursor-pointer p-0 pr-4 font-manrope">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-[32px] border border-dashed border-black/5 bg-white/30 py-24 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-ocean/20" />
            <h3 className="font-clash text-lg font-bold text-[#10233D]">
              No products found
            </h3>
            <p className="mx-auto max-w-md text-sm text-ocean/60 font-manrope">
              We couldn't find matches for your current filters. Try selecting a different category.
            </p>
          </div>
        )}
      </section>`;

// Replace from '<section id="products"' to the next '</section>'
const startIndex = content.indexOf('<section id="products"');
if (startIndex !== -1) {
  const nextSectionEnd = content.indexOf('</section>', startIndex);
  if (nextSectionEnd !== -1) {
    const afterSection = content.substring(nextSectionEnd + '</section>'.length);
    const beforeSection = content.substring(0, startIndex);
    content = beforeSection + newSection + afterSection;
  }
}

fs.writeFileSync('src/app/page.tsx', content);
