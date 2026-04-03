import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://color-conv.pages.dev'

interface PageHeadProps {
  readonly title: string
  readonly description: string
  readonly path: string
}

export function PageHead({ title, description, path }: PageHeadProps) {
  const fullTitle = path === '/' ? title : `${title}｜カラー変換ツール`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:site_name" content="カラー変換ツール" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
