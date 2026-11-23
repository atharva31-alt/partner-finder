
# Partner-Finder

### Find your perfect partner. Build meaningful connections.

Partner-Finder is a full-stack web application designed to help individuals discover compatible partners, connect with like-minded people, and build meaningful relationships through a modern and intuitive digital platform.

**Live Website:** https://partner-finder-chi.vercel.app/

---

## Project Goal

The goal of Partner-Finder is to create a platform where individuals can discover like-minded and compatible people, connect with potential partners, and build meaningful relationships.

The website aims to simplify the process of finding the right partner by providing personalized user profiles, profile discovery, matching features, connections, and messaging functionality.

Partner-Finder focuses on making online partner discovery more accessible, interactive, and convenient while providing a secure environment where users can express themselves, explore potential connections, and communicate with others.

### Our Vision

To make finding meaningful connections easier by bringing people together through technology, compatibility, and genuine interaction.

### Our Mission

- Help users discover people with shared interests and preferences.
- Make partner discovery simple and accessible.
- Encourage meaningful connections rather than random interactions.
- Provide tools for profile creation, matching, and communication.
- Create a secure and user-friendly platform for building relationships.

---

## Features

- User registration and login.
- Google authentication.
- User profile creation and management.
- Discover and explore other user profiles.
- Matching system.
- Connections and matches management.
- Messaging functionality.
- Integrated AI chat assistant.
- Responsive user interface.
- Secure authentication and protected API routes.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | Database object modeling |
| JWT | Authentication |
| Google OAuth | Google sign-in |
| CSS | Styling and responsive design |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## Project Structure

```text
partner-finder/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Discover.jsx
│   │   ├── Messages.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── MatchesHub.jsx
│   │   ├── api.js
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── README.md
```

## Getting Started

Follow these instructions to run Partner-Finder locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Google OAuth credentials (if using Google authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/atharva31-alt/partner-finder.git
cd partner-finder
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
```

Replace the placeholder values with your actual credentials.

### 4. Start the Backend

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the Frontend

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Environment Variables

Never commit `.env` files or expose private credentials in your repository.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLIENT_URL` | Frontend application URL |
| `VITE_API_URL` | Backend API base URL used by the frontend |

## Deployment

Partner-Finder uses the following deployment services:

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://partner-finder-chi.vercel.app/ |
| Backend | Render | https://partner-finder-api.onrender.com |
| Database | MongoDB Atlas | Cloud-hosted |

### Frontend Deployment

**Platform:** Vercel

Configuration:

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL`

### Backend Deployment

**Platform:** Render

Configuration:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Configure the backend environment variables in the Render dashboard.

## Security

- Environment variables are used for sensitive configuration.
- Authentication uses JSON Web Tokens.
- Protected API routes use authentication middleware.
- Database credentials must never be committed to source control.

## Future Improvements

- Enhanced compatibility recommendations.
- Advanced profile discovery filters.
- Improved real-time messaging.
- Additional profile customization.
- Better matching recommendations.
- Enhanced mobile experience.

## Author

**Atharva Anand**

GitHub: [@atharva31-alt](https://github.com/atharva31-alt)

## License

This project is currently available as a personal project. Add an open-source license if you intend to permit reuse, modification, or redistribution.

---

<p align="center">
  Partner-Finder — Discover. Connect. Match.
</p>

<p align="center">
  Made with passion.
</p>
