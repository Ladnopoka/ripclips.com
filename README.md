# Babylon Assessment Task – Next.js + Firebase Authentication

This project is a simple authentication system built using **Next.js (App Router)**, **Firebase Authentication**, and **Tailwind CSS**.  

The goal of today’s work was to set up a foundation for user authentication, with both **registration** and **login** functionality, styled in a dark green theme using Tailwind.

---

## Features Implemented
- Firebase integration (`firebase.js`) with project config and auth export.
- User **registration** with email and password.
- Added ability to store **displayName** (full name) during registration.
- Basic **login page** with Firebase authentication.
- **Homepage** that adapts depending on user state:
  - If logged in → shows greeting and Logout button.
  - If not logged in → shows options to Login or Register.
- Styled with **Tailwind CSS**.

---

## Improvements to Work On
- Extracting **Auth logic into reusable hooks** (`useAuth`) instead of duplicating in pages.
- Implementing **form validation** for better user experience (e.g., password strength, email validation).
- Adding **error feedback UI** instead of plain text messages.

---

## Next Steps
1. Protect routes using middleware and auth state.
2. Add persistent sessions so users stay logged in after refresh.
3. Improve Tailwind styling with components (buttons, forms).
4. Extend project into a real-world application.

---

## Future of This Project
This project will serve as the foundation for building **[ripclips.com](https://ripclips.com)**,  
a website where users can **watch or upload hardcore rip clips** from ARPG video games such as **Path of Exile, Last Epoch, and Diablo**.  
