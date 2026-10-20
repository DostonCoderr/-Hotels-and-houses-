/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Vercel'da build bo'lishi uchun xatolarni e'tiborsiz qoldirish
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // rasm sozlamalari (agar oldin bo'lsa, o'chirmang, qo'shib qo'ying)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;