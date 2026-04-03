import { createContext } from 'react'
import type { Lang, Translations } from './types'
import { DEFAULT_LANG } from './types'
import { ja } from './ja'

export interface I18nContextValue {
  readonly lang: Lang
  readonly t: Translations
}

export const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANG,
  t: ja,
})
