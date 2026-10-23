// Identifies server catalog changes without inspecting private error messages.
// Owns the recoverable GraphQL error-code boundary.
// Does not retry ordinary write failures or persist errors.
export function guidanceCatalogChanged(error: unknown) {
  const errors = (error as { errors?: Array<{ extensions?: { code?: string } }> })?.errors ?? [];
  return errors.some(item => item.extensions?.code === "GUIDANCE_CATALOG_CHANGED");
}
