🚀 Como Testar o Sistema de Produtos

  1. Iniciar o Ambiente Local

  # Terminal 1 - Backend
  supabase start

  # Terminal 2 - Frontend
  vercel dev

  2. Acessar o Sistema

  - Abra: http://localhost:3000
  - Faça login como administrador
  - Navegue para: Admin → Gestão de Produtos

  3. Funcionalidades Disponíveis para Testar

  ✅ Criar Produtos

  - Clique em "Novo Produto"
  - Preencha: SKU Padre, Marca, Estilo, Preço, Custo
  - Adicione variantes com SKU Filho e Tamanho
  - Teste validação de SKU únicos

  ✅ Visualizar Catálogo

  - Lista responsiva (desktop = tabela, mobile = cards)
  - Buscar por SKU, marca, estilo ou tamanho
  - Ordenar por: SKU, marca, preço, data
  - Ver hierarquia produto-variante

  ✅ Editar Produtos

  - Clique no ícone de editar
  - Modificar dados do produto
  - Gerenciar variantes (adicionar/remover)

  ✅ Eliminar Produtos

  - Clique no ícone de lixeira
  - Confirmação com avisos de dependências
  - Não permite deletar se há variantes

  4. Recursos Específicos para Validar

  💰 Formatação Colombiana

  - Preços em Pesos Colombianos: $ 150.000 COP
  - Interface 100% em espanhol

  📱 Design Responsivo

  - Teste em diferentes tamanhos de tela
  - Mobile: cards expansíveis
  - Desktop: tabela completa

  🔒 Segurança

  - Apenas admins podem acessar
  - Validação de SKU duplicados
  - Mensagens de erro em espanhol

  5. Casos de Teste Sugeridos

  1. Produto Simples: Criar produto sem variantes
  2. Produto Complexo: Criar com múltiplas variantes (S, M, L, XL)
  3. SKU Duplicado: Tentar criar SKU que já existe
  4. Busca: Procurar por marca "Nike" ou estilo "Air Max"
  5. Eliminação: Tentar deletar produto com variantes

  6. Dados de Teste Disponíveis

  O sistema já tem dados seed para testar imediatamente!





  OBS:
  El SKU solo puede contener letras y números -> meus SKUS são formados da seguinte maneira 1184-1101-7286-15745, então podemos remover esse bloqueio

  Custo por enquanto deixamos como não obrigatório

  as variações já podem ser pré definidas com curvas, por exemplo
  Femenina: do 34 ao 41
  No momento que eu criar o produto pai 1184-1101-7286-15745 já pode criar as variações 1184-1101-7286-15745-34, 1184-1101-7286-15745-35, 1184-1101-7286-15745-36, 1184-1101-7286-15745-37, 1184-1101-7286-15745-38, 1184-1101-7286-15745-39, 1184-1101-7286-15745-40, 1184-1101-7286-15745-41 porque a curva foi definida como femenina
  também vamos precisar uma maneira de criar novas curvas se necessário ou agregar variações especiais em uma curva sem salvar, caso eu queira adicionar 42 não registra para as próximas vezes que usar a curva femenina
  faltou foto do produto1.4

