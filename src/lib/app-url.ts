/** Share links work both on Lovable and in a GitHub Pages project subdirectory. */
export function appUrl(path = "/"): string {
  if (import.meta.env.VITE_STATIC_PAGES) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = path;
    return url.href;
  }
  return new URL(path, window.location.origin).href;
}
