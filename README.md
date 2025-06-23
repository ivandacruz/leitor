# 📚 Leitor de Documentos

Um leitor de documentos moderno e responsivo que suporta arquivos PDF, MOBI e EPUB, desenvolvido com HTML, CSS e JavaScript puro.

## ✨ Funcionalidades

- **Suporte a múltiplos formatos**: PDF, MOBI e EPUB
- **Interface moderna e responsiva**: Design limpo e intuitivo
- **Navegação por páginas**: Controles para navegar entre páginas
- **Controles de zoom**: Ampliar e reduzir o conteúdo
- **Modo fullscreen**: Visualização em tela cheia
- **Lista de documentos**: Gerenciamento de múltiplos arquivos
- **Drag and drop**: Arraste arquivos diretamente para o leitor
- **Atalhos de teclado**: Navegação rápida com o teclado
- **Responsivo**: Funciona em desktop, tablet e mobile

## 🚀 Como usar

1. **Abra o arquivo `index.html`** em seu navegador
2. **Adicione documentos** clicando no botão "Adicionar Documento" ou arrastando arquivos
3. **Navegue pelos documentos** usando a lista na sidebar
4. **Use os controles** para navegar, fazer zoom e alternar para fullscreen

## ⌨️ Atalhos de teclado

- **Seta esquerda**: Página anterior
- **Seta direita**: Próxima página
- **+ ou =**: Aumentar zoom
- **-**: Diminuir zoom
- **Ctrl + F**: Alternar fullscreen

## 📁 Estrutura do projeto

```
leitor/
├── index.html          # Arquivo principal HTML
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Este arquivo
```

## 🔧 Tecnologias utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **PDF.js**: Biblioteca para renderização de PDFs
- **Font Awesome**: Ícones
- **LocalStorage**: Persistência de dados

## 📋 Formatos suportados

### ✅ PDF
- Renderização completa com PDF.js
- Navegação por páginas
- Controles de zoom
- Suporte a documentos grandes

### ⚠️ EPUB
- Detecção básica do formato
- Para implementação completa, recomenda-se usar epub.js
- Atualmente mostra informações básicas do arquivo

### ⚠️ MOBI
- Detecção do formato
- Para implementação completa, requer bibliotecas específicas
- Atualmente mostra informações sobre o formato

## 🎨 Características do design

- **Interface limpa**: Design minimalista e focado
- **Cores modernas**: Paleta de cores profissional
- **Animações suaves**: Transições e efeitos visuais
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Controles intuitivos e navegação por teclado

## 🔮 Melhorias futuras

- [ ] Implementação completa de EPUB com epub.js
- [ ] Suporte completo a MOBI
- [ ] Marcadores e anotações
- [ ] Busca no texto
- [ ] Modo noturno
- [ ] Exportação de anotações
- [ ] Sincronização com nuvem
- [ ] Suporte a mais formatos (TXT, DOCX, etc.)

## 🛠️ Como executar localmente

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Ou use um servidor local:
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js
   npx serve .
   
   # Com PHP
   php -S localhost:8000
   ```

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar a leitura de documentos digitais** 