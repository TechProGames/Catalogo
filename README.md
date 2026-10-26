# Catálogo online (GitHub Pages)

Duas páginas, sem servidor e sem custo:

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

- Cadastre/edite produtos no painel e clique em **Publicar no site**. O catálogo dos clientes atualiza em cerca de 1 minuto.
- Preço vazio aparece como "Preço sob consulta".
- Desligar a chave de um produto deixa ele como **Esgotado** (aparece, mas não dá para selecionar).
- As fotos são reduzidas automaticamente (máx. 1000 px) antes de subir.
- Mande para os clientes só o link do catálogo (sem `admin.html`).

## Segurança

- O token fica salvo **apenas no navegador** onde você colou. Não compartilhe.
- Qualquer pessoa pode abrir `admin.html`, mas sem o seu token não consegue alterar nada.
- Em um aparelho emprestado, use "Esquecer token deste aparelho" ao terminar.
- Se o token vazar, apague-o em *GitHub → Settings → Developer settings → Personal access tokens* e crie outro.
