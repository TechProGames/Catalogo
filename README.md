# Catálogo online (GitHub Pages)

Arquivos: `index.html` (catálogo), `admin.html` (painel), `pedido.html` (página do pedido), `comum.js` e `pedido.js` (código compartilhado), `topo-pdf.png` (topo do PDF) e `data/produtos.json` (seus produtos).

- **`index.html`** — o catálogo que você manda para os clientes. Eles buscam, filtram por categoria, escolhem itens e quantidades e enviam a lista pronta para o seu WhatsApp.
- **`admin.html`** — o seu painel. Cadastra, edita, apaga, reordena, marca como esgotado/destaque, envia fotos e publica tudo direto no repositório.

Os produtos ficam em `data/produtos.json` e as fotos em `imagens/`, dentro do próprio repositório.

## Como colocar no ar

1. **Crie o repositório** no GitHub (ex.: `catalogo`), como **público** — o GitHub Pages gratuito só funciona em repositório público.
2. **Envie os arquivos**: no repositório, *Add file → Upload files* e arraste **todo o conteúdo desta pasta** (incluindo a pasta `data` e o arquivo `.nojekyll`). Clique em *Commit changes*.
3. **Ative o site**: *Settings → Pages → Build and deployment → Source: Deploy from a branch*, escolha `main` e `/ (root)`, salve. Em 1–2 minutos o site fica em
   `https://SEU-USUARIO.github.io/catalogo/`
4. **Crie o token do painel**: abra <https://github.com/settings/personal-access-tokens/new>
   - *Repository access*: **Only select repositories** → marque `catalogo`
   - *Permissions → Repository permissions → Contents*: **Read and write**
   - Gere e copie o token (começa com `github_pat_`).
5. **Abra o painel**: `https://SEU-USUARIO.github.io/catalogo/admin.html`, cole o token e clique em **Conectar e carregar**. Usuário e repositório já vêm preenchidos.

## Uso no dia a dia

