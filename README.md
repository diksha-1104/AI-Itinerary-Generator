# ✈️ AI Itinerary Generator

An AI-powered travel planning web application that creates personalized travel itineraries based on your destination, travel dates, budget, travel type, and interests.

The application uses **React.js** for the frontend, **Node.js + Express.js** for the backend, **MongoDB** for data persistence, and the **Groq API** to generate intelligent travel recommendations.

---

## 🌍 Overview

Planning a trip can be time-consuming because travelers need to research destinations, activities, restaurants, transportation, accommodation, and costs.

**AI Itinerary Generator** simplifies this process by allowing users to enter their travel preferences and automatically generating a structured day-by-day itinerary.

Users can:

* Create an account and securely log in
* Enter their destination and travel dates
* Set a travel budget
* Select their travel type
* Choose their interests
* Generate an AI-powered itinerary
* View detailed daily travel plans
* Save generated itineraries
* Search and filter saved trips
* Regenerate an existing itinerary
* Copy an itinerary to the clipboard
* Print an itinerary
* View personal travel statistics

---

## ✨ Features

### 🔐 User Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Persistent login using local storage
* Password validation
* Logout functionality

### 🤖 AI-Powered Itinerary Generation

Users can provide:

* Destination
* Start date
* End date
* Number of days
* Budget
* Budget category
* Travel type
* Interests

The application sends these preferences to the backend, which uses the **Groq API** to generate a personalized itinerary.

### 🗓️ Detailed Daily Itinerary

Each generated itinerary can include:

* Morning activities
* Afternoon activities
* Evening activities
* Places to visit
* Food recommendations
* Daily estimated expenses
* General travel tips

### 💰 Budget Planning

The generated itinerary includes an estimated budget breakdown for:

* Accommodation
* Food
* Transportation
* Activities
* Total estimated trip cost

The application also indicates whether the estimated trip cost exceeds the user's selected budget.

### 💾 Saved Trips

Users can save and manage their generated itineraries.

Saved trips can be:

* Viewed
* Searched by destination
* Filtered by budget category
* Deleted
* Regenerated

### 📊 Travel Analytics

The profile page provides travel statistics such as:

* Total trips created
* Average trip length
* Low-budget trips
* Medium-budget trips
* Luxury trips
* Total planned budget

### 📋 Copy & Print

Users can:

* Copy the complete itinerary to their clipboard
* Print their itinerary for offline use

### 📱 Responsive Interface

The frontend is designed to provide a clean travel-planning experience across different screen sizes.

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **React Router**
* **Axios**
* **Context API**
* **CSS3**
* JavaScript

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **Axios**
* **Groq API**

### AI

* **Groq API**
* Large Language Model-based itinerary generation

### Development Tools

* npm
* Nodemon
* Git / GitHub

---

## 🏗️ Project Architecture

```text
AI Itinerary Generator/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── tripController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Trip.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── tripRoutes.js
│   │
│   ├── utils/
│   │   └── aiService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── planmytrip-favicon.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Spinner.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── css/
│   │   │   └── styles.css
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── GenerateItinerary.js
│   │   │   ├── SavedTrips.js
│   │   │   ├── ViewItinerary.js
│   │   │   └── Profile.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

## 🔄 How It Works

```text
                 ┌───────────────────┐
                 │      User         │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   React Frontend  │
                 │     (React.js)    │
                 └─────────┬─────────┘
                           │
                     HTTP / REST API
                           │
                           ▼
                 ┌───────────────────┐
                 │   Express Server  │
                 │     (Node.js)     │
                 └──────┬─────┬──────┘
                        │     │
             ┌──────────┘     └───────────┐
             ▼                            ▼
     ┌───────────────┐            ┌───────────────┐
     │    MongoDB    │            │    Groq API   │
     │  User/Trip DB │            │ AI Generation │
     └───────────────┘            └───────┬───────┘
                                          │
                                          ▼
                                  AI Generated
                                   Itinerary
                                          │
                                          ▼
                                  MongoDB Storage
                                          │
                                          ▼
                                  React Frontend
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd "AI Itinerary Generator"
```

---

## ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder values with your actual credentials.

### Start the Backend

For development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will normally run on:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `PORT`         | Port used by the Express server               |
| `MONGODB_URI`  | MongoDB database connection string            |
| `JWT_SECRET`   | Secret used to sign JWT authentication tokens |
| `GROQ_API_KEY` | API key used for AI itinerary generation      |

### Frontend

The API service supports:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If `REACT_APP_API_URL` is not provided, the application automatically uses:

```text
http://localhost:5000/api
```

---

## 🔐 Authentication Flow

1. User registers an account.
2. Backend validates the registration information.
3. Password is securely hashed.
4. User logs in with their credentials.
5. Backend generates a JWT token.
6. Token is stored on the client.
7. Axios automatically attaches the token to authenticated requests.
8. Protected backend routes verify the token before allowing access.

---

## 🤖 AI Itinerary Flow

When a user generates an itinerary:

```text
User Preferences
      │
      ▼
