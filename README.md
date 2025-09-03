# LegalTrack: AI-Powered Legal Assistance Platform

LegalTrack is a full-stack web application designed to be a comprehensive legal assistance platform. It leverages modern web technologies, AI, and blockchain to provide a secure, transparent, and user-friendly experience for managing legal information and processes.

## ✨ Key Features

*   **FIR Management**: Securely file, view, and update First Information Reports (FIRs).
*   **IPC Section Prediction**: An intelligent feature that uses a machine learning model to predict relevant Indian Penal Code (IPC) sections based on incident descriptions.
*   **AI-Powered Chatbot**: An interactive chatbot, powered by the OpenAI API, to assist users with their legal queries in real-time.
*   **Blockchain Integration**: Utilizes blockchain technology for data integrity, ensuring that records like FIRs are immutable and transparent.
*   **User Authentication**: Secure user sign-up and sign-in functionality provided by Clerk.
*   **Legal Handbook**: A comprehensive resource section for users to access legal information and guidelines.
*   **Officer Management**: A dedicated portal for administrators to manage law enforcement officer details.

## 🚀 Tech Stack

### Frontend

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Blockchain Interaction**: [Ethers.js](https://ethers.io/)
*   **API Communication**: [Axios](https://axios-http.com/)

### Backend

*   **Framework**: [Express.js](https://expressjs.com/)
*   **Language**: [Node.js](https://nodejs.org/)
*   **Blockchain Interaction**: [Ethers.js](https://ethers.io/), [Web3.js](https://web3js.org/)
*   **File Uploads**: [Multer](https://github.com/expressjs/multer)

## 🏁 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
*   [Yarn](https://classic.yarnpkg.com/en/docs/install) (or npm)
*   A code editor like [VS Code](https://code.visualstudio.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/legaltrack.git
    cd legaltrack
    ```

2.  **Install frontend dependencies:**
    ```bash
    yarn install
    # or
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd backend
    yarn install
    # or
    npm install
    cd ..
    ```

### Environment Variables

Both the frontend and backend require environment variables to function correctly.

1.  **Frontend (`.env.local`):** Create a file named `.env.local` in the root of the project and add the following variables. You can get the Clerk keys from your Clerk dashboard.

    ```env
    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # Backend API URL
    NEXT_PUBLIC_API_URL=http://localhost:3001

    # OpenAI API Key (if used from Next.js API routes)
    OPENAI_API_KEY=your_openai_api_key
    ```

2.  **Backend (`backend/.env`):** Create a file named `.env` in the `backend` directory and add your blockchain-related secrets.

    ```env
    # Blockchain Configuration
    PRIVATE_KEY=your_ethereum_wallet_private_key
    RPC_URL=your_infura_or_alchemy_rpc_url
    CONTRACT_ADDRESS=your_deployed_smart_contract_address
    ```

### Running the Application

You need to run both the frontend and backend servers simultaneously in separate terminals.

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start # Or your configured start script
    ```
    The backend will run on `http://localhost:3001` (or the port you configure).

2.  **Start the frontend development server:**
    ```bash
    # In the root directory
    yarn dev
    ```
    The frontend will be available at `http://localhost:3000`.

## ☁️ Deployment

This project is structured as a monorepo and is best deployed as two separate services.

*   **Frontend (Next.js)**: The frontend is optimized for deployment on **[Vercel](https://vercel.com/)**. A `.vercelignore` file is included to ensure only the frontend code is deployed.
*   **Backend (Node.js)**: The backend can be deployed to any service that supports Node.js, such as **[Render](https://render.com/)** or Heroku.

Remember to configure all necessary environment variables in your hosting provider's dashboard.

## 📂 Project Structure

```
.
├── app/          # Next.js 13+ App Router pages and layouts
├── backend/      # Node.js/Express backend server
├── components/   # Shared React components
├── lib/          # Utility functions and libraries
├── public/       # Static assets (images, fonts, etc.)
├── scripts/      # Helper scripts (e.g., deployment, model setup)
└── ...
```
