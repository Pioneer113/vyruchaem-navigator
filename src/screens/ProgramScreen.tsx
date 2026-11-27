import qrHome from '../assets/qr-home.svg'
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
  const inHelper = situation.id === 'helper'
  const steps = inHelper ? (program.stepsHelper ?? program.steps) : program.steps
  const sayScript = inHelper
    ? (program.sayScriptHelper ?? program.sayScript)
    : program.sayScript

  return (
    <>
      <section className="screen">
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
        {program.id === 'foodshare' && (
          <p className="small">
            В вашем регионе: {region.foodshare ? 'подтверждено' : 'не подтверждено'}.
          </p>
        )}

        <h2 className="sec-h">Как получить</h2>
        <ol className="steps-list">
          {steps.map((step, index) => (
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

        {sayScript && (
          <>
            <h2 className="sec-h">Что сказать</h2>
            <blockquote className="say">{sayScript}</blockquote>
          </>
        )}

        <h2 className="sec-h">
          {program.channel === 'store' ? 'Важные ограничения' : 'Сколько ждать'}
        </h2>
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

        <button className="print-btn" type="button" onClick={() => window.print()}>
          Распечатать памятку
        </button>

        <p className="src">
          Проверено {formatDate(program.verifiedAt)} · источник:{' '}
          <a href={program.sourceUrl} target="_blank" rel="noreferrer">
            {program.sourceName}
          </a>
        </p>
      </section>

      <div className="print-memo" data-testid="print-memo">
        <div className="pm-head">
          <span>Навигатор продуктовой помощи · фонд «Выручаем»</span>
          <span>Проверено {formatDate(program.verifiedAt)}</span>
        </div>
        <h1 className="pm-title">{program.title}</h1>
        <p className="pm-sub">
          {situation.title} · {region.title}
        </p>
        {program.id === 'foodshare' && (
          <p className="pm-note">
            В вашем регионе: {region.foodshare ? 'подтверждено' : 'не подтверждено'}.
          </p>
        )}
        <p className="pm-benefit">{program.benefit}</p>
        <h2 className="pm-h">Как получить</h2>
        <ol className="pm-steps">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <h2 className="pm-h">Что взять с собой</h2>
        <ul className="pm-docs">
          {program.documents.map((document) => (
            <li key={document}>{document}</li>
          ))}
        </ul>
        {program.documentsNote && <p className="pm-note">{program.documentsNote}</p>}
        {sayScript && (
          <>
            <h2 className="pm-h">Что сказать</h2>
            <p className="pm-say">{sayScript}</p>
          </>
        )}
        <div className="pm-foot">
          <img
            className="pm-qr"
            src={qrHome}
            alt="QR-код на сайт «Навигатор продуктовой помощи»"
          />
          <div>
            <p className="pm-note">Подробнее — на сайте: pioneer113.github.io/vyruchaem-navigator</p>
            <p className="pm-note">Источник данных: {program.sourceName}.</p>
            <p className="pm-note">
              Информационный сайт. Не фонд: заявки и деньги не принимаем.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
