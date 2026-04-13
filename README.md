# Medium Clone - Content Publishing Platform

A full-featured content publishing platform similar to Medium, built with Django REST Framework and React.

## Latest Updates

### Recent Features Added:
- **Simplified Registration**: Only email, password, first name, and last name required
- **Enhanced Password Validation**: Minimum 6 characters with letters + numbers/special characters
- **Clickable Author Profiles**: Click author names/avatars to view their profiles
- **Follow System**: Follow/unfollow users from their profile pages
- **Real-time Notifications**: Instant notification badge updates
- **Professional UI**: SVG icons and responsive design across all devices
- **Avatar Dropdown Menu**: Settings, Help, About, and Sign out functionality
- **Comprehensive Pages**: Settings, Help, About, Following, and Stories management

## Project Structure

```
├── backend/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── local.py
│   │   │   └── prod.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── celery.py
│   ├── apps/
│   │   ├── users/
│   │   ├── articles/
│   │   ├── interactions/
│   │   ├── comments/
│   │   ├── notifications/
│   │   └── feeds/
│   ├── common/
│   │   ├── pagination.py
│   │   ├── permissions.py
│   │   └── utils.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
├── README.md
├── ARCHITECTURE.md
├── SUBMISSION.md
└── .gitignore
```

## Features

### Core Features
- **User Management**: Simplified registration with email/password, user profiles with avatars
- **Content Management**: Rich text editor, draft/published states, article series
- **Discovery & Engagement**: Personalized feeds, search, clap system, bookmarks, comments
- **Social Features**: Follow/unfollow users, clickable author profiles, user discovery
- **Real-time Features**: WebSocket notifications, live updates, instant badge clearing
- **Background Processing**: Async tasks for emails, image processing, feed generation
- **Professional UI**: Mobile-responsive design, SVG icons, consistent layouts

### User Interface
- **Sidebar Navigation**: Always visible with user info and quick access links
- **Avatar Dropdown**: Settings, Help, About, and Sign out options
- **Notification System**: Real-time badge updates and popup notifications
- **Responsive Design**: Optimized for all screen sizes (desktop, tablet, mobile)
- **Professional Icons**: Clean SVG icons throughout the interface

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Database Setup

1. **Install PostgreSQL** (if not already installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

2. **Create Database and User**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE medium_clone_db1;
CREATE USER medium_clone_user1 WITH PASSWORD 'medium_clone_pass1';
GRANT ALL PRIVILEGES ON DATABASE medium_clone_db1 TO medium_clone_user1;
\q
'''I have creadted 

### Backend Setup

1. **Clone and setup environment**
```bash
git clone <repository-url>
cd mediumclone/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Database migrations**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

3. **Run services**
```bash
# Terminal 1: Django server
python manage.py runserver

# Terminal 2: Celery worker (optional for now)
celery -A config worker -l info

# Terminal 3: Redis server
redis-server
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Docker Setup

```bash
docker-compose up --build
```

## API Endpoints

### Authentication & Users
- `POST /api/v1/auth/register/` - Register user (email, password, first_name, last_name)
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/logout/` - Logout
- `GET /api/v1/users/profile/` - Get user profile
- `PUT /api/v1/users/profile/` - Update profile
- `POST /api/v1/users/<email>/follow/` - Follow user
- `DELETE /api/v1/users/<email>/follow/` - Unfollow user
- `GET /api/v1/users/following/` - Get following list

### Articles
- `POST /api/v1/articles/` - Create article
- `GET /api/v1/articles/` - List articles
- `GET /api/v1/articles/<slug>/` - Get article
- `PUT /api/v1/articles/<slug>/` - Update article
- `POST /api/v1/articles/<slug>/publish/` - Publish article
- `GET /api/v1/articles/search/` - Search articles

### Interactions
- `POST /api/v1/interactions/clap/<slug>/` - Clap article
- `POST /api/v1/interactions/bookmark/<slug>/` - Bookmark article
- `DELETE /api/v1/interactions/bookmark/<slug>/` - Remove bookmark
- `GET /api/v1/interactions/clap/<slug>/status/` - Get clap status
- `GET /api/v1/interactions/bookmark/<slug>/status/` - Get bookmark status

### Notifications
- `GET /api/v1/notifications/` - Get notifications
- `POST /api/v1/notifications/<id>/read/` - Mark as read
- `POST /api/v1/notifications/mark-all-read/` - Mark all as read

## Database Schema

### Core Models
- **User**: Extended Django user with profile fields, social links, follower counts
- **Article**: Content with metadata, tags, engagement metrics, scheduled publishing
- **Comment**: Threaded comments with parent-child relationships
- **Tag**: Article categorization
- **Follow**: User relationships
- **Clap**: Article appreciation (max 50 per user)
- **Bookmark**: Saved articles
- **Notification**: Real-time user notifications

## API Documentation

Interactive API documentation available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## Development

The project uses:
- **Django REST Framework** for API
- **PostgreSQL** for database
- **Redis** for caching and message brokering
- **Celery** for background tasks
- **Token Authentication** for API access
- **React Router** for frontend navigation
- **Context API** for state management

## Key Features Implementation

### Registration System
- Simplified form with email, password, first name, last name
- Password validation: minimum 6 characters with letters + numbers/special chars
- Email used as username automatically
- Instant account creation

### Social Features
- Clickable author names and avatars throughout the app
- User profile pages with follow/unfollow functionality
- Real-time follower count updates
- Following page to manage followed users

### Notification System
- Real-time notification badges in header
- Instant badge clearing when notifications viewed
- Popup notifications for new activities
- Comprehensive notification management

### User Interface
- Professional SVG icons replacing emoji icons
- Consistent 1200px width layouts across all pages
- Mobile-responsive design with comprehensive breakpoints
- Sidebar navigation visible by default
- Avatar dropdown with Settings, Help, About, Sign out

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Database Backup & Restore

### Create Backup
```bash
PGPASSWORD=medium_clone_pass1 pg_dump -h localhost -U medium_clone_user1 -d medium_clone_db1 > medium_clone_backup.sql
```

### Restore from Backup
```bash
PGPASSWORD=medium_clone_pass1 psql -h localhost -U medium_clone_user1 -d medium_clone_db1 < medium_clone_backup.sql
```

## Environment Variables

Create `.env` file in backend directory:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://medium_clone_user1:medium_clone_pass1@localhost:5432/medium_clone_db1
REDIS_URL=redis://localhost:6379/0
```
