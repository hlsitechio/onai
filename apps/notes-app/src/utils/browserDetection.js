// Modern Browser Detection Utility
// File: src/utils/browserDetection.js
// Replaces deprecated navigator.userAgent, navigator.platform, navigator.appVersion

/**
 * Modern browser detection utility using navigator.userAgentData and feature detection
 * Replaces deprecated navigator.userAgent, navigator.platform, navigator.appVersion
 */
class ModernBrowserDetection {
  constructor() {
    this.userAgentData = navigator.userAgentData || null;
    this.fallbackUserAgent = null; // Only used when absolutely necessary
    this.cachedInfo = new Map();
  }

  /**
   * Get browser information using modern APIs
   * @returns {Promise<Object>} Browser information object
   */
  async getBrowserInfo() {
    const cacheKey = 'browserInfo';
    if (this.cachedInfo.has(cacheKey)) {
      return this.cachedInfo.get(cacheKey);
    }

    let browserInfo = {
      name: 'Unknown',
      version: 'Unknown',
      platform: 'Unknown',
      mobile: false,
      architecture: 'Unknown',
      bitness: 'Unknown',
      model: 'Unknown',
      platformVersion: 'Unknown',
      brands: [],
      fullVersionList: []
    };

    try {
      if (this.userAgentData) {
        // Use modern User-Agent Client Hints API
        browserInfo = await this.getBrowserInfoFromUserAgentData();
      } else {
        // Fallback to feature detection and minimal parsing
        browserInfo = this.getBrowserInfoFromFeatureDetection();
      }
    } catch (error) {
      console.warn('Browser detection failed, using defaults:', error);
      browserInfo = this.getBrowserInfoFromFeatureDetection();
    }

    this.cachedInfo.set(cacheKey, browserInfo);
    return browserInfo;
  }

  /**
   * Get browser info using modern User-Agent Client Hints API
   * @returns {Promise<Object>} Browser information
   */
  async getBrowserInfoFromUserAgentData() {
    const basicInfo = {
      brands: this.userAgentData.brands || [],
      mobile: this.userAgentData.mobile || false,
      platform: this.userAgentData.platform || 'Unknown'
    };

    try {
      // Request high entropy values (requires user permission)
      const highEntropyValues = await this.userAgentData.getHighEntropyValues([
        'architecture',
        'bitness',
        'model',
        'platformVersion',
        'fullVersionList'
      ]);

      return {
        ...basicInfo,
        architecture: highEntropyValues.architecture || 'Unknown',
        bitness: highEntropyValues.bitness || 'Unknown',
        model: highEntropyValues.model || 'Unknown',
        platformVersion: highEntropyValues.platformVersion || 'Unknown',
        fullVersionList: highEntropyValues.fullVersionList || [],
        name: this.extractBrowserName(basicInfo.brands),
        version: this.extractBrowserVersion(highEntropyValues.fullVersionList || basicInfo.brands)
      };
    } catch (error) {
      // High entropy values not available, use basic info
      return {
        ...basicInfo,
        architecture: 'Unknown',
        bitness: 'Unknown',
        model: 'Unknown',
        platformVersion: 'Unknown',
        fullVersionList: [],
        name: this.extractBrowserName(basicInfo.brands),
        version: this.extractBrowserVersion(basicInfo.brands)
      };
    }
  }

  /**
   * Get browser info using feature detection (fallback)
   * @returns {Object} Browser information
   */
  getBrowserInfoFromFeatureDetection() {
    return {
      name: this.detectBrowserByFeatures(),
      version: 'Unknown',
      platform: this.detectPlatformByFeatures(),
      mobile: this.detectMobileByFeatures(),
      architecture: 'Unknown',
      bitness: 'Unknown',
      model: 'Unknown',
      platformVersion: 'Unknown',
      brands: [],
      fullVersionList: []
    };
  }

