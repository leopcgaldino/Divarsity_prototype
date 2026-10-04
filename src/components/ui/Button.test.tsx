import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button isLoading>Carregando</Button>)
    expect(screen.getByRole('button', { name: /carregando/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-ink/20')
    expect(button).toHaveClass('text-ink')
  })

  it('applies size classes', () => {
    render(<Button size="sm">Pequeno</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-3.5')
    expect(button).toHaveClass('py-1.5')
    expect(button).toHaveClass('text-sm')
  })
})