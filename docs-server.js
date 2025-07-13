const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

// Configurar marked com highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (__) {}
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
  gfm: true,
  breaks: true
});

class DocsServer {
  constructor(docsPath) {
    this.docsPath = docsPath;
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Rota principal da documentação
    this.router.get('/', (req, res) => {
      res.render('docs/index');
    });

    // Rota para arquivos específicos
    this.router.get('/:file', (req, res) => {
      const fileName = req.params.file;
      this.renderMarkdownFile(fileName, req, res);
    });

    // Rota para arquivos em subpastas
    this.router.get('/:folder/:file', (req, res) => {
      const folder = req.params.folder;
      const fileName = req.params.file;
      const filePath = path.join(folder, fileName);
      this.renderMarkdownFile(filePath, req, res);
    });

    // API para estrutura de documentação
    this.router.get('/api/structure', (req, res) => {
      const structure = this.getDocsStructure();
      res.json(structure);
    });
  }

  renderMarkdownFile(filePath, req, res) {
    try {
      const fullPath = path.join(this.docsPath, `${filePath}.md`);
      
      if (!fs.existsSync(fullPath)) {
        return res.status(404).render('docs/layout', {
          title: 'Página não encontrada',
          content: '<h1>404 - Página não encontrada</h1><p>A documentação solicitada não foi encontrada.</p>',
          navigation: this.getNavigation(),
          breadcrumbs: [{ name: 'Docs', path: '/docs', active: false }, { name: '404', active: true }],
          currentPath: filePath
        });
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      const htmlContent = marked(content);
      const title = this.extractTitle(content);
      const breadcrumbs = this.generateBreadcrumbs(filePath);

      res.render('docs/layout', {
        title,
        content: htmlContent,
        navigation: this.getNavigation(),
        breadcrumbs,
        currentPath: filePath
      });
    } catch (error) {
      console.error('Erro ao renderizar documentação:', error);
      res.status(500).render('docs/layout', {
        title: 'Erro interno',
        content: '<h1>500 - Erro interno</h1><p>Ocorreu um erro ao carregar a documentação.</p>',
        navigation: this.getNavigation(),
        breadcrumbs: [{ name: 'Docs', path: '/docs', active: false }, { name: 'Erro', active: true }],
        currentPath: filePath
      });
    }
  }

  extractTitle(content) {
    const match = content.match(/^# (.+)$/m);
    return match ? match[1] : 'Documentação';
  }

  generateBreadcrumbs(filePath) {
    const parts = filePath.split('/');
    const breadcrumbs = [{ name: 'Docs', path: '/docs', active: false }];
    
    let currentPath = '';
    for (let i = 0; i < parts.length; i++) {
      currentPath += parts[i];
      const isLast = i === parts.length - 1;
      
      breadcrumbs.push({
        name: this.formatBreadcrumbName(parts[i]),
        path: isLast ? null : `/docs/${currentPath}`,
        active: isLast
      });
      
      if (!isLast) currentPath += '/';
    }
    
    return breadcrumbs;
  }

  formatBreadcrumbName(name) {
    return name
      .replace(/\.(md|html)$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getNavigation() {
    return {
      main: [
        { title: 'Visão Geral', path: 'README' },
        { title: 'Índice', path: 'INDEX' },
        { title: 'Contribuir', path: 'CONTRIBUTING' },
        { title: 'Changelog', path: 'CHANGELOG' }
      ],
      guides: [
        { title: 'Instalação', path: 'guides/installation' },
        { title: 'Acesso Admin', path: 'guides/admin-access' },
        { title: 'Desenvolvimento', path: 'guides/dev-advanced' },
        { title: 'Deploy', path: 'guides/deployment' },
        { title: 'Troubleshooting', path: 'guides/troubleshooting' }
      ],
      api: [
        { title: 'Endpoints', path: 'api/endpoints' }
      ]
    };
  }

  getDocsStructure() {
    try {
      const structure = {};
      
      const scanDirectory = (dir, basePath = '') => {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            structure[path.join(basePath, item)] = scanDirectory(itemPath, path.join(basePath, item));
          } else if (item.endsWith('.md')) {
            const key = path.join(basePath, item.replace('.md', ''));
            structure[key] = {
              type: 'file',
              path: itemPath,
              title: this.extractTitleFromFile(itemPath)
            };
          }
        });
        
        return structure;
      };
      
      return scanDirectory(this.docsPath);
    } catch (error) {
      console.error('Erro ao gerar estrutura da documentação:', error);
      return {};
    }
  }

  extractTitleFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return this.extractTitle(content);
    } catch (error) {
      return path.basename(filePath, '.md');
    }
  }

  middleware() {
    return this.router;
  }
}

module.exports = DocsServer;
