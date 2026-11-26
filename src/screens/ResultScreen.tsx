import { programsForSituation } from '../data'
import type { Region, Situation } from '../data'

interface Props {
  situation: Situation
  region: Region
  onBack: () => void
  onOpenProgram: (programId: string) => void
}

export function ResultScreen({ situation, region, onBack, onOpenProgram }: Props) {
  const programs = programsForSituation(situation.id)

  return (
    <section>
      <button className="back" type="button" onClick={onBack}>
        ← Изменить регион
      </button>
      <h1>Вам может подойти</h1>
      <p className="sub">
        {situation.title} · {region.title}
      </p>

      <ul className="cards">
        {programs.map((program) => (
          <li key={program.id} className="program-card">
            <h2 className="pc-title">{program.title}</h2>
            <p className="pc-benefit">{program.benefit}</p>
            <p className="pc-meta">{program.audienceNote}</p>
            <span className="chip">{program.statusNote}</span>
            <button
              className="more-btn"
              type="button"
              onClick={() => onOpenProgram(program.id)}
            >
              Подробнее
            </button>
          </li>
        ))}
      </ul>

      <p className="note">
        Мы не фонд и не принимаем заявки. Помощь выдают фонд «Выручаем» и его партнёры.
      </p>
    </section>
  )
}
