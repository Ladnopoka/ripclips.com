# Development Diary

## 21/08/2025
### Initial setup

1. Started reading Next.js documentation to have a better understanding of this cool web development framework
2. Created a Next.js Project using "npx create-next-app@latest" in root directory
3. Initialized a GitHub repository and made my first commit
4. Installed Firebase using npm install firebase - This adds Firebase SDK needed for Auth
5. Created a new Firebase project though Firebase Console
6. Setting local environment variables from Firebase config
7. Reading Firebase docs at https://firebase.google.com/docs/auth to learn Authentication basics
7. Understanding the core features, supported providers, and how to set up flows like email/password login, Google sign-in, password management, and more
8. Found this useful documentation of Firebase + Next.js implementation - https://firebase.google.com/codelabs/firebase-nextjs - will work on this and see where I can get


### Firebase integration

1. Learning about Password authentication with Firebase at https://firebase.google.com/docs/auth/web/password-auth
2. To create new pages, I must put them into app directory
3. Turned page.tsx into a client component
4. Got my first successful registration using my own email and passowrd. The user is displayed in my Firebase project
5. Added some Tailwind CSS styling to make the working page to be a bit more fun
6. Added full name field and update profile logic
7. Added login page with similar logic like on the register page


### Homepage and Login/Register routing

1. Restructured directories to make Homepage to be main page
2. Login and Register pages are now accessible from homepage
3. Added "router.push("/homepage");" to redirect back to homepage after successful login or registration

4. How does routing from homepage works?:
    - onAuthStateChanged listens for auth changes.
    - If the user is logged in -> shows greeting + logout button.
    - If no user -> shows Register / Login buttons.
    - Clicking Logout signs the user out and returns to the same page showing the buttons.
