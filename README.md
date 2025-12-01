# PeerPort Frontend

This repository contains the frontend code for **PeerPort**, a platform designed to connect students, taking inspiration from other LMS such as Google Classroom or D2L. We strive to create the best mix of websites for both teachers and students, providing a perfect blend of both experiences

## Technologies/programs used

* **TypeScript**
* **Angular**


---

## download and setup

Follow the steps below to run the project locally.

### 1. Install dependencies

Make sure you have **Node.js** installed. Then run:

```bash
npm install
```

### 2. Start Backend

Before starting Frontend, make sure that the Backend is up and running.
To run the Backend, check out the [Backend ReadMe](https://github.com/LUGC-PeerPort/PeerPort-Backend)!

### 3. Start frontend server

```bash
ng serve or ng serve --open
```

This will launch the app on:

```
http://localhost:4200
```

---


## Project Structure

```
PeerPort-Frontend/
│── .angular
│── .vscode
│── .node_modules
│── public/          
│── src/
│   ├── components/   # components of each page that detail each page and its functionality 
│   ├── services/        #  used for adding CRUD and for linking to API  
│   ├── environment/        # controls environment variables
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   └── 
├──.editorconfig
├──.gitignore
├── angular.json
├── package-lock.json
├── package.json
├── ts.config.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

---