React Generate Itinerary Page
      │
      ▼
POST /api/trips/generate
      │
      ▼
Express Trip Controller
      │
      ▼
AI Service
      │
      ▼
Groq API
      │
      ▼
Generated Travel Plan
      │
      ▼
MongoDB
      │
      ▼
Itinerary Displayed to User
```

---

## 📡 API Overview

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login`    | Login user          |

### Trips

| Method   | Endpoint              | Description                 |
| -------- | --------------------- | --------------------------- |
| `POST`   | `/api/trips/generate` | Generate a new AI itinerary |
| `GET`    | `/api/trips`          | Get user's saved trips      |
| `GET`    | `/api/trips/:id`      | Get a specific itinerary    |
| `DELETE` | `/api/trips/:id`      | Delete a saved itinerary    |

> All trip endpoints require authentication.

---

## 🗃️ Database Models

### User

The `User` model stores user account information such as:

* Name
* Email
* Password

### Trip

The `Trip` model stores information including:

* User ID
* Destination
* Start date
* End date
* Number of days
* Budget
* Budget category
* Travel type
* Interests
* Generated itinerary
* AI-generated budget estimates

---

## 📂 Main Frontend Pages

### Home

Landing page introducing the application and its travel-planning functionality.

### Register

Allows new users to create an account.

### Login

Allows existing users to authenticate.

### Dashboard

Provides access to the main travel-planning features.

### Generate Itinerary

Collects travel preferences and sends them to the backend for AI generation.

### Saved Trips

Displays previously generated itineraries with:

* Destination search
* Budget filters
* Delete functionality
* View functionality

### View Itinerary

Displays the complete AI-generated travel plan.

Users can:

* Expand/collapse itinerary days
* Copy the itinerary
* Print the itinerary
* Regenerate the itinerary

### Profile

Displays account information and travel-planning statistics.

---

## 🔒 Security Considerations

The application uses several security mechanisms:

* JWT-based authentication
* Protected API routes
* Password hashing
* Environment variables for secrets
* Authorization middleware
* User-specific trip access

### Important

Never commit your `.env` file or API keys to GitHub.

Make sure `.env` is included in `.gitignore`.

---

## 🧪 Running the Project Locally

You need **two terminals**.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 🖥️ Application Flow

```text
Landing Page
     │
     ├── Register
     │      │
     │      ▼
     │    Dashboard
     │
     └── Login
            │
            ▼
        Dashboard
            │
     ┌──────┼─────────┐
     ▼      ▼         ▼
 Generate  Saved     Profile
 Itinerary Trips
     │
     ▼
 AI Generated
 Itinerary
     │
     ├── View
     ├── Copy
     ├── Print
     └── Regenerate
```

---

## 🌟 Future Improvements

Potential enhancements include:

* 🌤️ Real-time weather information
* 🗺️ Interactive maps
* 📍 Google Maps integration
* ✈️ Flight search integration
* 🏨 Hotel recommendations
* 🍽️ Restaurant recommendations
* 💱 Multi-currency support
* 📱 Progressive Web App support
* 🔔 Travel reminders
* 📧 Email itinerary sharing
* 📄 PDF itinerary export
* 🌐 Multi-language support
* 🤝 Collaborative trip planning
* 📊 More advanced travel analytics

---

## 🐛 Troubleshooting

### MongoDB connection error

Check that:

* Your MongoDB URI is correct.
* Your MongoDB cluster is running.
* Your IP address is allowed in MongoDB Atlas.
* Your database credentials are correct.

### AI generation error

Check that:

* `GROQ_API_KEY` is correctly configured.
* The selected Groq model is currently available.
* Your API account has access to the model.
* The backend is receiving the request correctly.

### Frontend cannot connect to backend

Check:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Also make sure the backend is running before making API requests.

---

## 👩‍💻 Author

**Diksha Kumari**

AI Itinerary Generator — Full-Stack AI Travel Planning Application

---

## 📄 License

This project is developed for educational and project purposes.

You may modify and extend the project according to your requirements.