  /**
   * Extract browser name from brands array
   * @param {Array} brands - Array of brand objects
   * @returns {string} Browser name
   */
  extractBrowserName(brands) {
    if (!brands || !Array.isArray(brands)) return 'Unknown';

    // Priority order for brand detection
    const brandPriority = ['Google Chrome', 'Microsoft Edge', 'Opera', 'Firefox', 'Safari'];
    
    for (const priority of brandPriority) {
      const brand = brands.find(b => b.brand && b.brand.includes(priority));
      if (brand) return brand.brand;
    }

    // Return first non-generic brand
    const nonGeneric = brands.find(b => 
      b.brand && 
      !b.brand.includes('Not') && 
      !b.brand.includes('Chromium') &&
      b.brand !== 'Unknown'
    );

    return nonGeneric ? nonGeneric.brand : 'Unknown';
  }

  /**
   * Extract browser version from brands or fullVersionList
   * @param {Array} versionSource - Brands or fullVersionList array
   * @returns {string} Browser version
   */
  extractBrowserVersion(versionSource) {
    if (!versionSource || !Array.isArray(versionSource)) return 'Unknown';

    // Try to find version from known browsers
    const knownBrowsers = ['Google Chrome', 'Microsoft Edge', 'Opera', 'Firefox', 'Safari'];
    
    for (const browser of knownBrowsers) {
      const entry = versionSource.find(item => 
        item.brand && item.brand.includes(browser)
      );
      if (entry && entry.version) {
        return entry.version;
      }
    }

    // Return first available version
    const withVersion = versionSource.find(item => item.version);
    return withVersion ? withVersion.version : 'Unknown';
  }

  /**
   * Detect browser using feature detection
   * @returns {string} Browser name
   */
  detectBrowserByFeatures() {
    // Chrome/Chromium detection
    if (window.chrome && window.chrome.runtime) {
      if (window.opr) return 'Opera';
      if (window.edg) return 'Microsoft Edge';
      return 'Google Chrome';
    }

    // Firefox detection
    if (typeof InstallTrigger !== 'undefined') {
      return 'Firefox';
    }

    // Safari detection
    if (window.safari && window.safari.pushNotification) {
      return 'Safari';
    }

    // Internet Explorer detection
    if (document.documentMode) {
      return 'Internet Explorer';
    }

    return 'Unknown';
  }

  /**
   * Detect platform using feature detection
   * @returns {string} Platform name
   */
  detectPlatformByFeatures() {
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for mobile-specific APIs
    const hasMobileAPIs = 'orientation' in window || 'DeviceMotionEvent' in window;
    
    // Check for desktop-specific features
    const hasDesktopFeatures = window.screen.width > 1024 && !hasTouch;

    if (hasTouch && hasMobileAPIs) {
      return 'Mobile';
    } else if (hasDesktopFeatures) {
      return 'Desktop';
    } else {
      return 'Unknown';
    }
  }

  /**
   * Detect if device is mobile using feature detection
   * @returns {boolean} True if mobile device
   */
  detectMobileByFeatures() {
    // Check multiple mobile indicators
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const orientationSupport = 'orientation' in window;
    const smallScreen = window.screen.width <= 768;
    const deviceMotion = 'DeviceMotionEvent' in window;

    // Consider mobile if multiple indicators are present
    const mobileIndicators = [touchSupport, orientationSupport, smallScreen, deviceMotion];
    const mobileScore = mobileIndicators.filter(Boolean).length;

    return mobileScore >= 2;
  }

