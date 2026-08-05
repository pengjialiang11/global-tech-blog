// 内容合规红线校验（对照计划书 3.4 / 六）
// 硬红线：命中即拦截发布；软红线：提示警告，但仍可发布（如 Web3 需在官方落地技术边界内）。

export interface ComplianceHit {
  level: "hard" | "soft";
  rule: string;
  matched: string;
}

// 硬红线关键词（中英文，覆盖投资指导/收益承诺/加密金融等）
const HARD_PATTERNS: { rule: string; pattern: RegExp }[] = [
  { rule: "投资指导/行情预测", pattern: /(投资指导|行情预测|抄底|建仓|买卖点|trading tip|investment advice|price prediction)/i },
  { rule: "收益承诺", pattern: /(稳赚|保收益|保本|高额回报| guaranteed return|risk-free profit| guaranteed profit)/i },
  { rule: "代币/加密货币交易", pattern: /(\b代币\b|ico\b|id[oe]\b| defi\b| 交易所\b| 加密货币(交易|炒作)|crypto trading|coin listing|token sale)/i },
  { rule: "政治敏感", pattern: /(政变|颠覆|游行示威|敏感人物|政治献金)/i },
];

// 软红线：Web3/区块链仅限官方落地技术（数字人民币/政务联盟链/区块链存证溯源）
const WEB3_OFFICIAL = /(数字人民币|政务联盟链|区块链存证溯源|e-CNY|official consortium chain|on-chain notarization)/i;
const WEB3_GENERAL = /(区块链|web3|blockchain|分布式账本)/i;

const WEB3_SOFT_PATTERNS: { rule: string; pattern: RegExp }[] = [
  { rule: "Web3/区块链需限定在官方实体落地技术", pattern: WEB3_GENERAL },
];

export function checkCompliance(text: string): ComplianceHit[] {
  const hits: ComplianceHit[] = [];
  const sample = text || "";

  for (const { rule, pattern } of HARD_PATTERNS) {
    const m = sample.match(pattern);
    if (m) hits.push({ level: "hard", rule, matched: m[0] });
  }

  // 软红线仅在命中 Web3 泛词、且未命中官方落地技术时提示
  const hasWeb3 = WEB3_GENERAL.test(sample);
  const hasOfficial = WEB3_OFFICIAL.test(sample);
  if (hasWeb3 && !hasOfficial) {
    for (const { rule, pattern } of WEB3_SOFT_PATTERNS) {
      const m = sample.match(pattern);
      if (m) hits.push({ level: "soft", rule, matched: m[0] });
    }
  }

  return hits;
}

export function getHardViolations(text: string): ComplianceHit[] {
  return checkCompliance(text).filter((h) => h.level === "hard");
}

export function getSoftWarnings(text: string): ComplianceHit[] {
  return checkCompliance(text).filter((h) => h.level === "soft");
}
