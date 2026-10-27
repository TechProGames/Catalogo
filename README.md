# Catálogo online (GitHub Pages)

Arquivos: `index.html` (catálogo), `admin.html` (painel), `comum.js` (código usado pelos dois) e `data/produtos.json` (seus produtos).

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
- As **opções** no fim da edição (ex.: 90 dias de garantia, Em oferta, Último disponível) aparecem listadas embaixo do produto. Dá para renomear, apagar e criar novas.
- Na aba **Loja**, escolha 📱 Celular ou 🖥 Computador na pré-visualização (⛶ amplia). A logo, o nome, a frase e o Instagram aparecem em caixas tracejadas: arraste para mover e puxe o quadradinho do canto para mudar o tamanho — cada aparelho guarda as suas posições. Clique em qualquer texto da pré-visualização para mudar fonte, tamanho, cor e estilo só dele. Os tamanhos de texto valem para o aparelho escolhido na pré-visualização (celular e computador são separados). O topo do site é ampliado/reduzido por igual em cada tela, então fica idêntico à prévia em qualquer celular.
- Na aba **Categorias**, a setinha ▾ recolhe uma categoria e suas subcategorias, e o 🔗 adiciona caminhos de outras categorias (quantos quiser): "usar as subcategorias de" ou "incluir inteira". Os itens são os mesmos nos dois caminhos — cadastrar por qualquer um deles dá no mesmo.
- Na edição do produto, em **Itens para o cliente escolher junto**, escolha o caminho até uma categoria e o texto do botão (ex.: "Adicionar Jogos"). No site, o botão abre uma nova aba já nessa lista, com o produto principal selecionado.
- **Armazenamento (versões)**: cadastre versões como 500 GB / 1 TB com o espaço livre e, se quiser, o preço de cada uma. O cliente escolhe a versão, e a soma dos itens em GB não pode passar do espaço livre.
- **Categoria do item** (Ação, Aventura…) aparece embaixo do nome e vira filtro dentro das categorias do site, junto com a busca e a ordenação (A–Z, Z–A, menor/maior valor).
- No catálogo, ao tocar numa categoria as subcategorias abrem numa lista compacta logo abaixo dela; o caminho escolhido aparece na linha com setas.
- No catálogo, o cliente toca no produto para ver fotos grandes, descrição completa e opções.
- Cada produto pode ter até 10 fotos (viram carrossel no catálogo) e valor em **R$** ou em **GB**.
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
