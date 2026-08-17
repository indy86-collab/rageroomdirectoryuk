/**
 * Placement marker for pages eligible for AdSense Auto ads.
 *
 * The global AdSense script in app/layout.tsx already enables Auto ads for the
 * publisher. Pushing the legacy `enable_page_level_ads` option here initializes
 * it a second time and AdSense rejects that duplicate configuration.
 */
export default function PageLevelAds() {
  return null
}
