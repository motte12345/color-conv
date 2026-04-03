import { useContext } from 'react'
import { I18nContext } from './i18n-context'
import type { Lang, Translations } from './types'

export function useLang(): Lang {
  return useContext(I18nContext).lang
}

export function useT(): Translations {
  return useContext(I18nContext).t
}

/** パスに言語プレフィックスを付ける */
export function langPath(lang: Lang, path: string): string {
  return `/${lang}${path}`
}
