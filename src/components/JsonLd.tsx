interface JsonLdProps {
  readonly data: Record<string, unknown>
}

/** JSON-LDを安全にレンダリング（</script>インジェクション防止） */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/<\//g, '<\\/')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
