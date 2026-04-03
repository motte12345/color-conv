import { Helmet } from 'react-helmet-async'
import { useLang } from '../i18n'

const BASE_URL = 'https://color-conv.pages.dev'

interface PageHeadProps {
  readonly title: string
  readonly description: string
  readonly path: string
}

export function PageHead({ title, description, path }: PageHeadProps) {
  const lang = useLang()
  const fullTitle = path === '/' ? title : `${title}｜${lang === 'ja' ? 'カラー変換ツール' : 'Color Converter'}`
  const jaUrl = `${BASE_URL}/ja${path}`
  const enUrl = `${BASE_URL}/en${path}`
  const currentUrl = lang === 'ja' ? jaUrl : enUrl
  const ogLocale = lang === 'ja' ? 'ja_JP' : 'en_US'

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="ja" href={jaUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={jaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={lang === 'ja' ? 'カラー変換ツール' : 'Color Converter'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
