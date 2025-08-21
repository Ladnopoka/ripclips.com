# Assessment Task

## Objective

**Build a simple Next.js app with a login feature using Firebase Authentication.**

---

## Task Overview

You are required to create a Next.js app that includes:

### 1. Login Page

- Fields:
  - **Full Name**
  - **Email Address**
  - **Password**
- Input validation for each field
- Button to trigger login or registration

### 2. Firebase Authentication

- Handle user registration and login

### 3. Homepage

- Greets the user by their full name
- Includes a logout button

---

## Instructions

### 1. Environment Setup

- Follow the [Next.js installation guide](https://nextjs.org/docs/getting-started/installation) to set up your project.

### 2. Create the Login Page

- Design a simple login page with:
  - Fields for **Full Name**, **Email**, and **Password**
  - Input validation for each field
  - Button to trigger login or registration

### 3. Set Up Firebase Authentication

- Go to the [Firebase Console](https://console.firebase.google.com/) and create a project for your app.
- Add Firebase to your Next.js project.
- Follow the [Firebase documentation](https://firebase.google.com/docs/web/setup) to:
  - Integrate the required libraries
  - Add configuration files from Firebase

### 4. Implement Authentication Logic

- Use Firebase’s authentication methods to:
  - **Register new users** or **log in existing ones** based on form input
  - Handle both scenarios:
    - **New User:** Register the user and store their full name
    - **Returning User:** Authenticate the user and fetch their details

### 5. Navigate to the Home Page After Login

- Upon successful login, navigate to a Home Page displaying:
  - A message:  
    > “Hey, &lt;User&gt;! You’re successfully logged in,”  
    with the user’s name
  - A logout button that signs out the user and redirects back to the login page

---

## Tips

- Refer to [Next.js’ Official Documentation](https://nextjs.org/docs) for guidance.
- Test as you code; testing after each step can help catch issues early.
- Focus on functionality over design; a simple layout