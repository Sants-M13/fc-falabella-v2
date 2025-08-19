# 6. Estrutura Unificada do Projeto (Monorepo)

```
falabella-inventory-app/
├── apps/
│   └── web/                      # Aplicação Next.js
│       ├── app/
│       │   ├── (admin)/          # Rotas do Administrador
│       │   └── (promotora)/      # Rotas da Promotora
│       ├── components/
│       └── lib/
├── packages/
│   └── types/                    # Tipos TypeScript compartilhados
├── supabase/
│   ├── functions/                # Funções Serverless
│   └── migrations/               # Migrações do banco de dados (SQL)
├── .env.local
└── package.json
```