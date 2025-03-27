# Verify.me

Verify.me is a B2B SaaS platform designed to eliminate fraud in digital interactions by creating a verified "channel chain" for companies' online presence. It helps users verify channels like X handles, Telegram handles, websites, emails, and phone numbers.

## Features

- **Public verification page**: Verify any company channel with a simple input
- **Channel chain system**: Companies link their channels for comprehensive verification
- **Company dashboard**: Manage channels and track verification statistics
- **Admin panel**: Approve company registrations and monitor platform usage
- **Modern UI**: Deep blues, crisp whites, subtle gradients, and smooth animations

## Tech Stack

### Frontend
- React.js with TypeScript 
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling

### Backend
- Node.js with Express
- JSON-based data storage (for MVP; can be extended to PostgreSQL/Supabase)
- Simple JWT authentication (for demo purposes)

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/verify.me.git
   cd verify.me
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

4. Run the development servers:
   ```bash
   # Start backend (from root directory)
   cd backend
   npm run dev

   # In a new terminal, start frontend (from root directory)
   cd frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:7879
   
## Demo Credentials

### Company Login
- Email: any email containing '@company' (e.g., `test@company.com`)
- Password: any password at least 8 characters long

### Admin Login  
- Email: `admin@verify.me`
- Password: `admin123`

## Project Structure
```
verify.me/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Express backend
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── .env                    # Environment variables
└── package.json            # Root dependencies
```

## Deployment

The application is designed to be deployed to Vercel for both the frontend and backend.

## License

[MIT](LICENSE)

## Acknowledgements

- Design inspired by [Scira.ai](https://scira.ai)
- Icons from [Heroicons](https://heroicons.com/)
- Font from [Google Fonts](https://fonts.google.com/) 