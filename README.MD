# routeify-cli

O routeify-cli é uma ferramenta de linha de comando que permite a criação de projetos com o [routeify-express](https://www.npmjs.com/package/routeify-express) de forma rápida e fácil.

[![npm version](https://badge.fury.io/js/routeify-cli.svg)](https://www.npmjs.com/package/routeify-cli)

## 📦 Instalação

Utilize o npm para instalar o routeify-cli globalmente:

```bash
npm i routeify-cli -g
```

## 🛠 Como Usar

### Criar um novo projeto

Para criar um novo projeto com o routeify-express, execute o comando abaixo:

```bash
routeify new my-project-name [options]
```

#### Flags Disponíveis

- `-p` - Define o gerenciador de pacotes do projeto (npm || yarn || pnpm)
- `--no-git` - Não inicia um repositório git no projeto
- `--no-install` - Não instala as dependências do projeto

### Executar o projeto

Para executar o projeto, entre na pasta do projeto e execute o comando abaixo:

```bash
    npm run dev
```

OU

```bash
    routeify dev
```

## 📄 Licença

[MIT](https://choosealicense.com/licenses/mit/)

## Autores

- [@piazin](https://www.github.com/piazin)
