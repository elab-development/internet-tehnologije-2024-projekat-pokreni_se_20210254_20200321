# Pokreni Se - Sports Event Management Platform

A full-stack web application for managing and participating in sports events. Built with Laravel (backend) and React (frontend).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Pokreni Se is a comprehensive sports event management platform that allows users to:
- Browse and search for sports events
- Create and manage their own events
- Join events as participants
- Manage user accounts and roles
- Administer the platform (admin users)

The application follows a modern architecture with a RESTful API backend and a responsive React frontend.

## ✨ Features

### Public Features (Guest Users)
- Browse all sports events
- Search events by name, sport, or location
- View event details and participant lists
- Browse available sports categories

### Registered User Features
- User registration and authentication
- Create and manage personal events
- Join events as participants
- View personal event history
- Edit profile information

### Admin Features
- Manage all users (view, delete)
- Create, edit, and delete sports categories
- Delete any event (moderation)
- Access admin dashboard with statistics
- Full platform administration

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 11.x (PHP 8.2+)
- **Authentication**: Laravel Sanctum
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **API**: RESTful API with JSON responses
- **Validation**: Laravel Form Request Validation
- **Testing**: PHPUnit

### Frontend
- **Framework**: React 19.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with modern design patterns

### Development Tools
- **Package Manager**: Composer (PHP), npm (JavaScript)
- **Build Tool**: Vite (Laravel), Create React App
- **Version Control**: Git

## 📁 Project Structure

```
internet-tehnologije-2024-projekat-pokreni_se_20210254_20200321/
├── backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/              # Eloquent Models
│   │   ├── Http/Middleware/     # Custom Middleware
│   │   └── Http/Resources/      # API Resources
│   ├── database/
│   │   ├── migrations/          # Database Migrations
│   │   └── seeders/             # Database Seeders
│   ├── routes/
│   │   └── api.php              # API Routes
│   └── tests/                   # Backend Tests
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Service Layer
│   │   ├── hooks/               # Custom React Hooks
│   │   └── routes/              # Routing Configuration
│   └── public/                  # Static Assets
└── README.md                   # This Documentation
```

## 🚀 Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internet-tehnologije-2024-projekat-pokreni_se_20210254_20200321
   ```

2. **Install PHP dependencies**
   ```bash
   cd backend
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Start the backend server**
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env` file:

```env
APP_NAME="Pokreni Se"
APP_ENV=local
APP_KEY=your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Frontend Configuration

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📖 Usage

### User Registration and Authentication

1. **Register a new account**
   - Navigate to `/register`
   - Fill in name, email, and password
   - Submit the form

2. **Login**
   - Navigate to `/login`
   - Enter email and password
   - Access authenticated features

### Event Management

1. **Browse Events**
   - Visit the home page to see all events
   - Use search functionality to find specific events

2. **Create an Event**
   - Login to your account
   - Navigate to "Create Event"
   - Fill in event details (name, description, sport, location, date, max participants)
   - Submit the form

3. **Join an Event**
   - View event details
   - Click "Join Event" button
   - Confirm participation

4. **Manage Your Events**
   - Navigate to "My Events"
   - View created and joined events
   - Edit or delete your own events

### Admin Panel

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin-panel`

2. **Manage Users**
   - View all registered users
   - Delete users if necessary

3. **Manage Sports**
   - Add new sports categories
   - Edit existing sports
   - Delete sports

4. **Event Moderation**
   - Delete any event from the platform
   - Monitor event creation and participation

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/register` | Register new user | Public |
| POST | `/api/login` | User login | Public |
| POST | `/api/logout` | User logout | Authenticated |
| GET | `/api/profile` | Get user profile | Authenticated |

### Event Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/events` | List all events | Public |
| GET | `/api/events/{id}` | Get event details | Public |
| GET | `/api/events/search` | Search events | Public |
| POST | `/api/events` | Create new event | Registered User |
| PUT | `/api/events/{id}` | Update event | Event Owner |
| DELETE | `/api/events/{id}` | Delete event | Event Owner/Admin |

