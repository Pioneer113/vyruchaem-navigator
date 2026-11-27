import { useState } from 'react'
import qrHome from '../assets/qr-home.svg'
import type { Program, Region, Situation } from '../data'
import { partnersForRegion } from '../data/partners'
import type { PartnerOrg } from '../data/partners'
import { formatDate } from '../app/dates'
import { telHref } from '../app/phone'

interface Props {
  program: Program
  situation: Situation
  region: Region
  onBack: () => void
  onOpenProgram?: (programId: string) => void
  partners?: PartnerOrg[]
}

const READINESS_QUESTIONS = [
  {
    text: 'Есть ли в семье ребёнок от 3 до 17 лет включительно?',
    reason:
      'В акции участвуют семьи с ребёнком от 3 до 17 лет включительно. Для этой заявки не подходит — посмотрите программы без возрастного ценза.',
  },
  {
    text: 'Среднедушевой доход семьи ниже прожиточного минимума в регионе?',
    reason:
      'Заявка рассчитана на семьи с доходом ниже прожиточного минимума — это подтверждается справкой. Без неё заявку не примут; удостоверение многодетной семьи не заменяет справку о доходе.',
  },
  {
    text: 'Есть ли справка о малоимущем статусе/доходе — бумажная с печатью или PDF с Госуслуг, не старше сентября 2025 года?',
    reason:
      'Нужна справка о малоимущем статусе или доходе: бумажная с подписью и печатью либо PDF с Госуслуг, не старше сентября 2025 года. Скриншот не подойдёт. Удостоверение многодетной семьи не заменяет справку.',
  },
]

function ReadinessCheck({
  onOpenProgram,
  onShowRoutes,
}: {
  onOpenProgram?: (programId: string) => void
  onShowRoutes: () => void
}) {
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null])
  const allAnswered = answers.every((answer) => answer !== null)
  const firstNo = answers.findIndex((answer) => answer === false)

  const setAnswer = (index: number, value: boolean) => {
    setAnswers((prev) => prev.map((answer, i) => (i === index ? value : answer)))
  }

  return (
    <div className="check">
      <h2 className="sec-h">Проверьте за 10 секунд, подойдёт ли заявка</h2>
      <p className="small">Ответы никуда не отправляются и не сохраняются.</p>
      {READINESS_QUESTIONS.map((question, index) => (
        <div key={question.text} className="check-row">
          <p id={`check-q-${index}`}>{question.text}</p>
          <div
            className="check-btns"
            role="group"
            aria-labelledby={`check-q-${index}`}
          >
            <button
              type="button"
              aria-pressed={answers[index] === true}
              onClick={() => setAnswer(index, true)}
            >
              Да
            </button>
            <button
              type="button"
              aria-pressed={answers[index] === false}
              onClick={() => setAnswer(index, false)}
            >
              Нет
            </button>
          </div>
        </div>
      ))}
      {allAnswered && firstNo === -1 && (
        <p className="check-ok" role="status">
          По основным критериям подходите — можно заполнять заявку на елкажеланий.рф
        </p>
      )}
      {firstNo !== -1 && (
        <div className="check-no">
          <p role="status">{READINESS_QUESTIONS[firstNo].reason}</p>
          <div className="check-alts">
            <button
              type="button"
              className="more-btn"
              onClick={() => onOpenProgram?.('korzina')}
            >
              Корзина доброты
            </button>
            <button type="button" className="more-btn" onClick={onShowRoutes}>
              Другие маршруты
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProgramScreen({
  program,
  situation,
  region,
  onBack,
  onOpenProgram,
  partners,
}: Props) {
  const inHelper = situation.id === 'helper'
  const steps = inHelper ? (program.stepsHelper ?? program.steps) : program.steps
  const sayScript = inHelper
    ? (program.sayScriptHelper ?? program.sayScript)
    : program.sayScript
  const regionalPartners = partnersForRegion(region.id, partners)

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

        {program.id === 'prazdnik' && (
          <ReadinessCheck onOpenProgram={onOpenProgram} onShowRoutes={onBack} />
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

        {regionalPartners.length > 0 && (
          <>
            <h2 className="sec-h">Проверенные организации в вашем регионе</h2>
            <ul className="routes-list">
              {regionalPartners.map((partner) => (
                <li key={partner.id} className="route-item">
                  <span className="r-title">{partner.name}</span>
                  <p className="r-text">{partner.city}</p>
                  <div className="r-links">
                    {partner.phone && <a href={telHref(partner.phone)}>{partner.phone}</a>}
                    {partner.channelUrl && (
                      <a href={partner.channelUrl} target="_blank" rel="noreferrer">
                        написать
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

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
        {program.channel === 'store' && (
          <>
            <h2 className="pm-h">Важные ограничения</h2>
            <p className="pm-note">{program.expectations}</p>
          </>
        )}
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
