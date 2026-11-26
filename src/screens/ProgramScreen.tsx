import type { Program, Region, Situation } from '../data'

interface Props {
  program: Program
  situation: Situation
  region: Region
  onBack: () => void
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export function ProgramScreen({ program, situation, region, onBack }: Props) {
  return (
    <section>
      <button className="back" type="button" onClick={onBack}>
        ← Вернуться
      </button>
      <h1>{program.title}</h1>
      <p className="sub">
        {situation.title} · {region.title}
      </p>
      <span className="chip">{program.statusNote}</span>

      <h2 className="sec-h">Что дают</h2>
      <p>{program.benefit}</p>
      {program.benefitNote && <p className="small">{program.benefitNote}</p>}

      <h2 className="sec-h">Кому подходит</h2>
      <p>{program.audienceNote}</p>
      {program.geographyNote && <p className="small">{program.geographyNote}</p>}

      <h2 className="sec-h">Как получить</h2>
      <ol className="steps-list">
        {program.steps.map((step, index) => (
          <li key={index}>
            <span className="step-num">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <h2 className="sec-h">Что взять с собой</h2>
      <ul className="docs-list">
        {program.documents.map((document) => (
          <li key={document}>{document}</li>
        ))}
      </ul>
      {program.documentsNote && <p className="small">{program.documentsNote}</p>}

      {program.sayScript && (
        <>
          <h2 className="sec-h">Что сказать</h2>
          <blockquote className="say">{program.sayScript}</blockquote>
        </>
      )}

      <h2 className="sec-h">Сколько ждать</h2>
      <p>{program.expectations}</p>

      {program.channel === 'direct' && (
        <a
          className="btn-link"
          href="https://елкажеланий.рф/dreamer"
          target="_blank"
          rel="noreferrer"
        >
          Открыть заявку на елкажеланий.рф
        </a>
      )}

      <p className="src">
        Проверено {formatDate(program.verifiedAt)} · источник:{' '}
        <a href={program.sourceUrl} target="_blank" rel="noreferrer">
          {program.sourceName}
        </a>
      </p>
    </section>
  )
}
