import { useEffect, useRef } from 'react'

const AD_CLIENT = 'ca-pub-4590343506815597'

/**
 * Google AdSense ad unit component.
 *
 * Renders a responsive AdSense display ad.
 * Falls back to a styled placeholder if ads fail to load
 * (e.g. during local development or if AdSense hasn't approved the site yet).
 *
 * @param {'horizontal'|'vertical'|'square'} format  - Ad shape preference
 * @param {string} label - Fallback label text
 */
export default function AdPlaceholder({
  format = 'horizontal',
  label = 'Advertisement',
}) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Only push once per mount, and only if adsbygoogle is available
    if (pushed.current) return

    try {
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({})
        pushed.current = true
      }
    } catch (e) {
      // AdSense not loaded yet (local dev, ad blocker, etc.) — silent fail
    }
  }, [])

  return (
    <div className="ad-container" style={{ margin: '24px 0' }}>
      {/* Tiny "Ad" disclosure label */}
      <div
        style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px',
          textAlign: 'center',
        }}
      >
        Advertisement
      </div>

      {/* AdSense ad unit — responsive auto format */}
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{
          display: 'block',
          minHeight: '90px',
          width: '100%',
          textAlign: 'center',
          overflow: 'hidden',
          borderRadius: 'var(--radius-sm)',
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot="auto"
        data-ad-format={format === 'square' ? 'rectangle' : format === 'vertical' ? 'vertical' : 'auto'}
        data-full-width-responsive="true"
      />

      {/* 
        Fallback: if AdSense doesn't fill the slot (no ads available,
        site not yet approved, local dev, ad blocker), the <ins> stays
        empty and collapsed. The minHeight ensures some space is reserved.
        
        Once your site is approved and live, the ads will auto-fill
        these slots. You can also replace data-ad-slot="auto" with
        specific ad unit IDs from your AdSense dashboard for better
        control over ad types and placement.
      */}
    </div>
  )
}
