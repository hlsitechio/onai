// Security Settings Component for ONAI
// File: src/components/security/SecuritySettings.jsx
// Provides user interface for security management and monitoring

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Settings,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  User,
  Mail,
  Calendar
} from 'lucide-react'
import securityManager, { useSecurity } from '../../utils/security/securityManager'
import { useAuth } from '../../utils/security/auth'

const SecuritySettings = ({ isOpen = true, onClose, className = '' }) => {
  const [securityStatus, setSecurityStatus] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [securityEvents, setSecurityEvents] = useState([])
  const [encryptionKey, setEncryptionKey] = useState('')
  const [backupData, setBackupData] = useState('')
  
  const auth = useAuth()
  const security = useSecurity()

  // Load security status
  useEffect(() => {
    const loadSecurityStatus = () => {
      try {
        const status = security.getStatus()
        setSecurityStatus(status)
        
        // Get recent security events
        const events = status.threats?.recentEvents || []
        setSecurityEvents(events.slice(0, 10)) // Show last 10 events
      } catch (error) {
        console.error('Failed to load security status:', error)
      }
    }

    loadSecurityStatus()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadSecurityStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      setIsLoading(true)
      await auth.updatePassword(newPassword)
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      alert('Password updated successfully')
    } catch (error) {
      alert(`Password update failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle encryption key backup
  const handleBackupEncryptionKey = async () => {
    try {
      const keyData = await securityManager.encryption.exportKey(
        securityManager.encryption.userKey
      )
      const backup = {
        key: securityManager.encryption.service.arrayBufferToBase64(keyData),
        userId: auth.user?.id,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      
      const backupString = JSON.stringify(backup, null, 2)
      setBackupData(backupString)
      
      // Create download link
      const blob = new Blob([backupString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `onai-encryption-backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('Encryption key backed up successfully')
    } catch (error) {
      alert(`Backup failed: ${error.message}`)
    }
  }

  // Handle encryption key restore
  const handleRestoreEncryptionKey = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)
      
      if (!backup.key || !backup.userId) {
        throw new Error('Invalid backup file format')
      }
      
      if (backup.userId !== auth.user?.id) {
        throw new Error('Backup file belongs to a different user')
      }
      
      // Restore key
      const keyBuffer = securityManager.encryption.service.base64ToArrayBuffer(backup.key)
      const key = await securityManager.encryption.service.importKey(keyBuffer)
      
      // Store restored key
      await securityManager.encryption.service.storeKey(auth.user.id, key)
      
      alert('Encryption key restored successfully')
    } catch (error) {
      alert(`Restore failed: ${error.message}`)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'SECURE':
      case 'ACTIVE':
      case true:
        return 'text-green-400'
      case 'WARNING':
        return 'text-yellow-400'
      case 'CRITICAL':
      case 'INACTIVE':
      case false:
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'SECURE':
      case 'ACTIVE':
      case true:
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'CRITICAL':
      case 'INACTIVE':
      case false:
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  if (!isOpen) return null

  return (
    <div className={`security-settings flex flex-col h-full bg-black/20 backdrop-blur-xl border-l border-white/10 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Security Center</h2>
              <p className="text-xs text-gray-400">Manage your security settings</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          )}
        </div>

        {/* Security Status Overview */}
        {securityStatus && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(securityStatus.authentication.isAuthenticated)}
                <span className="text-xs font-medium text-white">Authentication</span>
              </div>
              <p className="text-xs text-gray-400">
                {securityStatus.authentication.isAuthenticated ? 'Secure' : 'Not authenticated'}
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(securityStatus.encryption.isInitialized)}
                <span className="text-xs font-medium text-white">Encryption</span>
              </div>
              <p className="text-xs text-gray-400">
                {securityStatus.encryption.isInitialized ? 'Active' : 'Not initialized'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Password Security */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-4 w-4" />
                Password Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your password and manage authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-black/20 border-white/20 text-white pr-10"
                      placeholder="Enter current password"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
                    >
                      {showPasswords ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">New Password</label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-black/20 border-white/20 text-white"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Confirm New Password</label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black/20 border-white/20 text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Encryption Management */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Encryption Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your encryption keys and data security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityStatus?.encryption && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="h-3 w-3 text-blue-400" />
                      <span className="text-xs font-medium text-white">Algorithm</span>
                    </div>
                    <p className="text-xs text-gray-400">{securityStatus.encryption.info.algorithm}</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Key className="h-3 w-3 text-green-400" />
                      <span className="text-xs font-medium text-white">Key Length</span>
                    </div>
                    <p className="text-xs text-gray-400">{securityStatus.encryption.info.keyLength} bits</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Button
                  onClick={handleBackupEncryptionKey}
                  variant="outline"
                  className="w-full bg-black/20 border-white/20 text-white hover:bg-white/10"
                  disabled={!securityStatus?.encryption?.isInitialized}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Backup Encryption Key
                </Button>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreEncryptionKey}
                    className="hidden"
                    id="restore-key-input"
                  />
                  <Button
                    onClick={() => document.getElementById('restore-key-input').click()}
                    variant="outline"
                    className="w-full bg-black/20 border-white/20 text-white hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Encryption Key
                  </Button>
                </div>
              </div>

              <Alert className="bg-yellow-500/20 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300 text-xs">
                  Keep your encryption key backup safe. Without it, you cannot recover your encrypted data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Security Monitoring */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Security Monitoring
              </CardTitle>
              <CardDescription className="text-gray-400">
                View recent security events and system status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityStatus && (
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Session Status</span>
                      {getStatusIcon(securityStatus.session.valid)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Valid:</span>
                        <span className={getStatusColor(securityStatus.session.valid)}>
                          {securityStatus.session.valid ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Idle:</span>
                        <span className={getStatusColor(!securityStatus.session.idle)}>
                          {securityStatus.session.idle ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Recent Auth:</span>
                        <span className={getStatusColor(securityStatus.session.recentAuth)}>
                          {securityStatus.session.recentAuth ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Threat Detection</span>
                      {getStatusIcon(!securityStatus.threats.suspiciousActivity)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Suspicious Activity:</span>
                        <span className={getStatusColor(!securityStatus.threats.suspiciousActivity)}>
                          {securityStatus.threats.suspiciousActivity ? 'Detected' : 'None'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Recent Events:</span>
                        <span className="text-gray-300">{securityStatus.threats.recentEvents}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Blocked IPs:</span>
                        <span className="text-gray-300">{securityStatus.threats.blockedIPs.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Security Events */}
              {securityEvents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Recent Security Events</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {securityEvents.map((event, index) => (
                      <div key={index} className="bg-black/20 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white">{event.type}</span>
                          <span className="text-xs text-gray-400">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        {event.error && (
                          <p className="text-xs text-red-400">{event.error}</p>
                        )}
                        {event.operation && (
                          <p className="text-xs text-gray-400">Operation: {event.operation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Policies */}
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Security Policies
              </CardTitle>
              <CardDescription className="text-gray-400">
                Current security policy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityStatus?.policies && (
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <h5 className="text-xs font-medium text-white mb-2">Password Policy</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Length:</span>
                        <span className="text-gray-300">{securityStatus.policies.passwordPolicy.minLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Age:</span>
                        <span className="text-gray-300">90 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3">
                    <h5 className="text-xs font-medium text-white mb-2">Session Policy</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Duration:</span>
                        <span className="text-gray-300">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Idle Timeout:</span>
                        <span className="text-gray-300">30 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}

export default SecuritySettings

