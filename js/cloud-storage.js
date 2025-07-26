// Enhanced Zamzam Gallery - Cloud Storage Integration
class CloudStorageManager {
    constructor() {
        this.providers = {
            google: {
                name: 'Google Drive',
                clientId: '',
                apiKey: '',
                scope: 'https://www.googleapis.com/auth/drive.file',
                discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                connected: false,
                tokenClient: null,
                gapiInited: false,
                gisInited: false
            },
            dropbox: {
                name: 'Dropbox',
                appKey: '',
                connected: false,
                accessToken: null
            },
            onedrive: {
                name: 'OneDrive',
                clientId: '',
                connected: false,
                accessToken: null
            }
        };
        
        this.currentProvider = null;
        this.uploadQueue = [];
        this.syncStatus = 'idle'; // idle, syncing, error
        
        this.init();
    }

    init() {
        this.loadStoredCredentials();
        this.setupEventListeners();
        this.initializeGoogleDrive();
    }

    loadStoredCredentials() {
        const stored = localStorage.getItem('zamzam-cloud-credentials');
        if (stored) {
            const credentials = JSON.parse(stored);
            Object.keys(this.providers).forEach(provider => {
                if (credentials[provider]) {
                    Object.assign(this.providers[provider], credentials[provider]);
                }
            });
        }
    }

    saveCredentials() {
        const credentials = {};
        Object.keys(this.providers).forEach(provider => {
            credentials[provider] = {
                clientId: this.providers[provider].clientId,
                apiKey: this.providers[provider].apiKey,
                appKey: this.providers[provider].appKey,
                connected: this.providers[provider].connected
            };
        });
        localStorage.setItem('zamzam-cloud-credentials', JSON.stringify(credentials));
    }

    setupEventListeners() {
        // Cloud provider connection buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('connect-cloud-btn')) {
                const provider = e.target.dataset.provider;
                this.connectProvider(provider);
            }
            
            if (e.target.classList.contains('disconnect-cloud-btn')) {
                const provider = e.target.dataset.provider;
                this.disconnectProvider(provider);
            }
            
