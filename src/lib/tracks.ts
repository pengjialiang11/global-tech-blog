// 中央赛道/分类配置（对照用户确认的 4 大主题赛道）
// 计划书 3.2 要求聚焦中国前沿科技的跨境报道，统一收敛为 4 个赛道。

export interface Track {
  slug: string;
  name: string;
  description: string;
}

export const TRACKS: Track[] = [
  {
    slug: "general-china-tech",
    name: "General China Tech",
    description:
      "China's macro tech economy, policy drivers and cross-border industry trends.",
  },
  {
    slug: "semiconductor-hardware",
    name: "Semiconductor & Hardware",
    description:
      "Domestic chips, advanced packaging, equipment, materials and hardware supply chains.",
  },
  {
    slug: "ai-digital-software",
    name: "AI & Digital Software",
    description:
      "Foundation models, open-source AI, agents, cloud software and digital platforms.",
  },
  {
    slug: "green-tech-manufacturing",
    name: "Green Tech & Advanced Manufacturing",
    description:
      "Green energy, batteries, smart factories, robotics and advanced manufacturing going global.",
  },
];

const TRACK_MAP = new Map(TRACKS.map((t) => [t.slug, t]));

export function getTrack(slug: string): Track | undefined {
  return TRACK_MAP.get(slug);
}
