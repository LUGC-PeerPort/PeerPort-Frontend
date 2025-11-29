# PeerPort Frontend

This repository contains the frontend code for **PeerPort**, a platform designed to connect students, taking inspiration from other LLM's such as google classroom or D2L, we strive to create the best mix of websites for both teachers and students, providing a perfect blend of both experiences

## Technologies/programs used

**Vercel**
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

### 2. Start frontend server

```bash
ng serve or ng serve --open
```

This will launch the app on:

```
http://localhost:4200
```

---


## Project Structure(rudimentary, will rework later)

```
PeerPort-Frontend/
│── public/           # Static assets
│── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page views (Dashboard, Login, etc.)
│   ├── redux/        # Redux slices & store
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Helper functions
│   ├── App.tsx       # Main app component
│   └── main.tsx      # Entry point
│
└── package.json
```

---

## 🔧 API Configuration

The frontend communicates with the backend through API endpoints.



The link to backend/api-docs for the server

```ts
export const API_BASE_URL = "http://localhost:3000";
```

---

## collaboration

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a pull request
5. merge content
---




