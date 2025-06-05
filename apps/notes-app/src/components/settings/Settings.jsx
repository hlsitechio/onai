// Comprehensive Settings Component for ONAI
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'
import { 
  Settings as SettingsIcon,
  Palette,
  Edit,
  Brain,
  Shield,
  Database,
  Monitor,
  Save,
  X,
  RefreshCw,
  Moon,
  Sun,
  Laptop
} from 'lucide-react'
import StorageManager from '../storage/StorageManager'

const Settings = ({ isOpen, onClose }) => {
  // Theme Settings
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('medium')
  const [fontFamily, setFontFamily] = useState('Inter')

  // Editor Settings
  const [defaultEditor, setDefaultEditor] = useState('rich')
  const [autoSave, setAutoSave] = useState(true)
  const [autoSaveInterval, setAutoSaveInterval] = useState(2000)
  const [showWordCount, setShowWordCount] = useState(true)
  const [spellCheck, setSpellCheck] = useState(true)

  // AI Settings
  const [aiModel, setAiModel] = useState('gemini-2.5-flash')
  const [aiTemperature, setAiTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)

  // Security Settings
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Notification Settings
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [soundNotifications, setSoundNotifications] = useState(true)

  // Performance Settings
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('onai-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        // Apply saved settings
        if (parsed.theme) setTheme(parsed.theme)
        if (parsed.language) setLanguage(parsed.language)
        if (parsed.fontSize) setFontSize(parsed.fontSize)
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily)
        if (parsed.defaultEditor) setDefaultEditor(parsed.defaultEditor)
        if (parsed.autoSave !== undefined) setAutoSave(parsed.autoSave)
        if (parsed.autoSaveInterval) setAutoSaveInterval(parsed.autoSaveInterval)
        if (parsed.showWordCount !== undefined) setShowWordCount(parsed.showWordCount)
        if (parsed.spellCheck !== undefined) setSpellCheck(parsed.spellCheck)
        if (parsed.aiModel) setAiModel(parsed.aiModel)
        if (parsed.aiTemperature) setAiTemperature(parsed.aiTemperature)
        if (parsed.maxTokens) setMaxTokens(parsed.maxTokens)
        if (parsed.encryptionEnabled !== undefined) setEncryptionEnabled(parsed.encryptionEnabled)
        if (parsed.sessionTimeout) setSessionTimeout(parsed.sessionTimeout)
        if (parsed.twoFactorEnabled !== undefined) setTwoFactorEnabled(parsed.twoFactorEnabled)
        if (parsed.desktopNotifications !== undefined) setDesktopNotifications(parsed.desktopNotifications)
        if (parsed.emailNotifications !== undefined) setEmailNotifications(parsed.emailNotifications)
        if (parsed.soundNotifications !== undefined) setSoundNotifications(parsed.soundNotifications)
        if (parsed.animationsEnabled !== undefined) setAnimationsEnabled(parsed.animationsEnabled)
        if (parsed.reducedMotion !== undefined) setReducedMotion(parsed.reducedMotion)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      theme,
      language,
      fontSize,
      fontFamily,
      defaultEditor,
      autoSave,
      autoSaveInterval,
      showWordCount,
      spellCheck,
      aiModel,
      aiTemperature,
      maxTokens,
      encryptionEnabled,
      sessionTimeout,
      twoFactorEnabled,
      desktopNotifications,
      emailNotifications,
      soundNotifications,
      animationsEnabled,
      reducedMotion
    }
    
    localStorage.setItem('onai-settings', JSON.stringify(settings))
    console.log('Settings saved successfully')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-black/90 backdrop-blur-xl border-l border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <p className="text-sm text-gray-400">Customize your ONAI experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={saveSettings}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-6">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-black/30">
                <TabsTrigger value="general" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Monitor className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="editor" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  AI
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="storage" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                  <Database className="h-4 w-4 mr-2" />
                  Storage
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card className="glass-effect-dark border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="h-5 w-5 text-blue-400" />
                      Appearance
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Customize the look and feel of your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white">Theme</label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="bg-black/30 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          <SelectItem value="dark">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="light">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center gap-2">
                              <Laptop className="h-4 w-4" />
                              System
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="bg-black/30 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white">Font Size</label>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger className="bg-black/30 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Animations</label>
                        <p className="text-xs text-gray-400">Enable smooth animations and transitions</p>
                      </div>
                      <Switch
                        checked={animationsEnabled}
                        onCheckedChange={setAnimationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Reduced Motion</label>
                        <p className="text-xs text-gray-400">Minimize motion for accessibility</p>
                      </div>
                      <Switch
                        checked={reducedMotion}
                        onCheckedChange={setReducedMotion}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Storage Settings */}
              <TabsContent value="storage" className="space-y-6">
                <Card className="glass-effect-dark border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="h-5 w-5 text-cyan-400" />
                      Storage Management
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your notes storage, backup, and data import/export
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <StorageManager />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs can be added here */}
              <TabsContent value="editor" className="space-y-6">
                <Card className="glass-effect-dark border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Editor Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Configure your editing experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Auto Save</label>
                        <p className="text-xs text-gray-400">Automatically save changes</p>
                      </div>
                      <Switch
                        checked={autoSave}
                        onCheckedChange={setAutoSave}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Show Word Count</label>
                        <p className="text-xs text-gray-400">Display word count in editor</p>
                      </div>
                      <Switch
                        checked={showWordCount}
                        onCheckedChange={setShowWordCount}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-white">Spell Check</label>
                        <p className="text-xs text-gray-400">Enable spell checking</p>
                      </div>
                      <Switch
                        checked={spellCheck}
                        onCheckedChange={setSpellCheck}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add other tab contents as needed */}
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default Settings

