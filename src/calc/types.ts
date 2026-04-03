/** RGB色空間 (各チャンネル 0-255) */
export interface Rgb {
  readonly r: number
  readonly g: number
  readonly b: number
}

/** HSL色空間 (H: 0-360, S: 0-100, L: 0-100) */
export interface Hsl {
  readonly h: number
  readonly s: number
  readonly l: number
}

/** HSV色空間 (H: 0-360, S: 0-100, V: 0-100) */
export interface Hsv {
  readonly h: number
  readonly s: number
  readonly v: number
}

/** CMYK色空間 (各チャンネル 0-100) */
export interface Cmyk {
  readonly c: number
  readonly m: number
  readonly y: number
  readonly k: number
}

/** CIE XYZ色空間 (D65光源) */
export interface Xyz {
  readonly x: number
  readonly y: number
  readonly z: number
}

/** CIE L*a*b* 色空間 */
export interface Lab {
  readonly l: number
  readonly a: number
  readonly b: number
}
