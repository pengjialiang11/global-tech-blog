export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Settings</h1>
      <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4 text-gray-700">
        <p>Current environment variables (read-only preview):</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Site URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || "https://www.sinotechlens.com"}</li>
          <li><strong>Admin User:</strong> {process.env.ADMIN_USER || "admin"}</li>
          <li><strong>Analytics Provider:</strong> {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || "not set"}</li>
          <li><strong>AdSense:</strong> {process.env.NEXT_PUBLIC_ADSENSE_PUB ? "configured" : "not set"}</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">
          To change these values, update the environment variables on your hosting platform (e.g. Vercel).
        </p>
      </div>
    </div>
  );
}
