# deployment.md

## Tech Stack

* **Frontend:** React + Next.js, TailwindCSS (optional styling for MVP).
* **Auth & User Management:** Firebase Authentication.
* **Deployment:**

  * Frontend: Vercel (for Next.js)
  * Firebase: Cloud-hosted (Authentication)

---

## Checklist for Task Execution

### 1. Environment Setup

* [ ] Install Node.js (v18+ recommended).
* [ ] Install Next.js via `npx create-next-app@latest rip-clips-auth`.
* [ ] Navigate to project folder and run `npm run dev` to verify setup.

### 2. Setup Firebase

* [ ] Go to [Firebase Console](https://console.firebase.google.com/).
* [ ] Create a new Firebase project (e.g., `rip-clips-hub`).
* [ ] Add a web app inside Firebase project.
* [ ] Copy Firebase config (API key, projectId, etc.).
* [ ] Install Firebase SDK in Next.js: `npm install firebase`.

### 3. Configure Firebase in Next.js

* [ ] Create `lib/firebase.js` (or `firebaseConfig.js`).
* [ ] Initialize Firebase app with config.
* [ ] Setup Firebase Auth instance.

### 4. Create Login Page

* [ ] Create a page: `app/login/page.tsx`.
* [ ] Add form fields: Full Name, Email, Password.
* [ ] Add validation (simple: check empty fields, valid email format).
* [ ] Add button to trigger login/register.

### 5. Implement Auth Logic

* [ ] For new user: `createUserWithEmailAndPassword` → also store full name.
* [ ] For returning user: `signInWithEmailAndPassword`.
* [ ] Save user’s full name (e.g., in Firestore or local state for MVP).
* [ ] Redirect to home page on successful login.

### 6. Home Page

* [ ] Create `app/page.tsx` as Home.
* [ ] Display greeting: “Hey, <Full Name>! You’re successfully logged in.”
* [ ] Add logout button: `signOut` → redirect back to login page.

### 7. Deploy MVP

* [ ] Push repo to GitHub.
* [ ] Connect Vercel to repo and deploy.
* [ ] Set environment variables for Firebase config in Vercel.

---

## Best Practices for Learning Frontend

* Build UI with **reusable components**.
* Separate **auth logic** into `lib/` folder.
* Use **React hooks** (`useState`, `useEffect`) for managing auth state.
* Add **loading/error states** for better UX.
* Start simple, expand with TailwindCSS once basics work.

---

## Next Step (Your Kick-Off)

1. Install Node.js (if not installed).
2. Run:

```bash
npx create-next-app@latest rip-clips-auth
cd rip-clips-auth
npm run dev
```

3. Verify: open [http://localhost:3000](http://localhost:3000) → confirm Next.js app runs.

👉 Once the environment is running, the next move is setting up **Firebase project and config**.
