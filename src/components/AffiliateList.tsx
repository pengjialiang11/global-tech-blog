import { getAffiliates } from "@/lib/affiliateData";

// 前台联盟营销展示（计划书 5.2）：按赛道自然植入文字链接/产品卡片
// 使用 rel="sponsored nofollow" 满足广告/联盟合规（计划书 六）
export default function AffiliateList({
  track,
  title = "Recommended Tools",
}: {
  track?: string;
  title?: string;
}) {
  const items = getAffiliates(track);
  if (!items.length) return null;

  return (
    <section className="my-8 border rounded-lg p-5 bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col">
            <a
              href={item.targetUrl}
              target="_blank"
              rel="sponsored nofollow"
              className="font-medium text-blue-700 hover:underline"
            >
              {item.name}
              {item.featured ? <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Featured</span> : null}
            </a>
            {item.note ? <span className="text-sm text-gray-500">{item.note}</span> : null}
            {item.commission ? <span className="text-xs text-gray-400">Commission: {item.commission}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