### Event Participation

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/events/{event}/participants` | Join event | Registered User |
| DELETE | `/api/events/{event}/participants/{participant}` | Leave event | Participant |
| GET | `/api/events/{event}/participants` | List participants | Registered User |

### Sports Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/sports` | List all sports | Public |
| GET | `/api/sports/{id}` | Get sport details | Public |
| POST | `/api/sports` | Create new sport | Admin |
| PUT | `/api/sports/{id}` | Update sport | Admin |
| DELETE | `/api/sports/{id}` | Delete sport | Admin |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | List all users | Admin |
| DELETE | `/api/admin/users/{id}` | Delete user | Admin |
| GET | `/api/admin/dashboard` | Admin dashboard | Admin |

## 🗄️ Database Schema

### Users Table
```sql
users (
    id (primary key)
    name (string)
    email (string, unique)
    password (string, hashed)
    role (string: 'user', 'admin')
    email_verified_at (timestamp)
    created_at (timestamp)
    updated_at (timestamp)
)
```

### Sports Table
```sql
sports (
    id (primary key)
    name (string)
    description (text)
    created_at (timestamp)
    updated_at (timestamp)
)
```

### Events Table
```sql
events (
    id (primary key)
    name (string)
    description (text)
    sport_id (foreign key to sports)
    location (string)
    max_participants (integer)
    start_time (datetime)
    user_id (foreign key to users)
    image (string, nullable)
    created_at (timestamp)
    updated_at (timestamp)
)
```

### Event Participants Table
```sql
event_participants (
    id (primary key)
    event_id (foreign key to events)
    user_id (foreign key to users)
    created_at (timestamp)
    updated_at (timestamp)
)
```

## 👥 User Roles

### Guest User
- Browse events and sports
- Search functionality
- View event details

### Registered User
- All guest permissions
- Create and manage own events
- Join events as participants
- Edit profile
- View personal event history

### Admin User
- All registered user permissions
- Manage all users
- Create, edit, delete sports
- Delete any event
- Access admin dashboard
- Full platform administration

## 🛠 Development

### Backend Development

1. **Run migrations**
   ```bash
   php artisan migrate
   ```

2. **Run seeders**
   ```bash
   php artisan db:seed
   ```

3. **Clear cache**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   ```

4. **Generate API documentation**
   ```bash
   php artisan route:list --path=api
   ```

### Frontend Development

1. **Start development server**
   ```bash
   npm start
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Run tests**
   ```bash
   npm test
   ```

### Code Style

- **Backend**: Follow PSR-12 coding standards
- **Frontend**: Use ESLint and Prettier for code formatting
- **Git**: Use conventional commit messages

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test public endpoint
curl http://localhost:8000/api/events

# Test authenticated endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/profile
```

## 🚀 Deployment

### Backend Deployment

1. **Production environment setup**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Database setup**
   ```bash
   php artisan migrate --force
   ```

3. **Web server configuration**
   - Configure Nginx/Apache to serve Laravel
   - Set up SSL certificates
   - Configure environment variables

### Frontend Deployment

1. **Build production version**
   ```bash
   npm run build
   ```

2. **Deploy build folder**
   - Upload `build/` folder to web server
   - Configure server for React Router

### Environment Variables

Set production environment variables:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

## 🤖 AI Event Summary Setup

The app includes AI-powered event summaries using Hugging Face's free API:

### Setup Hugging Face API (Free Tier)
1. **Get Hugging Face API Key:**
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create a new access token
   - Copy the token

2. **Add to .env file:**
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   ```

### Template Fallback
If the Hugging Face API is not available, the system will generate a template-based summary automatically.

### Test the Summary API:
```bash
# Test with event ID 1
curl "http://localhost:8000/api/summary-debug/1"

# Get event with summary included
curl "http://localhost:8000/api/events/1?include_summary=1"
```

**Features:**
- ✅ **Free to use** (Hugging Face free tier or local Ollama)
- ✅ **Cached for 1 hour** to improve performance
- ✅ **Fallback system** ensures summaries always work
- ✅ **Sport-specific** summaries based on event details
- ✅ **Optional loading** - only loads when requested

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

- **Maša Grubor** (2021/0254)
- **Lazar Tasić** (20200321)

## 🙏 Acknowledgments

- Laravel team for the excellent framework
- React team for the frontend library
- All contributors and testers

---

**Note**: This documentation is maintained as part of the Internet Technologies 2024 project. For questions or issues, please refer to the project repository or contact the development team. 