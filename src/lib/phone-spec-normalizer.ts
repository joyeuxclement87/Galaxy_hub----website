import "server-only";
import type { MobileApiDeviceDetail } from "@/lib/mobile-api";
import type { ProductSpecifications, SpecGroup } from "@/types/specifications";

/**
 * Converts a raw MobileAPI.dev device record into Galaxy Hub's own
 * specification structure (see src/types/specifications.ts).
 *
 * Rules:
 * - Never invents data: a label is only included when the source field has
 *   a real, non-empty value.
 * - Groups with zero populated specs are dropped entirely.
 * - Price is intentionally never read from the API (Galaxy Hub's price is
 *   always set independently by the admin).
 */

function clean(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed.toLowerCase() === "n/a") return undefined;
  return trimmed;
}

/**
 * MobileAPI documents the `hardware` field as following the consistent
 * pattern "<RAM> RAM, <Chipset>" (e.g. "12GB RAM, Snapdragon 8 Elite").
 * This extracts just the RAM portion from that documented format —
 * it's a parse of existing text, not an invented value.
 */
function extractRam(hardware?: string | null): string | undefined {
  const text = clean(hardware);
  if (!text) return undefined;
  const match = text.match(/(\d+(?:\.\d+)?\s?GB)\s*RAM/i);
  return match ? `${match[1].replace(/\s+/g, "")} RAM` : undefined;
}

function buildGroup(name: string, entries: Array<[string, string | null | undefined]>): SpecGroup | null {
  const specs = entries
    .map(([label, value]) => ({ label, value: clean(value) }))
    .filter((entry): entry is { label: string; value: string } => Boolean(entry.value));

  return specs.length > 0 ? { name, specs } : null;
}

export function normalizeMobileApiDevice(device: MobileApiDeviceDetail): ProductSpecifications {
  const groups: Array<SpecGroup | null> = [
    buildGroup("Display", [
      ["Screen Size", device.display?.size || device.screen_resolution],
      ["Display Type", device.display?.type],
      ["Resolution", device.display?.resolution],
      ["Protection", device.display?.protection],
      ["Other", device.display?.other],
    ]),
    buildGroup("Performance", [
      ["Processor", device.platform?.chipset],
      ["RAM", extractRam(device.hardware)],
      ["Storage", device.storage],
      ["CPU", device.platform?.cpu],
      ["GPU", device.platform?.gpu],
      ["Memory Details", device.memory?.internal],
      ["Card Slot", device.memory?.card_slot],
    ]),
    buildGroup("Camera", [
      ["Main Camera", device.camera],
      ["Rear Camera Modules", device.main_camera?.modules],
      ["Rear Camera Features", device.main_camera?.features],
      ["Video Recording", device.main_camera?.video],
      ["Front Camera", device.selfie_camera?.modules],
      ["Front Camera Features", device.selfie_camera?.features],
      ["Front Video", device.selfie_camera?.video],
    ]),
    buildGroup("Battery", [
      ["Capacity", device.battery_capacity],
      ["Type", device.battery?.type],
      ["Charging", device.battery?.charging],
    ]),
    buildGroup("Connectivity", [
      ["Network", device.network?.technology],
      ["5G Bands", device.network?.bands_5g],
      ["Network Speed", device.network?.speed],
      ["Wi-Fi", device.comms?.wlan],
      ["Bluetooth", device.comms?.bluetooth],
      ["GPS", device.comms?.positioning],
      ["NFC", device.comms?.nfc],
      ["USB", device.comms?.usb],
      ["Radio", device.comms?.radio],
    ]),
    buildGroup("Design", [
      ["Dimensions", device.body?.dimensions],
      ["Weight", device.body?.weight || device.weight],
      ["Thickness", device.thickness],
      ["Build", device.body?.build],
      ["SIM", device.body?.sim],
      ["Colors", device.colors],
      ["Other", device.body?.other],
    ]),
    buildGroup("Software", [["Operating System", device.platform?.os]]),
    buildGroup("Sound", [
      ["Loudspeaker", device.sound?.loudspeaker],
      ["Audio Jack", device.sound?.audio_jack],
    ]),
    buildGroup("Sensors & Features", [
      ["Sensors", device.features?.sensors],
      ["Other Features", device.features?.other],
    ]),
  ];

  return groups.filter((group): group is SpecGroup => group !== null);
}