  /**
   * Get a privacy-friendly identifier for logging/analytics
   * @returns {Promise<string>} Privacy-friendly browser identifier
   */
  async getPrivacyFriendlyIdentifier() {
    const cacheKey = 'privacyIdentifier';
    if (this.cachedInfo.has(cacheKey)) {
      return this.cachedInfo.get(cacheKey);
    }

    try {
      const browserInfo = await this.getBrowserInfo();
      
      // Create a general identifier without specific versions or detailed info
      const identifier = `${browserInfo.name || 'Unknown'}_${browserInfo.platform || 'Unknown'}_${browserInfo.mobile ? 'Mobile' : 'Desktop'}`;
      
      this.cachedInfo.set(cacheKey, identifier);
      return identifier;
    } catch (error) {
      const fallback = 'Unknown_Unknown_Unknown';
      this.cachedInfo.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Get minimal browser info for error reporting
   * @returns {Promise<Object>} Minimal browser info
   */
  async getMinimalBrowserInfo() {
    try {
      const browserInfo = await this.getBrowserInfo();
      
      return {
        browser: browserInfo.name || 'Unknown',
        platform: browserInfo.platform || 'Unknown',
        mobile: browserInfo.mobile || false,
        // Only include major version, not full version for privacy
        majorVersion: browserInfo.version ? browserInfo.version.split('.')[0] : 'Unknown'
      };
    } catch (error) {
      return {
        browser: 'Unknown',
        platform: 'Unknown',
        mobile: false,
        majorVersion: 'Unknown'
      };
    }
  }

  /**
   * Check if specific browser features are supported
   * @param {Array<string>} features - Features to check
   * @returns {Object} Feature support object
   */
  checkFeatureSupport(features = []) {
    const support = {};

    const featureChecks = {
      'serviceWorker': () => 'serviceWorker' in navigator,
      'pushNotifications': () => 'PushManager' in window,
      'webGL': () => {
        try {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
          return false;
        }
      },
      'webGL2': () => {
        try {
          const canvas = document.createElement('canvas');
          return !!canvas.getContext('webgl2');
        } catch (e) {
          return false;
        }
      },
      'webAssembly': () => typeof WebAssembly === 'object',
      'indexedDB': () => 'indexedDB' in window,
      'localStorage': () => {
        try {
          return typeof Storage !== 'undefined';
        } catch (e) {
          return false;
        }
      },
      'geolocation': () => 'geolocation' in navigator,
      'camera': () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      'fullscreen': () => document.fullscreenEnabled || document.webkitFullscreenEnabled,
      'clipboard': () => 'clipboard' in navigator,
      'share': () => 'share' in navigator,
      'bluetooth': () => 'bluetooth' in navigator,
      'usb': () => 'usb' in navigator,
      'webXR': () => 'xr' in navigator,
      'webRTC': () => 'RTCPeerConnection' in window,
      'webAudio': () => 'AudioContext' in window || 'webkitAudioContext' in window,
      'webCrypto': () => 'crypto' in window && 'subtle' in window.crypto,
      'intersectionObserver': () => 'IntersectionObserver' in window,
      'resizeObserver': () => 'ResizeObserver' in window,
      'mutationObserver': () => 'MutationObserver' in window,
      'webWorkers': () => 'Worker' in window,
      'sharedArrayBuffer': () => 'SharedArrayBuffer' in window,
      'bigInt': () => typeof BigInt !== 'undefined',
      'modules': () => 'noModule' in document.createElement('script'),
      'customElements': () => 'customElements' in window,
      'shadowDOM': () => 'attachShadow' in Element.prototype,
      'css': {
        'grid': () => CSS.supports('display', 'grid'),
        'flexbox': () => CSS.supports('display', 'flex'),
        'customProperties': () => CSS.supports('--custom', 'property'),
        'containerQueries': () => CSS.supports('container-type', 'inline-size')
      }
    };

    if (features.length === 0) {
      // Return all feature support if no specific features requested
      features = Object.keys(featureChecks);
    }

    features.forEach(feature => {
      if (feature.includes('.')) {
        // Nested feature like 'css.grid'
        const [category, subFeature] = feature.split('.');
        if (featureChecks[category] && typeof featureChecks[category] === 'object') {
          support[feature] = featureChecks[category][subFeature] ? featureChecks[category][subFeature]() : false;
        } else {
          support[feature] = false;
        }
      } else {
        support[feature] = featureChecks[feature] ? featureChecks[feature]() : false;
      }
    });

    return support;
  }

  /**
   * Clear cached information (useful for testing or when user agent changes)
   */
  clearCache() {
    this.cachedInfo.clear();
  }

  /**
   * Get legacy user agent string (only when absolutely necessary)
   * This should be avoided and only used for critical compatibility
   * @returns {string} User agent string or privacy-friendly alternative
   */
  getLegacyUserAgent() {
    console.warn('⚠️ Using legacy user agent string. Consider using modern alternatives.');
    
    // Return a generic, privacy-friendly user agent string
    return 'Mozilla/5.0 (compatible; ONAI/1.0; Privacy-Friendly)';
  }
}

// Create singleton instance
const browserDetection = new ModernBrowserDetection();

// Export both the class and singleton instance
export { ModernBrowserDetection };
export default browserDetection;

