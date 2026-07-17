"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/data/mock-data";
import { Heart, Share2, ZoomIn } from "lucide-react";
import { Button } from "./button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductDetails({ product, relatedProducts }: { product: Product; relatedProducts?: Product[] }) {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart, removeFromCart } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const gallery: string[] = (product as any).gallery && (product as any).gallery.length ? (product as any).gallery : [product.image];
  const colors: string[] = (product as any).colors || ["Default"];
  const storages: string[] = (product as any).storages || ["128GB", "256GB", "512GB", "1TB"];

  const [selectedImage, setSelectedImage] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(storages[0]);
  const [quantity, setQuantity] = useState(1);

  function incQty() { setQuantity((q) => Math.min(9, q + 1)); }
  function decQty() { setQuantity((q) => Math.max(1, q - 1)); }

  // Tabs with deep-linking via hash
  const [tab, setTab] = useState<string>("overview");
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    if (hash) setTab(hash);
  }, []);
  function selectTab(t: string) {
    setTab(t);
    if (typeof window !== "undefined") history.replaceState(null, "", `#${t}`);
  }

  // Sticky purchase bar
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll as any);
  }, []);

  // Frequently Bought Together state and undo snackbar
  const [bundleSelected, setBundleSelected] = useState<string[]>([]);
  const [undoVisible, setUndoVisible] = useState(false);
  const undoTimer = useRef<number | null>(null);

  function toggleBundle(id: string) {
    setBundleSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addBundle() {
    const ids = [product.id, ...bundleSelected];
    ids.forEach((id) => addToCart(id));
    setUndoVisible(true);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndoVisible(false), 6000);
  }

  function undoBundle() {
    const ids = [product.id, ...bundleSelected];
    ids.forEach((id) => removeFromCart(id));
    setUndoVisible(false);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
  }

  return (
    <div>
      {/* Sticky purchase bar (mobile bottom + desktop small sticky) */}
      {showSticky && (
        <div className="fixed bottom-4 left-1/2 z-[150] w-[min(980px,calc(100%-48px))] -translate-x-1/2 rounded-2xl bg-ivory/95 border border-black/6 p-3 shadow-lg hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.title} className="h-12 w-12 object-contain rounded-lg" />
            <div>
              <div className="font-semibold text-[#10233D]">{product.title}</div>
              <div className="text-sm text-ocean/70">{product.currency} {new Intl.NumberFormat('en-US').format(product.price)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-ocean text-ivory" onClick={() => { addToCart(product.id); router.push('/order'); }}>Order Now</Button>
            <Button variant="secondary" onClick={() => addToCart(product.id)}>Add to Cart</Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery (left 55%) */}
        <div className="lg:col-span-7">
          <div className="rounded-[28px] bg-white border border-black/5 overflow-hidden">
            <div className="relative bg-[#F8F9FA]">
              <button
                onClick={() => setOpenLightbox(true)}
                className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-md bg-ivory/90 px-3 py-2 text-xs font-semibold text-ocean shadow-sm"
              >
                <ZoomIn className="h-4 w-4" /> View
              </button>
              <div className="aspect-[4/5] flex items-center justify-center p-8">
                <img src={gallery[selectedImage]} alt={product.title} className="max-h-[600px] w-full object-contain transition-transform duration-300 hover:scale-105" />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-black/6">
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {gallery.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn("h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border", selectedImage === i ? "border-ocean" : "border-black/6")}
                  >
                    <img src={src} alt={`thumb-${i}`} className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lightbox */}
          {openLightbox && (
            <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
              <button onClick={() => setOpenLightbox(false)} className="absolute right-6 top-6 text-white">Close</button>
              <div className="max-w-[1100px] w-full">
                <img src={gallery[selectedImage]} alt={product.title} className="w-full h-auto object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Info (right 45%) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ocean/70">{product.category}</span>
            <span className="text-sm font-medium text-[#10233D]">{product.brand}</span>
          </div>

          <h1 className="font-clash text-3xl sm:text-4xl font-bold text-[#10233D]">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-4 w-4 fill-current text-amber-400" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.56L19.335 24 12 19.897 4.665 24l1.636-8.69L.6 9.75l7.732-1.732z"/></svg>
              ))}
            </div>
            <div className="text-sm font-semibold text-[#10233D]">{product.rating || "4.9"}</div>
            <div className="text-sm text-ocean/60">({product.reviewCount || 0} reviews)</div>
          </div>

          <div className="mt-6 pb-6 border-b border-black/6">
            {product.priceOnRequest ? (
              <div className="text-xl font-bold text-ocean">Contact for Price</div>
            ) : (
              <div>
                <div className="flex items-end gap-3">
                  <div className="font-space text-3xl font-bold text-[#10233D]">{product.currency} {new Intl.NumberFormat("en-US").format(product.price)}</div>
                  {product.originalPrice && <div className="text-sm line-through text-ocean/40">{new Intl.NumberFormat("en-US").format(product.originalPrice)}</div>}
                  {product.badge && <div className="ml-auto rounded-full bg-rose-50 text-rose-600 px-3 py-1 text-xs font-bold">{product.badge}</div>}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-ocean/70 mb-2">Storage</div>
                    <div className="flex flex-wrap gap-2">
                      {storages.map((s) => (
                        <button key={s} onClick={() => setSelectedStorage(s)} className={cn("px-3 py-2 rounded-lg border text-sm", selectedStorage === s ? "border-ocean bg-ocean/10" : "border-black/6 bg-white")}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-ocean/70 mb-2">Color</div>
                    <div className="flex items-center gap-2">
                      {colors.map((c: string) => (
                        <button key={c} onClick={() => setSelectedColor(c)} className={cn("h-8 w-8 rounded-full border", selectedColor === c ? "ring-2 ring-ocean" : "border-black/6") } style={{ background: c === 'Default' ? '#fff' : undefined }} aria-label={c} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
                    <button onClick={decQty} className="text-xl leading-none">−</button>
                    <div className="w-8 text-center font-semibold">{quantity}</div>
                    <button onClick={incQty} className="text-xl leading-none">+</button>
                  </div>

                  <button onClick={() => toggleWishlist(product.id)} className={cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 border", isWishlisted ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-white border-black/6 text-ocean") }>
                    <Heart className="h-4 w-4" /> Wishlist
                  </button>

                  <button onClick={() => navigator.share ? navigator.share({ title: product.title, text: product.tagline, url: window.location.href }) : alert('Share this product URL') } className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-black/6">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button className="flex-1 py-4 bg-ocean text-ivory" onClick={() => { addToCart(product.id); router.push('/order'); }}>Order Now</Button>
                  <Button variant="secondary" className="py-4" onClick={() => addToCart(product.id)}>Add to Cart</Button>
                </div>

                <div className="mt-4 text-sm text-ocean/70">
                  <div>🚚 Delivery Across Rwanda</div>
                  <div>📍 Pickup Available in Kigali</div>
                  <div className="mt-2">✓ Genuine Product • Warranty Included</div>
                </div>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {['Super Retina Display','A18 Pro Chip','48MP Camera','Fast Charging'].map((h) => (
              <div key={h} className="rounded-xl border bg-white p-4 text-sm">
                <div className="font-bold text-[#10233D]">{h}</div>
                <div className="text-xs text-ocean/60 mt-1">Premium performance and efficiency.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description, What's included, Specs */}
      <div className="mt-10">
        <div className="border-b border-black/6">
          <nav className="flex gap-6" role="tablist" aria-label="Product sections">
            <button aria-selected={tab === 'overview'} role="tab" onClick={() => selectTab('overview')} className={cn('py-3 font-semibold', tab === 'overview' ? 'text-[#10233D]' : 'text-ocean/70')}>Overview</button>
            <button aria-selected={tab === 'features'} role="tab" onClick={() => selectTab('features')} className={cn('py-3', tab === 'features' ? 'text-[#10233D]' : 'text-ocean/70')}>Features</button>
            <button aria-selected={tab === 'specs'} role="tab" onClick={() => selectTab('specs')} className={cn('py-3', tab === 'specs' ? 'text-[#10233D]' : 'text-ocean/70')}>Specifications</button>
            <button aria-selected={tab === 'included'} role="tab" onClick={() => selectTab('included')} className={cn('py-3', tab === 'included' ? 'text-[#10233D]' : 'text-ocean/70')}>What's Included</button>
          </nav>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8" role="tabpanel">
            {tab === 'overview' && (
              <>
                <h3 className="font-clash text-2xl font-bold text-[#10233D] mb-4">Product Overview</h3>
                <p className="text-ocean/70 leading-relaxed mb-6">{product.description}</p>
              </>
            )}

            {tab === 'features' && (
              <>
                <h3 className="font-clash text-2xl font-bold text-[#10233D] mb-4">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Super Retina Display','A18 Pro Chip','48MP Camera','Fast Charging'].map((f) => (
                    <div key={f} className="rounded-xl border bg-white p-4 text-sm">
                      <div className="font-bold text-[#10233D]">{f}</div>
                      <div className="text-xs text-ocean/60 mt-1">Short explanatory copy.</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'included' && (
              <>
                <h3 className="font-clash text-2xl font-bold text-[#10233D] mb-4">What's Included</h3>
                <ul className="list-disc list-inside text-sm text-ocean/70">
                  <li>Handset</li>
                  <li>USB-C Cable</li>
                  <li>Documentation</li>
                </ul>
              </>
            )}
          </div>

          <div className="lg:col-span-4">
            {tab === 'specs' && (
              <>
                <h4 className="font-clash text-lg font-bold mb-3">Technical Specifications</h4>
                <div className="rounded-xl bg-white border p-4 text-sm">
                  {Object.entries(product.specifications).map(([k,v]) => (
                    <div key={k} className="flex justify-between py-2 border-b last:border-b-0">
                      <div className="text-[#10233D] font-semibold">{k}</div>
                      <div className="text-ocean/70">{v}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Frequently Bought Together */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="font-clash text-2xl font-bold text-[#10233D] mb-4">Frequently Bought Together</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {relatedProducts.slice(0,4).map((rp) => (
              <div key={rp.id} className="min-w-[220px] rounded-lg border bg-white p-3">
                <div className="flex items-center gap-3">
                  <img src={rp.image} alt={rp.title} className="h-16 w-16 object-contain" />
                  <div>
                    <div className="font-semibold text-sm">{rp.title}</div>
                    <div className="text-xs text-ocean/70">{rp.currency} {new Intl.NumberFormat('en-US').format(rp.price)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" onChange={() => toggleBundle(rp.id)} checked={bundleSelected.includes(rp.id)} /> Add</label>
                  <button onClick={() => addToCart(rp.id)} className="text-sm text-ocean/70">Add</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button className="bg-ocean text-ivory" onClick={addBundle}>Add Bundle</Button>
            {undoVisible && (
              <div className="ml-3 inline-flex items-center gap-3 bg-black/5 rounded-full px-3 py-2">
                <div className="text-sm">Bundle added</div>
                <button onClick={undoBundle} className="text-sm text-ocean font-semibold">Undo</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
