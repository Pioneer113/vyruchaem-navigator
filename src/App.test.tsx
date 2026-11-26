import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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

  it('ведёт от ситуации к выбору региона и результату', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Я одинокий пенсионер' }))
    expect(await screen.findByText('Где вы живёте?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Москва/ }))
    expect(await screen.findByText('Вам может подойти')).toBeInTheDocument()
    expect(localStorage.getItem('vyruchaem.region')).toBe('moscow')
  })
})
