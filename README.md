# 💡 IdeaVault

IdeaVault is a dynamic, web-based platform designed for innovators, entrepreneurs, and visionaries to share startup concepts, receive community validation, and refine ideas collectively. Moving away from traditional scheduling systems, IdeaVault focuses entirely on open crowdsourced innovation, feedback loops, and trend discovery.

🌐 [Live Site URL]https://idea-vault-phi-five.vercel.app

---

## ✨ Features

*   **Secure Authentication & Seamless State Persistence:** Features complete JWT-backed email/password and Google OAuth workflows. Custom private route wrappers ensure that logged-in users are **never** booted back to the login screen upon refreshing a private route.
*   **Granular Advanced Search & Filtering:** Allows users to easily sift through concepts with case-insensitive title search via MongoDB `$regex` alongside swift category dropdown filtering.
*   **Fully Real-Time Interaction System:** Includes an interactive, private-route protected comment ecosystem where authors can create, instantly edit, or delete their own feedback with clear user attribution and precise timestamps.
*   **Personal Dashboard (Full CRUD Capabilities):** A robust "My Ideas" control hub allowing creators to look over their submissions and perform fast inline updates using modals or safely clear entries with confirmation dialogs.
*   **Global Light/Dark Mode Synergy:** Built-in seamless UI theme toggle accessible from the navigation bar, injecting uniform system-wide typography, equal card scaling, and modern aesthetics (featuring updated X branding) across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

### Client-Side
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS / [ShadCN / Flowbite / Material UI - *Keep your chosen one*]
*   **Icons:** Lucide React / React Icons (Featuring updated X platform branding)
*   **State Management & Routing:** React Router DOM
*   **Feedback System:** React Hot Toast / React Toastify (Zero default browser alerts used)

### Server-Side
*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB Atlas (Utilizing advanced query aggregations like `$limit`, `$regex`, and sorting)
*   **Security:** JSON Web Tokens (JWT) for secure state persistence & cookie-based or header-based route protection

---

## 🚀 Key Client-Side Dynamic Routes

| Route | Accessibility | Description |
| :--- | :--- | :--- |
| `/` | Public | Features a 3-slide innovation banner, custom sections, and top 6 trending ideas. |
| `/ideas` | Public | 3-column responsive catalog equipped with title search and category filter. |
| `/idea/:id` | **Private** | Detailed specification breakdown containing the reactive comment engine. |
| `/add-idea` | **Private** | Multipart form schema evaluating problem, solution, budget, and target audience. |
| `/my-ideas` | **Private** | Personal inventory featuring modal-driven update and delete flows. |
| `/my-interactions` | **Private** | Complete ledger displaying ideas you have validated and commented on. |
| `*` | Public | Custom 404 error page matching global application styling guidelines. |

---

## 💻 Local Installation & Setup

Follow these steps to run the client application locally on your computer:

1. **Clone the repository:**
   
```bash
   git clone [https://github.com/sultanafardhowsy/ideavault-client.git](https://github.com/YOUR_GITHUB_USERNAME/ideavault-client.git)
   cd ideavault-client
   npm i
   copy .env.example .env.local
   PowerShell
   Copy-Item .env.example .env.local
   bash
   npm run dev
