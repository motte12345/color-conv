import { PageHead } from '../components/PageHead'
import { useT } from '../i18n'

export default function AboutPage() {
  const t = useT()

  return (
    <>
      <PageHead title={t.about.title} description={t.about.description} path="/about" />
      <h1 className="page-title">{t.about.h1}</h1>

      <div className="card">
        <h2>{t.about.aboutHeading}</h2>
        <p>{t.about.aboutText}</p>
      </div>

      <div className="card">
        <h2>{t.about.disclaimerHeading}</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
          {t.about.disclaimerItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>{t.about.contactHeading}</h2>
        <p>{t.about.contactText}</p>
        <p style={{ marginTop: 8 }}>
          {t.about.contactEmail}
        </p>
      </div>
    </>
  )
}
