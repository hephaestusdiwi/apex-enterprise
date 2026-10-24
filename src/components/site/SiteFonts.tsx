import { GOOGLE_FONTS_ORIGIN, buildFontHead, type SiteFonts as SiteFontsData } from '@/lib/fonts'

export function SiteFonts({ fonts }: { fonts: SiteFontsData }) {
  const { googleHref, preloads, css } = buildFontHead(fonts)
  if (!googleHref && !css) return null

  return (
    <>
      {googleHref ? (
        <>
          <link rel="preconnect" href={GOOGLE_FONTS_ORIGIN} />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={googleHref} />
        </>
      ) : null}
      {preloads.map(({ href, type }) => (
        <link key={href} rel="preload" as="font" type={type} href={href} crossOrigin="anonymous" />
      ))}
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
    </>
  )
}
