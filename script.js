// Configuração do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class DocumentReader {
    constructor() {
        this.documents = [];
        this.currentDocument = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.zoomLevel = 1.0;
        this.isFullscreen = false;
        this.escHandler = null;
        
        // Inicializar PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        this.initializeElements();
        this.bindEvents();
        this.loadStoredDocuments();
        this.adjustSidebarForScreenSize();
        
        console.log('DocumentReader initialized');
        console.log('All elements:', {
            sidebar: this.sidebar,
            closeSidebar: this.closeSidebar,
            menuBtn: this.menuBtn,
            sidebarOverlay: this.sidebarOverlay
        });
    }

    initializeElements() {
        // Elementos da interface
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.menuBtn = document.getElementById('menuBtn');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.fileInput = document.getElementById('fileInput');
        this.fileInputWelcome = document.getElementById('fileInputWelcome');
        this.documentList = document.getElementById('documents');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.viewerContainer = document.getElementById('viewerContainer');
        this.viewerWrapper = document.getElementById('viewerWrapper');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Elementos da toolbar
        this.currentDocumentTitle = document.getElementById('currentDocumentTitle');
        this.prevPage = document.getElementById('prevPage');
        this.nextPage = document.getElementById('nextPage');
        this.pageInfo = document.getElementById('pageInfo');
        this.zoomOut = document.getElementById('zoomOut');
        this.zoomIn = document.getElementById('zoomIn');
        this.zoomLevel = document.getElementById('zoomLevel');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Debug: verificar se o botão de fechar foi encontrado
        console.log('closeSidebar element:', this.closeSidebar);
    }

    bindEvents() {
        // Eventos da sidebar
        this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Verificar se o botão de fechar existe antes de adicionar o evento
        if (this.closeSidebar) {
            console.log('Adding click event to closeSidebar');
            
            // Remover eventos existentes para evitar duplicação
            this.closeSidebar.removeEventListener('click', this.handleCloseSidebar);
            this.closeSidebar.removeEventListener('touchstart', this.handleCloseSidebar);
            this.closeSidebar.removeEventListener('mousedown', this.handleCloseSidebar);
            
            // Adicionar eventos
            this.closeSidebar.addEventListener('click', this.handleCloseSidebar);
            this.closeSidebar.addEventListener('touchstart', this.handleCloseSidebar);
            this.closeSidebar.addEventListener('mousedown', this.handleCloseSidebar);
            
            // Teste de clique programático
            setTimeout(() => {
                console.log('Testing close button functionality...');
                console.log('Close button element:', this.closeSidebar);
                console.log('Close button visible:', this.closeSidebar.offsetParent !== null);
                console.log('Close button styles:', window.getComputedStyle(this.closeSidebar));
            }, 2000);
            
        } else {
            console.error('closeSidebar element not found!');
            // Tentar encontrar o elemento novamente
            setTimeout(() => {
                this.closeSidebar = document.getElementById('closeSidebar');
                if (this.closeSidebar) {
                    console.log('Found closeSidebar element on retry');
                    this.bindEvents();
                } else {
                    console.error('closeSidebar element still not found after retry');
                }
            }, 1000);
        }
        
        // Overlay para fechar sidebar no mobile
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => this.closeSidebarMenu());
        }
        
        // Eventos de upload
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.fileInputWelcome.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Evento limpar todos
        this.clearAllBtn.addEventListener('click', () => this.confirmClearAll());
        
        // Eventos de navegação
        this.prevPage.addEventListener('click', () => this.previousPage());
        this.nextPage.addEventListener('click', () => this.nextPage());
        
        // Eventos de zoom
        this.zoomOut.addEventListener('click', () => this.zoomOut());
        this.zoomIn.addEventListener('click', () => this.zoomIn());
        
        // Evento fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Eventos de redimensionamento
        window.addEventListener('resize', () => this.handleResize());
        
        // Touch events para mobile
        this.addTouchEvents();
    }

    // Método separado para lidar com o fechamento da sidebar
    handleCloseSidebar = (e) => {
        console.log('handleCloseSidebar called with event:', e.type);
        e.preventDefault();
        e.stopPropagation();
        this.closeSidebarMenu();
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.toggle('active');
        }
        
        // Prevenir scroll do body quando sidebar está aberta no mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = this.sidebar.classList.contains('open') ? 'hidden' : '';
        }
    }

    closeSidebarMenu() {
        console.log('closeSidebarMenu called');
        console.log('Sidebar before close:', this.sidebar.classList.contains('open'));
        
        this.sidebar.classList.remove('open');
        
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
        
        console.log('Sidebar after close:', this.sidebar.classList.contains('open'));
        
        // Forçar reflow para garantir que a animação seja aplicada
        this.sidebar.offsetHeight;
    }

    addTouchEvents() {
        // Swipe para fechar sidebar no mobile
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe horizontal para direita (fechar sidebar)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50 && this.sidebar.classList.contains('open')) {
                this.closeSidebarMenu();
            }
            
            // Swipe horizontal para esquerda (abrir sidebar)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50 && !this.sidebar.classList.contains('open')) {
                this.toggleSidebar();
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Double tap para zoom no mobile
        let lastTap = 0;
        this.viewerWrapper.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                if (this.currentDocument && this.currentDocument.type === 'PDF') {
                    if (this.zoomLevel < 2.0) {
                        this.zoomLevel = 2.0;
                    } else {
                        this.zoomLevel = 1.0;
                    }
                    this.renderCurrentPage();
                    this.updateControls();
                }
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            await this.addDocument(file);
        }
        
        // Limpar input
        event.target.value = '';
    }

    async addDocument(file) {
        const document = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: this.getFileType(file.name),
            file: file,
            size: this.formatFileSize(file.size),
            addedAt: new Date().toLocaleDateString()
        };

        this.documents.push(document);
        this.renderDocumentList();
        this.saveDocumentsToStorage();
        
        // Se for o primeiro documento, abrir automaticamente
        if (this.documents.length === 1) {
            this.openDocument(document);
        }
    }

    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'pdf': 'PDF',
            'epub': 'EPUB',
            'mobi': 'MOBI'
        };
        return typeMap[extension] || 'Unknown';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    renderDocumentList() {
        this.documentList.innerHTML = '';
        
        // Mostrar/ocultar botão "Limpar Todos"
        if (this.documents.length > 0) {
            this.clearAllBtn.style.display = 'flex';
        } else {
            this.clearAllBtn.style.display = 'none';
        }
        
        if (this.documents.length === 0) {
            this.documentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>Nenhum documento adicionado</p>
                    <small>Arraste arquivos ou clique em "Adicionar Documento"</small>
                </div>
            `;
            return;
        }
        
        this.documents.forEach((doc, index) => {
            const docElement = document.createElement('div');
            docElement.className = 'document-item';
            docElement.setAttribute('data-doc-id', doc.id);
            
            if (this.currentDocument && this.currentDocument.id === doc.id) {
                docElement.classList.add('active');
            }
            
            docElement.innerHTML = `
                <div class="document-info">
                    <h4>${doc.name}</h4>
                    <p>${doc.type} • ${doc.size} • ${doc.addedAt}</p>
                </div>
                <div class="document-actions">
                    <button class="remove-btn" title="Remover documento" type="button" onclick="if(window.documentReader) { console.log('Remove button clicked via onclick for:', '${doc.name}'); window.documentReader.confirmRemoveDocument(${JSON.stringify(doc).replace(/"/g, '&quot;')}); } else { console.log('DocumentReader not available'); }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Evento para abrir documento
            const documentInfo = docElement.querySelector('.document-info');
            documentInfo.addEventListener('click', () => {
                console.log('Abrindo documento:', doc.name);
                this.openDocument(doc);
            });
            
            // Evento para remover documento
            const removeBtn = docElement.querySelector('.remove-btn');
            
            const handleRemove = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Tentando remover documento:', doc.name);
                console.log('Event type:', e.type);
                console.log('Target:', e.target);
                console.log('Current target:', e.currentTarget);
                this.confirmRemoveDocument(doc);
            };
            
            // Adicionar múltiplos tipos de eventos para garantir compatibilidade
            removeBtn.addEventListener('click', handleRemove);
            removeBtn.addEventListener('touchstart', handleRemove);
            removeBtn.addEventListener('mousedown', handleRemove);
            
            // Debug: verificar se o botão foi encontrado
            console.log('Remove button for', doc.name, ':', removeBtn);
            
            this.documentList.appendChild(docElement);
        });
    }

    confirmRemoveDocument(document) {
        console.log('Confirmando remoção do documento:', document.name); // Debug
        
        // Criar modal de confirmação
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-content">
                <div class="confirm-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Remover Documento</h3>
                </div>
                <div class="confirm-body">
                    <p>Tem certeza que deseja remover <strong>"${document.name}"</strong>?</p>
                    <p class="confirm-warning">Esta ação não pode ser desfeita.</p>
                </div>
                <div class="confirm-actions">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-remove">Remover</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar estilos para o modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = modal.querySelector('.confirm-content');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // Eventos dos botões
        const cancelBtn = modal.querySelector('.btn-cancel');
        const removeBtn = modal.querySelector('.btn-remove');
        
        cancelBtn.addEventListener('click', () => {
            console.log('Remoção cancelada'); // Debug
            modal.remove();
        });
        
        removeBtn.addEventListener('click', () => {
            console.log('Removendo documento:', document.name); // Debug
            this.removeDocument(document.id);
            modal.remove();
        });
        
        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    async openDocument(document) {
        this.showLoading();
        this.currentDocument = document;
        this.currentPage = 1;
        this.zoomLevel = 1.0;
        
        this.currentDocumentTitle.textContent = document.name;
        this.renderDocumentList();
        
        try {
            switch (document.type) {
                case 'PDF':
                    await this.loadPDF(document.file);
                    break;
                case 'EPUB':
                    await this.loadEPUB(document.file);
                    break;
                case 'MOBI':
                    await this.loadMOBI(document.file);
                    break;
                default:
                    throw new Error('Formato de arquivo não suportado');
            }
            
            this.showViewer();
            this.updateControls();
        } catch (error) {
            console.error('Erro ao carregar documento:', error);
            alert('Erro ao carregar o documento. Verifique se o arquivo está correto.');
        } finally {
            this.hideLoading();
        }
    }

    async loadPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        this.pdfDocument = pdf;
        this.totalPages = pdf.numPages;
        
        this.viewerWrapper.innerHTML = '';
        
        // Carregar primeira página
        await this.renderPDFPage(1);
    }

    async renderPDFPage(pageNumber) {
        const page = await this.pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: this.zoomLevel });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        const pageDiv = document.createElement('div');
        pageDiv.className = 'pdf-page';
        pageDiv.appendChild(canvas);
        
        this.viewerWrapper.innerHTML = '';
        this.viewerWrapper.appendChild(pageDiv);
    }

    async loadEPUB(file) {
        // Para EPUB, vamos usar uma abordagem simplificada
        // Em um projeto real, você usaria uma biblioteca como epub.js
        const text = await file.text();
        
        this.viewerWrapper.innerHTML = `
            <div class="epub-container">
                <h2>${this.currentDocument.name}</h2>
                <p>Este é um arquivo EPUB. Para uma implementação completa, seria necessário usar uma biblioteca especializada como epub.js.</p>
                <p>Conteúdo do arquivo (primeiros 1000 caracteres):</p>
                <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
                    ${text.substring(0, 1000)}...
                </div>
            </div>
        `;
        
        this.totalPages = 1; // EPUB não tem páginas tradicionais
    }

    async loadMOBI(file) {
        // Para MOBI, vamos mostrar uma mensagem informativa
        this.viewerWrapper.innerHTML = `
            <div class="epub-container">
                <h2>${this.currentDocument.name}</h2>
                <p>Arquivo MOBI detectado. Para uma implementação completa, seria necessário usar uma biblioteca especializada para processar arquivos MOBI.</p>
                <p>O formato MOBI é proprietário da Amazon e requer bibliotecas específicas para leitura.</p>
            </div>
        `;
        
        this.totalPages = 1;
    }

    showViewer() {
        this.welcomeScreen.style.display = 'none';
        this.viewerContainer.style.display = 'block';
    }

    showWelcome() {
        console.log('showWelcome called');
        
        // Limpar o visualizador
        this.viewerWrapper.innerHTML = '';
        
        // Mostrar tela de boas-vindas
        this.welcomeScreen.style.display = 'flex';
        this.viewerContainer.style.display = 'none';
        
        // Limpar título do documento
        this.currentDocumentTitle.textContent = 'Selecione um documento';
        
        // Atualizar controles
        this.updateControls();
        
        console.log('Welcome screen shown, viewer cleared');
    }

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    updateControls() {
        if (!this.currentDocument) {
            this.prevPage.disabled = true;
            this.nextPage.disabled = true;
            this.zoomOut.disabled = true;
            this.zoomIn.disabled = true;
            this.pageInfo.textContent = '0 / 0';
            this.zoomLevel.textContent = '100%';
            return;
        }

        this.prevPage.disabled = this.currentPage <= 1;
        this.nextPage.disabled = this.currentPage >= this.totalPages;
        this.zoomOut.disabled = this.zoomLevel <= 0.5;
        this.zoomIn.disabled = this.zoomLevel >= 3.0;
        
        this.pageInfo.textContent = `${this.currentPage} / ${this.totalPages}`;
        this.zoomLevel.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    async previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.renderCurrentPage();
            this.updateControls();
        }
    }

    async nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            await this.renderCurrentPage();
            this.updateControls();
        }
    }

    async renderCurrentPage() {
        if (this.currentDocument && this.currentDocument.type === 'PDF') {
            await this.renderPDFPage(this.currentPage);
        }
    }

    zoomOut() {
        if (this.zoomLevel > 0.5) {
            this.zoomLevel -= 0.25;
            this.renderCurrentPage();
            this.updateControls();
        }
    }

    zoomIn() {
        if (this.zoomLevel < 3.0) {
            this.zoomLevel += 0.25;
            this.renderCurrentPage();
            this.updateControls();
        }
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            document.body.classList.add('fullscreen');
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            this.isFullscreen = true;
        } else {
            document.body.classList.remove('fullscreen');
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            this.isFullscreen = false;
        }
    }

    handleKeyboard(event) {
        if (!this.currentDocument) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.previousPage();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextPage();
                break;
            case '+':
            case '=':
                event.preventDefault();
                this.zoomIn();
                break;
            case '-':
                event.preventDefault();
                this.zoomOut();
                break;
            case 'f':
            case 'F':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.toggleFullscreen();
                }
                break;
        }
    }

    handleResize() {
        if (this.currentDocument && this.currentDocument.type === 'PDF') {
            this.renderCurrentPage();
        }
        
        // Ajustar sidebar baseado no tamanho da tela
        this.adjustSidebarForScreenSize();
    }

    adjustSidebarForScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isLandscape = width > height;
        
        // Fechar sidebar automaticamente em telas pequenas se estiver aberta
        if (width <= 768 && this.sidebar.classList.contains('open')) {
            // Manter aberta apenas se for landscape e tela pequena
            if (!isLandscape || width <= 480) {
                this.closeSidebarMenu();
            }
        }
        
        // Ajustar comportamento baseado no tamanho da tela
        if (width <= 480) {
            // Mobile muito pequeno - sidebar ocupa toda a largura
            this.sidebar.style.width = '100%';
        } else if (width <= 768) {
            // Mobile/tablet pequeno
            this.sidebar.style.width = isLandscape ? '320px' : '280px';
        } else if (width <= 1024) {
            // Tablet
            this.sidebar.style.width = '280px';
        } else if (width >= 1440) {
            // Telas grandes
            this.sidebar.style.width = '350px';
        } else {
            // Desktop padrão
            this.sidebar.style.width = '300px';
        }
        
        console.log(`Tela ajustada: ${width}x${height} - Landscape: ${isLandscape}`);
    }

    saveDocumentsToStorage() {
        const documentsData = this.documents.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            addedAt: doc.addedAt
        }));
        
        localStorage.setItem('documents', JSON.stringify(documentsData));
    }

    loadStoredDocuments() {
        const stored = localStorage.getItem('documents');
        if (stored) {
            try {
                const documentsData = JSON.parse(stored);
                // Note: Não podemos restaurar os arquivos File, apenas os metadados
                this.documents = documentsData;
                this.renderDocumentList();
            } catch (error) {
                console.error('Erro ao carregar documentos salvos:', error);
            }
        }
    }

    removeDocument(documentId) {
        console.log('removeDocument called with ID:', documentId);
        console.log('Current document:', this.currentDocument);
        
        // Remover documento da lista
        this.documents = this.documents.filter(doc => doc.id !== documentId);
        console.log('Documents after removal:', this.documents.length);
        
        // Se o documento removido era o atual, limpar o visualizador
        if (this.currentDocument && this.currentDocument.id === documentId) {
            console.log('Removing current document from viewer');
            this.currentDocument = null;
            this.currentPage = 1;
            this.zoomLevel = 1.0;
            
            // Limpar o visualizador
            this.viewerWrapper.innerHTML = '';
            
            // Limpar o título do documento
            this.currentDocumentTitle.textContent = 'Selecione um documento';
            
            // Mostrar tela de boas-vindas
            this.showWelcome();
            
            // Desabilitar controles
            this.updateControls();
        }
        
        // Atualizar a lista de documentos
        this.renderDocumentList();
        
        // Salvar no localStorage
        this.saveDocumentsToStorage();
        
        console.log('Document removal completed');
    }

    confirmClearAll() {
        // Criar modal de confirmação
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-content">
                <div class="confirm-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Limpar Todos os Documentos</h3>
                </div>
                <div class="confirm-body">
                    <p>Tem certeza que deseja limpar todos os documentos?</p>
                    <p class="confirm-warning">Esta ação não pode ser desfeita.</p>
                </div>
                <div class="confirm-actions">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-clear">Limpar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar estilos para o modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = modal.querySelector('.confirm-content');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // Eventos dos botões
        const cancelBtn = modal.querySelector('.btn-cancel');
        const clearBtn = modal.querySelector('.btn-clear');
        
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        clearBtn.addEventListener('click', () => {
            console.log('Clearing all documents');
            
            // Limpar lista de documentos
            this.documents = [];
            
            // Limpar documento atual
            this.currentDocument = null;
            this.currentPage = 1;
            this.zoomLevel = 1.0;
            this.isFullscreen = false;
            
            // Limpar o visualizador
            this.viewerWrapper.innerHTML = '';
            
            // Atualizar interface
            this.renderDocumentList();
            this.saveDocumentsToStorage();
            this.showWelcome();
            
            console.log('All documents cleared');
            modal.remove();
        });
        
        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
}

// Aguardar o DOM estar carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DocumentReader...');
    
    // Verificar se PDF.js está disponível
    if (typeof pdfjsLib === 'undefined') {
        console.error('PDF.js not loaded!');
        return;
    }
    
    // Inicializar a aplicação
    window.documentReader = new DocumentReader();
    
    // Adicionar funcionalidade de drag and drop
    const dropZone = document.querySelector('.document-viewer');
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '';
        
        const files = Array.from(e.dataTransfer.files);
        const reader = window.documentReader;
        
        files.forEach(file => {
            if (file.type.includes('pdf') || file.name.endsWith('.epub') || file.name.endsWith('.mobi')) {
                reader.addDocument(file);
            }
        });
    });
}); 