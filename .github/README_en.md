<div align="center">
  <img src=".github/logo.png" width="250px" align="center"/>
</div>

<h1 align="center">
  🎀 Imagine Laços
</h1>

<p align="center">E-commerce that sells children's accessories, with a more customized visual experience.</p>

<h3 align="center">
  <a href="https://www.figma.com/file/EQarsX2XaixUfXgMY6gvTo/Imagine-La%C3%A7os?node-id=0%3A1">Figma Design</a> •
  <a href="">Production website</a> •
  <a href="README.md">Portuguese README</a>
</h3>

<div align="center">

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
  [![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](#)
  
</div>

## Table of Contents
- [Functionalities](#Functionalities)
- [Integrations](#Integrations)
- [Running locally](#Running-locally)

<h2>Functionalities</h2>

<h3>User</h3>

* Authentication via email or via Google OAuth;
* Password recovery via email;
* Product filtering by categories;
* Put products in the cart;
* Checkout with choice of payment method;
<details>
  <summary>To-do</summary>
  
  * Filter products by other parameters;
  * View ongoing orders and previous orders;
</details>

<h3>Admin</h3>

* Create or remove categories and products;
<details>
  <summary>To-do</summary>
  
  * View orders and postal information;
  * Listing of users;
  * Page with sales statistics;
</details>

<h2>Integrations</h2>

* [Google OAuth](https://console.cloud.google.com) - Used to authenticate via a Google account.
* [Sendgrid](https://sendgrid.com) - Platform for sending emails.
* [Gerencianet](https://gerencianet.com.br) - Offers an API for implementing payment methods, such as credit card, bank slip and PIX.
* [ASAP Log](https://asaplog.com.br) - Delivery service for e-commerces.

<h2>Running locally</h2>

### 1. Initial install
* Clone the repo.
```
git clone https://github.com/RicardoSXAV/imagine-lacos
```
* Run ```npm install``` or ```yarn install``` to install all necessary dependencies.

### 2. Environment variables

* For the client folder, you will need the following environment variable:
```env
REACT_APP_GOOGLE_CLIENT_ID="" # Google Authentication
```
* For the api folder, the following variables will be needed:
```env
DB_URL="" # Connection with database
JWT_SECRET="" # Generate JWT

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
