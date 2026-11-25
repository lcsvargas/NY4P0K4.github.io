# Portfólio — Lucas Vargas

Portfólio acadêmico estático, feito com HTML, CSS e JavaScript puro. Não usa framework, compilação ou dependências de instalação.

## Como visualizar

- **No VS Code:** abra a pasta do projeto e inicie o `index.html` com a extensão Live Server.
- **Publicado:** o projeto funciona em hospedagem estática, como GitHub Pages.
- Não abra o `index.html` diretamente pelo endereço `file://`: o navegador bloqueia o carregamento do arquivo JSON nesse modo.

## Como adicionar uma atividade

Edite somente `data/activities.json`. Encontre a matéria, depois o trimestre, e adicione um novo objeto dentro de `activities`:

```json
{
  "title": "Nome da atividade",
  "url": "https://link-do-trabalho.com",
  "image": "Matematica/nova-imagem.jpg",
  "competencies": ["C1", "C2"],
  "skills": ["H1", "H5"],
  "status": "available"
}
```

O que cada campo significa:

| Campo | O que preencher |
| --- | --- |
| `title` | Nome que aparece no cartão. |
| `url` | Link do trabalho. Use `null` quando não houver link. |
| `image` | Caminho da imagem a partir da pasta principal. Use `null` para gerar uma capa automática. |
| `competencies` | Lista de competências, por exemplo `C1` e `C2`. |
| `skills` | Lista de habilidades, por exemplo `H1` e `H5`. |
| `status` | `available`, `not-submitted` ou `link-pending`. |

Para adicionar um trimestre, inclua outro objeto dentro de `periods`:

```json
{
  "number": 3,
  "activities": []
}
```

O site cria a seção do trimestre automaticamente. Para adicionar uma matéria, copie a estrutura de uma matéria existente, altere `id`, `name`, `teachers` e `periods`, e adicione a pasta correspondente para as imagens.

O código antigo tinha um rascunho de 3º trimestre, mas vários registros estavam repetidos do 2º trimestre e nenhuma das páginas exibia essa etapa. Por isso, mantive no novo portfólio os registros que estavam efetivamente apresentados (1º e 2º trimestres) e deixei o cadastro pronto para incluir o 3º quando os dados estiverem definidos.

**Importante:** mantenha as vírgulas entre os objetos e não coloque vírgula depois do último item. JSON não aceita comentários.

## Estrutura

```text
assets/
  css/styles.css       # Todo o visual do site
  js/app.js            # Renderização e interações
data/
  activities.json      # Perfil, matérias e atividades
Home/                  # Foto de perfil e atalho legado
Matematica/             # Imagens da matéria
Linguagens/
Humanas/
Natureza/
Tecnico/
index.html              # Página inicial
```

## Onde alterar cada coisa

- **Adicionar/editar atividade, link, competência ou habilidade:** `data/activities.json`.
- **Alterar cores, espaçamento e responsividade:** `assets/css/styles.css`.
- **Alterar a estrutura dos cartões ou os filtros:** `assets/js/app.js`.
- **Alterar a apresentação pessoal e os links de perfil:** objeto `profile` em `data/activities.json`.

## Descrições e pop-ups

- `description` de cada atividade em `data/activities.json` aparece no cartão.
- `data/glossary.json` guarda o significado de cada competência (C) e habilidade (H) por disciplina; ele aparece ao passar o mouse. Código sem texto mostra um aviso: basta adicionar a chave.
- `assets/css/theme.css` é a camada visual (cores, fontes, disco de vinil, pop-up).
