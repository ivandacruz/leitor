// Configuração do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class DocumentReader {
    constructor() {
        this.documents = [];
        this.currentDocument = null;
        this.currentPage = 1;
        this.zoomLevel = 1.0;
        this.isFullscreen = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadStoredDocuments();
    }

    initializeElements() {
        // Elementos da interface
        this.sidebar = document.getElementById('sidebar');
        this.menuBtn = document.getElementById('menuBtn');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.fileInput = document.getElementById('fileInput');
        this.fileInputWelcome = document.getElementById('fileInputWelcome');
        this.documentList = document.getElementById('documents');
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
    }

    bindEvents() {
        // Eventos da sidebar
        this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        this.closeSidebar.addEventListener('click', () => this.toggleSidebar());
        
        // Eventos de upload
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.fileInputWelcome.addEventListener('change', (e) => this.handleFileUpload(e));
        
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
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
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
        
        this.documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-item';
            if (this.currentDocument && this.currentDocument.id === doc.id) {
                docElement.classList.add('active');
            }
            
            docElement.innerHTML = `
                <h4>${doc.name}</h4>
                <p>${doc.type} • ${doc.size} • ${doc.addedAt}</p>
            `;
            
            docElement.addEventListener('click', () => this.openDocument(doc));
            this.documentList.appendChild(docElement);
        });
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
        this.welcomeScreen.style.display = 'flex';
        this.viewerContainer.style.display = 'none';
        this.currentDocumentTitle.textContent = 'Selecione um documento';
        this.updateControls();
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
        this.documents = this.documents.filter(doc => doc.id !== documentId);
        
        if (this.currentDocument && this.currentDocument.id === documentId) {
            this.currentDocument = null;
            this.showWelcome();
        }
        
        this.renderDocumentList();
        this.saveDocumentsToStorage();
    }
}

// Inicializar o leitor quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new DocumentReader();
});

// Adicionar funcionalidade de drag and drop
document.addEventListener('DOMContentLoaded', () => {
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

// Expor a instância globalmente para drag and drop
window.documentReader = null;
document.addEventListener('DOMContentLoaded', () => {
    window.documentReader = new DocumentReader();
}); 