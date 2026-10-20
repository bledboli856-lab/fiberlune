# FIBERLUNE indexing configuration

The public site is a single HTML page at https://bledboli856-lab.github.io/fiberlune/. Its canonical URL intentionally omits index.html and fragment identifiers. The three books are sections, not separate indexable HTML pages. The English/Albanian switch uses the same URL, so no duplicate hreflang URLs are declared.

The homepage includes a unique title, description, canonical link, index/follow rules, social metadata, translated cover alternatives, and Schema.org Organization, WebSite, CollectionPage, ItemList and Book data. Book data describes the visible collection and its free PDF excerpts; no prices, ISBNs, ratings or stock claims are invented.

## Sitemap

Submit https://bledboli856-lab.github.io/fiberlune/sitemap.xml in the matching URL-prefix Search Console property. It contains the homepage, three public PDF samples and three cover-image references. Update lastmod only when the associated content actually changes. Keep the Google ownership verification meta tag in the homepage after verification.

## robots.txt scope

Google reads https://bledboli856-lab.github.io/robots.txt. That URL returned GitHub Pages 404 on 2026-10-20. The current project repository publishes only /fiberlune/, so adding docs/robots.txt here would not create an effective host-level robots file. A missing robots.txt does not block crawling.

robots-root.txt is a ready-to-deploy template for the root-host site, usually managed by a separate bledboli856-lab.github.io repository. Do not overwrite other sites' existing host rules if that repository is later set up. Creating or modifying that separate site is outside this repository update. The submitted sitemap works independently of robots.txt discovery.

## Images and hosting

Original PNG covers are retained unchanged. The page serves 400px and 800px WebP derivatives through srcset, keeps explicit dimensions, and lazy-loads the covers. The three original covers total 16,196,685 bytes; the three 800px alternatives total 849,290 bytes (94.8% smaller), and the 400px alternatives total 269,072 bytes. PDFs remain unchanged. GitHub Pages controls HTTP cache headers; no unsupported cache-header configuration is added.

## Documentation

- https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/webmasters/answer/9008080
- https://schema.org/Book
