export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-6 leading-relaxed">
        This website is an independent English technology blog focused on global and China tech news, analysis, and industry insights.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="leading-relaxed">
          We may collect anonymous visit data, including the pages you visit, the time of access, your browser type, and your general IP address, solely for the purpose of understanding content performance and improving the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li>To analyze which articles and topics are most useful to readers.</li>
          <li>To improve website content, structure, and user experience.</li>
          <li>To detect technical issues and protect website stability.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
        <p className="leading-relaxed">
          We may use cookies to improve your browsing experience. You can control cookie preferences through your browser settings.
        </p>
      </section>
    </div>
  );
}