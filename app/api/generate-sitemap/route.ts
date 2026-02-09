import { NextRequest, NextResponse } from 'next/server';

// This endpoint can be called by cron services or Vercel cron
export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BLOG_SITEMAP_CRON_SECRET_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Import and run the sitemap generation
    const { generateSitemap } = await import('../../../scripts/generate-blog-sitemap');

    // Run the sitemap generation function directly
    const result = await generateSitemap();

    return NextResponse.json({
      success: true,
      message: `Blog sitemap generated successfully with ${result.urlCount} URLs`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Only allow POST for security (optional)
export async function POST(request: NextRequest) {
  return GET(request);
}