- O painel tem 4 abas: **Produtos** (lista agrupada e recolhida por categoria), **Categorias** (categorias dentro de categorias, sem limite de níveis), **Loja** (logo, cores, fontes, tamanhos e dados, com pré-visualização ao vivo) e **Conexão** (token e backup).
- Clique na foto, no nome ou no ✎ de um produto para editar.
- No cadastro, a **Categoria** abre como árvore: as subcategorias ficam recolhidas (toque na setinha ▸ para abrir) e o caminho da última categoria usada já vem aberto.
- Em **Categoria do item**, toque na caixa para ver todos os filtros e marque **um ou vários** (toque de novo para desmarcar); **▴ Minimizar** fecha a caixa. Para criar um filtro novo, digite na caixa ao lado e toque em ＋. No site, o item aparece em cada filtro marcado.
- As **opções** no fim da edição (ex.: 90 dias de garantia, Em oferta, Último disponível) aparecem listadas embaixo do produto. Dá para renomear, apagar e criar novas.
- Na aba **Loja**, escolha 📱 Celular ou 🖥 Computador na pré-visualização (⛶ amplia). A logo, o nome, a frase e o Instagram aparecem em caixas tracejadas: arraste para mover e puxe o quadradinho do canto para mudar o tamanho — cada aparelho guarda as suas posições. Clique em qualquer texto da pré-visualização para mudar fonte, tamanho, cor e estilo só dele. Os tamanhos de texto valem para o aparelho escolhido na pré-visualização (celular e computador são separados). O topo do site é ampliado/reduzido por igual em cada tela, então fica idêntico à prévia em qualquer celular.
- Na aba **Categorias**, a setinha ▾ recolhe uma categoria e suas subcategorias, e o 🔗 adiciona caminhos de outras categorias (quantos quiser): "usar as subcategorias de" ou "incluir inteira". Os itens são os mesmos nos dois caminhos — cadastrar por qualquer um deles dá no mesmo.
- Na edição do produto, em **Itens para o cliente escolher junto**, escolha o caminho até uma categoria e o texto do botão (ex.: "Adicionar Jogos"). No site, o botão abre uma nova aba já nessa lista, com o produto principal selecionado.
- **Serviços / variações com foto**: num anúncio (ex.: Controle PS5), use **＋ Puxar itens já cadastrados** e toque nos itens (ex.: troca do conector, analógico…). Eles saem da lista solta e passam a ficar dentro do anúncio, cada um com a sua foto, nome, descrição e valor. No site, o cartão mostra o botão "Clique para ver as opções"; na janela que abre, ao tocar num serviço o anúncio mostra esse serviço; tocando de novo volta para o produto. Sem valor no anúncio, o cliente escolhe só os serviços (aparece "a partir de"). O ✕ devolve o item para a lista. No pedido sai "Controle PS5 — Troca do conector USB C".
- **Armazenamento (versões)**: cadastre versões como 500 GB / 1 TB com o espaço livre e, se quiser, o preço de cada uma. O cliente escolhe a versão, e a soma dos itens em GB não pode passar do espaço livre.
- **Categoria do item** (Ação, Aventura…) aparece embaixo do nome e vira filtro dentro das categorias do site, junto com a busca e a ordenação (A–Z, Z–A, menor/maior valor).
- No catálogo, ao tocar numa categoria as subcategorias abrem numa lista compacta logo abaixo dela; o caminho escolhido aparece na linha com setas.
- No catálogo, o cliente toca no produto para ver fotos grandes, descrição completa e opções.
- Cada produto pode ter até 10 fotos (viram carrossel no catálogo) e valor em **R$** ou em **GB**.
- O **formato da capa** fica no cadastro de cada produto (Automático = proporção da própria foto, ou 1:1, 4:5, 3:4, 2:3, 9:16), com **prévia do cartão**. Novos produtos começam com a última configuração usada.
- **Também mostrar em**: o mesmo item aparece em outras categorias. **⧉ Duplicar** (na lista de produtos) cria uma cópia separada.
- No site, os itens de uma categoria ficam lado a lado (mesmo de subcategorias diferentes), com o caminho em cima; o caminho, os títulos e a logo/nome da loja são links.
- **Pedidos**: ao tocar em "Enviar pelo WhatsApp", o cliente manda a mensagem (os itens adicionais, como jogos, aparecem como "Jogos listados no PDF anexado") e depois um botão envia o **PDF com as capas** (no celular abre o compartilhamento; no computador baixa o arquivo). A mensagem também leva um **link do pedido completo** (`pedido.html`).
- **Histórico**: abra o link do pedido num aparelho onde o painel está conectado e ele entra sozinho na aba **Pedidos** (ou cole o link lá). Fica guardado neste navegador ou, se configurar, num repositório **privado** do GitHub — nunca no repositório público do catálogo.
- **Link curto**: cada produto tem um código curto fixo (criado sozinho pelo painel), e o link do pedido leva só esses códigos, compactados (ex.: `…/Catalogo/#3.FFSCK2.BAQAAA…`). O link abre direto a página do pedido. Links antigos continuam funcionando.
- **Limpar seleção**: o 🗑 na barra de baixo (e "Limpar seleção" na lista) esvazia tudo o que o cliente marcou.
- **Apagar histórico**: na aba **Pedidos**, o ✕ de cada pedido apaga só ele; **🗑 Apagar todos** limpa o histórico inteiro (pede confirmação duas vezes).
- **Topo do PDF**: usa `topo-pdf.png` (logo + nome da loja). Para trocar, use **Loja › Topo do PDF do pedido**.
- **Ordem**: os itens aparecem em **A → Z** por padrão; o cliente pode trocar para Z → A, **Mais vendidos**, Valor (menor → maior / maior → menor), GB (menor → maior / maior → menor) ou a ordem da loja.
- **Mais vendidos**: ao **Publicar**, o painel soma o que foi pedido no histórico e publica só a contagem por produto (sem dados de clientes). O ranking também aparece na aba **Pedidos**.
- Depois de mexer, clique em **Publicar no site**. O catálogo dos clientes atualiza em cerca de 1 minuto.
- Valor em R$ vazio aparece como "Preço sob consulta". Itens em GB mostram a soma de GB do que o cliente escolheu.
- Desligar a chave (ou desmarcar "Disponível") de um produto deixa ele como **Esgotado** (aparece, mas não dá para selecionar).
- As fotos são reduzidas automaticamente (máx. 1000 px) antes de subir.
- Mande para os clientes só o link do catálogo (sem `admin.html`).

## Segurança

- O token fica salvo **apenas no navegador** onde você colou. Não compartilhe.
- Qualquer pessoa pode abrir `admin.html`, mas sem o seu token não consegue alterar nada.
- Em um aparelho emprestado, use "Esquecer token deste aparelho" ao terminar.
- Se o token vazar, apague-o em *GitHub → Settings → Developer settings → Personal access tokens* e crie outro.
