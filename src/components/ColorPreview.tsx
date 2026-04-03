import { useT } from '../i18n'

interface ColorPreviewProps {
  readonly hex: string
  readonly size?: 'sm' | 'md' | 'lg'
}

export function ColorPreview({ hex, size = 'md' }: ColorPreviewProps) {
  const t = useT()
  return (
    <div
      className={`color-preview color-preview--${size}`}
      style={{ backgroundColor: hex }}
      role="img"
      aria-label={`${t.common.colorPreviewAria}: ${hex}`}
    />
  )
}
