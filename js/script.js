// Enhanced Zamzam Gallery - Advanced JavaScript Implementation
class EnhancedZamzamGallery {
    constructor() {
        this.mediaItems = [];
        this.filteredItems = [];
        this.currentFilter = 'all';
        this.currentView = 'masonry';
        this.currentImageIndex = 0;
        this.searchTerm = '';
        this.isLoading = false;
        this.soundEnabled = true;
        this.currentTheme = 'purple';
        this.currentFont = 'cairo';
        this.currentBackground = 'gradient';
        this.categories = ['عام', 'طبيعة', 'فن', 'تصوير', 'معمارية', 'طعام', 'رياضة', 'تقنية'];
        this.brands = ['كانون', 'نيكون', 'سوني', 'فوجي', 'أوليمبوس', 'لايكا', 'باناسونيك'];
        this.socialLinks = {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            whatsapp: ''
        };
        this.cloudProviders = {
            google: { connected: false, token: null },
            dropbox: { connected: false, token: null },
            onedrive: { connected: false, token: null }
        };
        this.masonryInstance = null;
        this.rollingInterval = null;
        this.scene3D = null;
        this.camera3D = null;
        this.renderer3D = null;
        this.group3D = null;
        this.animationId = null;
        this.uploadQueue = [];
        this.cloudStorage = 0;
        this.totalViews = 0;
        this.settings = {
            quality: 'medium',
            lazyLoading: true,
            preload: false,
            autoSync: false,
            backup: false,
            particles: true,
            animations: true
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeParticles();
        this.loadSampleData();
        this.hideLoadingScreen();
        this.updateStats();
        this.showWelcomeMessage();
        this.loadSettings();
        this.initializeCloudSync();
        this.setupServiceWorker();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayItems();
            });
        }

        // Advanced search toggle
        const advancedSearchToggle = document.getElementById('advanced-search-toggle');
        if (advancedSearchToggle) {
            advancedSearchToggle.addEventListener('click', () => {
                this.playSound('click');
                this.toggleAdvancedSearch();
            });
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterAndDisplayItems();
            });
        });

        // View modes
        document.querySelectorAll('.view-mode').forEach(mode => {
            mode.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.view-mode').forEach(m => m.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.displayItems();
            });
        });

        // Header actions
        this.setupHeaderActions();
        
        // Upload functionality
        this.setupUploadFunctionality();
        
        // Settings functionality
        this.setupSettingsFunctionality();
        
        // Lightbox functionality
        this.setupLightboxFunctionality();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Cloud sync
        this.setupCloudSync();
        
        // AI enhancement
        this.setupAIEnhancement();
    }

    setupHeaderActions() {
        const cloudSyncBtn = document.getElementById('cloud-sync-btn');
        const aiEnhanceBtn = document.getElementById('ai-enhance-btn');
        const uploadBtn = document.getElementById('upload-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (cloudSyncBtn) {
            cloudSyncBtn.addEventListener('click', () => {
                this.playSound('click');
                this.syncWithCloud();
            });
        }

        if (aiEnhanceBtn) {
            aiEnhanceBtn.addEventListener('click', () => {
                this.playSound('click');
                this.enhanceWithAI();
            });
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.playSound('click');
                this.openModal('upload-modal');
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.playSound('click');
                this.openModal('settings-modal');
            });
        }
    }

    setupUploadFunctionality() {
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        const uploadSubmit = document.getElementById('upload-submit');
        const urlInput = document.getElementById('url-input');
        const fetchUrlBtn = document.getElementById('fetch-url');

        // Upload tabs
        document.querySelectorAll('.upload-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.upload-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('.upload-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(`${e.target.dataset.tab}-upload`).classList.add('active');
            });
        });

        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        if (uploadSubmit) {
            uploadSubmit.addEventListener('click', () => {
                this.processUploadQueue();
            });
        }

        if (fetchUrlBtn) {
            fetchUrlBtn.addEventListener('click', () => {
                this.fetchFromUrl(urlInput.value);
            });
        }

        // Cloud providers
        document.querySelectorAll('.cloud-provider').forEach(provider => {
            provider.addEventListener('click', (e) => {
                this.playSound('click');
                this.connectCloudProvider(e.target.dataset.provider);
            });
        });
    }

    setupSettingsFunctionality() {
        // Settings tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('.settings-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(`${e.target.dataset.tab}-settings`).classList.add('active');
            });
        });

        // Background options
        document.querySelectorAll('.bg-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.bg-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                this.changeBackground(e.target.dataset.bg);
            });
        });

        // Font options
        document.querySelectorAll('.font-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                this.changeFont(e.target.dataset.font);
            });
        });

        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                this.changeTheme(e.target.dataset.theme);
            });
        });

        // Quality options
        document.querySelectorAll('.quality-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.playSound('click');
                document.querySelectorAll('.quality-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                this.settings.quality = e.target.dataset.quality;
                this.saveSettings();
            });
        });

        // Toggle switches
        this.setupToggleSwitches();

        // Save settings
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.playSound('click');
                this.saveAllSettings();
                this.closeModal('settings-modal');
                this.showNotification('تم حفظ الإعدادات بنجاح', 'success');
            });
        }
    }

    setupToggleSwitches() {
        const soundToggle = document.getElementById('sound-toggle');
        const particlesToggle = document.getElementById('particles-toggle');
        const animationsToggle = document.getElementById('animations-toggle');
        const autoSyncToggle = document.getElementById('auto-sync-toggle');
        const backupToggle = document.getElementById('backup-toggle');
        const lazyLoadingToggle = document.getElementById('lazy-loading-toggle');
        const preloadToggle = document.getElementById('preload-toggle');

        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.soundEnabled = e.target.checked;
                this.saveSettings();
            });
        }

        if (particlesToggle) {
            particlesToggle.addEventListener('change', (e) => {
                this.settings.particles = e.target.checked;
                this.toggleParticles(e.target.checked);
                this.saveSettings();
            });
        }

        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                this.settings.animations = e.target.checked;
                this.toggleAnimations(e.target.checked);
                this.saveSettings();
            });
        }

        if (autoSyncToggle) {
            autoSyncToggle.addEventListener('change', (e) => {
                this.settings.autoSync = e.target.checked;
                this.saveSettings();
            });
        }

        if (backupToggle) {
            backupToggle.addEventListener('change', (e) => {
                this.settings.backup = e.target.checked;
                this.saveSettings();
            });
        }

        if (lazyLoadingToggle) {
            lazyLoadingToggle.addEventListener('change', (e) => {
                this.settings.lazyLoading = e.target.checked;
                this.saveSettings();
            });
        }

        if (preloadToggle) {
            preloadToggle.addEventListener('change', (e) => {
                this.settings.preload = e.target.checked;
                this.saveSettings();
            });
        }
    }

    setupLightboxFunctionality() {
        const lightbox = document.getElementById('lightbox');
        const closeLightbox = document.getElementById('close-lightbox');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const shareBtn = document.getElementById('share-btn');
        const downloadBtn = document.getElementById('download-btn');
        const favoriteBtn = document.getElementById('favorite-btn');
        const editBtn = document.getElementById('edit-btn');

        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                this.playSound('click');
                this.closeLightbox();
            });
        }

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
                    this.closeLightbox();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.playSound('click');
                this.navigateLightbox(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.playSound('click');
                this.navigateLightbox(1);
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.playSound('click');
                this.shareMedia();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.playSound('click');
                this.downloadMedia();
            });
        }

        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.playSound('click');
                this.toggleFavorite();
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.playSound('click');
                this.editMedia();
            });
        }

        // Rating system
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                this.playSound('click');
                this.rateMedia(parseInt(e.target.dataset.rating));
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeAllModals();
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (document.getElementById('lightbox').style.display !== 'none') {
                        this.navigateLightbox(-1);
                    }
                    break;
                case 'ArrowRight':
                    if (document.getElementById('lightbox').style.display !== 'none') {
                        this.navigateLightbox(1);
                    }
                    break;
                case 'f':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                    }
                    break;
                case 's':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.downloadAllMedia();
                    }
                    break;
            }
        });
    }

    setupCloudSync() {
        // Cloud service connection buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playSound('click');
                const service = e.target.closest('.cloud-service').querySelector('.service-name').textContent;
                this.connectCloudService(service);
            });
        });
    }

    setupAIEnhancement() {
        // AI enhancement will be implemented here
        // This is a placeholder for future AI integration
    }

    loadSampleData() {
        // Sample media items with enhanced metadata
        this.mediaItems = [
            {
                id: 1,
                type: 'image',
                src: 'https://picsum.photos/400/600?random=1',
                thumbnail: 'https://picsum.photos/200/300?random=1',
                title: 'منظر طبيعي خلاب',
                description: 'صورة جميلة لمنظر طبيعي في فصل الربيع',
                category: 'طبيعة',
                brand: 'كانون',
                tags: ['طبيعة', 'ربيع', 'جبال', 'أشجار'],
                rating: 4.5,
                views: 1250,
                likes: 89,
                favorites: false,
                date: '2024-01-15',
                size: '2.5 MB',
                dimensions: '1920x1080',
                camera: 'Canon EOS R5',
                settings: 'f/8, 1/125s, ISO 100'
            },
            {
                id: 2,
                type: 'image',
                src: 'https://picsum.photos/600/400?random=2',
                thumbnail: 'https://picsum.photos/300/200?random=2',
                title: 'فن معماري حديث',
                description: 'تصميم معماري مبتكر يجمع بين الحداثة والتراث',
                category: 'معمارية',
                brand: 'نيكون',
                tags: ['معمارية', 'حديث', 'تصميم', 'مباني'],
                rating: 4.8,
                views: 2100,
                likes: 156,
                favorites: true,
                date: '2024-01-20',
                size: '3.2 MB',
                dimensions: '2560x1440',
                camera: 'Nikon D850',
                settings: 'f/11, 1/60s, ISO 200'
            },
            {
                id: 3,
                type: 'video',
                src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                thumbnail: 'https://picsum.photos/400/300?random=3',
                title: 'فيديو تجريبي',
                description: 'فيديو تجريبي لاختبار المعرض',
                category: 'عام',
                brand: 'سوني',
                tags: ['فيديو', 'تجريبي', 'اختبار'],
                rating: 4.2,
                views: 890,
                likes: 67,
                favorites: false,
                date: '2024-01-25',
                size: '5.8 MB',
                dimensions: '1280x720',
                duration: '0:30',
                format: 'MP4'
            },
            {
                id: 4,
                type: 'image',
                src: 'https://picsum.photos/500/700?random=4',
                thumbnail: 'https://picsum.photos/250/350?random=4',
                title: 'لوحة فنية رقمية',
                description: 'عمل فني رقمي يعبر عن الإبداع المعاصر',
                category: 'فن',
                brand: 'فوجي',
                tags: ['فن', 'رقمي', 'إبداع', 'ألوان'],
                rating: 4.7,
                views: 1680,
                likes: 134,
                favorites: true,
                date: '2024-02-01',
                size: '4.1 MB',
                dimensions: '1800x2400',
                camera: 'Fujifilm X-T4',
                settings: 'f/5.6, 1/250s, ISO 400'
            },
            {
                id: 5,
                type: 'image',
                src: 'https://picsum.photos/800/500?random=5',
                thumbnail: 'https://picsum.photos/400/250?random=5',
                title: 'تصوير طعام احترافي',
                description: 'تصوير احترافي لطبق شرقي تقليدي',
                category: 'طعام',
                brand: 'أوليمبوس',
                tags: ['طعام', 'احترافي', 'شرقي', 'تقليدي'],
                rating: 4.6,
                views: 1420,
                likes: 98,
                favorites: false,
                date: '2024-02-05',
                size: '3.7 MB',
                dimensions: '2400x1600',
                camera: 'Olympus OM-D E-M1',
                settings: 'f/4, 1/100s, ISO 320'
            }
        ];

        this.filteredItems = [...this.mediaItems];
        this.displayItems();
        this.updateCounts();
    }

    filterAndDisplayItems() {
        this.filteredItems = this.mediaItems.filter(item => {
            const matchesFilter = this.currentFilter === 'all' || 
                                (this.currentFilter === 'images' && item.type === 'image') ||
                                (this.currentFilter === 'videos' && item.type === 'video') ||
                                (this.currentFilter === 'favorites' && item.favorites);
            
            const matchesSearch = this.searchTerm === '' ||
                                item.title.toLowerCase().includes(this.searchTerm) ||
                                item.description.toLowerCase().includes(this.searchTerm) ||
                                item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesFilter && matchesSearch;
        });

        this.displayItems();
        this.updateCounts();
    }

    displayItems() {
        const gallery = document.getElementById('gallery');
        const gallery3D = document.getElementById('gallery-3d');
        const timelineView = document.getElementById('timeline-view');

        // Hide all views first
        gallery.style.display = 'none';
        gallery3D.style.display = 'none';
        timelineView.style.display = 'none';

        switch(this.currentView) {
            case 'masonry':
                this.displayMasonryView();
                break;
            case 'grid':
                this.displayGridView();
                break;
            case 'rolling':
                this.displayRollingView();
                break;
            case '3d':
                this.display3DView();
                break;
            case 'timeline':
                this.displayTimelineView();
                break;
        }
    }

    displayMasonryView() {
        const gallery = document.getElementById('gallery');
        gallery.style.display = 'block';
        gallery.className = 'gallery masonry-view';
        
        if (this.masonryInstance) {
            this.masonryInstance.destroy();
        }

        gallery.innerHTML = '';
        
        this.filteredItems.forEach(item => {
            const itemElement = this.createGalleryItem(item);
            gallery.appendChild(itemElement);
        });

        // Initialize Masonry after images load
        imagesLoaded(gallery, () => {
            this.masonryInstance = new Masonry(gallery, {
                itemSelector: '.gallery-item',
                columnWidth: '.gallery-item',
                gutter: 20,
                fitWidth: true
            });
        });
    }

    displayGridView() {
        const gallery = document.getElementById('gallery');
        gallery.style.display = 'block';
        gallery.className = 'gallery grid-view';
        
        if (this.masonryInstance) {
            this.masonryInstance.destroy();
        }

        gallery.innerHTML = '';
        
        this.filteredItems.forEach(item => {
            const itemElement = this.createGalleryItem(item);
            gallery.appendChild(itemElement);
        });
    }

    displayRollingView() {
        const gallery = document.getElementById('gallery');
        gallery.style.display = 'block';
        gallery.className = 'gallery rolling-view';
        
        if (this.masonryInstance) {
            this.masonryInstance.destroy();
        }

        gallery.innerHTML = '';
        
        this.filteredItems.forEach(item => {
            const itemElement = this.createRollingItem(item);
            gallery.appendChild(itemElement);
        });

        this.startRollingAnimation();
    }

    display3DView() {
        const gallery3D = document.getElementById('gallery-3d');
        gallery3D.style.display = 'block';
        
        this.init3DGallery();
    }

    displayTimelineView() {
        const timelineView = document.getElementById('timeline-view');
        timelineView.style.display = 'block';
        
        const timelineContainer = timelineView.querySelector('.timeline-container');
        timelineContainer.innerHTML = '';
        
        // Group items by date
        const groupedItems = this.groupItemsByDate();
        
        Object.keys(groupedItems).sort().reverse().forEach(date => {
            const timelineGroup = this.createTimelineGroup(date, groupedItems[date]);
            timelineContainer.appendChild(timelineGroup);
        });
    }

    createGalleryItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'gallery-item glass-effect';
        itemElement.dataset.id = item.id;
        
        const aspectRatio = item.type === 'video' ? '16/9' : 'auto';
        
        itemElement.innerHTML = `
            <div class="item-media" style="aspect-ratio: ${aspectRatio}">
                ${item.type === 'video' ? 
                    `<video src="${item.src}" poster="${item.thumbnail}" preload="metadata"></video>
                     <div class="video-overlay">
                         <div class="play-button">▶</div>
                         <div class="video-duration">${item.duration || '0:00'}</div>
                     </div>` :
                    `<img src="${this.settings.lazyLoading ? item.thumbnail : item.src}" 
                          data-src="${item.src}" 
                          alt="${item.title}" 
                          loading="${this.settings.lazyLoading ? 'lazy' : 'eager'}">`
                }
                <div class="item-overlay">
                    <div class="item-actions">
                        <button class="action-btn favorite-btn ${item.favorites ? 'active' : ''}" 
                                data-action="favorite" title="إضافة للمفضلة">
                            ❤️
                        </button>
                        <button class="action-btn share-btn" data-action="share" title="مشاركة">
                            📤
                        </button>
                        <button class="action-btn download-btn" data-action="download" title="تحميل">
                            💾
                        </button>
                    </div>
                </div>
            </div>
            <div class="item-info">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <div class="item-stats">
                        <span class="views">👁️ ${this.formatNumber(item.views)}</span>
                        <span class="likes">❤️ ${this.formatNumber(item.likes)}</span>
                        <span class="rating">⭐ ${item.rating}</span>
                    </div>
                    <div class="item-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add click event to open lightbox
        itemElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('action-btn')) {
                this.playSound('click');
                this.openLightbox(item.id);
            }
        });

        // Add action button events
        itemElement.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSound('click');
                this.handleItemAction(item.id, e.target.dataset.action);
            });
        });

        return itemElement;
    }

    createRollingItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'rolling-item';
        itemElement.dataset.id = item.id;
        
        itemElement.innerHTML = `
            <div class="rolling-media">
                ${item.type === 'video' ? 
                    `<video src="${item.src}" poster="${item.thumbnail}"></video>` :
                    `<img src="${item.thumbnail}" alt="${item.title}">`
                }
            </div>
            <div class="rolling-info">
                <h4>${item.title}</h4>
                <div class="rolling-stats">
                    <span>⭐ ${item.rating}</span>
                    <span>👁️ ${this.formatNumber(item.views)}</span>
                </div>
            </div>
        `;

        itemElement.addEventListener('click', () => {
            this.playSound('click');
            this.openLightbox(item.id);
        });

        return itemElement;
    }

    createTimelineGroup(date, items) {
        const groupElement = document.createElement('div');
        groupElement.className = 'timeline-group';
        
        groupElement.innerHTML = `
            <div class="timeline-date">
                <h3>${this.formatDate(date)}</h3>
                <div class="timeline-line"></div>
            </div>
            <div class="timeline-items">
                ${items.map(item => `
                    <div class="timeline-item" data-id="${item.id}">
                        <div class="timeline-media">
                            ${item.type === 'video' ? 
                                `<video src="${item.src}" poster="${item.thumbnail}"></video>` :
                                `<img src="${item.thumbnail}" alt="${item.title}">`
                            }
                        </div>
                        <div class="timeline-content">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="timeline-meta">
                                <span class="category">${item.category}</span>
                                <span class="rating">⭐ ${item.rating}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click events to timeline items
        groupElement.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => {
                this.playSound('click');
                this.openLightbox(parseInt(item.dataset.id));
            });
        });

        return groupElement;
    }

    init3DGallery() {
        const canvas = document.getElementById('three-canvas');
        const container = document.getElementById('gallery-3d');
        
        // Initialize Three.js scene
        this.scene3D = new THREE.Scene();
        this.camera3D = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.renderer3D = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        
        this.renderer3D.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer3D.setClearColor(0x000000, 0);
        
        // Create 3D gallery group
        this.group3D = new THREE.Group();
        this.scene3D.add(this.group3D);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene3D.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene3D.add(directionalLight);
        
        // Create 3D items
        this.create3DItems();
        
        // Position camera
        this.camera3D.position.z = 10;
        
        // Start animation
        this.animate3D();
        
        // Setup 3D controls
        this.setup3DControls();
    }

    create3DItems() {
        const radius = 8;
        const itemCount = this.filteredItems.length;
        
        this.filteredItems.forEach((item, index) => {
            const angle = (index / itemCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 4;
            
            // Create plane geometry for image/video
            const geometry = new THREE.PlaneGeometry(2, 2);
            
            // Load texture
            const loader = new THREE.TextureLoader();
            loader.load(item.thumbnail, (texture) => {
                const material = new THREE.MeshLambertMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0.9
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);
                mesh.lookAt(0, y, 0);
                mesh.userData = { id: item.id, item: item };
                
                this.group3D.add(mesh);
                
                // Add click event
                mesh.addEventListener = (event, callback) => {
                    // This would need a proper raycaster implementation
                };
            });
        });
    }

    animate3D() {
        this.animationId = requestAnimationFrame(() => this.animate3D());
        
        // Rotate the group slowly
        if (this.group3D) {
            this.group3D.rotation.y += 0.005;
        }
        
        this.renderer3D.render(this.scene3D, this.camera3D);
    }

    setup3DControls() {
        const rotateLeft = document.getElementById('rotate-left');
        const rotateRight = document.getElementById('rotate-right');
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        
        if (rotateLeft) {
            rotateLeft.addEventListener('click', () => {
                this.group3D.rotation.y -= 0.2;
            });
        }
        
        if (rotateRight) {
            rotateRight.addEventListener('click', () => {
                this.group3D.rotation.y += 0.2;
            });
        }
        
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.camera3D.position.z = Math.max(5, this.camera3D.position.z - 1);
            });
        }
        
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.camera3D.position.z = Math.min(20, this.camera3D.position.z + 1);
            });
        }
    }

    startRollingAnimation() {
        if (this.rollingInterval) {
            clearInterval(this.rollingInterval);
        }
        
        const gallery = document.getElementById('gallery');
        let scrollPosition = 0;
        
        this.rollingInterval = setInterval(() => {
            scrollPosition += 2;
            if (scrollPosition >= gallery.scrollWidth) {
                scrollPosition = 0;
            }
            gallery.scrollLeft = scrollPosition;
        }, 50);
    }

    openLightbox(itemId) {
        const item = this.mediaItems.find(i => i.id === itemId);
        if (!item) return;
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxVideo = document.getElementById('lightbox-video');
        const lightboxTitle = document.querySelector('.lightbox-title');
        
        // Update view count
        item.views++;
        this.updateStats();
        
        // Set current index
        this.currentImageIndex = this.filteredItems.findIndex(i => i.id === itemId);
        
        // Update lightbox content
        lightboxTitle.textContent = item.title;
        
        if (item.type === 'video') {
            lightboxImage.style.display = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = item.src;
        } else {
            lightboxVideo.style.display = 'none';
            lightboxImage.style.display = 'block';
            lightboxImage.src = item.src;
            lightboxImage.alt = item.title;
        }
        
        // Update info
        this.updateLightboxInfo(item);
        
        // Show lightbox
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add animation
        gsap.fromTo(lightbox.querySelector('.lightbox-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    }

    updateLightboxInfo(item) {
        document.getElementById('media-views').textContent = this.formatNumber(item.views);
        document.getElementById('media-likes').textContent = this.formatNumber(item.likes);
        document.getElementById('media-date').textContent = this.formatDate(item.date);
        document.getElementById('media-description-text').textContent = item.description;
        document.querySelector('.rating-value').textContent = item.rating;
        
        // Update stars
        document.querySelectorAll('.star').forEach((star, index) => {
            star.classList.toggle('active', index < Math.floor(item.rating));
        });
        
        // Update tags
        const tagsContainer = document.getElementById('media-tags-container');
        tagsContainer.innerHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // Update favorite button
        const favoriteBtn = document.getElementById('favorite-btn');
        favoriteBtn.classList.toggle('active', item.favorites);
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxVideo = document.getElementById('lightbox-video');
        
        // Pause video if playing
        if (lightboxVideo.src) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
        
        // Hide lightbox
        gsap.to(lightbox.querySelector('.lightbox-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    navigateLightbox(direction) {
        this.currentImageIndex += direction;
        
        if (this.currentImageIndex >= this.filteredItems.length) {
            this.currentImageIndex = 0;
        } else if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.filteredItems.length - 1;
        }
        
        const item = this.filteredItems[this.currentImageIndex];
        this.openLightbox(item.id);
    }

    handleItemAction(itemId, action) {
        const item = this.mediaItems.find(i => i.id === itemId);
        if (!item) return;
        
        switch(action) {
            case 'favorite':
                this.toggleItemFavorite(item);
                break;
            case 'share':
                this.shareItem(item);
                break;
            case 'download':
                this.downloadItem(item);
                break;
        }
    }

    toggleItemFavorite(item) {
        item.favorites = !item.favorites;
        this.updateItemDisplay(item);
        this.updateCounts();
        this.saveToLocalStorage();
        
        const message = item.favorites ? 'تم إضافة العنصر للمفضلة' : 'تم إزالة العنصر من المفضلة';
        this.showNotification(message, 'success');
    }

    shareItem(item) {
        if (navigator.share) {
            navigator.share({
                title: item.title,
                text: item.description,
                url: item.src
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(item.src).then(() => {
                this.showNotification('تم نسخ الرابط إلى الحافظة', 'success');
            });
        }
    }

    downloadItem(item) {
        const link = document.createElement('a');
        link.href = item.src;
        link.download = `${item.title}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
        link.click();
        
        this.showNotification('بدأ التحميل', 'success');
    }

    updateItemDisplay(item) {
        const itemElement = document.querySelector(`[data-id="${item.id}"]`);
        if (itemElement) {
            const favoriteBtn = itemElement.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.classList.toggle('active', item.favorites);
            }
        }
    }

    updateCounts() {
        const allCount = this.mediaItems.length;
        const imagesCount = this.mediaItems.filter(item => item.type === 'image').length;
        const videosCount = this.mediaItems.filter(item => item.type === 'video').length;
        const favoritesCount = this.mediaItems.filter(item => item.favorites).length;
        
        document.getElementById('count-all').textContent = allCount;
        document.getElementById('count-images').textContent = imagesCount;
        document.getElementById('count-videos').textContent = videosCount;
        document.getElementById('count-favorites').textContent = favoritesCount;
    }

    updateStats() {
        const totalItems = this.mediaItems.length;
        this.totalViews = this.mediaItems.reduce((sum, item) => sum + item.views, 0);
        const totalLikes = this.mediaItems.reduce((sum, item) => sum + item.likes, 0);
        const avgRating = this.mediaItems.reduce((sum, item) => sum + item.rating, 0) / totalItems;
        
        document.getElementById('total-items').textContent = this.formatNumber(totalItems);
        document.getElementById('total-views').textContent = this.formatNumber(this.totalViews);
        document.getElementById('cloud-storage').textContent = `${this.cloudStorage.toFixed(1)} GB`;
        document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
    }

    // Cloud functionality
    syncWithCloud() {
        const syncIndicator = document.querySelector('.sync-indicator');
        syncIndicator.classList.add('syncing');
        
        // Simulate cloud sync
        setTimeout(() => {
            syncIndicator.classList.remove('syncing');
            this.showNotification('تم مزامنة البيانات مع السحابة', 'success');
        }, 2000);
    }

    connectCloudProvider(provider) {
        // This would integrate with actual cloud APIs
        this.showNotification(`جاري الاتصال بـ ${provider}...`, 'info');
        
        // Simulate connection
        setTimeout(() => {
            this.cloudProviders[provider].connected = true;
            this.showNotification(`تم الاتصال بـ ${provider} بنجاح`, 'success');
            this.updateCloudUI();
        }, 1500);
    }

    connectCloudService(serviceName) {
        // Placeholder for cloud service connection
        this.showNotification(`جاري الاتصال بـ ${serviceName}...`, 'info');
    }

    enhanceWithAI() {
        this.showNotification('جاري تحسين الصور بالذكاء الاصطناعي...', 'info');
        
        // Simulate AI enhancement
        setTimeout(() => {
            this.showNotification('تم تحسين الصور بنجاح', 'success');
        }, 3000);
    }

    // Upload functionality
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (this.isValidFile(file)) {
                this.uploadQueue.push(file);
                this.showUploadPreview(file);
            }
        });
    }

    isValidFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi'];
        const maxSize = 50 * 1024 * 1024; // 50MB
        
        if (!validTypes.includes(file.type)) {
            this.showNotification('نوع الملف غير مدعوم', 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            this.showNotification('حجم الملف كبير جداً', 'error');
            return false;
        }
        
        return true;
    }

    showUploadPreview(file) {
        // Show preview of uploaded file
        const reader = new FileReader();
        reader.onload = (e) => {
            // Add preview to upload area
            this.showNotification(`تم إضافة ${file.name} إلى قائمة الرفع`, 'success');
        };
        reader.readAsDataURL(file);
    }

    processUploadQueue() {
        if (this.uploadQueue.length === 0) {
            this.showNotification('لا توجد ملفات للرفع', 'warning');
            return;
        }
        
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progressContainer = document.getElementById('upload-progress');
        
        progressContainer.style.display = 'block';
        
        let uploaded = 0;
        const total = this.uploadQueue.length;
        
        this.uploadQueue.forEach((file, index) => {
            setTimeout(() => {
                this.uploadFile(file).then(() => {
                    uploaded++;
                    const progress = (uploaded / total) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${Math.round(progress)}%`;
                    
                    if (uploaded === total) {
                        this.showNotification('تم رفع جميع الملفات بنجاح', 'success');
                        this.uploadQueue = [];
                        progressContainer.style.display = 'none';
                        this.closeModal('upload-modal');
                    }
                });
            }, index * 500);
        });
    }

    async uploadFile(file) {
        // Simulate file upload
        return new Promise((resolve) => {
            setTimeout(() => {
                // Create new media item
                const newItem = {
                    id: Date.now() + Math.random(),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    src: URL.createObjectURL(file),
                    thumbnail: URL.createObjectURL(file),
                    title: document.getElementById('media-title').value || file.name,
                    description: document.getElementById('media-description').value || '',
                    category: document.getElementById('media-category').value,
                    brand: document.getElementById('media-brand').value,
                    tags: document.getElementById('media-tags').value.split(',').map(tag => tag.trim()),
                    rating: 0,
                    views: 0,
                    likes: 0,
                    favorites: false,
                    date: new Date().toISOString().split('T')[0],
                    size: this.formatFileSize(file.size),
                    dimensions: '1920x1080' // Would be detected from actual file
                };
                
                this.mediaItems.unshift(newItem);
                this.filterAndDisplayItems();
                this.updateStats();
                this.saveToLocalStorage();
                
                resolve();
            }, 1000);
        });
    }

    fetchFromUrl(url) {
        if (!url) {
            this.showNotification('يرجى إدخال رابط صحيح', 'error');
            return;
        }
        
        this.showNotification('جاري جلب الملف من الرابط...', 'info');
        
        // Simulate URL fetch
        setTimeout(() => {
            const newItem = {
                id: Date.now(),
                type: 'image',
                src: url,
                thumbnail: url,
                title: 'صورة من رابط',
                description: 'تم جلبها من رابط خارجي',
                category: 'عام',
                brand: '',
                tags: ['رابط', 'خارجي'],
                rating: 0,
                views: 0,
                likes: 0,
                favorites: false,
                date: new Date().toISOString().split('T')[0]
            };
            
            this.mediaItems.unshift(newItem);
            this.filterAndDisplayItems();
            this.updateStats();
            this.saveToLocalStorage();
            
            this.showNotification('تم جلب الملف بنجاح', 'success');
            this.closeModal('upload-modal');
        }, 2000);
    }

    // Settings functionality
    changeBackground(background) {
        this.currentBackground = background;
        document.body.className = document.body.className.replace(/bg-\w+/g, '');
        document.body.classList.add(`bg-${background}`);
        this.saveSettings();
    }

    changeFont(font) {
        this.currentFont = font;
        document.body.className = document.body.className.replace(/font-\w+/g, '');
        document.body.classList.add(`font-${font}`);
        this.saveSettings();
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        this.saveSettings();
    }

    toggleParticles(enabled) {
        const particlesContainer = document.getElementById('particles-js');
        if (enabled) {
            particlesContainer.style.display = 'block';
            this.initializeParticles();
        } else {
            particlesContainer.style.display = 'none';
        }
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            font: this.currentFont,
            background: this.currentBackground,
            sound: this.soundEnabled,
            ...this.settings
        };
        
        localStorage.setItem('zamzam-gallery-settings', JSON.stringify(settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('zamzam-gallery-settings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            this.currentTheme = settings.theme || 'purple';
            this.currentFont = settings.font || 'cairo';
            this.currentBackground = settings.background || 'gradient';
            this.soundEnabled = settings.sound !== false;
            
            Object.assign(this.settings, settings);
            
            // Apply settings
            this.changeTheme(this.currentTheme);
            this.changeFont(this.currentFont);
            this.changeBackground(this.currentBackground);
            
            // Update UI
            this.updateSettingsUI();
        }
    }

    updateSettingsUI() {
        // Update active states in settings modal
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
        
        document.querySelectorAll('.font-option').forEach(option => {
            option.classList.toggle('active', option.dataset.font === this.currentFont);
        });
        
        document.querySelectorAll('.bg-option').forEach(option => {
            option.classList.toggle('active', option.dataset.bg === this.currentBackground);
        });
        
        // Update toggles
        document.getElementById('sound-toggle').checked = this.soundEnabled;
        document.getElementById('particles-toggle').checked = this.settings.particles;
        document.getElementById('animations-toggle').checked = this.settings.animations;
        document.getElementById('auto-sync-toggle').checked = this.settings.autoSync;
        document.getElementById('backup-toggle').checked = this.settings.backup;
        document.getElementById('lazy-loading-toggle').checked = this.settings.lazyLoading;
        document.getElementById('preload-toggle').checked = this.settings.preload;
    }

    saveAllSettings() {
        // Save social links
        this.socialLinks.facebook = document.getElementById('facebook-link').value;
        this.socialLinks.instagram = document.getElementById('instagram-link').value;
        this.socialLinks.twitter = document.getElementById('twitter-link').value;
        this.socialLinks.youtube = document.getElementById('youtube-link').value;
        this.socialLinks.whatsapp = document.getElementById('whatsapp-link').value;
        
        this.saveSettings();
        this.updateSocialIcons();
    }

    updateSocialIcons() {
        const socialContainer = document.getElementById('footer-social');
        socialContainer.innerHTML = '';
        
        Object.entries(this.socialLinks).forEach(([platform, url]) => {
            if (url) {
                const icon = document.createElement('a');
                icon.href = url;
                icon.target = '_blank';
                icon.className = 'social-icon';
                icon.innerHTML = this.getSocialIcon(platform);
                socialContainer.appendChild(icon);
            }
        });
    }

    getSocialIcon(platform) {
        const icons = {
            facebook: '📘',
            instagram: '📷',
            twitter: '🐦',
            youtube: '📺',
            whatsapp: '💬'
        };
        return icons[platform] || '🔗';
    }

    // Utility functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    groupItemsByDate() {
        const grouped = {};
        this.filteredItems.forEach(item => {
            const date = item.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });
        return grouped;
    }

    // Modal functionality
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        gsap.fromTo(modal.querySelector('.modal-content'), 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'flex') {
                this.closeModal(modal.id);
            }
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.fromTo(notification, 
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
        );
        
        // Auto remove
        setTimeout(() => {
            gsap.to(notification, {
                x: 300,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    notification.remove();
                }
            });
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    // Audio functionality
    playSound(soundName) {
        if (!this.soundEnabled) return;
        
        const audio = new Audio(`./audio/${soundName}.wav`);
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Ignore audio play errors
        });
    }

    // Particles initialization
    initializeParticles() {
        if (!this.settings.particles) return;
        
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#8B5CF6" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#8B5CF6", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    }

    // Loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progress = loadingScreen.querySelector('.loading-progress');
        
        // Animate progress bar
        gsap.to(progress, {
            width: '100%',
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                // Hide loading screen
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                    }
                });
            }
        });
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.playSound('welcome');
            this.showNotification('مرحباً بك في معرض زمزم المحسن', 'success');
        }, 2500);
    }

    // Service Worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(() => {
                    console.log('Service Worker registered');
                })
                .catch(() => {
                    console.log('Service Worker registration failed');
                });
        }
    }

    initializeCloudSync() {
        // Initialize cloud sync functionality
        this.cloudStorage = 2.3; // GB
    }

    // Local storage
    saveToLocalStorage() {
        localStorage.setItem('zamzam-gallery-media', JSON.stringify(this.mediaItems));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('zamzam-gallery-media');
        if (saved) {
            this.mediaItems = JSON.parse(saved);
            this.filterAndDisplayItems();
        }
    }

    // Advanced search
    toggleAdvancedSearch() {
        // Placeholder for advanced search functionality
        this.showNotification('البحث المتقدم قيد التطوير', 'info');
    }

    // Media actions
    shareMedia() {
        const currentItem = this.filteredItems[this.currentImageIndex];
        this.shareItem(currentItem);
    }

    downloadMedia() {
        const currentItem = this.filteredItems[this.currentImageIndex];
        this.downloadItem(currentItem);
    }

    toggleFavorite() {
        const currentItem = this.filteredItems[this.currentImageIndex];
        this.toggleItemFavorite(currentItem);
        this.updateLightboxInfo(currentItem);
    }

    editMedia() {
        this.showNotification('محرر الوسائط قيد التطوير', 'info');
    }

    rateMedia(rating) {
        const currentItem = this.filteredItems[this.currentImageIndex];
        currentItem.rating = rating;
        this.updateLightboxInfo(currentItem);
        this.updateStats();
        this.saveToLocalStorage();
        this.showNotification(`تم تقييم الوسائط بـ ${rating} نجوم`, 'success');
    }

    downloadAllMedia() {
        this.showNotification('جاري تحميل جميع الوسائط...', 'info');
        // This would implement bulk download functionality
    }

    updateCloudUI() {
        // Update cloud connection status in UI
        document.querySelectorAll('.cloud-service').forEach(service => {
            const serviceName = service.querySelector('.service-name').textContent;
            const status = service.querySelector('.service-status');
            const button = service.querySelector('.connect-btn');
            
            // This would check actual connection status
            // For now, just update UI based on stored state
        });
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zamzamGallery = new EnhancedZamzamGallery();
});

// Setup modal close functionality
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && window.zamzamGallery) {
                window.zamzamGallery.closeModal(modal.id);
            }
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && window.zamzamGallery) {
                window.zamzamGallery.closeModal(modal.id);
            }
        });
    });
});

