import { getServerSideSitemap } from "next-sitemap";
import jobs from "@/components/app/careers/jobs_data";

export async function GET(request: Request) {
  const urls = jobs.map((job: any) => {
    const id = job.id;
    return {
      loc: `https://www.cipherwill.com/careers/${id}`,
      lastmod: new Date(job.datePosted).toISOString(),
    };
  });

  return getServerSideSitemap(urls);
}
