# 9. Guia Rápido do Desenvolvedor (Prompts para Claude Code)

Esta seção serve como um guia de prompts para iniciar e gerenciar sua sessão de desenvolvimento usando o Claude Code como seu agente executor.

## Iniciando a Sessão

1. **Verificar Docker**: "Primeiro, preciso garantir que o Docker Desktop esteja rodando. Por favor, verifique o status do Docker."
2. **Sincronizar Código**: "Vamos começar. Sincronize o projeto com as últimas alterações do repositório remoto." (`git pull`)
3. **Iniciar Backend**: "Agora, inicie os serviços locais do Supabase." (`supabase start`)
4. **Iniciar Ambiente Completo**: "Ótimo. Agora, inicie o ambiente de desenvolvimento completo da Vercel." (`vercel dev`)
5. **Confirmar Status**: "Perfeito. Por favor, confirme a URL local em que a aplicação está rodando."

## Finalizando a Sessão

1. **Parar Servidor**: "Sessão concluída. Pare o servidor de desenvolvimento da Vercel."
2. **Parar Backend**: "Agora, pare os serviços locais do Supabase." (`supabase stop`)
3. **Salvar Trabalho**: "Por fim, adicione, faça o commit e envie as alterações para o repositório remoto."