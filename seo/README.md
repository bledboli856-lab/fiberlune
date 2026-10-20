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

## Audit results — 2026-10-20

Deployed code commit: ba829dccf837b49c19afb2252ef7af8bf5f83ed5. GitHub Pages run 39455218059 completed successfully. The stylesheet was compared before/after and is identical. All existing purchase and sample anchors were preserved.

| Check | Result |
| --- | --- |
| Mobile Lighthouse | Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.8 s, TBT 0 ms, CLS 0 |
| Desktop Lighthouse | Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.2 s, TBT 0 ms, CLS 0 |
| Real-user performance data | No CrUX field data available yet; the scores above are laboratory results |
| Desktop layout | All three covers loaded; no horizontal overflow observed |
| Mobile layout | Existing responsive CSS preserved and reviewed; PageSpeed mobile emulation passed. No separate manual device-width session was available |
| English/Albanian | Page title, description, image alternatives and all three sample labels verified after switching language |
| Free PDF samples | All three actual downloads completed and were byte-for-byte equal to the original PDFs |
| Moonlit Garden Rooms purchases | Etsy and Apple Books destinations verified; Amazon URL retained, destination inspection blocked by browser policy; Google still intentionally coming soon |
| Crochet & Knitting purchases | No purchase URLs were supplied; existing coming-soon note retained |
| Cozy Ocean Life purchases | Etsy, Apple Books and Google Play destinations verified; Amazon URL retained, destination inspection blocked by browser policy |
| Search Console ownership | URL-prefix property verified successfully using the homepage HTML meta tag |
| Sitemap publication | Public HTTPS response 200 with application/xml; valid XML containing 4 URLs and 3 image references |
| Sitemap submission | Submitted successfully, then resubmitted once after diagnostics; report still showed Couldn't fetch at the end of the audit |
| Google live sitemap test | URL is available to Google; Page fetch Successful. Initial report fetch error remains unresolved; do not describe sitemap processing or indexing as successful yet |

Performance report: https://pagespeed.web.dev/analysis/https-bledboli856-lab-github-io-fiberlune/rr8vx05v7o?form_factor=mobile

Search Console sitemap report: https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fbledboli856-lab.github.io%2Ffiberlune%2F

Google documents that failed sitemap fetches are retried for a few days. If the error remains, revisit the report and live URL test before making changes: https://support.google.com/webmasters/answer/7451001

### Remaining input or permission

No additional authorization is needed for the published changes or the verified Search Console property. An effective host-root robots.txt would require approval to create or modify a separate root-host GitHub Pages repository; the prepared template is optional and crawling is not blocked by its absence. The owner still needs to supply purchase URLs for Crochet & Knitting and the Moonlit Garden Rooms Google Play link. Amazon availability needs manual confirmation in an ordinary browser.
