'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xs">D</span>
            </div>
            <span className="font-display font-semibold">Divarsity</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/#sobre" className="hover:text-foreground transition-colors">Sobre</Link>
            <Link href="/#como-funciona" className="hover:text-foreground transition-colors">Como Funciona</Link>
            <Link href="/#contato" className="hover:text-foreground transition-colors">Contato</Link>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-primary fill-primary" /> para todos
          </p>
        </div>
      </div>
      <div className="h-1 pride-gradient w-full" />
    </footer>
  )
}
