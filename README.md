# 📚 Leitor de Documentos

<div align="center">

![Leitor de Documentos](https://img.shields.io/badge/Leitor-Documentos-blue?style=for-the-badge&logo=book)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Uma solução moderna e intuitiva para leitura de documentos digitais**

[🌐 Demo Online](https://ivandacruz.github.io/leitor) • [📖 Documentação](https://github.com/ivandacruz/leitor#readme) • [🐛 Reportar Bug](https://github.com/ivandacruz/leitor/issues)

</div>

---

## ✨ Características Principais

- 🎯 **Interface Moderna**: Design limpo e intuitivo com foco na experiência do usuário
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 📄 **Suporte Completo a PDF**: Renderização nativa com PDF.js
- 🔍 **Controles Avançados**: Zoom, navegação por páginas e modo fullscreen
- ⌨️ **Atalhos de Teclado**: Navegação rápida e eficiente
- 🎨 **Drag & Drop**: Arraste arquivos diretamente para o leitor
- 💾 **Persistência Local**: Lista de documentos salva automaticamente
- 🚀 **Performance Otimizada**: Carregamento rápido mesmo com documentos grandes

## 🎨 Screenshots

<div align="center">

![Interface Principal](https://via.placeholder.com/800x400/667eea/ffffff?text=Interface+Principal)
![Modo Mobile](https://via.placeholder.com/400x600/764ba2/ffffff?text=Modo+Mobile)

</div>

## 🚀 Começando

### Pré-requisitos

- Navegador moderno (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Conexão com internet (para carregar bibliotecas externas)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ivandacruz/leitor.git
   cd leitor
   ```

2. **Abra o projeto**
   ```bash
   # Opção 1: Abrir diretamente no navegador
   open index.html
   
   # Opção 2: Usar servidor local
   python -m http.server 8000
   # ou
   npx serve .
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

## 📖 Como Usar

### 1. Adicionar Documentos
- Clique em **"Adicionar Documento"** na sidebar
- Ou arraste arquivos diretamente para a área de visualização
- Formatos suportados: PDF, MOBI, EPUB

### 2. Navegar pelos Documentos
- Use a **lista na sidebar** para alternar entre documentos
- Clique em qualquer documento para abri-lo

### 3. Controles de Leitura
- **Navegação**: Use as setas ou botões para navegar entre páginas
- **Zoom**: Use os botões +/- ou atalhos de teclado
- **Fullscreen**: Clique no botão de tela cheia para imersão total

### 4. Atalhos de Teclado
| Ação | Atalho |
|------|--------|
| Página anterior | ← |
| Próxima página | → |
| Zoom in | + ou = |
| Zoom out | - |
| Fullscreen | Ctrl + F |

## 🛠️ Tecnologias Utilizadas

<table>
<tr>
<td align="center" width="96">
<a href="#">
<img src="https://skillicons.dev/icons?i=html5" width="48" height="48" alt="HTML5" />
</a>
<br>HTML5
</td>
<td align="center" width="96">
<a href="#">
<img src="https://skillicons.dev/icons?i=css3" width="48" height="48" alt="CSS3" />
</a>
<br>CSS3
</td>
<td align="center" width="96">
<a href="#">
<img src="https://skillicons.dev/icons?i=js" width="48" height="48" alt="JavaScript" />
</a>
<br>JavaScript
</td>
<td align="center" width="96">
<a href="#">
<img src="https://skillicons.dev/icons?i=pdf" width="48" height="48" alt="PDF.js" />
</a>
<br>PDF.js
</td>
</tr>
</table>

## 📁 Estrutura do Projeto

```
leitor/
├── 📄 index.html              # Interface principal do leitor
├── 🎨 styles.css              # Estilos modernos e responsivos
├── ⚡ script.js               # Lógica JavaScript completa
├── 🌐 landing.html            # Página de apresentação
├── 🎨 landing-styles.css      # Estilos da landing page
├── ⚡ landing-script.js       # JavaScript da landing page
├── 📖 README.md               # Documentação completa
├── 📦 package.json            # Configuração do projeto
└── 🚫 .gitignore              # Arquivos ignorados pelo Git
```

## 🔧 Funcionalidades Detalhadas

### 📄 Suporte a PDF
- ✅ Renderização nativa com PDF.js
- ✅ Navegação por páginas
- ✅ Controles de zoom (50% - 300%)
- ✅ Suporte a documentos grandes
- ✅ Carregamento otimizado

### 📱 Design Responsivo
- ✅ Layout adaptativo para todos os dispositivos
- ✅ Sidebar colapsável em mobile
- ✅ Controles otimizados para touch
- ✅ Interface intuitiva

### ⚡ Performance
- ✅ Carregamento lazy de páginas
- ✅ Cache de documentos
- ✅ Otimização de memória
- ✅ Renderização eficiente

## 🎯 Roadmap

### ✅ Concluído
- [x] Interface moderna e responsiva
- [x] Suporte completo a PDF
- [x] Controles de navegação e zoom
- [x] Atalhos de teclado
- [x] Drag & drop
- [x] Persistência local

### 🚧 Em Desenvolvimento
- [ ] Suporte completo a EPUB com epub.js
- [ ] Modo noturno
- [ ] Sistema de marcadores

### 📋 Planejado
- [ ] Suporte completo a MOBI
- [ ] Busca no texto
- [ ] Anotações e comentários
- [ ] Exportação de anotações
- [ ] Sincronização com nuvem
- [ ] Suporte a mais formatos (TXT, DOCX)

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes de Contribuição
- Mantenha o código limpo e bem documentado
- Siga os padrões de estilo existentes
- Teste suas mudanças em diferentes navegadores
- Atualize a documentação quando necessário

## 📊 Estatísticas do Projeto

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/ivandacruz/leitor?style=social)
![GitHub forks](https://img.shields.io/github/forks/ivandacruz/leitor?style=social)
![GitHub issues](https://img.shields.io/github/issues/ivandacruz/leitor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ivandacruz/leitor)
![GitHub license](https://img.shields.io/github/license/ivandacruz/leitor)

</div>

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [PDF.js](https://mozilla.github.io/pdf.js/) - Biblioteca para renderização de PDFs
- [Font Awesome](https://fontawesome.com/) - Ícones
- [Inter Font](https://rsms.me/inter/) - Tipografia

## 📞 Contato

- **GitHub**: [@ivandacruz](https://github.com/ivandacruz)
- **Projeto**: [https://github.com/ivandacruz/leitor](https://github.com/ivandacruz/leitor)
- **Issues**: [https://github.com/ivandacruz/leitor/issues](https://github.com/ivandacruz/leitor/issues)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

Desenvolvido com ❤️ para facilitar a leitura digital

</div> 