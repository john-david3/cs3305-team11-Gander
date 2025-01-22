# **Team 11 - Live Streaming Platform**

## Overview

Our project is a live streaming service that enables content creators to broadcast to viewers through a web-based platform. The application consists of a React-based frontend that users access to watch streams, and a Flask backend that manages the core functionality and business logic.

## Access Control Levels

The platform implements three-tier access control:

1. **No Access** (Non-authenticated Users)
   - View live streams
   - Browse available content

2. **Regular Access** (Authenticated Users)
   - All features available to non-authenticated users
   - Ability to donate to streamers through Stripe integration
   - Interact with streams through comments
   - Follow other users
   - Option to become a content creator and start streaming

3. **Admin Access**
   - Complete platform management capabilities
   - Content moderation tools
   - User account management
   - System configuration controls

## Technical Stack

### Frontend
- React with TypeScript for type safety
- Tailwind CSS for styling
- Video.js for stream playback
- Stripe integration for payment processing

### Backend
- Python with Flask web framework
- SQLite database for data persistence
- Flask-Session for user session management
- Nginx RTMP module for stream handling

### Infrastructure
- Docker for containerization and deployment
- Docker Compose for multi-container orchestration
- Nginx for reverse proxy and RTMP streaming server

## Future Development

While our current focus is on the web platform, we've architected the system with potential mobile expansion in mind, particularly through React Native for Android development.

## Development

This project is actively maintained on GitHub with all team members contributing through version control. We follow collaborative development practices with regular code reviews and feature branches.


# Running the Current Implementation of the Project
The current implementation can be run, in development mode, using the following method:
1. With the Docker VSCode extension installed, right click within the editor with the `docker-compose.yaml` file active.
Select `Compose Up`
![image](https://github.com/user-attachments/assets/d68dd3b1-f3de-4780-b957-055cb536446b)
Now the backend is up and running on `http://127.0.0.1:8080`.
2. Next, having Node.js & Vite installed, `cd` into `web_server/frontend` and execute the command `npm run dev`. This should startup the frontend section of the application. However, this is only a temporary method as a Docker solution is in development for this frontend part of the project.
3. Navigate to the localhost link given in the terminal upon executing the last command (`http://localhost:5173/`).
