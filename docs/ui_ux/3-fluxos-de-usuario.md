# 3. Fluxos de Usuário

## Fluxo 1: Registro de Venda (Promotora)
- **Diagrama**: Início -> Clicar 'Registrar Venda' -> Escanear/Digitar SKU -> Confirmar Produto e Quantidade -> Adicionar à cesta -> Finalizar Venda -> Sucesso.
- **Tratamento de Erros**: SKU não encontrado, estoque baixo (alerta, mas permite venda), falha de conexão (salvar localmente).

## Fluxo 2: Confirmação de Recebimento (Promotora) - Fluxo Híbrido
- **Descrição**: A interface principal exibe a lista de produtos a serem recebidos. A promotora pode confirmar manualmente ou usar um botão opcional de "Escanear" que age como um atalho para encontrar e destacar o item na lista.
- **Diagrama**: Início -> 'Confirmar Recebimento' -> Selecionar Ingresso -> Tela com lista de produtos -> Localizar na lista (manual) OU Escanear (opcional) -> Digitar quantidade recebida -> Repetir -> Finalizar e Confirmar -> Sucesso.
- **Tratamento de Erros**: Produto escaneado não pertence ao ingresso.

## Fluxo 3: Execução de Auditoria (Promotora)
- **Descrição**: Fluxo de contagem "cega". A promotora vê a lista de itens a contar, sem a quantidade teórica. Ela pode encontrar o item na lista (via busca) ou usar o scanner opcional para destacá-lo.
- **Diagrama**: Início -> 'Realizar Auditoria' -> Selecionar Auditoria -> Tela de Contagem (lista sem quantidades) -> Buscar/Escanear item -> Inserir quantidade contada -> Repetir -> Finalizar e Enviar -> Sucesso.
- **Tratamento de Erros**: Produto escaneado não pertence ao escopo da auditoria.
