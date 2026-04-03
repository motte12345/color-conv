import { useParams } from 'react-router-dom'
import type { Lang, Translations } from './types'
import { isLang, DEFAULT_LANG } from './types'
import { I18nContext } from './i18n-context'
import { ja } from './ja'
import { en } from './en'

const translations: Record<Lang, Translations> = { ja, en }

export function I18nProvider({ children }: { readonly children: React.ReactNode }) {
  const { lang: langParam } = useParams<{ lang: string }>()
  const lang: Lang = langParam && isLang(langParam) ? langParam : DEFAULT_LANG
  const t = translations[lang]

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  )
}
