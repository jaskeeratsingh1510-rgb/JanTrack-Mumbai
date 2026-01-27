# JanTrack Mumbai - Civic Awareness & Candidate Transparency Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 🎯 Problem Statement

In local and general elections, voters often lack access to clear, verified, and consolidated information about candidates. Essential details such as educational background, criminal records, past performance, asset declarations, and fulfillment of election promises are scattered across multiple sources or presented in complex formats. This information gap limits informed decision-making and weakens public accountability, ultimately affecting the quality of democratic participation.

## 💡 Our Solution

**JanTrack Mumbai** is a comprehensive civic engagement platform that acts as a digital report card for election candidates. The platform empowers citizens of Mumbai by providing real-time, verified data on local candidates, tracking manifesto promises, enabling civic issue reporting, and presenting constituency-level information through visual dashboards.

## ✨ Key Features

### 📊 Candidate Transparency
- **Unified Candidate Profiles**: Consolidated view of candidate information including:
  - Educational background and qualifications
  - Asset declarations and financial transparency
  - Criminal record disclosure (if any)
  - Past performance metrics and achievements
  - Political history and affiliations
- **Side-by-Side Comparison**: Compare multiple candidates on key parameters to make informed voting decisions
- **Performance Tracking**: Monitor fulfillment of election promises and manifesto commitments

### 🗣️ Civic Engagement
- **Issue Reporting System**: Report local civic issues (potholes, garbage, infrastructure problems) with:
  - Geolocation tagging
  - Photo evidence upload
  - Status tracking and updates
  - Community voting on issue priority
- **Ward-Level Insights**: Access constituency-level fund allocation and utilization data
- **Interactive Ward Maps**: Visualize ward boundaries, routes, and administrative divisions

### 🤖 AI-Powered Assistance
- **Jan Sahayak**: Google Gemini-powered AI chatbot that:
  - Answers queries about candidates and wards using real-time database context
  - Provides personalized recommendations based on user preferences
  - Explains complex political and civic information in simple language
  - Offers multilingual support for broader accessibility

### 🔐 Admin & Verification
- **Secure Admin Dashboard**: Comprehensive administrative portal for:
  - Managing candidate profiles and data verification
  - Reviewing and validating civic issue reports
  - Monitoring platform analytics and user engagement
  - Content moderation and quality control
- **Data Verification**: Multi-level verification process to ensure information accuracy

### 🎨 User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark Mode**: Eye-friendly dark theme option
- **Accessibility**: WCAG 2.1 compliant interface for inclusive access
- **Intuitive Navigation**: User-friendly interface designed for all age groups and tech literacy levels

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) 18+ with [Vite](https://vitejs.dev/) for fast development
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) components
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for server state
- **Routing**: [Wouter](https://github.com/molefrog/wouter) - lightweight routing solution
- **Maps**: [Leaflet](https://leafletjs.com/) with [React-Leaflet](https://react-leaflet.js.org/) for interactive maps
- **Charts**: Data visualization libraries for dashboard analytics

### Backend
- **Server**: [Express.js](https://expressjs.com/) - robust Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - reliable relational database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - type-safe database toolkit
- **Authentication**: Passport.js with Local Strategy for secure user authentication
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Security**: Helmet.js, CORS, rate limiting, and input sanitization

### Third-Party Integrations
- **AI**: Google Gemini API (`@google/generative-ai`) for intelligent chatbot
- **Email**: Resend API for OTP verification and notifications
- **Storage**: Cloudinary for optimized image hosting and delivery
- **Maps Data**: OpenStreetMap for geographical information

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jantrack-mumbai.git
   cd jantrack-mumbai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/jantrack_mumbai

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_secure_random_session_secret_here

   # AI Integration (Google Gemini)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Image Storage (Cloudinary)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key_here
   ```

   **Getting API Keys:**
   - **Gemini API**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Cloudinary**: Sign up at [Cloudinary](https://cloudinary.com/)
   - **Resend**: Get your key from [Resend Dashboard](https://resend.com/api-keys)

4. **Database Setup**
   
   Create a PostgreSQL database:
   ```bash
   createdb jantrack_mumbai
   ```

   Push the schema to your database:
   ```bash
   npm run db:push
   ```

5. **Verify Installation**
   ```bash
   npm run check
   ```

### Running the Application

#### Development Mode

Start both frontend and backend in development mode:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:5000

For separate development servers:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run dev:client
```

#### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The production server will serve the built frontend and API at http://localhost:5000

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend server in watch mode with hot reload |
| `npm run dev:client` | Start frontend Vite dev server |
| `npm run build` | Build both client and server for production |
| `npm run start` | Start the production server |
| `npm run db:push` | Push Drizzle schema changes to PostgreSQL |
| `npm run db:studio` | Open Drizzle Studio for database management |
| `npm run check` | Run TypeScript type checking across the project |
| `npm run lint` | Run ESLint to check code quality |

## 📁 Project Structure

```
jantrack-mumbai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and helpers
│   │   └── styles/        # Global styles and Tailwind config
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── index.ts           # Server entry point
│   └── db/
│       ├── schema.ts      # Drizzle database schema
│       └── index.ts       # Database connection
├── db/                    # Database migrations and seeds
├── shared/                # Shared types and utilities
├── .env                   # Environment variables (not in repo)
├── package.json
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: Secure password storage using bcrypt
- **Session Management**: Secure session handling with express-session
- **Input Validation**: Server-side validation using Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **XSS Protection**: Content Security Policy and input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Controlled cross-origin resource sharing

## 🎨 UI/UX Highlights

- **Material Design Principles**: Clean, modern interface following best practices
- **Responsive Grid Layouts**: Optimized for all screen sizes
- **Loading States**: Skeleton screens and loading indicators for better UX
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: Keyboard navigation, screen reader support, ARIA labels
- **Performance**: Lazy loading, code splitting, and optimized assets

## 🤝 Contributing

We welcome contributions to JanTrack Mumbai! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

Please ensure your code follows our coding standards and includes appropriate tests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hackathon Organizers** for the opportunity to work on civic technology
- **Election Commission of India** for open data initiatives
- **Mumbai Municipal Corporation** for ward and constituency data
- **Open Source Community** for the amazing tools and libraries
- **Google Gemini Team** for AI capabilities
- All contributors and testers who helped improve this platform

## 📧 Contact & Support

For questions, suggestions, or support:

- **Email**: support@jantrack-mumbai.in
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/jantrack-mumbai/issues)
- **Documentation**: [Full documentation](https://docs.jantrack-mumbai.in)

## 🗺️ Roadmap

- [ ] Multi-language support (Marathi, Hindi, English)
- [ ] Mobile app (React Native)
- [ ] Integration with more government data sources
- [ ] Real-time election results tracking
- [ ] Voter registration assistance
- [ ] Push notifications for civic alerts
- [ ] Community forums and discussions
- [ ] Expansion to other cities

---

**Made with ❤️ for better civic engagement and democratic participation**

*JanTrack Mumbai - Empowering Citizens, Strengthening Democracy*