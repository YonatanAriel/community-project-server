# Community Project Server

A professional networking platform backend built with Node.js and Express, featuring AI-powered user recommendations, LinkedIn OAuth integration, and comprehensive connection management.

## 🚀 Features

- JWT-based authentication
- LinkedIn OAuth integration
- Admin and regular user roles
- Secure password hashing with bcrypt

- User profile management with professional photos
- Connection request system
- Connection management (send, accept, reject, remove)
- Skills, interests, and industry categorization

- Google Gemini API integration
- Intelligent user matching based on profiles
- Personalized connection suggestions

- SQLite with WAL journal mode
- Comprehensive relational schema
- Better-sqlite3 for optimal performance

---

post_title: Community Project Server
author1: Yonatan Ariel
post_slug: community-project-server
microsoft_alias: yonat
featured_image: https://example.com/featured-image.png
categories:

- Node.js
- Backend
- API
- Community
- Database
- AI
- Express
- SQLite
- Authentication
  tags:
- nodejs
- express
- sqlite
- ai
- backend
- api
- authentication
- recommendations
  ai_note: true
  summary: "A Node.js backend server for managing a community platform, featuring user authentication, AI-powered recommendations, and SQLite database integration."
  post_date: 2025-08-28

---

## Overview

The **Community Project Server** is a Node.js backend application designed to power a community platform. It provides RESTful APIs for user management, connection requests, AI-driven recommendations, and more. The server leverages Express, SQLite, and Google Generative AI to deliver a robust, scalable, and intelligent backend solution.

## Features

- User authentication and authorization (JWT-based)
- AI-powered recommendations using Google Generative AI
- Manage users, connections, skills, interests, and industries
- Secure password handling with bcrypt
- RESTful API design with Express
- SQLite database integration via better-sqlite3
- CORS support for cross-origin requests
- Environment variable management with dotenv

## Project Structure

```
community.db                # SQLite database file
index.js                    # Application entry point
package.json                # Project metadata and dependencies
src/
  BL/
    services/               # Business logic and service layer
    utils/                  # Utility modules (auth, error handling, etc.)
    data/                   # (Optional) Fake data for development/testing
    DL/
      DB.js                 # Database connection and setup
      controllers/          # API controllers
      models/               # Database models
  routes/                   # Express route definitions
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```pwsh
   git clone https://github.com/YonatanAriel/community-project-server.git
   cd community-project-server
   ```
2. **Install dependencies:**
   ```pwsh
   npm install
   ```
3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add required variables (e.g., JWT_SECRET, AI_API_KEY, etc.).

4. **Start the development server:**
   ```pwsh
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /auth/login` — User login
- `POST /auth/register` — User registration

### Users

- `GET /user/:id` — Get user profile
- `PUT /user/:id` — Update user profile

### Connections

- `POST /connection-requests` — Send a connection request
- `GET /connection-requests` — List connection requests
- `POST /connections` — Accept a connection

### AI Recommendations

- `GET /ai-recommendations` — Get AI-powered recommendations

### Skills, Interests, Industries

- `GET /skills` — List skills
- `GET /interests` — List interests
- `GET /industries` — List industries

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_google_generative_ai_key
PORT=3000
```

## Scripts

- `npm run dev` — Start the server in development mode with file watching
- `npm start` — Start the server (after build)

## Dependencies

