export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact SinoTechLens</h1>

      <p className="mb-6 leading-relaxed">
        We welcome tips, correction requests, partnership inquiries, and reader feedback. The fastest way to reach the editorial team is by email.
      </p>

      <div className="space-y-4 mb-10">
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">General &amp; Editorial</p>
          <a href="mailto:hello@sinotechlens.com" className="text-lg font-semibold text-blue-700 hover:underline">
            hello@sinotechlens.com
          </a>
        </div>
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Partnerships &amp; Sponsored Content</p>
          <a href="mailto:partners@sinotechlens.com" className="text-lg font-semibold text-blue-700 hover:underline">
            partners@sinotechlens.com
          </a>
        </div>
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Privacy Requests</p>
          <a href="mailto:privacy@sinotechlens.com" className="text-lg font-semibold text-blue-700 hover:underline">
            privacy@sinotechlens.com
          </a>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">About the team</h2>
      <p className="leading-relaxed mb-4">
        SinoTechLens is run by a small editorial team focused on China&apos;s industrial technology. The founding editor,
        operating under the editorial name <strong>SinoTechLens Editorial</strong>, has tracked China&apos;s emerging-technology
        supply chains for several years and built this publication to bridge the information gap for global readers.
      </p>
      <p className="leading-relaxed">
        We aim to respond to editorial emails within 3–5 business days.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: 2026</p>
    </div>
  );
}

export const metadata = {
  title: "Contact | SinoTechLens",
  description: "Reach the SinoTechLens editorial team by email for tips, corrections, and partnerships.",
};
