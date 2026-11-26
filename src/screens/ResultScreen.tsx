import type { Region, Situation } from '../data'

interface Props {
  situation: Situation
  region: Region
  onBack: () => void
}

export function ResultScreen({ situation, region, onBack }: Props) {
  return (
    <section>
      <button className="back" type="button" onClick={onBack}>
        ← Изменить регион
      </button>
      <h1>Вам может подойти</h1>
      <p className="sub">
        {situation.title} · {region.title}
      </p>

      <div className="placeholder">
        <strong>Здесь появятся карточки программ фонда «Выручаем».</strong> Этот экран
        собирается на следующем шаге: 1–3 программы с шагами, документами, сроками и
        источниками.
      </div>
    </section>
  )
}
