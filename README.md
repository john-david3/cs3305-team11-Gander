# **Team 11 - Gander - Live Streaming Platform**

## Overview and Purpose

For our project, we are creating a live streaming platform called Gander. The purpose of this project is to provide a source of entertainment to users and create a community for those with similar interests. In it, users will be able to watch live streams from other users, either gaming or in real life. Alternatively, users can stream themselves on the platform. If a user wants to go live, they can click the “Go Live” button when they are logged in. They will then be presented with a dashboard, so that they can choose their stream's title, category and thumbnail (if they wish to, otherwise a default thumbnail will be chosen). Users who are watching a live stream can interact with other viewers and the streamer through a chat feature. If a user likes a streamer enough, they can subscribe to them using the Stripe API on a monthly basis, for as many months as they wish.
![Screenshot 2025-03-03 123446](https://github.com/user-attachments/assets/a23c2974-9500-492d-be07-91161606e805)

![Screenshot 2025-03-03 125748](https://github.com/user-attachments/assets/ab2092a3-c599-4a90-a616-f08faa4c76ba)

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

![Screenshot 2025-03-03 122943](https://github.com/user-attachments/assets/26b82756-3e39-41d3-8d30-b3a6cbda21a0)

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
- Uses a microservices architecture

## Future Development

While our current focus is on the web platform, we've architected the system with potential mobile expansion in mind, particularly through React Native for Android development.

## Development

This project is actively maintained on GitHub with all team members contributing through version control. We follow collaborative development practices with regular code reviews and feature branches.

## Running the Current Implementation of the Project

The current implementation can be run, in development mode, using the following method:

- Pre-requisites:
  - Docker
  - Docker Compose
  - Node.js & npm

1. Replace `.env.example` files with `.env` and fill in the required environment variables
2. Launch Docker containers using either:
   - `docker-compose up --build` in terminal
   - Right click within the editor within `docker-compose.yml` and select `Compose Up`
   This will start the frontend, backend, and database services
3. Access the frontend at `localhost:8080` in your browser
