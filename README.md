# Bella Pizza - Cardápio Digital Premium

Este projeto é um cardápio digital interativo de alta fidelidade e premium desenvolvido para a pizzaria Bella Pizza. A aplicação foi construída utilizando tecnologias web puras (HTML, CSS e JavaScript), trazendo uma interface moderna com efeito de vidro (glassmorphism), animações sutis de hover e transição, além de ser totalmente responsiva para dispositivos móveis, tablets e computadores.

---

## Telas do Sistema

Aqui estão algumas capturas de tela demonstrando o design e as principais interações da plataforma:

### Tela Principal (Hero & Cardápio)
<img width="1419" height="758" alt="image" src="https://github.com/user-attachments/assets/38b73026-d8c5-4650-9612-89df14f82e78" />

### Personalização da Pizza (Modal de Tamanhos)
<img width="1007" height="680" alt="image" src="https://github.com/user-attachments/assets/e1299213-bdf9-47d6-b7ab-01ab5d9ccc17" />

### Carrinho de Compras Lateral e Checkout
<img width="1422" height="759" alt="image" src="https://github.com/user-attachments/assets/06be0caf-69ec-4288-a4b4-c92dfcf4cc9f" />

---

## Funcionalidades

- **Catálogo Dinâmico**: Renderização inteligente dos cartões de pizza direto de um banco de dados local estruturado em JavaScript.
- **Filtros por Categoria**: Alternância rápida e dinâmica entre categorias de pizzas (Salgadas e Doces).
- **Busca em Tempo Real**: Barra de pesquisa inteligente que realiza varredura no catálogo por nome e ingredientes à medida que o usuário digita.
- **Modal de Customização de Tamanhos**: Caixa de diálogo interativa que permite ao usuário escolher entre os tamanhos Pequena (P), Média (M) e Grande (G), atualizando instantaneamente o preço do produto com base em multiplicadores específicos.
- **Carrinho de Compras Sidebar**: Painel lateral retrátil contendo a lista de itens selecionados, controle de quantidade (adicionar e subtrair), botão de remoção e recálculo em tempo real de taxas e total final do pedido.
- **Simulação de Pedido**: Processo simplificado de encerramento do carrinho com exibição de modal animado confirmando o recebimento do pedido e fornecendo o tempo estimado de entrega.
- **Layout Responsivo**: Interface adaptada usando práticas de mobile-first, garantindo excelente experiência tanto em smartphones quanto em monitores desktop de alta resolução.

---

## Tecnologias Utilizadas

- **HTML5**: Estruturação semântica de todo o conteúdo da aplicação.
- **CSS3**: Estilização baseada em variáveis de design system, layout com Flexbox e Grid, efeitos visuais com Backdrop Filter (Glassmorphism), e animações fluidas via Keyframes.
- **JavaScript (ES6+)**: Manipulação nativa do DOM, tratamento de eventos do usuário e controle de estado do carrinho de compras e filtros.
- **Google Fonts**: Utilização das fontes Outfit (títulos) e Plus Jakarta Sans (corpo de texto) para uma tipografia moderna.
- **Lucide Icons**: Biblioteca de ícones vetoriais leves e nítidos integrada via CDN.

---

## Como Executar o Projeto

Como o projeto foi desenvolvido com tecnologias web nativas, não há necessidade de instalação de dependências ou etapas complexas de compilação.

### Método 1: Abertura Direta
1. Faça o download ou clone este repositório.
2. Navegue até a pasta do projeto.
3. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente em seu navegador padrão.

### Método 2: Servidor Local (Recomendado para Desenvolvimento)
Para uma experiência de desenvolvimento ideal com suporte a recarregamentos automáticos:
1. Abra o terminal na pasta raiz do projeto.
2. Inicie um servidor estático leve de sua preferência. Por exemplo, utilizando Node.js:
   ```bash
   npx http-server
   ```
3. Acesse a URL indicada no terminal (geralmente `http://localhost:8080`).

---

## Estrutura de Pastas

```
projeto-pizza/
├── index.html          # Estrutura HTML5 principal e modais
├── style.css           # Estilos globais, design system e animações
├── app.js              # Lógica de controle do catálogo, carrinho e buscas
├── README.md           # Documentação do projeto
└── pizzas/             # Diretório de imagens locais dos produtos
    ├── t pizza 4 queijos.png
    ├── t pizza Frango com Catupiry.png
    ├── t pizza bacon com cheddar.png
    ├── t pizza de chocolate.png
    ├── t pizza margherita.png
    └── t pizza pepperoni.png
```

---

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT. Você é livre para usá-lo, modificá-lo e distribuí-lo.
