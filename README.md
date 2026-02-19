# STRIDE Analyzer - Frontend Application

Interface web em React para análise de ameaças STRIDE em diagramas de arquitetura.

## 📋 Visão Geral

O frontend do STRIDE Analyzer é uma aplicação React moderna que permite aos usuários fazer upload de diagramas de arquitetura e visualizar análises detalhadas de segurança geradas por IA. A interface está completamente em português brasileiro.

## 🏗️ Arquitetura

```
stride_frontend_application/
├── public/
│   └── index.html           # HTML base
├── src/
│   ├── App.js               # Componente principal
│   ├── index.js             # Entry point
│   ├── index.css            # Estilos globais
│   ├── components/
│   │   ├── FileUpload.js    # Upload de diagramas
│   │   ├── JobsList.js      # Lista de análises
│   │   └── ResultsView.js   # Visualização de resultados
│   └── utils/
│       └── pdfGenerator.js  # Geração de relatórios PDF
└── package.json
```

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Axios** - Cliente HTTP
- **React Dropzone** - Drag & drop de arquivos
- **jsPDF** - Geração de PDFs
- **jsPDF AutoTable** - Tabelas em PDF
- **React Scripts** - Build e desenvolvimento

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend do STRIDE Analyzer rodando

### Passos

1. Clone o repositório e navegue até a pasta do frontend:
```bash
cd stride_frontend_application
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:

Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_API_URL=http://localhost:3001
```

Ou edite diretamente em `src/App.js` (linha 8):
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🎨 Funcionalidades

### 1. Upload de Diagramas
- **Drag & Drop**: Arraste imagens diretamente para a área de upload
- **Seleção Manual**: Clique para abrir o seletor de arquivos
- **Formatos Suportados**: PNG, JPG, JPEG, GIF
- **Preview**: Visualização da imagem antes do envio
- **Validação**: Nome do sistema obrigatório

### 2. Gerenciamento de Jobs
- **Lista Completa**: Visualize todos os trabalhos de análise
- **Status em Tempo Real**: Indicadores visuais de status
- **Auto-refresh**: Atualização automática a cada 5 segundos (opcional)
- **Filtros**: Ordenação por data e status
- **Ações Rápidas**: Visualizar e baixar PDFs

### 3. Visualização de Resultados
- **Diagrama Analisado**: Visualização do diagrama enviado
- **Arquitetura do Sistema**: Componentes, fluxos de dados e limites de confiança
- **Ameaças STRIDE**: Análise detalhada por categoria
- **Detalhes Expansíveis**: Clique para ver mais informações
- **Severidade Visual**: Badges coloridos (Critical, High, Medium, Low)

### 4. Exportação
- **PDF Completo**: Relatório profissional com todas as descobertas
- **JSON**: Dados brutos para integração com outras ferramentas

## 🎯 Componentes

### App.js
Componente principal que gerencia:
- Estado da aplicação
- Navegação entre views
- Polling de status de jobs
- Comunicação com a API

### FileUpload.js
Componente de upload de arquivos:
- Interface drag & drop
- Preview de imagens
- Validação de tipos de arquivo

### JobsList.js
Lista de trabalhos de análise:
- Tabela responsiva
- Formatação de datas em pt-BR
- Indicadores de status
- Ações (visualizar, baixar PDF)

### ResultsView.js
Visualização de resultados:
- Apresentação hierárquica
- Cards expansíveis para ameaças
- Botões de exportação
- Layout otimizado para leitura

### pdfGenerator.js
Utilitário para geração de PDFs:
- Formatação profissional
- Tabelas automáticas
- Suporte a múltiplas páginas
- Exportação com nome personalizado

## 🎨 Interface do Usuário

### Paleta de Cores

| Status/Tipo  | Cor       | Uso                    |
|--------------|-----------|------------------------|
| Pendente     | #ffc107   | Jobs aguardando        |
| Processando  | #2196f3   | Jobs em execução       |
| Concluído    | #4caf50   | Jobs completados       |
| Falhou       | #f44336   | Jobs com erro          |
| Critical     | #d32f2f   | Ameaças críticas       |
| High         | #f57c00   | Ameaças altas          |
| Medium       | #fbc02d   | Ameaças médias         |
| Low          | #388e3c   | Ameaças baixas         |

