// PWA utilities for ONAI
// Handles service worker registration, installation prompts, and PWA features

import browserDetection from './browserDetection';

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isStandalone = false;
    this.serviceWorker = null;
    
    this.init();
  }

  // Initialize PWA functionality
  async init() {
    this.checkInstallationStatus();
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupAppInstalledListener();
    this.setupBeforeInstallPrompt();
  }

  // Check if app is installed or running in standalone mode
  checkInstallationStatus() {
    // Check if running in standalone mode
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;

    // Check if app is installed (various methods)
    this.isInstalled = this.isStandalone ||
                       document.referrer.includes('android-app://') ||
                       window.external?.IsSearchProviderInstalled;

    console.log('📱 PWA Status:', {
      isStandalone: this.isStandalone,
      isInstalled: this.isInstalled
    });
  }

  // Register service worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        this.serviceWorker = registration;

        console.log('✅ Service Worker registered successfully:', registration.scope);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 New Service Worker installed, update available');
              this.showUpdateAvailable();
            }
          });
        });

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('💬 Message from Service Worker:', event.data);
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    } else {
      console.warn('⚠️ Service Workers not supported');
    }
  }

  // Setup install prompt handling
  setupBeforeInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('📲 Install prompt available');
      
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Save the event so it can be triggered later
      this.deferredPrompt = event;
      
      // Show custom install button/banner
      this.showInstallPrompt();
    });
  }

  // Setup app installed listener
  setupAppInstalledListener() {
    window.addEventListener('appinstalled', (event) => {
      console.log('🎉 ONAI has been installed successfully!');
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.showInstallSuccess();
    });
  }

  // Setup general install prompt
  async setupInstallPrompt() {
    // Check if running on iOS Safari using modern detection
    const browserInfo = await browserDetection.getBrowserInfo();
    const isIOSSafari = await this.isIOSSafari();
    
    if (isIOSSafari && !this.isInstalled) {
      this.showIOSInstallInstructions();
    }
  }

  // Show install prompt
  showInstallPrompt() {
    if (this.isInstalled) return;

    // Create install banner
    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">📱</div>
        <div class="pwa-install-text">
          <h3>Install ONAI</h3>
          <p>Get the full app experience with offline access</p>
        </div>
        <div class="pwa-install-actions">
          <button id="pwa-install-btn" class="pwa-install-button">Install</button>
          <button id="pwa-dismiss-btn" class="pwa-dismiss-button">×</button>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      .pwa-install-banner {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 16px;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: slideUp 0.3s ease-out;
      }
      
      .pwa-install-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
      }
      
      .pwa-install-icon {
        font-size: 24px;
      }
      
      .pwa-install-text h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .pwa-install-text p {
        margin: 4px 0 0 0;
        font-size: 14px;
        opacity: 0.8;
      }
      
      .pwa-install-actions {
        display: flex;
        gap: 8px;
        margin-left: auto;
      }
      
      .pwa-install-button {
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .pwa-install-button:hover {
        transform: translateY(-1px);
      }
      
      .pwa-dismiss-button {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .pwa-install-banner {
          left: 10px;
          right: 10px;
          bottom: 10px;
        }
      }
    `;

    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Add banner to page
    document.body.appendChild(installBanner);

    // Setup event listeners
    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      this.triggerInstall();
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      this.hideInstallPrompt();
    });
  }

  // Trigger install prompt
  async triggerInstall() {
    if (!this.deferredPrompt) {
      console.warn('⚠️ Install prompt not available');
      return;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(`📱 Install prompt outcome: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }

      // Clear the deferred prompt
      this.deferredPrompt = null;
      this.hideInstallPrompt();

    } catch (error) {
      console.error('❌ Install prompt failed:', error);
    }
  }

  // Hide install prompt
  hideInstallPrompt() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  // Show install success message
  showInstallSuccess() {
    // You can implement a success notification here
    console.log('🎉 App installed successfully!');
  }

  // Show update available notification
  showUpdateAvailable() {
    // You can implement an update notification here
    console.log('🔄 App update available!');
  }

  // Check if running on iOS Safari using modern detection
  async isIOSSafari() {
    try {
      const browserInfo = await browserDetection.getBrowserInfo();
      
      // Use feature detection for iOS
      const isIOS = browserDetection.detectMobileByFeatures() && 
                    browserInfo.platform === 'iOS' ||
                    ('standalone' in window.navigator) || // iOS-specific property
                    /iPad|iPhone|iPod/.test(browserInfo.platform);
      
      // Use feature detection for Safari
      const isSafari = browserInfo.name === 'Safari' ||
                       (window.safari && window.safari.pushNotification) ||
                       (!window.chrome && !window.opr && !window.edg);
      
      return isIOS && isSafari;
    } catch (error) {
      // Fallback to basic feature detection
      const hasIOSFeatures = 'standalone' in window.navigator;
      const hasSafariFeatures = window.safari && window.safari.pushNotification;
      return hasIOSFeatures && hasSafariFeatures;
    }
  }

  // Show iOS install instructions
  showIOSInstallInstructions() {
    // Implementation for iOS-specific install instructions
    console.log('📱 iOS Safari detected - showing install instructions');
  }

  // Get installation status
  async getInstallationStatus() {
    const isIOSSafari = await this.isIOSSafari();
    
    return {
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone,
      canInstall: !!this.deferredPrompt,
      isIOSSafari
    };
  }

  // Manual install trigger (for custom buttons)
  async install() {
    return await this.triggerInstall();
  }

  // Check for app updates
  async checkForUpdates() {
    if (this.serviceWorker) {
      try {
        await this.serviceWorker.update();
        console.log('🔄 Checked for app updates');
      } catch (error) {
        console.error('❌ Update check failed:', error);
      }
    }
  }

  // Enable background sync for notes
  async enableBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('save-notes');
        console.log('🔄 Background sync enabled for notes');
      } catch (error) {
        console.error('❌ Background sync registration failed:', error);
      }
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  }
}

// Export PWA manager
export default PWAManager;

