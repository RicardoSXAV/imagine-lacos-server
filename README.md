<div align="center">
  <img src=".github/logo.png" width="250px" align="center"/>
</div>

<h1 align="center">
  🎀 Imagine Laços
</h1>

<p align="center">E-commerce para venda de laços e acessórios infantis, com uma experiência visual mais customizada.</p>

<h3 align="center">
  <a href="https://www.figma.com/file/EQarsX2XaixUfXgMY6gvTo/Imagine-La%C3%A7os?node-id=0%3A1">Design no Figma</a> •
  <a href="">Site em produção</a> •
  <a href=".github/README_en.md">English README</a>
</h3>

<div align="center">

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](#)
  
</div>

## Lista de contéudos
- [Funcionalidades](#Funcionalidades)
- [Integrações](#Integrações)
- [Rodando localmente](#Rodando-localmente)

<h2>Funcionalidades</h2>

<h3>Usuário</h3>

* Autenticação por e-mail ou via Google OAuth;
* Recuperação de senha através do e-mail;
* Filtragem de produtos por categorias;
* Colocar produtos no carrinho;
* Checkout com escolha do método de pagamento;
<details>
  <summary>To-do</summary>
  
  * Filtrar produtos por outros parâmetros;
  * Visualização de pedidos em andamento e pedidos anteriores;
</details>

<h3>Administrador</h3>

* Criar ou remover categorias e produtos;
<details>
  <summary>To-do</summary>
  
  * Visualização de pedidos e informações postais;
  * Listagem de usuários;
  * Página com estatísticas sobre vendas;
</details>

<h2>Integrações</h2>

* [Google OAuth](https://console.cloud.google.com) - Usado para fazer a autenticação por meio de uma conta Google.
* [Sendgrid](https://sendgrid.com) - Plataforma para envio de e-mails.
* [Gerencianet](https://gerencianet.com.br) - Oferece uma API para implementação de métodos de pagamento, como cartão de crédito, boleto e PIX.
* [ASAP Log](https://asaplog.com.br) - Serviço de entregas para e-commerces.

<h2>Rodando localmente</h2>

### 1. Instalação inicial
* Clone o repositório.
```
git clone https://github.com/RicardoSXAV/imagine-lacos
```
* Rode ```npm install``` ou ```yarn install``` para instalar todas as dependências necessárias.

### 2. Variáveis de ambiente

* Para a pasta client, será necessária a seguinte variável de ambiente:
```env
REACT_APP_GOOGLE_CLIENT_ID="" # Para fazer a autenticação com o Google
```
* Para a pasta api, serão necessárias as seguintes variáveis:
```env
DB_URL="" # Para conexão com o banco de dados
JWT_SECRET="" # Geração dos tokens JWT

# Sendgrid
FROM_EMAIL=""
SENDGRID_API_KEY=""

# ASAP Log
ASAP_KEY=""
ASAP_PASSWORD=""

# Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Gerencianet
GERENCIANET_CLIENT_ID_H=""
GERENCIANET_CLIENT_SECRET_H=""
```