### Ícones e Emojis
A aplicação usa emojis para melhor comunicação visual:
- 🔐 STRIDE Analyzer
- 🚀 Nova Análise
- 📋 Todos os Trabalhos
- 📊 Diagrama
- 🏗️ Arquitetura
- 🔒 Ameaças
- 📥 Download
- ✅ Sucesso
- ❌ Erro
- ⏳ Aguardando

## 🔄 Fluxo de Uso

1. **Upload**:
   - Usuário acessa a aba "Nova Análise"
   - Faz upload do diagrama (drag & drop ou seleção)
   - Insere o nome do sistema
   - Clica em "Iniciar Análise"

2. **Processamento**:
   - Sistema cria um job no backend
   - Exibe mensagem "Analisando sua arquitetura..."
   - Faz polling a cada 2 segundos para verificar o status

3. **Resultados**:
   - Quando completo, exibe mensagem de sucesso
   - Mostra todos os resultados da análise
   - Permite exportar para PDF ou JSON

4. **Histórico**:
   - Usuário pode ver todos os jobs na aba "Todos os Trabalhos"
   - Pode revisitar análises anteriores
   - Pode baixar PDFs de análises antigas

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 🖥️ Desktop (1920x1080+)
- 💻 Laptop (1366x768+)
- 📱 Tablet (768x1024+)
- 📱 Mobile (320x568+)

## 🌐 Localização

Interface completamente em **Português Brasileiro** (pt-BR):
- Todos os textos traduzidos
- Formatação de datas brasileira
- Nomenclatura de arquivos em português

## 🔧 Build e Deploy

### Build de Produção
```bash
npm run build
```

Gera pasta `build/` otimizada para produção.

### Deploy

**Opção 1: Servidor Estático**
```bash
# Usando serve
npx serve -s build -l 3000
```

**Opção 2: Nginx**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    root /caminho/para/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

**Opção 3: Vercel/Netlify**
- Conecte seu repositório
- Configure build command: `npm run build`
- Configure publish directory: `build`

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ Validação de tipos de arquivo no cliente
- ✅ Sanitização de inputs
- ✅ CORS configurado no backend
- ✅ Sem credenciais hardcoded
- ✅ Variáveis de ambiente para configuração

### Recomendações Adicionais
- [ ] Implementar autenticação de usuários
- [ ] Adicionar rate limiting
- [ ] Implementar HTTPS em produção
- [ ] Adicionar Content Security Policy
- [ ] Implementar auditoria de ações

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm test -- --coverage
```

## 🐛 Debug

### Verificar Conexão com Backend
```javascript
// No console do navegador
fetch('http://localhost:3001/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Problemas Comuns

**Erro: "Network Error"**
- Verifique se o backend está rodando
- Confirme a URL da API no `.env`
- Verifique configuração CORS no backend

**Imagens não aparecem**
- Verifique formato do arquivo (PNG, JPG, GIF)
- Confirme tamanho máximo (geralmente 10MB)
- Veja logs do navegador (F12)

**PDF não gera**
- Verifique se jsPDF está instalado
- Confirme dados completos no resultado
- Veja erros no console

## 📊 Performance

### Otimizações Implementadas
- Code splitting automático (React lazy loading)
- Imagens otimizadas
- Polling com cleanup adequado
- Memoização de componentes pesados

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Bundle Size: < 500KB (gzipped)

## 📝 Variáveis de Ambiente

| Variável           | Padrão                | Descrição              |
|--------------------|-----------------------|------------------------|
| REACT_APP_API_URL  | http://localhost:3001 | URL do backend         |

## 🎓 Aprendizado

Este projeto demonstra:
- Arquitetura React moderna com hooks
- Gerenciamento de estado com useState/useEffect
- Comunicação com APIs REST
- Upload de arquivos com preview
- Polling para atualizações em tempo real
- Geração de PDFs no cliente
- Design responsivo e acessível
- Internacionalização (i18n)
