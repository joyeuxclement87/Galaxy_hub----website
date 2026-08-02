"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/data/mock-data";
import { Heart, Share2, ZoomIn, X } from "lucide-react";
import { Button } from "./button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductDetails({ product, relatedProducts }: { product: Product; relatedProducts?: Product[] }) {
  const router = useRouter();
  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.includes(product.id);

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
            <Button variant="primary" onClick={() => { addToCart(product.id); router.push('/order'); }}>Order Now</Button>
            <Button variant="secondary" onClick={() => addToCart(product.id)}>Add to Cart</Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery (left 55%) */}
        <div className="lg:col-span-7">
          <div className="rounded-[28px] bg-white border border-black/5 overflow-hidden">
            <div className="relative bg-[#F8F9FA]">
              <Button
                variant="secondary"
                onClick={() => setOpenLightbox(true)}
                className="absolute right-3 top-3 z-20 px-3 py-1.5 text-xs shadow-sm"
              >
                <ZoomIn className="h-3.5 w-3.5" /> View
              </Button>
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
              <Button variant="icon" onClick={() => setOpenLightbox(false)} className="absolute right-6 top-6 h-10 w-10 text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
              <div className="max-w-[1100px] w-full">
                <img src={gallery[selectedImage]} alt={product.title} className="w-full h-auto object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Info (right 45%) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-caption font-bold uppercase tracking-widest text-ocean/70">{product.category}</span>
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
                  {product.badge && (() => {
                    const b = product.badge!.toLowerCase();
                    const label = b.charAt(0).toUpperCase() + b.slice(1);
                    const isDiscount = b.includes("sale") || b.includes("off") || b.includes("discount");
                    const isNew = b === "new" || b === "new arrival";
                    return (
                      <div className={cn(
                        "ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.08em] border",
                        isDiscount ? "bg-orange-50 text-orange-600 border-orange-100/60"
                        : isNew ? "bg-ocean text-white border-ocean"
                        : "bg-white border-black/5 text-ocean-deeper"
                      )}>
                        {isDiscount ? "On discount" : label}
                      </div>
                    );
                  })()}
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
                  <div className="flex items-center gap-2 border border-black/10 rounded-btn px-3 py-1">
                    <button onClick={decQty} className="text-lg leading-none text-ocean/60 hover:text-ocean transition-colors">−</button>
                    <div className="w-8 text-center text-sm font-semibold">{quantity}</div>
                    <button onClick={incQty} className="text-lg leading-none text-ocean/60 hover:text-ocean transition-colors">+</button>
                  </div>

                  <Button variant="secondary" onClick={() => toggleWishlist(product.id)} className={cn("gap-1.5", isWishlisted && "!border-rose-100 !bg-rose-50 !text-rose-600")}>
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-600")} /> Wishlist
                  </Button>

                  <Button variant="secondary" onClick={() => navigator.share ? navigator.share({ title: product.title, text: product.tagline, url: window.location.href }) : alert('Share this product URL') } className="gap-1.5">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Button variant="primary" className="flex-1" onClick={() => { if (!isInCart) addToCart(product.id); router.push('/order'); }}>Order Now</Button>
                  <Button
                    variant="secondary"
                    className={cn("flex-1", isInCart && "!border-emerald-600 !bg-emerald-600 !text-white")}
                    onClick={() => { if (isInCart) { removeFromCart(product.id); } else { addToCart(product.id); } }}
                  >
                    {isInCart ? "Added" : "Add to Cart"}
                  </Button>
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
            <nav className="flex gap-1" role="tablist" aria-label="Product sections">
              {['overview', 'features', 'specs', 'included'].map((t) => (
                <button
                  key={t}
                  aria-selected={tab === t}
                  role="tab"
                  onClick={() => selectTab(t)}
                  className={cn(
                    "px-4 py-2.5 text-xs font-semibold rounded-btn transition-all duration-200",
                    tab === t
                      ? "bg-ocean/8 text-ocean"
                      : "text-ocean/50 hover:text-ocean hover:bg-ocean/4"
                  )}
                >
                  {t === 'overview' ? 'Overview' : t === 'features' ? 'Features' : t === 'specs' ? 'Specifications' : "What's Included"}
                </button>
              ))}
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
                <h3 className="font-clash text-2xl font-bold text-[#10233D] mb-4">What&apos;s Included</h3>
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
            <Button variant="primary" onClick={addBundle}>Add Bundle</Button>
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
