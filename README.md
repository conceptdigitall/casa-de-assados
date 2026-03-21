# 🍗 CASA DOS ASSADOS - Sistema de Gestão e PDV

Este é um sistema completo para gestão de uma assadeira, incluindo cardápio digital para clientes e um painel administrativo robusto para controle de pedidos, estoque, financeiro e entregas.

## 🚀 Funcionalidades

### 🌐 Área Pública (Cliente)
- **📱 Cardápio Digital**: Visualização de produtos por categorias (Assados, Acompanhamentos, Bebidas).
- **🛒 Carrinho de Compras**: Adição e remoção de itens com cálculo em tempo real.
- **💳 Checkout**: Sistema de finalização de pedido com suporte a diferentes formas de pagamento (Pix, etc.).
- **📍 Acompanhamento**: Página de status do pedido em tempo real.

### 🛡️ Área Administrativa (Gestão)
- **📊 Dashboard**: Visão geral de vendas, lucros e métricas essenciais com gráficos.
- **📦 Gestão de Pedidos**: Controle total dos pedidos recebidos (Novos, em preparo, saiu para entrega).
- **🛒 Gestão de Produtos**: Adição, edição e exclusão de itens do cardápio.
- **📉 Controle de Estoque**: Monitoramento de quantidades e alertas de estoque baixo.
- **💻 PDV (Ponto de Venda)**: Interface para criação de pedidos manuais (balcão, telefone, WhatsApp).
- **🛵 Gestão de Entregadores**: Cadastro e atribuição de entregas para motoboys.
- **⚙️ Configurações**: Personalização do sistema e horários de funcionamento.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Banco de Dados & Auth**: [Supabase](https://supabase.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)

## 📦 Como Rodar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU_USUARIO/casa-dos-assados.git
   cd casa-dos-assados
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 🗄️ Estrutura do Banco de Dados
O arquivo `supabase_schema.sql` na raiz do projeto contém a estrutura necessária para configurar as tabelas e políticas no Supabase.

---
Desenvolvido com ❤️ para a Casa dos Assados.