- express
- better-sqlite3
- bcrypt
- jsonwebtoken
- dotenv
- cors
- axios
- @google/generative-ai
- node-fetch

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Google Generative AI](https://ai.google/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## 🏗️ Architecture

### Project Structure

```
community project server/
├── index.js                    # Application entry point
├── package.json                # Dependencies and scripts
├── community.db               # SQLite database
├── src/
│   ├── BL/                    # Business Logic Layer
│   │   ├── services/          # Business logic services
│   │   └── utils/             # Utility functions
│   ├── DL/                    # Data Layer
│   │   ├── controllers/       # Database controllers
│   │   └── models/            # Database models
│   ├── routes/                # API route definitions
│   └── data/                  # Data management utilities
```

### MVC Architecture

- **Models**: Database schema definitions and table creation
- **Controllers**: Database operations and data access layer
- **Services**: Business logic and external API integrations
- **Routes**: RESTful API endpoints and request handling

## 📊 Database Schema

### Core Tables

- **users**: User profiles with authentication data
- **connection_requests**: Connection request management
- **matching_profiles**: AI recommendation profiles
- **skills**: User skill categorization
- **interests**: User interest tracking
- **industries**: Industry classifications

### Relationships

- Users have many-to-many relationships with skills, interests, and industries
- Connection requests link users with status tracking
- Matching profiles store AI recommendation data

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT + LinkedIn OAuth
- **AI Integration**: Google Gemini API
- **Security**: bcrypt for password hashing
- **HTTP Client**: Axios for external API calls

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- LinkedIn Developer Application (for OAuth)
- Google Gemini API key (for AI recommendations)

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "community project server"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   PORT=4000
   JWT_SECRET=your_jwt_secret_key
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:4000/auth/linkedin/callback
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Initialize Database**
   The database will be automatically initialized on first run with all necessary tables.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

This runs the server with file watching for automatic restarts.

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:4000` (or your configured PORT).

## 📡 API Endpoints

### Authentication

- `POST /auth/login` - User login with email/password
- `POST /auth/register` - User registration
- `GET /auth/linkedin` - LinkedIn OAuth initiation
- `GET /auth/linkedin/callback` - LinkedIn OAuth callback

### User Management

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user (admin only)

### Connection Management

- `GET /api/connections/:userId` - Get user's connections
- `POST /api/connection-requests` - Send connection request
- `GET /api/connection-requests/:userId` - Get connection requests
- `PUT /api/connection-requests/:requestId` - Accept/reject request
- `DELETE /api/connections/:connectionId` - Remove connection

### AI Recommendations

- `POST /api/ai-recommendations` - Get AI-powered user recommendations

## 🤖 AI Integration

The platform uses Google Gemini AI to provide intelligent user recommendations:

1. **Profile Matching**: Analyzes user skills, interests, and industries
2. **Query Processing**: Processes natural language queries for recommendations
3. **Response Parsing**: Extracts relevant user IDs from AI responses
4. **Personalization**: Provides tailored connection suggestions

## 🔐 Authentication Flow

### JWT Authentication

1. User logs in with credentials
2. Server validates and returns JWT token
3. Client includes token in Authorization header
4. Server validates token for protected routes

### LinkedIn OAuth

1. User initiates LinkedIn login
2. Redirected to LinkedIn authorization
3. LinkedIn returns authorization code
4. Server exchanges code for access token
5. Retrieves user profile and creates account

## 🔧 Database Operations

### Connection Management

- **Send Request**: Creates entry in connection_requests table
- **Accept Request**: Updates status and creates bidirectional connection
- **Reject Request**: Updates status to 'rejected'
- **Remove Connection**: Deletes connection record

### Profile Management

- **Skills**: Many-to-many relationship through user_skills table
- **Interests**: Many-to-many relationship through user_interests table
- **Industries**: Many-to-many relationship through user_industries table

## 🧪 Development Features

### Fake Data Generation

- Located in `src/data/fakeData/`
- Generates realistic user profiles with professional photos
- Includes skills, interests, and industry assignments
- Uses RandomUser.me API for profile images

### Database Utilities

- Automatic table creation and schema management
- WAL journal mode for better concurrent access
- Comprehensive error handling and logging

## 🔍 Error Handling

The application includes comprehensive error handling:

- **Authentication Errors**: Invalid credentials, expired tokens
- **Authorization Errors**: Insufficient permissions
- **Database Errors**: Connection issues, constraint violations
- **API Errors**: External service failures, invalid requests

## 🚦 CORS Configuration

Configured for frontend development:

- Origin: `http://localhost:5173` (Vite default)
- Methods: GET, POST, PUT, DELETE
- Credentials: Supported for authenticated requests

## 📝 Logging

- Database operations are logged via better-sqlite3 verbose mode
- Service errors are logged to console
- Authentication events are tracked

## 🔄 Development Workflow

1. **Database Changes**: Update model files and restart server
2. **API Changes**: Modify routes and controllers
3. **Business Logic**: Update services in BL layer
4. **Testing**: Use provided fake data generation

## 🌟 Key Features Implementation

### Professional Photos

All user profiles include professional human photos from RandomUser.me API, enhancing the platform's professional appearance.

### Smart Connections

The connection system prevents duplicate requests and manages bidirectional relationships automatically.

### AI Recommendations

Gemini AI analyzes user profiles to suggest relevant connections based on skills, interests, and professional background.

### Scalable Architecture

Clean separation of concerns with service layer pattern enables easy maintenance and feature additions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 💡 Future Enhancements

- Real-time messaging system
- Advanced search and filtering
- Event management features
- Mobile app integration
- Analytics dashboard
- Email notifications

---

For support or questions, please open an issue in the repository.
