'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { ProfileView } from '@/components/profile/ProfileView'
import { ProfileEdit } from '@/components/profile/ProfileEdit'
import { MainLayout } from '@/components/layout/MainLayout'
import { toastHelpers } from '@/components/ui/Toast'
import { 
  type Profile, 
  type Experience, 
  type Education, 
  type ProfileSkill,
  type Pronoun,
  type GenderIdentity,
  type SexualOrientation,
  type AvailabilityType,
  PRONOUN_LABELS,
  GENDER_IDENTITY_LABELS,
  SEXUAL_ORIENTATION_LABELS,
  AVAILABILITY_LABELS,
  VERIFICATION_STATUS_LABELS,
} from '@/types'
import { cn } from '@/lib/utils'

// Type for profile fields that can be updated - using Record to satisfy Supabase strict typing
type ProfileUpdate = Record<string, any>

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const supabaseUntyped = createUntypedClient()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile')
    }
  }, [user, authLoading, router])

  // Redirect to onboarding if profile doesn't exist
  useEffect(() => {
    if (!authLoading && user && !profile) {
      router.push('/onboarding')
    }
  }, [user, profile, authLoading, router])

  const handleSave = async (updatedData: Partial<ProfileUpdate>) => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabaseUntyped
        .from('profiles')
        .update(updatedData)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      toastHelpers.success('Perfil atualizado com sucesso! 💜')
      await refreshProfile()
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      toastHelpers.error('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddExperience = async (experience: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return
    
    try {
      const { error } = await supabaseUntyped
        .from('experiences')
        .insert({ ...experience, profile_id: user.id })
      
      if (error) throw error
      
      toastHelpers.success('Experiência adicionada!')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao adicionar experiência')
    }
  }

  const handleUpdateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      const { error } = await supabaseUntyped
        .from('experiences')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      toastHelpers.success('Experiência atualizada!')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao atualizar experiência')
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta experiência?')) return
    
    try {
      const { error } = await supabaseUntyped
        .from('experiences')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toastHelpers.success('Experiência removida')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao remover experiência')
    }
  }

  const handleAddEducation = async (education: Omit<Education, 'id' | 'profile_id' | 'created_at'>) => {
    if (!user) return
    
    try {
      const { error } = await supabaseUntyped
        .from('education')
        .insert({ ...education, profile_id: user.id })
      
      if (error) throw error
      
      toastHelpers.success('Formação adicionada!')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao adicionar formação')
    }
  }

  const handleUpdateEducation = async (id: string, updates: Partial<Education>) => {
    try {
      const { error } = await supabaseUntyped
        .from('education')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      toastHelpers.success('Formação atualizada!')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao atualizar formação')
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta formação?')) return
    
    try {
      const { error } = await supabaseUntyped
        .from('education')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toastHelpers.success('Formação removida')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao remover formação')
    }
  }

  const handleUpdateSkills = async (skills: string[]) => {
    if (!user) return
    
    try {
      // Delete existing skills
      await supabaseUntyped.from('profile_skills').delete().eq('profile_id', user.id)
      
      // Insert new skills
      if (skills.length > 0) {
        const skillsData = skills.map((skill, index) => ({
          profile_id: user.id,
          skill_name: skill,
          proficiency_level: 3,
          is_featured: index < 3,
        }))
        const { error } = await supabaseUntyped.from('profile_skills').insert(skillsData)
        if (error) throw error
      }
      
      toastHelpers.success('Skills atualizadas!')
      await refreshProfile()
    } catch (error) {
      toastHelpers.error('Erro ao atualizar skills')
    }
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  if (!user) return null

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Perfil' : 'Meu Perfil'}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {isEditing 
                ? 'Atualize suas informações profissionais e pessoais' 
                : 'Gerencie seu perfil profissional e configurações'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Editar Perfil
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Trigger save from child component
                    window.dispatchEvent(new CustomEvent('profile-save'))
                  }}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? 'edit' : 'view'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isEditing ? (
              <ProfileEdit
                profile={profile!}
                onSave={handleSave}
                onAddExperience={handleAddExperience}
                onUpdateExperience={handleUpdateExperience}
                onDeleteExperience={handleDeleteExperience}
                onAddEducation={handleAddEducation}
                onUpdateEducation={handleUpdateEducation}
                onDeleteEducation={handleDeleteEducation}
                onUpdateSkills={handleUpdateSkills}
              />
            ) : (
              <ProfileView profile={profile!} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}