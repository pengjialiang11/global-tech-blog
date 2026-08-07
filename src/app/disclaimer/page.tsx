export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <p className="mb-4">
        All information published on this website is for general informational and educational purposes only. It should not be treated as professional advice, including but not limited to investment advice, financial advice, or legal advice.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3">No Investment Advice</h2>
      <p className="mb-4">
        This website does not provide personalized investment recommendations, stock market analysis, or financial guidance. Readers should make their own independent decisions before taking any action related to investments, finance, or business.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3">Accuracy of Information</h2>
      <p className="mb-4">
        We strive to publish accurate and well-researched content, but we cannot guarantee that all information is complete, current, or free from errors. Industry data, market trends, and company developments may change over time.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3">External Links</h2>
      <p className="mb-4">
        This website may link to external websites for reference purposes. We do not control the content, privacy policies, or practices of those third-party sites.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-3">Personal Responsibility</h2>
      <p className="mb-6">
        Your use of this website is at your own risk. SinoTech Lens and its authors shall not be liable for any direct or indirect losses arising from the use of information published on this site.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Sponsored &amp; Affiliate Content Disclosure</h2>
      <p className="mb-4">
        SinoTechLens is an independent publication, but in the interest of full transparency we disclose the following:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>
          <strong>Sponsored content.</strong> Some articles may be marked as &quot;Sponsored&quot; and are produced in
          collaboration with, or commissioned by, a third-party brand. Sponsored articles are labeled as such at the top
          of the page. We retain full editorial control over the factual content of any sponsored piece.
        </li>
        <li>
          <strong>Affiliate links.</strong> Some articles contain affiliate links. If you click an affiliate link and make
          a purchase or sign up for a service, SinoTechLens may earn a commission at no additional cost to you. This does
          not influence our editorial coverage or rankings.
        </li>
        <li>
          <strong>Advertising.</strong> Display advertising (such as Google AdSense) may be served on the site. Ad
          placements are managed by the advertising partner and are not endorsed by SinoTechLens.
        </li>
      </ul>
      <p className="mb-4">
        Our editorial and commercial functions are kept separate. If you have any questions about a specific piece of
        sponsored or affiliate content, please contact{" "}
        <a href="mailto:partners@sinotechlens.com" className="text-blue-700 hover:underline">
          partners@sinotechlens.com
        </a>
        .
      </p>

      <p className="text-sm text-gray-500">Last updated: 2026</p>
    </div>
  );
}

export const metadata = {
  title: "Disclaimer | SinoTech Lens",
  description: "Disclaimer for SinoTech Lens, clarifying that content is for general information purposes only and not professional advice."
};