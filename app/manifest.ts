import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { 
    name: "Cipherwill",
    short_name: "Cipherwill",
    description:
      "Securely store and manage your digital assets, create a digital will, and ensure your data is passed on to your loved ones.",
    start_url: "/app",
    display: "standalone",
    background_color: "#000000",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}