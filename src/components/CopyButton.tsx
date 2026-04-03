import { useState, useCallback } from 'react'
import { useT } from '../i18n'

interface CopyButtonProps {
  readonly text: string
  readonly label?: string
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const t = useT()
  const displayLabel = label ?? t.common.copy
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [text])

  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
      onClick={handleCopy}
      aria-label={`${displayLabel} ${t.common.copy}`}
    >
      {copied ? '✓' : displayLabel}
    </button>
  )
}
