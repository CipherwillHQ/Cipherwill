// Defines the public blog listing's route props.
// Owns the query parameter shape shared by rendering and metadata.
// Does not define database records or article content.
export interface BlogListingPageProps {
  searchParams: Promise<{
    cursor?: string | string[];
  }>;
}
