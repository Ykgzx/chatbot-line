/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ ทำให้ next build สร้างไฟล์ static ในโฟลเดอร์ out
  images: {
    unoptimized: true, // ✅ ปิด image optimization เพื่อให้ export ได้
  },
};

export default nextConfig;
