export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">About SinoTechLens</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
        <p className="mb-4 leading-relaxed">
          SinoTechLens is an independent English technology blog built for global industry practitioners, investors, researchers and tech enthusiasts. We deliver objective, in-depth coverage of China’s fast-growing high-tech industrial ecosystem without biased media narratives.
        </p>
        <p className="leading-relaxed">
          The founder is a long-term industry observer tracking the full supply chain of China’s emerging technologies for years. This platform was created to bridge information gaps between overseas audiences and China’s domestic tech transformation, translating complex industrial updates into readable, straightforward analysis.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="leading-relaxed">
          We aim to provide transparent, factual insights into China’s industrial tech advancement. All content focuses on industrial application, policy trends, product iteration and cross-border cooperation. We explicitly exclude financial investment advice, cryptocurrency and speculative asset commentary to meet global advertising and regulatory compliance standards.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="leading-relaxed">
          Questions, corrections, or partnership inquiries are welcome. Reach the editorial team at{" "}
          <a href="mailto:hello@sinotechlens.com" className="text-blue-700 hover:underline">
            hello@sinotechlens.com
          </a>
          , or visit our{" "}
          <a href="/contact" className="text-blue-700 hover:underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </div>
  );
}