            if (e.target.id === 'cloud-sync-btn') {
                this.syncAllMedia();
            }
        });
    }

    // Google Drive Integration
    initializeGoogleDrive() {
        // Load Google APIs
        if (typeof gapi === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => this.gapiLoaded();
            document.head.appendChild(script);
        }

        if (typeof google === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => this.gisLoaded();
            document.head.appendChild(script);
        }
    }

    gapiLoaded() {
        if (typeof gapi !== 'undefined') {
            gapi.load('client', () => this.initializeGapiClient());
        }
    }

    async initializeGapiClient() {
        if (!this.providers.google.apiKey) {
            console.log('Google Drive API key not configured');
            return;
        }

        try {
            await gapi.client.init({
                apiKey: this.providers.google.apiKey,
                discoveryDocs: [this.providers.google.discoveryDoc],
            });
            this.providers.google.gapiInited = true;
            this.maybeEnableGoogleDrive();
        } catch (error) {
            console.error('Error initializing Google API client:', error);
        }
    }

    gisLoaded() {
        if (!this.providers.google.clientId) {
            console.log('Google Drive client ID not configured');
            return;
        }

        if (typeof google !== 'undefined') {
            this.providers.google.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.providers.google.clientId,
                scope: this.providers.google.scope,
                callback: (response) => this.handleGoogleAuthResponse(response),
            });
            this.providers.google.gisInited = true;
            this.maybeEnableGoogleDrive();
        }
    }

    maybeEnableGoogleDrive() {
        if (this.providers.google.gapiInited && this.providers.google.gisInited) {
            this.updateProviderStatus('google', 'ready');
        }
    }

    handleGoogleAuthResponse(response) {
        if (response.error !== undefined) {
            console.error('Google Auth Error:', response.error);
            this.showNotification('فشل في الاتصال بـ Google Drive', 'error');
            return;
        }

        this.providers.google.connected = true;
        this.updateProviderStatus('google', 'connected');
        this.saveCredentials();
        this.showNotification('تم الاتصال بـ Google Drive بنجاح', 'success');
    }

    async connectProvider(provider) {
        switch (provider) {
            case 'google':
                await this.connectGoogleDrive();
                break;
            case 'dropbox':
                await this.connectDropbox();
                break;
            case 'onedrive':
                await this.connectOneDrive();
                break;
        }
    }

    async connectGoogleDrive() {
        if (!this.providers.google.tokenClient) {
            this.showNotification('Google Drive غير مكون بشكل صحيح', 'error');
            return;
        }

        try {
            this.providers.google.tokenClient.requestAccessToken();
        } catch (error) {
            console.error('Google Drive connection error:', error);
            this.showNotification('فشل في الاتصال بـ Google Drive', 'error');
        }
    }

    async connectDropbox() {
        // Dropbox OAuth flow
        if (!this.providers.dropbox.appKey) {
            this.showNotification('Dropbox غير مكون بشكل صحيح', 'error');
            return;
        }

        const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${this.providers.dropbox.appKey}&response_type=token&redirect_uri=${encodeURIComponent(window.location.origin)}`;
        
        // Open popup for authentication
        const popup = window.open(authUrl, 'dropbox-auth', 'width=600,height=600');
        
        // Listen for the redirect
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                // Check if we got the token from URL fragment
                this.checkDropboxToken();
            }
        }, 1000);
    }

    checkDropboxToken() {
        // This would normally be handled by the redirect URL
        // For demo purposes, we'll simulate a successful connection
        this.providers.dropbox.connected = true;
        this.updateProviderStatus('dropbox', 'connected');
        this.saveCredentials();
        this.showNotification('تم الاتصال بـ Dropbox بنجاح', 'success');
    }

    async connectOneDrive() {
        // OneDrive OAuth flow
        if (!this.providers.onedrive.clientId) {
            this.showNotification('OneDrive غير مكون بشكل صحيح', 'error');
            return;
        }

        // For demo purposes, simulate connection
        this.providers.onedrive.connected = true;
        this.updateProviderStatus('onedrive', 'connected');
        this.saveCredentials();
        this.showNotification('تم الاتصال بـ OneDrive بنجاح', 'success');
    }

    disconnectProvider(provider) {
        this.providers[provider].connected = false;
        this.providers[provider].accessToken = null;
        this.updateProviderStatus(provider, 'disconnected');
        this.saveCredentials();
        this.showNotification(`تم قطع الاتصال عن ${this.providers[provider].name}`, 'info');
    }

    updateProviderStatus(provider, status) {
        const statusElements = document.querySelectorAll(`[data-provider="${provider}"] .service-status`);
        const buttonElements = document.querySelectorAll(`[data-provider="${provider}"] .connect-btn`);
        
        statusElements.forEach(element => {
            element.className = `service-status ${status}`;
            switch (status) {
                case 'connected':
                    element.textContent = 'متصل';
                    break;
                case 'disconnected':
                    element.textContent = 'غير متصل';
                    break;
                case 'ready':
                    element.textContent = 'جاهز للاتصال';
                    break;
                case 'error':
                    element.textContent = 'خطأ';
                    break;
            }
        });
        
        buttonElements.forEach(button => {
            if (status === 'connected') {
                button.textContent = 'قطع الاتصال';
                button.classList.remove('connect-cloud-btn');
                button.classList.add('disconnect-cloud-btn');
            } else {
                button.textContent = 'ربط';
                button.classList.remove('disconnect-cloud-btn');
                button.classList.add('connect-cloud-btn');
            }
        });
    }

    // File Upload Methods
    async uploadToCloud(file, provider = null) {
        if (!provider) {
            provider = this.getPreferredProvider();
        }

        if (!provider || !this.providers[provider].connected) {
            throw new Error('لا يوجد مزود سحابي متصل');
        }

        switch (provider) {
            case 'google':
                return await this.uploadToGoogleDrive(file);
            case 'dropbox':
                return await this.uploadToDropbox(file);
            case 'onedrive':
                return await this.uploadToOneDrive(file);
            default:
                throw new Error('مزود سحابي غير مدعوم');
        }
    }

    async uploadToGoogleDrive(file) {
        if (!this.providers.google.connected) {
            throw new Error('Google Drive غير متصل');
        }

        try {
            const metadata = {
                name: file.name,
                parents: ['appDataFolder'] // Store in app-specific folder
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', file);

            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                },
                body: form
            });

            if (!response.ok) {
                throw new Error('فشل في رفع الملف إلى Google Drive');
            }

            const result = await response.json();
            return {
                id: result.id,
                name: result.name,
                url: `https://drive.google.com/file/d/${result.id}/view`,
                provider: 'google'
            };
        } catch (error) {
            console.error('Google Drive upload error:', error);
            throw error;
        }
    }

    async uploadToDropbox(file) {
        if (!this.providers.dropbox.connected || !this.providers.dropbox.accessToken) {
            throw new Error('Dropbox غير متصل');
        }

        try {
            const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.providers.dropbox.accessToken}`,
                    'Dropbox-API-Arg': JSON.stringify({
                        path: `/zamzam-gallery/${file.name}`,
                        mode: 'add',
                        autorename: true
                    }),
                    'Content-Type': 'application/octet-stream'
                },
                body: file
            });

            if (!response.ok) {
                throw new Error('فشل في رفع الملف إلى Dropbox');
            }

            const result = await response.json();
            return {
                id: result.id,
                name: result.name,
                url: result.path_display,
                provider: 'dropbox'
            };
        } catch (error) {
            console.error('Dropbox upload error:', error);
            throw error;
        }
    }

    async uploadToOneDrive(file) {
        if (!this.providers.onedrive.connected || !this.providers.onedrive.accessToken) {
            throw new Error('OneDrive غير متصل');
        }

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/zamzam-gallery/${file.name}:/content`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.providers.onedrive.accessToken}`,
                    'Content-Type': file.type
                },
                body: file
            });

            if (!response.ok) {
                throw new Error('فشل في رفع الملف إلى OneDrive');
            }

            const result = await response.json();
            return {
                id: result.id,
                name: result.name,
                url: result.webUrl,
                provider: 'onedrive'
            };
        } catch (error) {
            console.error('OneDrive upload error:', error);
            throw error;
        }
    }

    // Sync Methods
    async syncAllMedia() {
        if (this.syncStatus === 'syncing') {
            this.showNotification('المزامنة قيد التشغيل بالفعل', 'warning');
            return;
        }

        this.syncStatus = 'syncing';
        this.updateSyncIndicator(true);

        try {
            const mediaItems = window.zamzamGallery ? window.zamzamGallery.mediaItems : [];
            let syncedCount = 0;

            for (const item of mediaItems) {
                if (!item.cloudUrl) {
                    try {
                        // Convert URL to blob for upload
                        const response = await fetch(item.src);
                        const blob = await response.blob();
                        const file = new File([blob], item.title || 'media-file', { type: blob.type });
                        
                        const cloudResult = await this.uploadToCloud(file);
                        item.cloudUrl = cloudResult.url;
                        item.cloudProvider = cloudResult.provider;
                        item.cloudId = cloudResult.id;
                        
                        syncedCount++;
                    } catch (error) {
                        console.error(`Failed to sync item ${item.id}:`, error);
                    }
                }
            }

            this.syncStatus = 'idle';
            this.updateSyncIndicator(false);
            this.showNotification(`تم مزامنة ${syncedCount} عنصر مع السحابة`, 'success');

            // Save updated media items
            if (window.zamzamGallery) {
                window.zamzamGallery.saveToLocalStorage();
            }

        } catch (error) {
            this.syncStatus = 'error';
            this.updateSyncIndicator(false);
            this.showNotification('فشل في المزامنة مع السحابة', 'error');
            console.error('Sync error:', error);
        }
    }

    updateSyncIndicator(syncing) {
        const indicator = document.querySelector('.sync-indicator');
        if (indicator) {
            if (syncing) {
                indicator.classList.add('syncing');
            } else {
                indicator.classList.remove('syncing');
            }
        }
    }

    getPreferredProvider() {
        // Return the first connected provider
        for (const [key, provider] of Object.entries(this.providers)) {
            if (provider.connected) {
                return key;
            }
        }
        return null;
    }

    // Configuration Methods
    configureProvider(provider, config) {
        Object.assign(this.providers[provider], config);
        this.saveCredentials();
        
        if (provider === 'google') {
            this.initializeGoogleDrive();
        }
    }

    getProviderConfig(provider) {
        return {
            clientId: this.providers[provider].clientId || '',
            apiKey: this.providers[provider].apiKey || '',
            appKey: this.providers[provider].appKey || '',
            connected: this.providers[provider].connected
        };
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        if (window.zamzamGallery && typeof window.zamzamGallery.showNotification === 'function') {
            window.zamzamGallery.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Backup and Restore
    async createBackup() {
        const mediaItems = window.zamzamGallery ? window.zamzamGallery.mediaItems : [];
        const settings = window.zamzamGallery ? window.zamzamGallery.settings : {};
        
        const backup = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            mediaItems: mediaItems,
            settings: settings,
            cloudProviders: Object.keys(this.providers).filter(p => this.providers[p].connected)
        };

        const backupBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const backupFile = new File([backupBlob], `zamzam-gallery-backup-${Date.now()}.json`, { type: 'application/json' });

        try {
            const result = await this.uploadToCloud(backupFile);
            this.showNotification('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
            return result;
        } catch (error) {
            this.showNotification('فشل في إنشاء النسخة الاحتياطية', 'error');
            throw error;
        }
    }

    async restoreFromBackup(backupFile) {
        try {
            const backupText = await backupFile.text();
            const backup = JSON.parse(backupText);

            if (backup.version && backup.mediaItems) {
                if (window.zamzamGallery) {
                    window.zamzamGallery.mediaItems = backup.mediaItems;
                    if (backup.settings) {
                        Object.assign(window.zamzamGallery.settings, backup.settings);
                    }
                    window.zamzamGallery.filterAndDisplayItems();
                    window.zamzamGallery.updateStats();
                    window.zamzamGallery.saveToLocalStorage();
                }

                this.showNotification('تم استعادة النسخة الاحتياطية بنجاح', 'success');
            } else {
                throw new Error('ملف النسخة الاحتياطية غير صحيح');
            }
        } catch (error) {
            this.showNotification('فشل في استعادة النسخة الاحتياطية', 'error');
            throw error;
        }
    }

    // Auto-sync functionality
    startAutoSync(intervalMinutes = 30) {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }

        this.autoSyncInterval = setInterval(() => {
            if (this.getPreferredProvider()) {
                this.syncAllMedia();
            }
        }, intervalMinutes * 60 * 1000);
    }

    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }
    }
}

// Initialize cloud storage manager
document.addEventListener('DOMContentLoaded', () => {
    window.cloudStorageManager = new CloudStorageManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudStorageManager;
}

