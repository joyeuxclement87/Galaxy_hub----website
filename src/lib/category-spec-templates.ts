/**
 * Category-aware "suggested groups" for the admin specification editor.
 *
 * Each category maps to a set of commonly expected specification groups,
 * each pre-filled with common field names (empty values). The admin is
 * never forced to fill anything — templates are just a head start so a
 * smartphone listing looks like a smartphone and a laptop like a laptop.
 *
 * This is pure data used by the admin editor only. The public page never
 * depends on templates — it only renders whatever is stored in
 * `products.specifications`.
 */

export interface SpecGroupTemplate {
  name: string;
  fields: string[];
}

export interface CategorySpecTemplate {
  displayName: string;
  groups: SpecGroupTemplate[];
}

type TemplateKey =
  | "smartphones"
  | "tablets"
  | "laptops"
  | "audio"
  | "watches"
  | "tvs"
  | "monitors"
  | "cameras"
  | "accessories"
  | "default";

const TEMPLATES: Record<TemplateKey, CategorySpecTemplate> = {
  smartphones: {
    displayName: "Smartphones",
    groups: [
      { name: "Display", fields: ["Screen Size", "Display Type", "Resolution", "Refresh Rate", "Peak Brightness", "Protection"] },
      { name: "Performance", fields: ["Processor", "CPU", "GPU"] },
      { name: "Camera", fields: ["Main Camera", "Rear Camera Modules", "Video Recording", "Front Camera"] },
      { name: "Memory & Storage", fields: ["RAM", "Internal Memory", "Card Slot"] },
      { name: "Battery", fields: ["Capacity", "Charging Speed", "Wireless Charging"] },
      { name: "Connectivity", fields: ["Wi-Fi", "Bluetooth", "NFC", "USB", "GPS"] },
      { name: "Network", fields: ["Technology", "5G Bands", "SIM"] },
      { name: "Design", fields: ["Dimensions", "Weight", "Build", "Colors", "IP Rating"] },
      { name: "Software", fields: ["Operating System", "Updates"] },
      { name: "Sensors", fields: ["Sensors", "Biometrics"] },
      { name: "Sound", fields: ["Loudspeaker", "Audio Jack"] },
      { name: "Features", fields: ["Other Features"] },
    ],
  },
  tablets: {
    displayName: "Tablets",
    groups: [
      { name: "Display", fields: ["Screen Size", "Display Type", "Resolution", "Refresh Rate"] },
      { name: "Performance", fields: ["Processor", "RAM", "GPU"] },
      { name: "Storage", fields: ["Internal Memory", "Card Slot"] },
      { name: "Camera", fields: ["Rear Camera", "Front Camera"] },
      { name: "Battery", fields: ["Capacity", "Charging"] },
      { name: "Connectivity", fields: ["Wi-Fi", "Bluetooth", "USB"] },
      { name: "Design", fields: ["Dimensions", "Weight", "Build", "Colors"] },
      { name: "Software", fields: ["Operating System"] },
      { name: "Features", fields: ["Stylus Support", "Keyboard Support"] },
    ],
  },
  laptops: {
    displayName: "Laptops",
    groups: [
      { name: "Display", fields: ["Screen Size", "Resolution", "Refresh Rate", "Panel Type", "Brightness"] },
      { name: "Processor", fields: ["Processor", "Cores", "Clock Speed", "Cache"] },
      { name: "Graphics", fields: ["GPU", "VRAM"] },
      { name: "Memory", fields: ["RAM", "RAM Type", "Max RAM"] },
      { name: "Storage", fields: ["Storage Type", "Storage Capacity", "Expandable Storage"] },
      { name: "Battery", fields: ["Capacity", "Battery Life", "Charging"] },
      { name: "Ports", fields: ["USB-C", "USB-A", "HDMI", "Thunderbolt", "SD Card Slot", "Audio Jack"] },
      { name: "Connectivity", fields: ["Wi-Fi", "Bluetooth"] },
      { name: "Camera", fields: ["Camera", "Camera Resolution"] },
      { name: "Audio", fields: ["Speakers", "Audio Features"] },
      { name: "Keyboard", fields: ["Keyboard", "Backlit Keyboard", "Trackpad"] },
      { name: "Design", fields: ["Dimensions", "Weight", "Build", "Colors"] },
      { name: "Operating System", fields: ["Operating System"] },
      { name: "Features", fields: ["Security", "Other Features"] },
    ],
  },
  audio: {
    displayName: "Earbuds & Headphones",
    groups: [
      { name: "Audio", fields: ["Sound Quality", "Codec Support", "Impedance", "Frequency Response"] },
      { name: "Driver", fields: ["Driver Size", "Driver Type"] },
      { name: "Noise Cancellation", fields: ["Active Noise Cancelling", "Ambient Mode", "ANC Strength"] },
      { name: "Battery", fields: ["Battery Life", "Battery Life with Case", "Charging", "Fast Charging"] },
      { name: "Connectivity", fields: ["Connection Type", "Range"] },
      { name: "Bluetooth", fields: ["Bluetooth Version", "Multipoint"] },
      { name: "Microphones", fields: ["Microphones", "Call Quality"] },
      { name: "Controls", fields: ["Controls", "Touch Controls", "Voice Assistant"] },
      { name: "Water Resistance", fields: ["IP Rating"] },
      { name: "Compatibility", fields: ["Compatible Devices", "App Support"] },
      { name: "Design", fields: ["Weight", "Colors", "Case Size"] },
      { name: "Features", fields: ["Other Features"] },
    ],
  },
  watches: {
    displayName: "Smartwatches",
    groups: [
      { name: "Display", fields: ["Screen Size", "Display Type", "Resolution", "Always-On Display"] },
      { name: "Performance", fields: ["Processor", "Performance Features"] },
      { name: "Memory", fields: ["RAM", "Internal Memory"] },
      { name: "Battery", fields: ["Capacity", "Battery Life", "Charging"] },
      { name: "Sensors", fields: ["Sensors", "Heart Rate Sensor", "SpO2 Sensor", "Accelerometer", "Gyroscope"] },
      { name: "Health & Fitness", fields: ["Health Tracking", "Workout Tracking", "Sleep Tracking", "GPS Tracking"] },
      { name: "Connectivity", fields: ["Bluetooth", "Wi-Fi", "NFC"] },
      { name: "GPS", fields: ["GPS", "GLONASS", "Galileo"] },
      { name: "Water Resistance", fields: ["IP Rating", "Water Resistance Depth"] },
      { name: "Compatibility", fields: ["Compatible Devices", "App Support"] },
      { name: "Design", fields: ["Case Size", "Materials", "Weight", "Colors", "Strap"] },
      { name: "Software", fields: ["Operating System", "Watch Faces"] },
      { name: "Features", fields: ["Calls", "Notifications", "Other Features"] },
    ],
  },
  tvs: {
    displayName: "Televisions",
    groups: [
      { name: "Display", fields: ["Screen Size", "Resolution", "Panel Type", "Refresh Rate", "HDR Support", "Brightness"] },
      { name: "Smart Platform", fields: ["Operating System", "App Store", "Voice Assistant"] },
      { name: "Audio", fields: ["Speakers", "Sound Output", "Audio Features"] },
      { name: "Connectivity", fields: ["Wi-Fi", "Bluetooth", "AirPlay"] },
      { name: "Ports", fields: ["HDMI Ports", "USB Ports", "Ethernet"] },
      { name: "Design", fields: ["Dimensions", "Weight", "Stand", "Wall Mount"] },
      { name: "Features", fields: ["Gaming Features", "Other Features"] },
    ],
  },
  monitors: {
    displayName: "Monitors",
    groups: [
      { name: "Display", fields: ["Screen Size", "Resolution", "Panel Type", "Refresh Rate", "Response Time", "Brightness", "Color Gamut"] },
      { name: "Performance", fields: ["Adaptive Sync", "HDR Support"] },
      { name: "Connectivity", fields: ["HDMI", "DisplayPort", "USB-C", "USB Hub"] },
      { name: "Ergonomics", fields: ["Height Adjust", "Tilt", "Swivel", "Pivot"] },
      { name: "Design", fields: ["Dimensions", "Weight", "VESA Mount"] },
      { name: "Features", fields: ["Built-in Speakers", "KVM Switch", "Other Features"] },
    ],
  },
  cameras: {
    displayName: "Cameras",
    groups: [
      { name: "Sensor", fields: ["Sensor Type", "Megapixels", "Sensor Size", "ISO Range"] },
      { name: "Performance", fields: ["Processor", "Shutter Speed", "Burst Shooting"] },
      { name: "Video", fields: ["Video Resolution", "Frame Rates", "Log Profiles"] },
      { name: "Battery", fields: ["Battery Type", "Battery Life"] },
      { name: "Connectivity", fields: ["Wi-Fi", "Bluetooth", "USB", "HDMI"] },
      { name: "Design", fields: ["Dimensions", "Weight", "Build", "Weather Sealing"] },
      { name: "Features", fields: ["Image Stabilization", "Other Features"] },
    ],
  },
  accessories: {
    displayName: "Accessories",
    groups: [
      { name: "Compatibility", fields: ["Compatible Devices", "Compatible Models"] },
      { name: "Design", fields: ["Materials", "Dimensions", "Weight", "Colors"] },
      { name: "Features", fields: ["Other Features"] },
    ],
  },
  default: {
    displayName: "Products",
    groups: [
      { name: "General", fields: ["Model Number", "Color", "Material"] },
      { name: "Performance", fields: ["Specifications"] },
      { name: "Connectivity", fields: ["Connectivity"] },
      { name: "Design", fields: ["Dimensions", "Weight"] },
      { name: "Features", fields: ["Other Features"] },
    ],
  },
};

function templateKeyFor(nameSlug: string): TemplateKey {
  const s = nameSlug.toLowerCase();
  if (s.includes("phone") || s.includes("mobile")) return "smartphones";
  if (s.includes("tablet") || s.includes("ipad")) return "tablets";
  if (s.includes("laptop") || s.includes("computer") || s.includes("macbook") || s.includes("notebook")) return "laptops";
  if (s.includes("earbud") || s.includes("audio") || s.includes("headphone") || s.includes("speaker")) return "audio";
  if (s.includes("watch") || s.includes("wearable")) return "watches";
  if (s.includes("tv") || s.includes("television")) return "tvs";
  if (s.includes("monitor") || s.includes("display")) return "monitors";
  if (s.includes("camera")) return "cameras";
  if (s.includes("acces") || s.includes("case") || s.includes("charger") || s.includes("cable") || s.includes("stand")) return "accessories";
  return "default";
}

/** Resolve the suggested specification template for a product category. */
export function getSpecificationTemplate(
  categoryName?: string | null,
  categorySlug?: string | null
): CategorySpecTemplate | null {
  const searched = `${categoryName ?? ""} ${categorySlug ?? ""}`;
  if (!searched.trim()) return null;
  return TEMPLATES[templateKeyFor(searched)];
}