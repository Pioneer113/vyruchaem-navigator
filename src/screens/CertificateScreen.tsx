import { CERTIFICATE_INFO } from '../data'
import { telHref } from '../app/phone'
import { formatDate } from '../app/dates'

interface Props {
  onBack: () => void
}

export function CertificateScreen({ onBack }: Props) {
  const info = CERTIFICATE_INFO

  return (
    <section className="screen">
      <button className="back" type="button" onClick={onBack}>
        ← К выбору ситуации
      </button>
      <h1>{info.title}</h1>
      <p className="sub">{info.intro}</p>

      <h2 className="sec-h">Как потратить</h2>
      <ol className="steps-list">
        {info.rules.map((rule, index) => (
          <li key={index}>
            <span className="step-num">{index + 1}</span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>

      <a className="btn-link" href={info.exclusionsUrl} target="_blank" rel="noreferrer">
        {info.exclusionsLabel}
      </a>

      <h2 className="sec-h">{info.cashierTitle}</h2>
      <ul className="docs-list">
        {info.cashierSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      {info.hotlines.map((hotline) => (
        <a key={hotline.phone} className="btn-link" href={telHref(hotline.phone)}>
          {hotline.label}: {hotline.phone}
        </a>
      ))}

      <p className="note">{info.fraudNote}</p>

      <p className="src">
        Проверено {formatDate(info.verifiedAt)} · источник:{' '}
        <a href={info.sourceUrl} target="_blank" rel="noreferrer">
          {info.sourceName}
        </a>
      </p>
    </section>
  )
}
