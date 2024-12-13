import questions from "@/components/public/FAQs/questions";
import { getServerSideSitemap } from "next-sitemap";
import { DateTime } from "luxon";

export async function GET(request: Request) {
  const faqs = questions;
  const lastmod = DateTime.now().startOf("month").toISO();
  const urls = [];
  for await (const [key, value] of Object.entries(faqs)) {
    for await (const [_, faq] of Object.entries(value)) {
      urls.push({
        loc: `https://www.cipherwill.com/i/frequently-asked-questions/${faq.slug}`,
        lastmod,
      });
    }
  }

  return getServerSideSitemap(urls);
}
