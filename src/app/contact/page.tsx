export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact SinoTechLens</h1>

      <p className="mb-6 leading-relaxed">
        We welcome tips, correction requests, partnership inquiries, and reader feedback.
        The fastest way to reach the editorial team is by email.
      </p>

      <div className="space-y-4 mb-10">
        <div className="border rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">General &amp; Editorial</p>
          <a href="mailto:1743153696@qq.com" className="text-lg font-semibold text-blue-700 hover:underline">
            1743153696@qq.com
          </a>
          <p className="text-xs text-gray-400 mt-1">
            We aim to respond within 3&ndash;5 business days.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">About the editor</h2>
      <p className="leading-relaxed mb-4">
        SinoTechLens is an independent, individually-run publication covering China&apos;s industrial technology
        for a global audience. The founding editor, writing under the name{" "}
        <strong>SinoTechLens Editorial</strong>, has tracked China&apos;s emerging-technology supply chains
        for several years and built this publication to bridge the information gap for global readers.
      </p>
      <p className="leading-relaxed">
        All articles are original. For corrections, story tips, or collaboration ideas, email the address above.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: August 2026</p>
    </div>
  );
}

export const metadata = {
  title: "Contact | SinoTechLens",
  description: "Reach the SinoTechLens editorial team by email for tips, corrections, and partnerships.",
};
