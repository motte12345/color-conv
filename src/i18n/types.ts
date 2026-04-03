export type Lang = 'ja' | 'en'

export const SUPPORTED_LANGS: readonly Lang[] = ['ja', 'en']
export const DEFAULT_LANG: Lang = 'ja'

export function isLang(value: string): value is Lang {
  return SUPPORTED_LANGS.includes(value as Lang)
}

export interface Translations {
  readonly common: {
    readonly siteTitle: string
    readonly nav: {
      readonly converter: string
      readonly palette: string
      readonly gradient: string
      readonly contrast: string
    }
    readonly footer: string
    readonly loading: string
    readonly copy: string
    readonly colorPreviewAria: string
    readonly thisColorWith: string
    readonly linkPalette: string
    readonly linkGradient: string
    readonly linkContrast: string
  }
  readonly home: {
    readonly title: string
    readonly metaTitle: string
    readonly description: string
    readonly h1: string
    readonly pageDescription: string
    readonly pickerAria: string
    readonly seoHeading1: string
    readonly seoText1: string
    readonly seoHeading2: string
    readonly formatHex: string
    readonly formatRgb: string
    readonly formatHsl: string
    readonly formatHsv: string
    readonly formatCmyk: string
    readonly jsonLdName: string
    readonly jsonLdDescription: string
  }
  readonly palette: {
    readonly title: string
    readonly description: string
    readonly h1: string
    readonly pageDescription: string
    readonly baseColor: string
    readonly baseColorAria: string
    readonly copyVars: string
    readonly types: {
      readonly complementary: string
      readonly analogous: string
      readonly triadic: string
      readonly 'split-complementary': string
      readonly tetradic: string
      readonly monochromatic: string
    }
    readonly roles: {
      readonly base: string
      readonly complement: string
      readonly analogous_minus: string
      readonly analogous_plus: string
      readonly triadic_120: string
      readonly triadic_240: string
      readonly split_150: string
      readonly split_210: string
      readonly tetradic_90: string
      readonly tetradic_180: string
      readonly tetradic_270: string
      readonly mono_dark_vivid: string
      readonly mono_dark: string
      readonly mono_light: string
      readonly mono_light_pale: string
    }
    readonly seoHeading: string
    readonly seoComplementary: string
    readonly seoAnalogous: string
    readonly seoTriadic: string
    readonly seoSplit: string
    readonly seoTetradic: string
    readonly seoMono: string
    readonly jsonLdName: string
    readonly jsonLdDescription: string
  }
  readonly gradient: {
    readonly title: string
    readonly description: string
    readonly h1: string
    readonly pageDescription: string
    readonly fromColor: string
    readonly toColor: string
    readonly fromAria: string
    readonly toAria: string
    readonly swapAria: string
    readonly direction: string
    readonly steps: string
    readonly stepsList: string
    readonly cssCode: string
    readonly copyCss: string
    readonly directions: {
      readonly toRight: string
      readonly toBottom: string
      readonly deg45: string
      readonly deg135: string
      readonly toBottomRight: string
      readonly circle: string
    }
    readonly seoHeading: string
    readonly seoText: string
    readonly jsonLdName: string
    readonly jsonLdDescription: string
  }
  readonly contrast: {
    readonly title: string
    readonly description: string
    readonly h1: string
    readonly pageDescription: string
    readonly foreground: string
    readonly background: string
    readonly fgAria: string
    readonly bgAria: string
    readonly swapAria: string
    readonly aaNormal: string
    readonly aaLarge: string
    readonly aaaNormal: string
    readonly aaaLarge: string
    readonly previewNormal: string
    readonly previewLarge: string
    readonly previewSmall: string
    readonly suggestionLabel: string
    readonly apply: string
    readonly seoHeading: string
    readonly seoItems: readonly string[]
    readonly seoText: string
    readonly jsonLdName: string
    readonly jsonLdDescription: string
  }
  readonly about: {
    readonly title: string
    readonly description: string
    readonly h1: string
    readonly aboutHeading: string
    readonly aboutText: string
    readonly disclaimerHeading: string
    readonly disclaimerItems: readonly string[]
    readonly contactHeading: string
    readonly contactText: string
    readonly contactEmail: string
  }
}
