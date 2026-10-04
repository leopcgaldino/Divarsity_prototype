'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import { UserIcon, LockClosedIcon, EnvelopeIcon, ShieldCheckIcon, DevicePhoneMobileIcon, KeyIcon, TrashIcon, ArrowPathIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button, Input, Checkbox } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function AccountSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'security' | 'email' | 'notifications' | 'devices' | 'danger'>('security')

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    two_factor_method: 'authenticator' as 'authenticator' | 'sms' | 'email',
    login_alerts: true,
    password_changed_recently: false,
  })

  const [emailSettings, setEmailSettings] = useState({
    primary_email: '',
    secondary_email: '',
    email_verified: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: true,
    security_alerts: true,
    weekly_digest: true,
  })

  const [devices, setDevices] = useState<Array<{
    id: string
    name: string
    browser: string
    os: string
    location: string
    last_active: string
    current: boolean
  }>>([
    {
      id: 'current',
      name: 'Dispositivo Atual',
      browser: 'Chrome 119.0',
      os: 'Windows 11',
      location: 'São Paulo, BR',
      last_active: 'Agora',
      current: true
    },
    {
      id: 'device-2',
      name: 'iPhone 15',
      browser: 'Safari 17.1',
      os: 'iOS 17.1',
      location: 'São Paulo, BR',
      last_active: '2 dias atrás',
      current: false
    },
    {
      id: 'device-3',
      name: 'MacBook Pro',
      browser: 'Chrome 119.0',
      os: 'macOS 14.1',
      location: 'São Paulo, BR',
      last_active: '1 semana atrás',
      current: false
    }
  ])

  const tabs = [
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'email', label: 'E-mail', icon: '📧' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'devices', label: 'Dispositivos', icon: '📱' },
    { id: 'danger', label: 'Zona de Perigo', icon: '⚠️' },
  ] as const

  const saveSettings = async (section: string) => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    // toastHelpers.success(`${section} salvo com sucesso! ✨`)
    setSaving(false)
  }

  const removeDevice = (deviceId: string) => {
    if (window.confirm('Tem certeza que deseja remover este dispositivo? Você será desconectado nele.')) {
      // TODO: Implement remove device
    }
  }

  const revokeAllSessions = () => {
    if (window.confirm('Tem certeza? Isso desconectará todos os dispositivos, incluindo este.')) {
      // TODO: Implement revoke all
    }
  }

  const changePassword = async () => {
    // TODO: Open change password modal
  }

  const enable2FA = async () => {
    // TODO: Implement 2FA setup
  }

  const disable2FA = async () => {
    if (window.confirm('Tem certeza que deseja desativar a autenticação de dois fatores?')) {
      // TODO: Disable 2FA
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações da Conta</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie sua segurança, e-mail, notificações e dispositivos</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-1" role="tablist" aria-label="Configurações da conta">
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
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Two-Factor Authentication */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                          <ShieldCheckIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Autenticação de Dois Fatores (2FA)</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {false ? (
                          <Button variant="outline" onClick={disable2FA} className="gap-2">
                            <LockClosedIcon className="h-4 w-4" />
                            Desativar 2FA
                          </Button>
                        ) : (
                          <Button onClick={enable2FA} className="gap-2">
                            <LockClosedIcon className="h-4 w-4" />
                            Ativar 2FA
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      A autenticação de dois fatores adiciona uma camada extra de segurança exigindo um código do seu aplicativo autenticador (Google Authenticator, Authy, etc.) além da senha.
                    </p>
                  </div>

                  {/* Login Alerts */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Login</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receba notificações quando houver login na sua conta de novos dispositivos</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.login_alerts}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, login_alerts: e.target.checked }))}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>
                  </div>

                  {/* Change Password */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Alterar Senha</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Atualize sua senha regularmente para manter sua conta segura</p>
                    </div>
                    <Button variant="outline" onClick={changePassword}>
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>

                  {/* 2FA Setup (if enabled) */}
                  {securitySettings.two_factor_enabled && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 dark:text-green-200">2FA Ativado</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">Método: Aplicativo Autenticador</p>
                          </div>
                        </div>
                        <Button variant="outline" onClick={disable2FA} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Desativar 2FA
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sessions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sessões Ativas</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gerencie dispositivos conectados à sua conta</p>

                  <div className="space-y-3">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <DevicePhoneMobileIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">{device.name}</span>
                              {device.current && <span className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">Atual</span>}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{device.browser} · {device.os}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{device.location} · {device.last_active}</p>
                          </div>
                        </div>
                        {device.current ? null : (
                          <button
                            onClick={() => removeDevice(device.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={revokeAllSessions}
                      className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center justify-center gap-2 py-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Sair de Todas as Sessões
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">E-mail Principal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail Principal</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="email"
                          value={emailSettings.primary_email || user?.email || ''}
                          disabled
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        {emailSettings.email_verified ? (
                          <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1">
                            <ShieldCheckIcon className="h-3 w-3" /> Verificado
                          </span>
                        ) : (
                          <Button variant="outline" size="sm">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            Verificar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail Secundário (Recuperação)</label>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={emailSettings.secondary_email}
                          onChange={(e) => setEmailSettings(prev => ({ ...prev, secondary_email: e.target.value }))}
                          placeholder="e-mail de recuperação"
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <Button variant="outline" size="sm">Salvar</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alterar E-mail Principal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Alterar seu e-mail principal requer verificação no novo endereço.</p>
                  <Button variant="outline" onClick={() => { /* TODO */ }}>
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Alterar E-mail Principal
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <EnvelopeIcon className="h-5 w-5" />
                      E-mail
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email_notifications', label: 'Todas as notificações por e-mail', desc: 'Receber todas as notificações por e-mail' },
                        { key: 'security_alerts', label: 'Alertas de Segurança', desc: 'Alertas de login suspeito, alteração de senha, etc.' },
                        { key: 'weekly_digest', label: 'Resumo Semanal', desc: 'Resumo semanal de atividades e oportunidades' },
                        { key: 'marketing_emails', label: 'Marketing e Novidades', desc: 'Novidades, dicas de carreira e ofertas' },
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <BellIcon className="h-5 w-5" />
                      Push & No App
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'push_notifications', label: 'Notificações Push', desc: 'Receber notificações no navegador/celular' },
                        { key: 'in_app', label: 'Notificações no App', desc: 'Ver notificações dentro da plataforma' },
                      ].map(item => (
                        <label key={item.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Devices Tab */}
            {activeTab === 'devices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                    Dispositivos Conectados
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Gerencie os dispositivos que têm acesso à sua conta</p>
                </div>

                <div className="space-y-3">
                  {devices.map(device => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                          <DevicePhoneMobileIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{device.name}</span>
                            {device.current && <span className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">Atual</span>}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{device.browser} · {device.os}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{device.location} · {device.last_active}</p>
                        </div>
                        {!device.current && (
                          <button
                            onClick={() => removeDevice(device.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={revokeAllSessions}
                    className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center justify-center gap-2 py-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Sair de Todas as Sessões
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="space-y-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                      <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Zona de Perigo</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">Ações irreversíveis que afetam permanentemente sua conta</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Desativar Conta Temporariamente</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Seu perfil ficará oculto, mas você pode reativar a qualquer momento fazendo login novamente.</p>
                        </div>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Desativar Conta
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-red-600 dark:text-red-400">Excluir Conta Permanentemente</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"><strong>IRREVERSÍVEL:</strong> Todos os seus dados, perfil, conexões, mensagens e histórico serão apagados permanentemente. Esta ação não pode ser desfeita.</p>
                        </div>
                        <Button variant="destructive" onClick={() => {
                          if (window.confirm('TEM CERTEZA ABSOLUTA? Esta ação é IRREVERSÍVEL e apagará TODOS os seus dados permanentemente. Digite "EXCLUIR" para confirmar.')) {
                            const confirmText = prompt('Digite "EXCLUIR" para confirmar a exclusão permanente:')
                            if (confirmText === 'EXCLUIR') {
                              // TODO: Implement account deletion
                            }
                          }
                        }}>
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Excluir Conta Permanentemente
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exportar Seus Dados</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Baixe uma cópia de todos os seus dados antes de tomar qualquer decisão drástica.</p>
                      <Button variant="outline" onClick={() => { /* TODO: export data */ }}>
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Baixar Meus Dados
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save buttons for non-danger tabs */}
            {activeTab !== 'danger' && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                <Button variant="outline" onClick={() => { /* reset */ }}>
                  Cancelar
                </Button>
                <Button onClick={() => saveSettings(activeTab)} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}