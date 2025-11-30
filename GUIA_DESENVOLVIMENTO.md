# 🚀 GuiaDeDesenvolvimento - DevStorage

## Visão Geral do Projeto

Seu projeto DevStorage foi criado com sucesso! É um sistema completo de controle de estoque em React + TypeScript com integração com sua API.

## ✅ O que foi implementado

### 1. **Infraestrutura & Setup**
- ✅ Projeto Vite com React + TypeScript
- ✅ React Router v6 para roteamento
- ✅ Tailwind CSS para estilização
- ✅ Axios para requisições HTTP
- ✅ Lucide React para ícones

### 2. **Autenticação & Segurança**
- ✅ Context API para gerenciamento de auth
- ✅ JWT tokens com localStorage
- ✅ Interceptadores de requisição (token automático)
- ✅ Proteção de rotas com PrivateRoute
- ✅ Verificação de roles (admin, gerente, operador)

### 3. **Páginas Criadas**

#### Login (`/login`)
- Formulário de login com email e senha
- Tratamento de erros
- Credenciais de teste incluídas
- Redirect automático ao dashboard após login

#### Dashboard (`/dashboard`)
- Estatísticas gerais (total de produtos, valor em estoque, etc.)
- Alertas de baixo estoque
- Informações específicas por role
- Dados em tempo real da API

#### Produtos (`/produtos`)
- Listagem de todos os produtos
- Busca por nome/categoria
- CRUD completo (Create, Read, Update, Delete)
- Modal para criar/editar produtos
- Indicadores visuais de quantidade

#### Usuários (`/usuarios`) - Admin Only
- Listagem de usuários
- Busca por nome/email
- CRUD completo
- Modal para criar/editar usuários
- Seleção de tipo (admin, gerente, operador)

### 4. **Componentes Reutilizáveis**
- `PrivateRoute` - Proteção de rotas
- `Navbar` - Navegação com menu responsivo
- `ProdutoModal` - Modal para CRUD de produtos
- `UserModal` - Modal para CRUD de usuários

### 5. **Serviços de API**
- `api.ts` - Cliente Axios configurado
- `auth.ts` - Serviços de autenticação
- `produto.ts` - Serviços de produtos

## 🎯 Como Usar

### Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173/**

### Credenciais de Teste

```
Email: admin@local.com.br
Senha: 123456
```

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## 📂 Estrutura de Arquivos

```
src/
├── components/
│   ├── Navbar.tsx              # Barra de navegação
│   ├── PrivateRoute.tsx         # Proteção de rotas
│   ├── ProdutoModal.tsx         # Modal de produtos
│   └── UserModal.tsx            # Modal de usuários
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── hooks/
│   └── useAuth.ts               # Hook customizado de auth
├── pages/
│   ├── Login.tsx                # Página de login
│   ├── Dashboard.tsx            # Dashboard
│   ├── Produtos.tsx             # Gerenciamento de produtos
│   └── Usuarios.tsx             # Gerenciamento de usuários
├── services/
│   ├── api.ts                   # Cliente HTTP
│   ├── auth.ts                  # Serviços de auth
│   └── produto.ts               # Serviços de produtos
├── types/
│   └── index.ts                 # Tipos TypeScript
├── App.tsx                      # Componente principal
├── main.tsx                     # Entrada da app
└── index.css                    # Estilos globais
```

## 🔐 Fluxo de Autenticação

1. Usuário faz login em `/login`
2. Token JWT é salvo no localStorage
3. Context é atualizado com dados do usuário
4. Usuário é redirecionado para `/dashboard`
5. Token é enviado automaticamente em todas as requisições
6. Se token expirar, usuário é redirecionado para login

## 🛣️ Rotas Disponíveis

| Rota | Componente | Acesso | Descrição |
|------|-----------|--------|-----------|
| `/login` | Login | Público | Login no sistema |
| `/dashboard` | Dashboard | Autenticado | Visão geral do sistema |
| `/produtos` | Produtos | Autenticado | CRUD de produtos |
| `/usuarios` | Usuarios | Admin | CRUD de usuários |
| `/` | - | - | Redireciona para dashboard |

## 🎨 Customização de Estilos

Tailwind CSS está configurado. Para customizar cores, fonts, etc., edite `tailwind.config.cjs`:

```javascript
theme: {
  extend: {
    colors: {
      // Suas cores personalizadas
    }
  }
}
```

## 📡 Endpoints da API

### Autenticação
```
POST   /api/users/login
GET    /api/users/me
```

### Usuários
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Produtos
```
GET    /api/produtos
GET    /api/produtos/:id
POST   /api/produtos
PATCH  /api/produtos/:id
DELETE /api/produtos/:id
```

## 🚧 Próximos Passos (Funcionalidades Futuras)

1. **Movimentações de Estoque** - Entrada/saída de produtos
2. **Relatórios Avançados** - Gráficos e análises
3. **Exportação de Dados** - CSV, PDF
4. **Notificações** - Alertas em tempo real
5. **Histórico** - Rastreamento de alterações
6. **Código de Barras** - Integração com scanner

## 🐛 Debug & Troubleshooting

### Token Expirado?
O sistema redirecionará automaticamente para login.

### Problemas com CORS?
Verifique se a API está permitindo requisições da sua aplicação.

### Erro ao Salvar?
Abra o DevTools (F12) → Network para ver a requisição e erro.

## 💡 Dicas de Desenvolvimento

1. **Adicione novos tipos** em `src/types/index.ts`
2. **Crie novos serviços** em `src/services/`
3. **Use o useAuth hook** para acessar dados de autenticação
4. **Imagens**: Coloque em `public/` e referencie diretamente
5. **Variáveis de ambiente**: Crie `.env.local`

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)

---

**Pronto para começar! 🎉**

Execute `npm run dev` e visite http://localhost:5173/
