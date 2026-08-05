import fs from "fs";
import path from "path";

export interface Affiliate {
  id: string;
  name: string;
  track: string; // 关联赛道 slug，用于在前台按赛道展示
  note?: string;
  targetUrl: string;
  status: "Active" | "Paused" | "Expired";
  commission?: string;
  featured?: boolean;
}

const dataFilePath = path.join(process.cwd(), "src", "data", "affiliates.json");

export function getAffiliates(track?: string): Affiliate[] {
  const fileContent = fs.readFileSync(dataFilePath, "utf8");
  const list: Affiliate[] = JSON.parse(fileContent);
  const active = list.filter((a) => a.status === "Active");
  const filtered = track ? active.filter((a) => a.track === track) : active;
  return filtered;
}

export function getAllAffiliates(): Affiliate[] {
  const fileContent = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(fileContent) as Affiliate[];
}

export function saveAffiliates(list: Affiliate[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(list, null, 2));
}
