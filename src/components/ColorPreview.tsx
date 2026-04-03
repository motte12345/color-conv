interface ColorPreviewProps {
  readonly hex: string
  readonly size?: 'sm' | 'md' | 'lg'
}

export function ColorPreview({ hex, size = 'md' }: ColorPreviewProps) {
  return (
    <div
      className={`color-preview color-preview--${size}`}
      style={{ backgroundColor: hex }}
      role="img"
      aria-label={`色見本: ${hex}`}
    />
  )
}
