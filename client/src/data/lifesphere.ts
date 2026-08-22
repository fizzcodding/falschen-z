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
  { id: "a01", index: "01", title: "Gold Medalist", venue: "GRIC — Global Robotics Innovation Consortium" },
  { id: "a02", index: "02", title: "Gold Medalist", venue: "World Invention Creation and Exhibition 2025 · Malaysia" },
  { id: "a03", index: "03", title: "Gold Medalist", venue: "International Science Innovation Fair (ISIF) · Bali" },
  { id: "a04", index: "04", title: "Gold Medalist", venue: "Fibonacci International Robotics Olympiad" },
  { id: "a05", index: "05", title: "Gold Medalist", venue: "World Sustainable Development Goals 2026" },
  { id: "a06", index: "06", title: "Champion", venue: "5th NWGCPL BUET Robo Carnival" },
  { id: "a07", index: "07", title: "Champion", venue: "National STEAM Carnival" },
  { id: "a08", index: "08", title: "Champion", venue: "46th National Science and Technology Week" },
  { id: "a09", index: "09", title: "Champion", venue: "20+ National Science and Robotics Fairs" },
  { id: "a10", index: "10", title: "Best IT Project Overall", venue: "DRMC Science Carnival" },
  { id: "a11", index: "11", title: "Best IT Project", venue: "Notre Dame Annual Science Fair" },
  { id: "a12", index: "12", title: "Best IT Project · National Round", venue: "Codeavour 7.0" },
  { id: "a13", index: "13", title: "Top 3", venue: "International Academic Research Competition" },
];
