import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` still needs 'unsafe-inline'/'unsafe-eval' because Next's
 * hydration bootstrap is inlined without a nonce. Tightening that to a
 * nonce-based policy requires generating a per-request nonce in middleware and
 * is tracked as follow-up work — the value here is in constraining which
 * *origins* can supply script, styles, images and connections, and in
 * `frame-ancestors`/`object-src`/`base-uri`/`form-action`.
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Google Fonts stylesheets, Leaflet's CSS from cdnjs, Tailwind's inline styles.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Place cover images are arbitrary operator-supplied https URLs; map tiles
  // and Leaflet marker icons come from OSM and cdnjs.
  "img-src 'self' data: blob: https:",
  // Supabase REST/auth/storage plus its realtime websocket.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  // Belt-and-braces alongside frame-ancestors for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Geolocation stays enabled for self: the map uses it to centre on the user.
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
      // Supabase Storage public objects (avatars, pet photos, place covers).
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
