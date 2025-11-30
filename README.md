# DevStorage - Controle de Estoque

Sistema completo de controle de estoque construído com React, TypeScript e integração com API REST.

## 🚀 Funcionalidades

- **Autenticação JWT**: Login seguro com tokens JWT
- **Dashboard**: Visão geral do sistema com estatísticas
- **CRUD de Produtos**: Criar, ler, atualizar e deletar produtos
- **CRUD de Usuários**: Gerenciar usuários do sistema (apenas admin)
- **Controle de Permissões**: Rotas protegidas por tipo de usuário
- **Responsivo**: Design mobile-first com Tailwind CSS
- **Relatórios**: Alertas para produtos com baixo estoque

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Roteamento
- **Axios** - HTTP client
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🌐 Configuração da API

A aplicação está configurada para conectar com a API em:
```
https://devotech.com.br/devostorange/devostorange_api/public
```

### Credenciais de Teste

**Email**: admin@local.com.br  
**Senha**: 123456

## 📱 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── PrivateRoute.tsx
│   ├── ProdutoModal.tsx
│   └── UserModal.tsx
├── contexts/          # Context API
│   └── AuthContext.tsx
├── hooks/             # Custom hooks
│   └── useAuth.ts
├── pages/             # Páginas
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Produtos.tsx
│   └── Usuarios.tsx
├── services/          # API services
│   ├── api.ts
│   ├── auth.ts
│   └── produto.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Componente principal
├── index.css          # Estilos globais
└── main.tsx
```

## 🔐 Tipos de Usuários

- **Administrador**: Acesso total, pode gerenciar usuários
- **Gerente**: Acesso a produtos e relatórios
- **Operador**: Acesso apenas a visualização de produtos

## 🗂️ Rotas da Aplicação

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/login` | Login no sistema | Público |
| `/dashboard` | Dashboard com estatísticas | Autenticado |
| `/produtos` | CRUD de produtos | Autenticado |
| `/usuarios` | CRUD de usuários | Admin |

## 📡 API Endpoints

### Autenticação
- `POST /api/users/login` - Login
- `GET /api/users/me` - Perfil do usuário

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Obter usuário
- `POST /api/users` - Criar usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Obter produto
- `POST /api/produtos` - Criar produto
- `PATCH /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

## 🚧 Funcionalidades Futuras

- [ ] Movimentações de estoque (entrada/saída)
- [ ] Relatórios avançados
- [ ] Exportação de dados (CSV, PDF)
- [ ] Notificações em tempo real
- [ ] Histórico de alterações
- [ ] Integração com código de barras

## 📝 Notas de Desenvolvimento

- A autenticação é gerenciada via Context API
- O token JWT é armazenado no localStorage
- Interceptadores de requisição adicionam o token automaticamente
- Rotas privadas redirecionam para login se não autenticado

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
