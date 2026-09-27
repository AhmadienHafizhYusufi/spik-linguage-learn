import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Saat development, app & admin dibuka di http://app.localhost:3000 dan http://admin.localhost:3000.
  // Next.js memblokir aset dev dari origin lain kecuali didaftarkan di sini.
  allowedDevOrigins: ["app.localhost", "admin.localhost"],
};

export default nextConfig;
