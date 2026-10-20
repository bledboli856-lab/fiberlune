# FIBERLUNE GA4 integration — inactive draft

## Current status

No GA4 account, property or stream has been inspected or created for this change. No real measurement ID is configured. This branch is not deployed. Browser/account access was unavailable during preparation. Do not interpret this code as proof of active analytics or legal compliance.

analytics-config.js defaults to disabled. Until every activation gate is satisfied, analytics.js returns without reading consent storage, adding UI, loading Google, or sending events. Existing website styling and sales/sample URLs are preserved.

## Activation prerequisites

1. With authorized Google Analytics access, inspect existing accounts/properties and web streams for https://bledboli856-lab.github.io/fiberlune/. Reuse the matching stream. Only create property FIBERLUNE and its web stream if none exists. Record actual property name, property ID, stream ID and measurement ID here. Confirm reporting timezone/currency with the owner.
2. Disable Enhanced Measurement for that stream, including outbound clicks, file downloads and history page views. This implementation sends explicit events instead. Check for other installed Google tags/GTM containers before enabling. Google-generated first_visit, session_start and user_engagement may still occur.
3. Keep Google Signals and advertising/personalization features off. Configure suitable retention (two months proposed, subject to owner decision), access controls and processor settings; record actual choices.
4. Publish an accurate same-origin privacy notice identifying the legal operator and public privacy contact, Google processing, purposes, consent/withdrawal, cookie and consent-preference lifetimes, actual retention, recipients/transfers and visitor rights. Obtain the owner's factual details and approval; do not invent identity or assume that a banner alone establishes compliance.
5. Set the real measurementId, same-origin HTTPS privacyNoticeUrl, enhancedMeasurementDisabled:true and privacyNoticeApproved:true only after verifying those facts. Set enabled:true in a test branch/environment, perform the checks below, then deploy the verified changes through the repository's normal Pages workflow.

## Events

| Event | Meaning | Parameters |
| --- | --- | --- |
| page_view | Once per consented document load | page_location, page_title, language |
| book_view | Book card at least 25% visible for one continuous second, once per consented page load | book_id, book_title |
| purchase_link_click | Activation of an existing retailer link | book_id, book_title, destination_platform, link_domain |
| sample_download | Initiation of an existing free PDF download | book_id, book_title, destination_platform=website, file_name, file_extension |

All explicit events also include page context and send_to. Book IDs are moonlit-garden-rooms, cozy-crochet-knitting and cozy-ocean-life. Platforms are amazon, etsy, apple_books and google_play_books.

Purchase-link clicks are not completed purchases; sample clicks do not prove a completed file transfer. Crochet's missing retailer URLs and Moonlit's missing Google URL remain absent. Future valid retailer links inside the existing book cards are handled automatically.

Register event-scoped custom dimensions book_id, book_title and destination_platform in GA4 to use them in reports/explorations. Do not emit purchase or revenue events without actual transaction evidence. Traffic sources come from GA session attribution; safe UTM campaign codes are retained, arbitrary query strings/hashes removed and referrers reduced to origins. Never put personal information in campaign codes.

## Consent behavior

Basic opt-in globally: no Google tag, analytics request, or Google analytics cookie before consent. Reject and accept have equal prominence. The necessary preference is stored locally for 180 days; blocked storage means the choice lasts only for the current page. Analytics cookies are host-only with the fiberlune prefix and a 180-day configured lifetime. Ads-related consent remains denied.

The footer Analytics settings control permits withdrawal. Withdrawal disables measurement, deletes this integration's host-only cookies and reloads if Google was already loaded. EN/SQ copy follows the existing language switch. Cookie banner and settings control appear only when the integration is activated. No existing design rules are changed.

One delegated listener per activation type handles primary/keyboard and middle clicks; no parallel pointer/touch listeners. Explicit page_view uses send_page_view:false. Disabling Enhanced Measurement is required to avoid overlapping auto click/file_download events. Book visibility events have a per-page de-duplication set.

## Validation performed during preparation

- JavaScript syntax parsing passed.
- Six preference tests passed: missing/corrupt, granted/denied, expired and invalid choice.
- Six inactive/incomplete configuration gates returned before access to browser globals.
- All existing HTML href values are byte-for-byte unchanged.
- No browser DOM/network/cookie tests, URL-classification execution, DebugView, Realtime or deployment verification were possible in this environment.

## Required browser and GA4 acceptance tests

1. Fresh storage, no consent: no googletagmanager.com/gtag or Google Analytics collection requests, no analytics cookies and no queued analytics events. Repeat after reject and reload.
2. Opt in: exactly one page_view; advertising consent stays denied. Confirm host-only cookie names and lifetime. Check English/Albanian and mobile/desktop banner usability.
3. Set sessionStorage.setItem('fiberlune-ga-debug','1') in a test browser, consent and reload. Inspect the real property's DebugView and network payloads. One activation produces one custom event with correct book/platform. Test all seven current retailer links and all three PDF downloads, including keyboard and middle-click behavior. Confirm original navigation/download behavior.
4. Each book_view occurs once after the visibility threshold, never before consent or while hidden. Test hidden-tab transitions and consent granted while scrolled.
5. Confirm no overlapping Enhanced Measurement click/file_download events. Check page referrer/UTM attribution with non-personal test codes.
6. Withdraw, reload and switch tabs: no subsequent analytics, namespaced cookies deleted, denial persists. Test storage disabled, corrupted/expired preferences and blocked Google script.
7. Remove debug flag with sessionStorage.removeItem('fiberlune-ga-debug'), reload and verify consented activity in Realtime. Record property/stream IDs, timestamp, event screenshots/counts and limitations.
8. Verify live Pages deployment and performance after activation.

## References

- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/analytics/answer/9216061
- https://support.google.com/analytics/answer/7201382
