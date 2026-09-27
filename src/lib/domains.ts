/**
 * Konfigurasi domain.
 *
 * Satu project Next.js melayani tiga host:
 *   - ROOT_DOMAIN        → landing page + checkout      (learnhub.id)
 *   - APP_HOST           → aplikasi pembeli             (app.learnhub.id)
 *   - ADMIN_HOST         → panel admin / pengelola konten (admin.learnhub.id)
 *
 * Default-nya APP_HOST = "app.<ROOT_DOMAIN>" dan ADMIN_HOST = "admin.<ROOT_DOMAIN>".
 * Kalau belum punya domain sendiri (mis. hosting di *.vercel.app), isi
 * NEXT_PUBLIC_APP_HOST dan NEXT_PUBLIC_ADMIN_HOST secara terpisah:
 *
 *   NEXT_PUBLIC_ROOT_DOMAIN="learnhub.vercel.app"
 *   NEXT_PUBLIC_APP_HOST="learnhub-app.vercel.app"
 *   NEXT_PUBLIC_ADMIN_HOST="learnhub-admin.vercel.app"
 *
 * Variabel NEXT_PUBLIC_* ditanam saat build → setelah mengubahnya, deploy ulang.
 * File ini dipakai juga oleh proxy.ts, jadi jangan import modul Node/DB di sini.
 */

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
export const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST || `app.${ROOT_DOMAIN}`;
export const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST || `admin.${ROOT_DOMAIN}`;

// localhost, xxx.localhost, atau 127.0.0.1 → http; selain itu https
const isLocal = /^(127\.0\.0\.1|([\w-]+\.)*localhost)(:\d+)?$/.test(ROOT_DOMAIN);
export const PROTOCOL = isLocal ? "http" : "https";

/** URL absolut di domain utama, mis. marketingUrl("/checkout") */
export function marketingUrl(path = "/") {
  return `${PROTOCOL}://${ROOT_DOMAIN}${path}`;
}

/** URL absolut di app subdomain, mis. appUrl("/dashboard") */
export function appUrl(path = "/") {
  return `${PROTOCOL}://${APP_HOST}${path}`;
}

/** URL absolut di admin subdomain, mis. adminUrl("/modules") */
export function adminUrl(path = "/") {
  return `${PROTOCOL}://${ADMIN_HOST}${path}`;
}

/** Folder internal (src/app/platform) tempat semua halaman app subdomain berada */
export const APP_ROUTE_PREFIX = "/platform";

/** Folder internal (src/app/console) tempat semua halaman admin berada */
export const ADMIN_ROUTE_PREFIX = "/console";

/** Nama cookie sesi — dibaca proxy.ts untuk cek cepat */
export const SESSION_COOKIE = "lh_session";

/** Cookie sesi admin — nama berbeda & hanya berlaku di admin subdomain */
export const ADMIN_SESSION_COOKIE = "lh_admin_session";

/** Cookie berisi secret checkout di domain utama (lihat checkout/actions.ts) */
export const CHECKOUT_COOKIE = "lh_checkout";
