import { getServerSideSitemap } from "next-sitemap";
import personas from "../data";

export async function GET(request: Request) {
  const urls = personas.map((persona: any) => {
    const slug = persona.slug;
    return {
      loc: `https://www.cipherwill.com/i/personas/${slug}`,
      lastmod: new Date(persona.date).toISOString(),
    };
  });

  return getServerSideSitemap(urls);
}
