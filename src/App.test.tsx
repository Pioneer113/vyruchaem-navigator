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
    expect(screen.getByRole('button', { name: 'Я одинокий пенсионер' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Мне нечего есть прямо сейчас' })).toBeInTheDocument()
  })

  it('ведёт от ситуации к карточкам программ и деталям', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я одинокий пенсионер' }))
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

  it('для срочной ситуации показывает маршруты «сегодня»', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Мне нечего есть прямо сейчас' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))

    expect(await screen.findByText('Если еды нет совсем')).toBeInTheDocument()
    expect(screen.getByText('112')).toBeInTheDocument()
    expect(screen.getByText(/не выдаёт еду в день обращения/)).toBeInTheDocument()
  })

  it('показывает другие маршруты под карточками программ', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я одинокий пенсионер' }))
    await user.click(await screen.findByRole('button', { name: /Москва/ }))

    expect(await screen.findByText('Другие маршруты')).toBeInTheDocument()
    expect(screen.getByText('Банк еды «Русь»')).toBeInTheDocument()
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

    await user.click(screen.getByRole('button', { name: 'Я одинокий пенсионер' }))
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
})
