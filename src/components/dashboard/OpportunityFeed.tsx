'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Card, Button, Input, Select, Badge, Avatar, Dropdown, Sheet } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  ComputerDesktopIcon,
  HomeIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { 
  type Opportunity, 
  type OpportunityType, 
  type ContractType, 
  type WorkModality,
  OPPORTUNITY_TYPE_LABELS,
  CONTRACT_TYPE_LABELS,
  WORK_MODALITY_LABELS,
} from '@/types'
import { cn, formatSalary, formatRelativeTime } from '@/lib/utils'

const STATES = [
  { value: '', label: 'Todos os estados' },
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' }, { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' }, { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' },
]

const CONTRACT_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'clt', label: 'CLT' },
  { value: 'pj', label: 'PJ' },
  { value: 'internship', label: 'Estágio' },
  { value: 'trainee', label: 'Trainee' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'gig', label: 'Bico/Serviço Rápido' },
]

const MODALITY_OPTIONS = [
  { value: '', label: 'Todas as modalidades' },
  { value: 'remote', label: 'Remoto' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'onsite', label: 'Presencial' },
]

interface FilterState {
  search: string
  type: OpportunityType | ''
  contract_type: ContractType | ''
  work_modality: WorkModality | ''
  location_city: string
  location_state: string
  salary_min: number | ''
  is_affirmative_action: boolean
}

