# GamePartner - Peer-to-Peer Sports Matchmaking Platform

GamePartner is a full-stack web application built using the MERN architecture. It is designed to help users find local sports partners nearby for casual games like Chess, Badminton, Cricket, and Football.

## Core Features
- **Secure Authentication:** Custom User signup and login protected by JWT tokens.
- **Dynamic Proximity Feed:** View open playing invites hosted by other local users while excluding your own entries.
- **Dynamic Matching Engine:** Instantly accept open invites to transition match states to 'Matched'.
- **Personal Match Ledger:** Side-by-side dashboard tracking games you are currently hosting vs. games you have joined.
- **Cancellation Control:** Full secure deletion permissions allowing hosts to cancel their open invites.
- **Interactive Time-Picker:** HTML5 visual calendar picker for choosing precise game timings.
- **Sport Filtering:** Quick-pill selection tabs across the top to sort the open match grid instantly by sport category.

---

## Technology Stack
- **Frontend:** React.js, Axios, HTML5 Native Elements
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT)
- **Database:** MongoDB, Mongoose Object Modeling

---

## Local Deployment Setup

Follow these exact steps to run the complete environment locally on your machine.

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB Server** (with MongoDB Compass) installed on your machine.

### 2. Backend Installation & Configurations
Navigate to the backend directory, install dependencies, and configure environment states:
```bash
cd backend
npm install