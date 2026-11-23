
# Partner-Finder

### Find Your Game. Find Your Team. Play Together.

Partner-Finder is a full-stack web application designed to connect people who share a passion for sports and fitness. It helps users discover compatible sports partners, teammates, and workout buddies based on their sporting interests, activities, skill levels, and preferences.

Whether someone is looking for a football teammate, a badminton partner, a cricket group, a gym buddy, or someone to train with, Partner-Finder makes finding the right sports companion easier.

**Live Website:** https://partner-finder-chi.vercel.app/

---

## Project Goal

The goal of Partner-Finder is to create a platform where individuals can easily find sports partners, teammates, and workout buddies who share similar sporting interests and fitness goals.

The platform aims to simplify the process of finding people to play, practice, train, and participate in sports activities together.

Partner-Finder brings sports enthusiasts together by providing user profiles, sports discovery, matching features, connections, and messaging functionality.

From finding someone for a casual game to building a regular sports team, the platform aims to make sports participation more accessible, interactive, and enjoyable.

### Our Vision

To build a connected sports community where everyone can find people to play, train, compete, and stay active with.

### Our Mission

- Help users discover sports partners with similar interests and skill levels.
- Make finding teammates and workout buddies easier.
- Encourage participation in sports, fitness, and physical activities.
- Connect individuals through shared sporting interests.
- Provide tools for profile creation, sports discovery, matching, and communication.
- Promote an active, healthy, and collaborative sporting community.

---

## Features

- **User Authentication:** Secure registration and login functionality.
- **Google Authentication:** Sign in using Google.
- **User Profiles:** Create and manage personal profiles.
- **Sports Preferences:** Showcase sporting interests and activities.
- **Discover People:** Explore profiles of other sports enthusiasts.
- **Partner Matching:** Discover potential sports partners based on shared interests and compatibility.
- **Connections:** Manage sports connections and matches.
- **Messaging:** Communicate with potential teammates and sports partners.
- **AI Chat Assistant:** Access an integrated chat assistant.
- **Responsive Design:** Enjoy a modern interface across different screen sizes.
- **Protected API Routes:** Secure backend access through authentication middleware.

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

Partner-Finder should now be running locally.

---

## Environment Variables

Never commit `.env` files or expose private credentials in your repository.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLIENT_URL` | Frontend application URL |
| `VITE_API_URL` | Backend API base URL used by the frontend |

---

## Deployment

Partner-Finder is deployed using the following services:

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

---

## Security

- Environment variables are used for sensitive configuration.
- Authentication uses JSON Web Tokens.
- Protected API routes use authentication middleware.
- Database credentials must never be committed to source control.
- Google authentication is configured through OAuth credentials.

---

## Future Improvements

- Advanced sports partner recommendations.
- Sports-based discovery filters.
- Skill-level-based partner matching.
- Location-based sports partner discovery.
- Team creation and group activities.
- Sports event and match scheduling.
- Improved real-time messaging.
- Enhanced mobile experience.
- Community features for sports enthusiasts.

---

## Author

**Atharva Anand**

GitHub: [@atharva31-alt](https://github.com/atharva31-alt)

---

## License

This project is currently available as a personal project. Add an open-source license if you intend to permit reuse, modification, or redistribution.

---

<p align="center">
  <strong>Partner-Finder</strong>
  <br>
  Find Your Game. Find Your Team. Play Together.
</p>

<p align="center">
  Built to bring sports enthusiasts together.
</p>
