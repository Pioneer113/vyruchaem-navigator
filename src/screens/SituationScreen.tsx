import { SITUATIONS } from '../data'

interface Props {
  onPick: (situationId: string) => void
}

export function SituationScreen({ onPick }: Props) {
  const situations = SITUATIONS.filter((situation) => situation.kind !== 'other')
  const other = SITUATIONS.find((situation) => situation.kind === 'other')!

  return (
    <section>
      <h1>Какая помощь вам нужна?</h1>
      <p className="sub">
        Выберите свою ситуацию — покажем, что положено, что взять с собой и куда идти.
      </p>

      <div className="tiles">
        {situations.map((situation) => (
          <button
            key={situation.id}
            type="button"
            className={situation.kind === 'urgent' ? 'tile tile--urgent' : 'tile'}
            onClick={() => onPick(situation.id)}
          >
            {situation.title}
          </button>
        ))}
        <button
          type="button"
          className="tile tile--quiet"
          onClick={() => onPick(other.id)}
        >
          {other.title}
        </button>
      </div>
    </section>
  )
}