export function OpportunityFeed() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    type: (searchParams.get('tab') as OpportunityType) || '',
    contract_type: '',
    work_modality: '',
    location_city: '',
    location_state: '',
    salary_min: '',
    is_affirmative_action: false,
  })

  useEffect(() => {
    const tab = searchParams.get('tab')
    const search = searchParams.get('search')
    setFilters(prev => ({
      ...prev,
      type: (tab as OpportunityType) || '',
      search: search || '',
    }))
  }, [searchParams])

  const fetchOpportunities = useCallback(async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    try {
      const limit = 10
      const from = pageNum * limit
      const to = from + limit - 1

      let query = supabase
        .from('opportunities')
        .select(`
          *,
          company:profiles!opportunities_author_id_fkey (
            social_name,
            avatar_url,
            verification_status
          ),
          skills:opportunity_skills (skill_name)
        `)
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,requirements.ilike.%${filters.search}%`)
      }
      // src/types/supabase.ts is stale relative to the migrations, whose enums match these app values.
      if (filters.type) {
        query = query.eq('type', filters.type as never)
      }
      if (filters.contract_type) {
        query = query.eq('contract', filters.contract_type as never)
      }
      if (filters.work_modality) {
        query = query.eq('mode', filters.work_modality as never)
      }
      if (filters.location_city) {
        query = query.ilike('city', `%${filters.location_city}%`)
      }
      if (filters.location_state) {
        query = query.eq('state', filters.location_state)
      }
      if (filters.salary_min && typeof filters.salary_min === 'number') {
        query = query.gte('price_max', filters.salary_min)
      }
      if (filters.is_affirmative_action) {
        query = query.eq('is_affirmative', true)
      }

      const { data, error } = await query

      if (error) throw error

      const rawData = (data as any[]) || []
      const formattedData: Opportunity[] = rawData.map(opp => ({
        ...opp,
        company_social_name: opp.company?.social_name,
        company_avatar_url: opp.company?.avatar_url,
        company_verification_status: opp.company?.verification_status,
        skills: opp.skills?.map((s: any) => s.skill_name) || [],
      }))

      if (append) {
        setOpportunities(prev => [...prev, ...formattedData])
      } else {
        setOpportunities(formattedData)
      }

      setHasMore(formattedData.length === limit)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      toastHelpers.error('Erro ao carregar oportunidades')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, supabase])

  useEffect(() => {
    fetchOpportunities(0, false)
  }, [filters, fetchOpportunities])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    if (key === 'type' || key === 'search') {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key === 'type' ? 'tab' : 'search', value)
      else params.delete(key === 'type' ? 'tab' : 'search')
      router.push(`/dashboard?${params.toString()}`, { scroll: false })
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      contract_type: '',
      work_modality: '',
      location_city: '',
      location_state: '',
      salary_min: '',
      is_affirmative_action: false,
    })
    router.push('/dashboard', { scroll: false })
  }

  const hasActiveFilters = filters.type || filters.contract_type || filters.work_modality || 
    filters.location_city || filters.location_state || filters.salary_min || filters.is_affirmative_action

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOpportunities(page + 1, true)
    }
  }

  const handleApply = async (opportunityId: string) => {
    if (!user) {
      router.push('/login?redirect=/dashboard')
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          applicant_id: user.id,
        })

      if (error) {
        if (error.code === '23505') {
          toastHelpers.warning('Você já se candidatou a esta oportunidade')
        } else {
          throw error
        }
      } else {
        toastHelpers.success('Candidatura enviada com sucesso! 🎉')
        setOpportunities(prev => prev.map(opp => 
          opp.id === opportunityId ? { ...opp, has_applied: true, applications_count: (opp.applications_count || 0) + 1 } : opp
        ))
      }
    } catch (error) {
      toastHelpers.error('Erro ao enviar candidatura')
    }
  }

  const renderOpportunityCard = (opp: any) => (
    <Card variant="outlined" padding="md" hover className="relative">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant={(opp as any).is_affirmative ? 'pride' : 'outline'} size="sm">
          {(opp as any).is_affirmative ? '✊ Vaga Afirmativa' : OPPORTUNITY_TYPE_LABELS[opp.type as OpportunityType]}
        </Badge>
        <Badge variant="outline" size="sm">{CONTRACT_TYPE_LABELS[(opp as any).contract as ContractType]}</Badge>
        <Badge variant="outline" size="sm">{WORK_MODALITY_LABELS[(opp as any).mode as WorkModality]}</Badge>
        {(opp as any).is_affirmative && <Badge variant="pride" size="sm">Diversidade</Badge>}
      </div>

      <div className="flex items-start gap-3 mb-3">
        <Avatar 
          src={opp.company_avatar_url} 
          name={opp.company_social_name || 'Empresa'} 
          size="md" 
          verificationStatus={opp.company_verification_status as any}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{opp.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {opp.company_social_name && (
              <>
                <BuildingOfficeIcon className="h-4 w-4" />
                <span>{opp.company_social_name}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {opp.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        {opp.city && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            {opp.city}{opp.state && `, ${opp.state}`}
          </span>
        )}
        {(opp.price_min || opp.price_max) && (
          <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
            {formatSalary(opp.price_min, opp.price_max)}
            {opp.is_salary_negotiable && <span className="text-xs text-primary-600 dark:text-primary-400">(negociável)</span>}
          </span>
        )}
        <span className="flex items-center gap-1">
          <SparklesIcon className="h-4 w-4" />
          {formatRelativeTime(opp.created_at)}
        </span>
      </div>

      {opp.skills && opp.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {opp.skills.slice(0, 5).map((skill: string) => (
            <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
          ))}
          {opp.skills.length > 5 && <Badge variant="outline" size="sm">+{opp.skills.length - 5}</Badge>}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{opp.views_count || 0} visualizações</span>
          <span>•</span>
          <span>{opp.applications_count || 0} candidaturas</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleApply(opp.id)}
            disabled={opp.has_applied}
          >
            {opp.has_applied ? (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Candidatada
              </>
            ) : (
              'Candidatar-se'
            )}
          </Button>
          <Button variant="outline" size="sm">Salvar</Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {filters.type ? OPPORTUNITY_TYPE_LABELS[filters.type as OpportunityType] : 'Todas as Oportunidades'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {opportunities.length} oportunidade{opportunities.length !== 1 ? 's' : ''} encontrada{opportunities.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1" role="tablist">
          {(['', 'formal', 'freelance', 'gig'] as const).map(type => (
            <button
              key={type || 'all'}
              role="tab"
              aria-selected={filters.type === type || (!type && !filters.type)}
              onClick={() => handleFilterChange('type', type)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filters.type === type || (!type && !filters.type)
                  ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {type ? OPPORTUNITY_TYPE_LABELS[type as OpportunityType] : 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Buscar por título, empresa, skills..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Buscar oportunidades"
          />
        </div>

        {/* Filters Button */}
        <div className="flex items-center gap-2">
          <Button
            variant={hasActiveFilters ? 'primary' : 'outline'}
            onClick={() => setMobileFiltersOpen(true)}
            className="sm:hidden"
            leftIcon={<FunnelIcon className="h-5 w-5" />}
          >
            Filtros {hasActiveFilters && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">!</span>}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="hidden sm:flex"
            leftIcon={<FunnelIcon className="h-5 w-5" />}
          >
            Filtros {hasActiveFilters && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">!</span>}
          </Button>
        </div>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block lg:absolute lg:left-0 lg:top-20 lg:w-64 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:sticky">
        <Card variant="outlined" padding="md" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <XMarkIcon className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Contrato</label>
              <Select
                options={CONTRACT_OPTIONS}
                value={filters.contract_type}
                onChange={(value) => handleFilterChange('contract_type', value as unknown as ContractType)}
                placeholder="Todos os tipos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modalidade</label>
              <Select
                options={MODALITY_OPTIONS}
                value={filters.work_modality}
                onChange={(value) => handleFilterChange('work_modality', value as unknown as WorkModality)}
                placeholder="Todas as modalidades"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
              <Input
                value={filters.location_city}
                onChange={(e) => handleFilterChange('location_city', e.target.value)}
                placeholder="São Paulo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <Select
                options={STATES}
                value={filters.location_state}
                onChange={(value) => handleFilterChange('location_state', value)}
                placeholder="Todos os estados"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salário Mínimo (R$)</label>
              <Input
                type="number"
                value={filters.salary_min === '' ? '' : filters.salary_min}
                onChange={(e) => handleFilterChange('salary_min', e.target.value ? parseInt(e.target.value) * 100 : '')}
                placeholder="Ex: 5000"
                step="100"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={filters.is_affirmative_action}
                onChange={(e) => handleFilterChange('is_affirmative_action', e.target.checked)}
                className="mt-0.5 h-5 w-5 text-primary-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                id="affirmative-filter"
              />
              <label htmlFor="affirmative-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Apenas vagas afirmativas
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Opportunities List */}
      <div className="lg:ml-72">
        {loading ? (
          <div className="space-y-4" role="status" aria-label="Carregando oportunidades">
            {[1, 2, 3].map(i => (
              <Card key={i} variant="outlined" padding="md" className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <Card variant="outlined" padding="lg" className="text-center">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma oportunidade encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tente ajustar seus filtros ou buscar por outros termos
            </p>
            <Button variant="outline" onClick={clearFilters}>Limpar filtros</Button>
          </Card>
        ) : (
          <>
            <div className="space-y-4" role="list" aria-label="Lista de oportunidades">
              {opportunities.map(opp => (
                <div key={opp.id} role="listitem">
                  {renderOpportunityCard(opp)}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  isLoading={loadingMore}
                  className="w-full sm:w-auto"
                >
                  Carregar mais oportunidades
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filtros"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Contrato</label>
            <Select
              options={CONTRACT_OPTIONS}
              value={filters.contract_type}
              onChange={(value) => handleFilterChange('contract_type', value as unknown as ContractType)}
              placeholder="Todos os tipos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modalidade</label>
            <Select
              options={MODALITY_OPTIONS}
              value={filters.work_modality}
              onChange={(value) => handleFilterChange('work_modality', value as unknown as WorkModality)}
              placeholder="Todas as modalidades"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
            <Input
              value={filters.location_city}
              onChange={(e) => handleFilterChange('location_city', e.target.value)}
              placeholder="São Paulo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
            <Select
              options={STATES}
              value={filters.location_state}
              onChange={(value) => handleFilterChange('location_state', value)}
              placeholder="Todos os estados"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salário Mínimo (R$)</label>
            <Input
              type="number"
              value={filters.salary_min === '' ? '' : filters.salary_min}
              onChange={(e) => handleFilterChange('salary_min', e.target.value ? parseInt(e.target.value) * 100 : '')}
              placeholder="Ex: 5000"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={filters.is_affirmative_action}
              onChange={(e) => handleFilterChange('is_affirmative_action', e.target.checked)}
              className="mt-0.5 h-5 w-5 text-primary-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              id="affirmative-filter-mobile"
            />
            <label htmlFor="affirmative-filter-mobile" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Apenas vagas afirmativas
            </label>
          </div>

          {hasActiveFilters && (
            <Button variant="destructive" className="w-full" onClick={clearFilters}>
              Limpar todos os filtros
            </Button>
          )}
        </div>
      </Sheet>
    </div>
  )
}
