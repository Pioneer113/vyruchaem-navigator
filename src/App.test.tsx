import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { findProgram, findRegion, findSituation } from './data'
import { ProgramScreen } from './screens/ProgramScreen'
import { ResultScreen } from './screens/ResultScreen'

describe('приложение', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
  })

  it('показывает ситуации на главной', () => {
    render(<App />)
    expect(screen.getByText('Какая помощь вам нужна?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Я пожилой человек, живу одиноко' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Мне нечего есть прямо сейчас' })).toBeInTheDocument()
  })

  it('футер доступен по стабильному селектору и содержит дисклеймер', () => {
    render(<App />)
    const footer = screen.getByTestId('footer-note')
    expect(footer).toHaveTextContent('Не фонд: заявки и деньги не принимаем')
    expect(footer).not.toHaveAttribute('style')
  })

  it('ведёт от ситуации к карточкам программ и деталям', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я пожилой человек, живу одиноко' }))
    expect(await screen.findByText('Где вы живёте?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Москва/ }))
    expect(await screen.findByText('Вам может подойти')).toBeInTheDocument()
    expect(screen.getByText('Выручаем каждый день')).toBeInTheDocument()
    expect(localStorage.getItem('vyruchaem.region')).toBe('moscow')

    await user.click(screen.getAllByRole('button', { name: 'Подробнее' })[0])
    const printButton = await screen.findByRole('button', { name: 'Распечатать памятку' })
    const scope = printButton.closest('.screen') as HTMLElement
    expect(within(scope).getByText('Как получить')).toBeInTheDocument()
    expect(within(scope).getByText(/Проверено \d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument()
  })

  it('для срочной ситуации сразу показывает маршруты «сегодня»', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Мне нечего есть прямо сейчас' }))

    expect(await screen.findByText('Если еды нет совсем')).toBeInTheDocument()
    expect(screen.getByText('112')).toBeInTheDocument()
    expect(screen.getByText(/не выдаёт еду в день обращения/)).toBeInTheDocument()
    expect(screen.getByText('Уточнить помощь в моём регионе')).toBeInTheDocument()
    expect(screen.getByText('8 800 234-07-07').closest('a')).toHaveAttribute(
      'href',
      'tel:+78002340707',
    )
    expect(window.location.hash).toBe('#/urgent')
  })

  it('глубокая ссылка #/result/urgent/moscow продолжает работать', async () => {
    window.location.hash = '#/result/urgent/moscow'
    render(<App />)

    expect(await screen.findByText('Если еды нет совсем')).toBeInTheDocument()
    expect(screen.getByText(/Москва\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '← Изменить регион' })).toBeInTheDocument()
  })

  it('показывает другие маршруты под карточками программ', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я пожилой человек, живу одиноко' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))

    expect(await screen.findByText('Другие маршруты')).toBeInTheDocument()
    expect(screen.getByText('Банк еды «Русь»')).toBeInTheDocument()
    expect(screen.getByText('8 800 234-07-07').closest('a')).toHaveAttribute(
      'href',
      'tel:+78002340707',
    )
  })

  it('для «другая ситуация» показывает только маршруты', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Моя ситуация другая' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))

    expect(await screen.findByText('Куда ещё обратиться')).toBeInTheDocument()
    expect(screen.getByText('Добро.Навигатор')).toBeInTheDocument()
  })

  it('переключает размер шрифта и запоминает выбор', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /шрифт/i })
    expect(button).toHaveTextContent('обычный')

    await user.click(button)
    expect(document.documentElement.dataset.font).toBe('large')
    expect(localStorage.getItem('vyruchaem.font')).toBe('large')
    expect(button).toHaveTextContent('крупный')
  })

  it('печатает памятку с QR-кодом', async () => {
    const user = userEvent.setup()
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я пожилой человек, живу одиноко' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))
    const card = screen.getByText('Выручаем каждый день').closest('.program-card') as HTMLElement
    await user.click(within(card).getByRole('button', { name: 'Подробнее' }))
    await user.click(await screen.findByRole('button', { name: 'Распечатать памятку' }))

    expect(printSpy).toHaveBeenCalledTimes(1)
    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText('Выручаем каждый день')).toBeInTheDocument()
    expect(within(memo).getByRole('img', { name: /QR/i })).toBeInTheDocument()
    expect(within(memo).getByText(/всё равно обратитесь/)).toBeInTheDocument()

    printSpy.mockRestore()
  })

  it('фудшеринг учитывает регион: Москву подтверждает', async () => {
    window.location.hash = '#/result/pensioner/moscow'
    render(<App />)

    expect(await screen.findByText('Фудшеринг работает в вашем регионе')).toBeInTheDocument()
  })

  it('фудшеринг честно говорит, если регион не подтверждён', async () => {
    window.location.hash = '#/result/pensioner/tatarstan'
    render(<App />)

    expect(await screen.findByText('В вашем регионе не подтверждён')).toBeInTheDocument()
  })

  it('не дублирует дисклеймеры на экране «другая ситуация»', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Моя ситуация другая' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))

    expect(screen.queryByText(/Мы не фонд и не принимаем заявки/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Если ни одна программа фонда не подошла/)).not.toBeInTheDocument()
    expect(screen.getByText(/Не фонд: заявки и деньги не принимаем/)).toBeInTheDocument()
  })

  it('на #/urgent есть кнопка возврата к выбору ситуации', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/urgent'
    render(<App />)

    expect(await screen.findByText('Если еды нет совсем')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '← К выбору ситуации' }))
    expect(await screen.findByText('Какая помощь вам нужна?')).toBeInTheDocument()
  })

  it('на #/result/urgent/moscow нет дублирующей ссылки на регион', () => {
    window.location.hash = '#/result/urgent/moscow'
    render(<App />)

    expect(screen.getByText(/Москва\./)).toBeInTheDocument()
    expect(screen.queryByText('Уточнить помощь в моём регионе')).not.toBeInTheDocument()
  })

  it('печатная памятка фудшеринга подтверждает Москву', () => {
    window.location.hash = '#/program/pensioner/moscow/foodshare'
    render(<App />)

    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText(/В вашем регионе: подтверждено/)).toBeInTheDocument()
  })

  it('печатная памятка фудшеринга честна про Татарстан', () => {
    window.location.hash = '#/program/pensioner/tatarstan/foodshare'
    render(<App />)

    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText(/В вашем регионе: не подтверждено/)).toBeInTheDocument()
  })

  it('быстрый выбор сохранённого региона ведёт к результату', async () => {
    const user = userEvent.setup()
    localStorage.setItem('vyruchaem.region', 'moscow')
    window.location.hash = '#/situation/pensioner'
    render(<App />)

    await user.click(
      screen.getByRole('button', { name: 'Ваш регион: Москва — продолжить' }),
    )
    expect(await screen.findByText('Вам может подойти')).toBeInTheDocument()
  })

  it('мусор в сохранённом регионе не показывает быстрый выбор', () => {
    localStorage.setItem('vyruchaem.region', 'nope')
    window.location.hash = '#/situation/pensioner'
    render(<App />)

    expect(screen.queryByText(/Ваш регион:/)).not.toBeInTheDocument()
    expect(screen.getByText('Где вы живёте?')).toBeInTheDocument()
  })

  it('сценарий помощника: формулировки от лица помогающего', () => {
    window.location.hash = '#/program/helper/moscow/ezhden'
    render(<App />)

    expect(screen.queryByText(/Живу одиноко/)).not.toBeInTheDocument()
    const screenEl = screen
      .getByRole('button', { name: 'Распечатать памятку' })
      .closest('.screen') as HTMLElement
    expect(within(screenEl).getByText(/помогаю одинокому пожилому/)).toBeInTheDocument()
    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText(/Расскажите о ситуации подопечного/)).toBeInTheDocument()
    expect(within(memo).queryByText(/живёте одиноко/)).not.toBeInTheDocument()
  })

  it('памятка помощника содержит скрипт «что сказать»', () => {
    window.location.hash = '#/program/helper/moscow/ezhden'
    render(<App />)

    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText('Что сказать')).toBeInTheDocument()
    expect(within(memo).getByText(/помогаю одинокому пожилому/)).toBeInTheDocument()
  })

  it('Тульская область: банк еды «Русь» есть — честная пометка', () => {
    window.location.hash = '#/result/pensioner/tula'
    render(<App />)

    expect(screen.getByText('В вашем регионе есть банк еды «Русь».')).toBeInTheDocument()
  })

  it('Татарстан: банка еды «Русь» нет — пометка и карточка в конце списка', () => {
    window.location.hash = '#/result/pensioner/tatarstan'
    render(<App />)

    expect(
      screen.getByText('В вашем регионе нет отделения банка еды «Русь».'),
    ).toBeInTheDocument()
    const items = document.querySelectorAll('.route-item')
    expect(items[items.length - 1].textContent).toContain('Банк еды «Русь»')
  })

  it('на срочном экране региона виден телефон отделения Красного Креста', () => {
    window.location.hash = '#/result/urgent/tula'
    render(<App />)

    expect(screen.getByText('8 (487) 250-51-36').closest('a')).toHaveAttribute(
      'href',
      'tel:+74872505136',
    )
  })

  it('на #/urgent есть ссылка на каталог отделений РКК', () => {
    window.location.hash = '#/urgent'
    render(<App />)

    expect(screen.getByRole('link', { name: 'Каталог отделений' })).toHaveAttribute(
      'href',
      'https://redcross.ru/contacts/regionalnye-otdeleniya/',
    )
  })

  it('пенсионеру показывается ежедневная скидка 10%', () => {
    window.location.hash = '#/result/pensioner/moscow'
    render(<App />)

    expect(screen.getByText('Скидка 10% для пенсионеров')).toBeInTheDocument()
    expect(
      screen.getByText('Действует каждый день (нужен документ и карта)'),
    ).toBeInTheDocument()
  })

  it('на экране скидки нет кнопки заявки, есть «Важные ограничения»', () => {
    window.location.hash = '#/program/pensioner/moscow/senior-discount'
    render(<App />)

    const screenEl = screen
      .getByRole('button', { name: 'Распечатать памятку' })
      .closest('.screen') as HTMLElement
    expect(
      screen.queryByText('Открыть заявку на елкажеланий.рф'),
    ).not.toBeInTheDocument()
    expect(within(screenEl).getByText(/Проверено 27\.11\.2026/)).toBeInTheDocument()
    expect(within(screenEl).getByText('Важные ограничения')).toBeInTheDocument()
    expect(screen.queryByText('Сколько ждать')).not.toBeInTheDocument()
  })

  it('памятка скидки печатает важные ограничения', () => {
    window.location.hash = '#/program/pensioner/moscow/senior-discount'
    render(<App />)

    const memo = screen.getByTestId('print-memo')
    expect(within(memo).getByText('Важные ограничения')).toBeInTheDocument()
    expect(within(memo).getByText(/Красную цену/)).toBeInTheDocument()
  })

  it('сертификат: инструкция сразу, без выбора региона и с горячими линиями', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'У меня уже есть продуктовый сертификат' }))

    expect(await screen.findByText('Как потратить продуктовый сертификат')).toBeInTheDocument()
    expect(screen.queryByText('Где вы живёте?')).not.toBeInTheDocument()
    expect(screen.getByText(/тратить частями/)).toBeInTheDocument()
    expect(screen.getByText(/за одну покупку/)).toBeInTheDocument()
    expect(screen.getByText(/мошенники/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Список магазинов-исключений (PDF)' }),
    ).toHaveAttribute(
      'href',
      'https://5d.5ka.ru/discovery-core/documents/ts5/certificate_restrictions.pdf',
    )
    expect(screen.getByRole('link', { name: /8 800 555-55-05/ })).toHaveAttribute(
      'href',
      'tel:+78005555505',
    )
    expect(screen.getByRole('link', { name: /8 800 200-95-55/ })).toHaveAttribute(
      'href',
      'tel:+78002009555',
    )
    expect(window.location.hash).toBe('#/certificate')
  })

  it('экран сертификата не скрывается при печати', () => {
    window.location.hash = '#/certificate'
    render(<App />)

    const heading = screen.getByRole('heading', { name: 'Как потратить продуктовый сертификат' })
    const section = heading.closest('section')!
    expect(section.classList.contains('screen--printable')).toBe(true)
  })

  it('чек критериев «Праздника»: «Нет» даёт объяснение и путь к «Корзине»', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/program/family/moscow/prazdnik'
    render(<App />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Проверьте за 10 секунд, подойдёт ли заявка')).toBeInTheDocument()
    expect(screen.getByText(/никуда не отправляются и не сохраняются/)).toBeInTheDocument()
    expect(
      screen.getByRole('group', {
        name: 'Есть ли в семье ребёнок от 3 до 17 лет включительно?',
      }),
    ).toBeInTheDocument()
    const firstRow = screen
      .getByText('Есть ли в семье ребёнок от 3 до 17 лет включительно?')
      .closest('.check-row') as HTMLElement
    await user.click(within(firstRow).getByRole('button', { name: 'Нет' }))

    const visibleReason = screen
      .getAllByText(/Для этой заявки не подходит — посмотрите программы без возрастного ценза/)
      .find((element) => !element.closest('[role="status"]'))
    expect(visibleReason).toBeDefined()
    expect(screen.getByRole('status')).toHaveTextContent(/Для этой заявки не подходит/)
    await user.click(screen.getByRole('button', { name: 'Корзина доброты' }))
    expect(window.location.hash).toBe('#/program/family/moscow/korzina')
    expect(await screen.findByRole('button', { name: 'Распечатать памятку' })).toBeInTheDocument()
    expect(document.querySelector('.screen h1')?.textContent).toBe('Корзина доброты')
  })

  it('чек критериев «Праздника»: три «Да» — можно заполнять заявку', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/program/family/moscow/prazdnik'
    render(<App />)

    const rows = document.querySelectorAll('.check-row')
    for (const row of rows) {
      await user.click(within(row as HTMLElement).getByRole('button', { name: 'Да' }))
    }
    const visibleVerdict = screen
      .getAllByText(/По основным критериям подходите/)
      .find((element) => !element.closest('[role="status"]'))
    expect(visibleVerdict).toBeDefined()
    expect(screen.getByRole('status')).toHaveTextContent(/По основным критериям подходите/)
    expect(screen.queryByRole('button', { name: 'Корзина доброты' })).not.toBeInTheDocument()
  })

  it('блок проверенных организаций появляется с переданным реестром', () => {
    const fixture = [
      {
        id: 'test-org',
        name: 'Тестовая организация (фикстура, не реальная)',
        regionId: 'moscow',
        city: 'Москва',
        programs: ['korzina'],
        phone: '8 800 000-00-00',
        acceptingRequests: true,
        verifiedAt: '2026-11-27',
      },
    ]
    render(
      <ResultScreen
        situation={findSituation('pensioner')!}
        region={findRegion('moscow')!}
        onBack={() => {}}
        onOpenProgram={() => {}}
        partners={fixture}
      />,
    )
    expect(screen.getByText('Проверенные организации в вашем регионе')).toBeInTheDocument()
    expect(
      screen.getByText('Тестовая организация (фикстура, не реальная)'),
    ).toBeInTheDocument()
  })

  it('блок организаций есть и на экране программы с реестром', () => {
    const fixture = [
      {
        id: 'test-org',
        name: 'Тестовая организация (фикстура, не реальная)',
        regionId: 'moscow',
        city: 'Москва',
        programs: ['korzina'],
        acceptingRequests: true,
        verifiedAt: '2026-11-27',
      },
    ]
    render(
      <ProgramScreen
        program={findProgram('korzina')!}
        situation={findSituation('pensioner')!}
        region={findRegion('moscow')!}
        onBack={() => {}}
        partners={fixture}
      />,
    )
    expect(screen.getByText('Проверенные организации в вашем регионе')).toBeInTheDocument()
  })

  it('без реестра блок организаций не выводится', () => {
    render(
      <ResultScreen
        situation={findSituation('pensioner')!}
        region={findRegion('moscow')!}
        onBack={() => {}}
        onOpenProgram={() => {}}
      />,
    )
    expect(
      screen.queryByText('Проверенные организации в вашем регионе'),
    ).not.toBeInTheDocument()
  })
})
