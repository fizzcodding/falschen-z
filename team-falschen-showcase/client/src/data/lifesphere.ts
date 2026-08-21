/* LifeSphere showcase data: subsystem specs, glossary terms, tech stack, awards index.
 * Awards (11) reflect the founder records already on the site: WICE 2025 Gold,
 * ISIF 2025 Bali Gold, and the other national/international recognitions listed
 * across the two founder profiles. Verified count matches the "11 awards" stamp.
 */

export interface Subsystem {
  id: string;
  name: string;
  role: string;
  specs: string[];
  /** Inline glossary terms this card exposes; resolved against GLOSSARY below. */
  glossary: string[];
}

export interface AwardItem {
  id: string;
  index: string;
  title: string;
  venue: string;
}

export const LIFESPHERE_TAGLINE = "Forged. Wired. Perfected.";
export const LIFESPHERE_SITE_URL = "https://lifespheremain.vercel.app";
export const PAPER_URL = "https://drive.google.com/file/d/1RDRlOY9X-jy6FGNMmqz4ix-oc8u8aXoe/view?usp=sharing";

export const SUBSYSTEMS: Subsystem[] = [
  {
    id: "SYS-01",
    name: "Vital32",
    role: "ESP32 wearable telemetry band",
    specs: [
      "16 bio-signals sampled at 200 Hz",
      "Edge-processed anomaly detection",
      "12-hour passive battery window",
      "Featherweight field-replaceable strap",
    ],
    glossary: ["ESP32"],
  },
  {
    id: "SYS-02",
    name: "HollowRover",
    role: "ROS2 mobile care robot",
    specs: [
      "SLAM + UWB indoor navigation",
      "Autonomous room-to-room transit",
      "Carry-payload for medication delivery",
      "Reactive obstacle avoidance stack",
    ],
    glossary: ["ROS2", "SLAM", "UWB"],
  },
  {
    id: "SYS-03",
    name: "SphereAI",
    role: "Trimodal emotion intelligence",
    specs: [
      "Whisper STT transcription layer",
      "Librosa prosody / acoustic analysis",
      "Firebase biomarker correlation",
      "Trimodal affect fusion model",
    ],
    glossary: ["Whisper", "Librosa", "Firebase", "Trimodal"],
  },
  {
    id: "SYS-04",
    name: "EntryGuard",
    role: "Face recognition security layer",
    specs: [
      "OpenCV face verification",
      "Layered home entry control",
      "Guest + resident access tiers",
      "Offline-first identity cache",
    ],
    glossary: ["OpenCV"],
  },
  {
    id: "SYS-05",
    name: "HollowCore",
    role: "Home automation orchestrator",
    specs: [
      "MQTT device bus",
      "Firebase orchestration rules",
      "Scene + routine scheduler",
      "Voice + schedule triggers",
    ],
    glossary: ["MQTT", "Firebase"],
  },
];

export const TECH_STACK: string[] = [
  "ESP32",
  "ROS2",
  "SLAM",
  "UWB",
  "Whisper",
  "Librosa",
  "Firebase",
  "MQTT",
  "OpenCV",
  "Python",
];

/** Plain-language definitions shown on hover for technical jargon. */
export const GLOSSARY: Record<string, string> = {
  ESP32: "Low-power Wi-Fi/Bluetooth microcontroller used as the wearable's edge compute core.",
  ROS2: "Robot Operating System v2 — the message-based middleware driving HollowRover's nodes.",
  SLAM: "Simultaneous Localization and Mapping; lets the rover build a map while locating itself in it.",
  UWB: "Ultra-Wideband radio for centimetre-accurate indoor positioning where GPS is unavailable.",
  Whisper: "OpenAI's open speech-to-text model; the transcription layer of SphereAI.",
  Librosa: "Python audio-analysis library used to read prosody and acoustic emotion cues.",
  Firebase: "Google's realtime backend used for biomarker sync and orchestration rules.",
  MQTT: "Lightweight pub/sub messaging protocol carrying HollowCore's device bus.",
  OpenCV: "Open computer-vision library powering EntryGuard's face verification.",
  Python: "Primary scripting language across the SphereAI inference and orchestration layers.",
  Trimodal: "Three-channel (text + prosody + biomarker) emotion fusion model.",
};

export const AWARDS: AwardItem[] = [
  { id: "a01", index: "01", title: "Gold Medalist", venue: "International Science Innovation Fair 2025 · Bali" },
  { id: "a02", index: "02", title: "International Representative", venue: "WICE 2025 · Malaysia" },
  { id: "a03", index: "03", title: "7th Place", venue: "The Reply AI Agent Competition · 3,143 teams" },
  { id: "a04", index: "04", title: "Runner-Up", venue: "ALOHA International Math Challenge" },
  { id: "a05", index: "05", title: "Runner-Up", venue: "International Scratch Olympiad" },
  { id: "a06", index: "06", title: "Top 10 International", venue: "LeetCode & Codeforces contests" },
  { id: "a07", index: "07", title: "Selected", venue: "GRIC — Academic Research" },
  { id: "a08", index: "08", title: "Selected", venue: "Codeavour 7.0" },
  { id: "a09", index: "09", title: "Top 10", venue: "International Academic Research Competition" },
  { id: "a10", index: "10", title: "Bronze Medalist", venue: "International CS Competition · 3,000+ participants" },
  { id: "a11", index: "11", title: "Finalist", venue: "International English Olympiad" },
];
