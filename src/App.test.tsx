import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

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
    expect(within(scope).getByText(/Проверено 26\.11\.2026/)).toBeInTheDocument()
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
    await user.click(screen.getAllByRole('button', { name: 'Подробнее' })[0])
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
})
