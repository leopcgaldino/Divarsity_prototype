'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import { SparklesIcon, DocumentTextIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button, Input, Textarea, Select, Card } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export default function CopilotPage() {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover' | 'interview' | 'pricing'>('resume')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  // Resume Builder State
  const [resumeData, setResumeData] = useState({
    targetRole: '',
    experience: '',
    skills: '',
    achievements: '',
  })

  // Cover Letter State
  const [coverLetterData, setCoverLetterData] = useState({
    companyName: '',
    positionName: '',
    whyInterested: '',
    keyQualifications: '',
  })

  // Interview Sim State
  const [interviewData, setInterviewData] = useState({
    role: '',
    level: 'mid' as 'junior' | 'mid' | 'senior' | 'expert',
    questions: [] as string[],
    currentQuestion: 0,
    answers: [] as string[],
  })

  // Pricing Advisor State
  const [pricingData, setPricingData] = useState({
    serviceType: 'freelance' as 'freelance' | 'consulting' | 'consulting_business',
    experience: 'mid' as 'junior' | 'mid' | 'senior' | 'expert',
    hoursPerWeek: 20,
    skills: '',
    location: 'São Paulo, SP',
  })

  const handleGenerate = async (type: string) => {
    setIsLoading(true)
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let content = ''
      switch (type) {
        case 'resume':
          content = generateResumeContent()
          break
        case 'cover':
          content = generateCoverLetterContent()
          break
        case 'interview':
          content = generateInterviewQuestions()
          break
        case 'pricing':
          content = generatePricingAdvice()
          break
      }
      setGeneratedContent(content)
      toastHelpers.success('Conteúdo gerado com sucesso! ✨')
    } catch (error) {
      toastHelpers.error('Erro ao gerar conteúdo. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateResumeContent = () => {
    const { targetRole, experience, skills, achievements } = resumeData
    return `# Currículo Otimizado para ${targetRole}

## Resumo Profissional
Profissional experiente com sólida experiência em ${experience}. Especialista em ${skills}, com histórico comprovado de ${achievements}. Buscando oportunidade como ${targetRole} para aplicar conhecimentos e gerar impacto positivo.

## Experiência Profissional
### Cargo Atual
**Empresa** | ${new Date().getFullYear()} - Presente
- Liderança de projetos de ${skills}
- Melhoria de ${achievements}
- Colaboração cross-functional

### Cargo Anterior
**Empresa Anterior** | ${parseInt(new Date().getFullYear().toString()) - 2} - ${parseInt(new Date().getFullYear().toString()) - 1}
- Desenvolvimento de ${skills}
- Otimização de processos

## Habilidades Técnicas
${skills.split(',').map(s => `- ${s.trim()}`).join('\n')}

## Conquistas Principais
${achievements.split('.').filter(a => a.trim()).map(a => `- ${a.trim()}`).join('\n')}

## Formação
- Formação relevante para ${targetRole}
- Certificações relevantes

---
*Gerado pelo Copiloto IA Divarsity - Personalize conforme sua experiência real*`
  }

  const generateCoverLetterContent = () => {
    const { companyName, positionName, whyInterested, keyQualifications } = coverLetterData
    return `# Carta de Apresentação para ${positionName} na ${companyName}

Prezado(a) Recrutador(a),

Escrevo para expressar meu forte interesse na posição de **${positionName}** na **${companyName}**. ${whyInterested}

Ao longo da minha carreira, desenvolvi expertise em ${keyQualifications}, o que me permite contribuir imediatamente para os objetivos da ${companyName}. Minha experiência inclui:

- Desenvolvimento de soluções escaláveis e eficientes
- Liderança técnica e mentoria de equipes
- Entrega de projetos complexos dentro de prazos e orçamento
- Colaboração efetiva com stakeholders diversos

Estou entusiasmado(a) com a possibilidade de contribuir para o sucesso da ${companyName} e gostaria de ter a oportunidade de discutir como minha experiência pode agregar valor à sua equipe.

Agradeço a consideração e aguardo a oportunidade de conversar mais sobre como posso contribuir para o sucesso da ${companyName}.

Atenciosamente,

[Seu Nome]
[Seu Telefone]
[Seu Email]
[LinkedIn/Portfolio]`
  }

  const generateInterviewQuestions = () => {
    const { role, level } = interviewData
    const questions = [
      `Conte-me sobre sua experiência mais relevante para a posição de ${role}.`,
      `Descreva um desafio técnico complexo que você resolveu recentemente.`,
      `Como você lida com prazos apertados e prioridades conflitantes?`,
      `Descreva uma situação onde você teve que aprender uma nova tecnologia rapidamente.`,
      `Como você garante a qualidade do seu código?`,
      `Conte sobre uma vez que você discordou de uma decisão técnica da equipe. Como resolveu?`,
      `Como você se mantém atualizado com as novas tecnologias?`,
      `Descreva um projeto do qual você se orgulha e por quê.`,
      `Como você lida com feedback negativo?`,
      `Onde você se vê daqui a 5 anos?`
    ]

    return `# Simulador de Entrevista para ${interviewData.role} (${interviewData.level})

## Perguntas Comportamentais e Técnicas

${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

---

## Dicas para a Entrevista

### Método STAR
Use o método **STAR** para estruturar suas respostas comportamentais:
- **S**ituation (Situação): Contextualize brevemente
- **T**ask (Tarefa): Qual era seu objetivo
- **A**ction (Ação): O que você fez especificamente
- **R**esult (Resultado): Qual foi o resultado mensurável

### Dicas por Nível (${interviewData.level})
${interviewData.level === 'junior' ? `
- Foque em potencial de aprendizado e vontade de crescer
- Destaque projetos acadêmicos e pessoais
- Mostre entusiasmo e curiosidade técnica
` : interviewData.level === 'mid' ? `
- Equilibre experiência técnica com soft skills
- Demonstre autonomia e capacidade de mentoria
- Foque em entregas concretas e métricas
` : `
- Foque em liderança técnica e estratégia
- Demonstre visão de arquitetura e escalabilidade
- Mostre experiência em gestão de stakeholders
`}

### Perguntas para o Entrevistador
Prepare 2-3 perguntas para o final:
1. "Quais são os maiores desafios técnicos da equipe atualmente?"
2. "Como é o processo de code review e deploy?"
3. "Como a empresa apoia o desenvolvimento profissional?"
4. "Como é a cultura de feedback e code review?"

---

*Simulado pelo Copiloto IA Divarsity - Pratique quantas vezes quiser!*`
  }

  const generatePricingAdvice = () => {
    const { serviceType, experience, hoursPerWeek, skills, location } = pricingData
    const baseRates = {
      freelance: { junior: 80, mid: 150, senior: 300, expert: 500 },
      consulting: { junior: 120, mid: 250, senior: 500, expert: 800 },
      consulting_business: { junior: 200, mid: 400, senior: 800, expert: 1500 },
    }
    
    const rates = baseRates[serviceType as keyof typeof baseRates] || baseRates.freelance
    const baseRate = rates[experience as keyof typeof rates] || rates.mid
    const weeklyHours = hoursPerWeek
    const monthlyHours = weeklyHours * 4.33
    const monthlyIncome = baseRate * monthlyHours
    const annualIncome = monthlyIncome * 12
    
    const locationMultipliers: Record<string, number> = {
      'São Paulo, SP': 1.25, 'Rio de Janeiro, RJ': 1.20, 'Brasília, DF': 1.15,
      'Belo Horizonte, MG': 1.05, 'Porto Alegre, RS': 1.05, 'Curitiba, PR': 1.05,
      'Florianópolis, SC': 1.15, 'Recife, PE': 0.95, 'Fortaleza, CE': 0.95,
      'Salvador, BA': 0.95, 'Goiânia, GO': 0.95, 'Outro': 1.0
    }
    
    const locationMultiplier = locationMultipliers[location] || 1.0
    const adjustedRate = Math.round(baseRate * locationMultiplier)
    const adjustedMonthly = adjustedRate * monthlyHours
    const adjustedAnnual = adjustedMonthly * 12

    return `# Calculadora de Precificação - ${serviceType === 'freelance' ? 'Freelance' : serviceType === 'consulting' ? 'Consultoria' : 'Consultoria Empresarial'}

## Análise de Precificação

### Perfil
- **Tipo de Serviço:** ${serviceType === 'freelance' ? 'Freelance/Projetos' : serviceType === 'consulting' ? 'Consultoria Técnica' : 'Consultoria Empresarial'}
- **Nível de Experiência:** ${experience === 'junior' ? 'Júnior (0-2 anos)' : experience === 'mid' ? 'Pleno (2-5 anos)' : experience === 'senior' ? 'Sênior (5-10 anos)' : 'Especialista (10+ anos)'}
- **Horas/Semana:** ${hoursPerWeek}h
- **Localização:** ${location}
- **Skills Principais:** ${pricingData.skills || 'Não especificado'}

---

## Precificação Sugerida

### Taxa Horária Base: **R$ ${baseRate.toLocaleString('pt-BR')}/h**
### Taxa Ajustada (${location}): **R$ ${adjustedRate.toLocaleString('pt-BR')}/h**

### Projeção de Renda

| Periodicidade | Horas | Valor Base | Valor Ajustado |
|---------------|-------|------------|----------------|
| **Semanal** | ${hoursPerWeek}h | R$ ${(baseRate * hoursPerWeek).toLocaleString('pt-BR')} | R$ ${(adjustedRate * hoursPerWeek).toLocaleString('pt-BR')} |
| **Mensal** | ${Math.round(monthlyHours)}h | R$ ${(baseRate * monthlyHours).toLocaleString('pt-BR')} | R$ ${(adjustedRate * monthlyHours).toLocaleString('pt-BR')} |
| **Anual** | ${Math.round(monthlyHours * 12)}h | R$ ${(baseRate * monthlyHours * 12).toLocaleString('pt-BR')} | R$ ${(adjustedRate * monthlyHours * 12).toLocaleString('pt-BR')} |

---

## Análise de Mercado

### Multiplicador de Localização: **${locationMultiplier}x**
${location === 'São Paulo, SP' ? 'São Paulo tem o maior mercado e maior custo de vida.' : location === 'Rio de Janeiro, RJ' ? 'Rio tem mercado forte, especialmente em óleo/gás e tech.' : location === 'Brasília, DF' ? 'Brasília tem mercado público forte e bom custo/benefício.' : 'Outras localidades têm multiplicador padrão.'}

### Benchmark de Mercado (${pricingData.skills || 'Tech Geral'})
- **Júnior:** R$ 60-120/h
- **Pleno:** R$ 120-250/h
- **Sênior:** R$ 250-500/h
- **Especialista:** R$ 500+/h

---

## Recomendações

### ✅ Faça
- Comece na faixa sugerida e ajuste conforme demanda
- Cobrança por projeto fixo para escopo bem definido
- Contrato claro com escopo, prazos e revisões
- Adicione 20-30% para imprevistos em projetos fixos

### ❌ Evite
- Cobrar por hora em projetos de longo prazo sem teto
- Aceitar abaixo do piso de mercado
- Trabalhar sem contrato assinado
- Não cobrar por reuniões e alinhamentos

---

## Próximos Passos

1. **Defina seu pacote** (horas, entregas, prazos)
2. **Crie proposta comercial** profissional
3. **Configure contratos** com cláusulas claras
4. **Defina processo de onboarding** para novos clientes
5. **Estabeleça rotina de faturamento** (semanal/quinzenal/mensal)

---

*Calculadora Divarsity - Baseada em dados de mercado brasileiro 2024. Valores de referência, ajuste conforme sua realidade.*`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    toastHelpers.success('Copiado para a área de transferência! 📋')
  }

  const clearContent = () => {
    setGeneratedContent('')
  }

  const tabs = [
    { id: 'resume', label: 'Currículo', icon: DocumentTextIcon },
    { id: 'cover', label: 'Carta de Apresentação', icon: DocumentTextIcon },
    { id: 'interview', label: 'Simulador Entrevista', icon: PencilIcon },
    { id: 'pricing', label: 'Precificação', icon: TrashIcon },
  ] as const

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <SparklesIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            Copiloto de Carreira IA
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Seu assistente inteligente para impulsionar sua carreira</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-1" role="tablist" aria-label="Ferramentas do Copiloto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <tab.icon className="h-5 w-5" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Cargo Alvo"
                  value={resumeData.targetRole}
                  onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                  placeholder="Ex: Desenvolvedora Full Stack Sênior"
                />
                <Select
                  label="Nível de Experiência"
                  options={[
                    { value: 'junior', label: 'Júnior (0-2 anos)' },
                    { value: 'mid', label: 'Pleno (2-5 anos)' },
                    { value: 'senior', label: 'Sênior (5-10 anos)' },
                    { value: 'expert', label: 'Especialista (10+ anos)' },
                  ]}
                  value={resumeData.experience}
                  onChange={(value) => setResumeData({ ...resumeData, experience: value })}
                  placeholder="Selecione..."
                />
              </div>
              <Input
                label="Skills Principais"
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                placeholder="React, Node.js, TypeScript, PostgreSQL, AWS..."
              />
              <Textarea
                label="Principais Conquistas"
                value={resumeData.achievements}
                onChange={(e) => setResumeData({ ...resumeData, achievements: e.target.value })}
                placeholder="Ex: Liderou migração para microsserviços reduzindo latência em 60%. Liderou equipe de 5 devs..."
                rows={3}
              />
              <Button onClick={() => handleGenerate('resume')} isLoading={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Gerando...' : 'Gerar Currículo'}
              </Button>
            </div>
          )}

          {/* Cover Letter Tab */}
          {activeTab === 'cover' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome da Empresa"
                  value={coverLetterData.companyName}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, companyName: e.target.value })}
                  placeholder="Ex: Divarsity"
                />
                <Input
                  label="Nome da Vaga"
                  value={coverLetterData.positionName}
                  onChange={(e) => setCoverLetterData({ ...coverLetterData, positionName: e.target.value })}
                  placeholder="Ex: Desenvolvedora Full Stack Sênior"
                />
              </div>
              <Textarea
                label="Por que tem interesse?"
                value={coverLetterData.whyInterested}
                onChange={(e) => setCoverLetterData({ ...coverLetterData, whyInterested: e.target.value })}
                placeholder="Explique por que quer trabalhar nessa empresa e nessa vaga..."
                rows={3}
              />
              <Textarea
                label="Principais Qualificações"
                value={coverLetterData.keyQualifications}
                onChange={(e) => setCoverLetterData({ ...coverLetterData, keyQualifications: e.target.value })}
                placeholder="Liste suas principais qualificações para esta vaga..."
                rows={3}
              />
              <Button onClick={() => handleGenerate('cover')} isLoading={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Gerando...' : 'Gerar Carta'}
              </Button>
            </div>
          )}

          {/* Interview Tab */}
          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Cargo Alvo"
                  value={interviewData.role}
                  onChange={(e) => setInterviewData({ ...interviewData, role: e.target.value })}
                  placeholder="Ex: Desenvolvedora Full Stack"
                />
                <Select
                  label="Nível"
                  options={[
                    { value: 'junior', label: 'Júnior (0-2 anos)' },
                    { value: 'mid', label: 'Pleno (2-5 anos)' },
                    { value: 'senior', label: 'Sênior (5-10 anos)' },
                    { value: 'expert', label: 'Especialista (10+ anos)' },
                  ]}
                  value={interviewData.level}
                  onChange={(value) => setInterviewData({ ...interviewData, level: value as 'junior' | 'mid' | 'senior' | 'expert' })}
                  placeholder="Selecione..."
                />
              </div>
              <Button onClick={() => handleGenerate('interview')} isLoading={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Gerando...' : 'Gerar Perguntas de Entrevista'}
              </Button>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Tipo de Serviço"
                  options={[
                    { value: 'freelance', label: 'Freelance/Projetos' },
                    { value: 'consulting', label: 'Consultoria Técnica' },
                    { value: 'consulting_business', label: 'Consultoria Empresarial' },
                  ]}
                  value={pricingData.serviceType}
                  onChange={(value) => setPricingData({ ...pricingData, serviceType: value as 'freelance' | 'consulting' | 'consulting_business' })}
                  placeholder="Selecione..."
                />
                <Select
                  label="Experiência"
                  options={[
                    { value: 'junior', label: 'Júnior (0-2 anos)' },
                    { value: 'mid', label: 'Pleno (2-5 anos)' },
                    { value: 'senior', label: 'Sênior (5-10 anos)' },
                    { value: 'expert', label: 'Especialista (10+ anos)' },
                  ]}
                  value={pricingData.experience}
                  onChange={(value) => setPricingData({ ...pricingData, experience: value as 'junior' | 'mid' | 'senior' | 'expert' })}
                  placeholder="Selecione..."
                />
                <Input
                  label="Horas/Semana"
                  type="number"
                  value={pricingData.hoursPerWeek}
                  onChange={(e) => setPricingData({ ...pricingData, hoursPerWeek: parseInt(e.target.value) || 0 })}
                  placeholder="20"
                />
                <Select
                  label="Localização"
                  options={[
                    { value: 'São Paulo, SP', label: 'São Paulo, SP (1.25x)' },
                    { value: 'Rio de Janeiro, RJ', label: 'Rio de Janeiro, RJ (1.20x)' },
                    { value: 'Brasília, DF', label: 'Brasília, DF (1.15x)' },
                    { value: 'Belo Horizonte, MG', label: 'Belo Horizonte, MG (1.05x)' },
                    { value: 'Porto Alegre, RS', label: 'Porto Alegre, RS (1.05x)' },
                    { value: 'Curitiba, PR', label: 'Curitiba, PR (1.05x)' },
                    { value: 'Florianópolis, SC', label: 'Florianópolis, SC (1.15x)' },
                    { value: 'Recife, PE', label: 'Recife, PE (0.95x)' },
                    { value: 'Fortaleza, CE', label: 'Fortaleza, CE (0.95x)' },
                    { value: 'Salvador, BA', label: 'Salvador, BA (0.95x)' },
                    { value: 'Goiânia, GO', label: 'Goiânia, GO (0.95x)' },
                    { value: 'Outro', label: 'Outro (1.0x)' },
                  ]}
                  value={pricingData.location}
                  onChange={(value) => setPricingData({ ...pricingData, location: value })}
                  placeholder="Selecione..."
                />
              </div>
              <Input
                label="Skills Principais"
                value={pricingData.skills}
                onChange={(e) => setPricingData({ ...pricingData, skills: e.target.value })}
                placeholder="React, Node.js, AWS, Kubernetes..."
              />
              <Button onClick={() => handleGenerate('pricing')} isLoading={isLoading} className="w-full md:w-auto">
                {isLoading ? 'Calculando...' : 'Calcular Precificação'}
              </Button>
            </div>
          )}

          {/* Generated Content Display */}
          {generatedContent && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resultado Gerado</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyToClipboard} size="sm">
                    Copiar
                  </Button>
                  <Button variant="ghost" onClick={clearContent} size="sm">
                    Limpar
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 max-h-96 overflow-y-auto prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}