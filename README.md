# 🤖 cint.ia - Assistente Virtual do CRIA

Chatbot inteligente com IA (Mistral) para o [CRIA](https://cria.net.br) - plataforma de correção de redações.

## 🚀 Funcionalidades

- 💬 Chat em tempo real com IA (Mistral)
- 📝 Conhecimento sobre a plataforma CRIA
- ✍️ Dicas de redação para ENEM e vestibulares
- 🎨 Design moderno alinhado com a identidade CRIA
- 📱 Totalmente responsivo
- 🗄️ Histórico de conversas (MongoDB)
- 🔌 Widget embedável

---

## 📦 Estrutura do Projeto

```
chat-bot-main/
├── api/                    # Backend Serverless (Vercel)
│   ├── chat.py             # POST /api/chat
│   └── health.py           # GET /api/health
├── src/                    # Frontend React
│   ├── App.jsx             # Componente principal
│   ├── mensagemForm.jsx    # Formulário de mensagem
│   ├── widget.jsx          # Widget embedável
│   ├── components/
│   │   └── Icons.jsx       # Ícones SVG
│   └── services/
│       └── mistralApi.js   # API service
├── vercel.json             # Config Vercel
├── requirements.txt        # Deps Python
└── package.json            # Deps Node
```

---

## 🛠️ Setup Local

### 1. Instalar dependências

```bash
# Frontend
npm install

# Backend (para teste local)
pip install -r requirements.txt
```

### 2. Configurar variáveis

Crie um arquivo `.env` na raiz:

```env
MISTRAL_API_KEY=sua_chave_mistral
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
```

### 3. Executar

```bash
# Frontend
npm run dev

# Backend (em outro terminal)
cd api && python -c "from chat import app; app.run(port=3001, debug=True)"
```

---

## 🚀 Deploy na Vercel

### 1. MongoDB Atlas (gratuito)

1. Crie conta em [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crie cluster M0 (free)
3. **Database Access** → crie usuário
4. **Network Access** → adicione `0.0.0.0/0`
5. Copie a connection string

### 2. Deploy

```bash
# Instale Vercel CLI
npm i -g vercel

# Login e deploy
vercel login
vercel
```

### 3. Variáveis de Ambiente (Vercel Dashboard)

| Variável | Valor |
|----------|-------|
| `MISTRAL_API_KEY` | Chave da Mistral AI |
| `MONGODB_URI` | mongodb+srv://... |

### 4. Production deploy

```bash
vercel --prod
```

---

## 🔌 Widget Embedável

### Build do widget

```bash
npm run build:widget
```

### Integrar em outro site

```html
<script src="https://seu-app.vercel.app/cintia-widget.js"></script>
<script>
  CintiaWidget.init();
</script>
```

---

## 📋 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Frontend dev server |
| `npm run build` | Build produção |
| `npm run build:widget` | Build widget embedável |

---

## 🎨 Personalização

### Cores (src/index.css)
```css
:root {
  --cria-purple: #7A2FF2;
  --cria-purple-dark: #5A18D6;
}
```

### Personalidade da IA (api/chat.py)
Edite o `SYSTEM_MESSAGE`.

---

Feito com 💜 para o [CRIA](https://cria.net.br)
