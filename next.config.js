/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CLOUDINARY_NAME: "djkwvx3rd",
    CLOUDINARY_API_KEY: "112692864583482",
    BASE_URL: "https://www.seniormanagers.com",
  },

  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.pixabay.com", "res.cloudinary.com", "images.unsplash.com"],
  },
};

module.exports = nextConfig;
