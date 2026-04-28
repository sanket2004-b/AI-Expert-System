# 🧠 AI Based Help Desk Management Expert System
### SPPU Third Year Engineering — Artificial Intelligence Project

---

## 📋 Project Overview

This is a complete **Rule-Based Expert System** built as a full-stack web application.
It simulates an intelligent help desk that diagnoses technical problems using:

- **Knowledge Base** — Stored IF-THEN rules for all issue categories
- **Inference Engine** — JavaScript backend logic that applies rules to user answers
- **Forward Chaining** — Rules fired sequentially based on user inputs
- **Ticket Generation** — MongoDB-stored support tickets when issues remain unresolved

---

## 🗂️ Complete Folder Structure

```
helpdesk-expert-system/
├── server.js                  ← Main Express server entry point
├── package.json               ← Project dependencies
├── .env                       ← Environment variables (create from .env.example)
├── .env.example               ← Example env file
│
├── models/
│   └── Ticket.js              ← Mongoose schema for MongoDB tickets
│
├── routes/
│   ├── index.js               ← User routes + Inference Engine logic
│   └── admin.js               ← Admin dashboard routes
│
├── views/
│   ├── home.ejs               ← Home/landing page
│   ├── query.ejs              ← Issue category selection page
│   ├── diagnose.ejs           ← Step-by-step diagnostic questions
│   ├── result.ejs             ← Expert recommendations output
│   ├── ticket-confirm.ejs     ← Ticket generated confirmation
│   ├── admin.ejs              ← Admin dashboard
│   ├── about.ejs              ← About expert system page
│   ├── 404.ejs                ← Error page
│   └── partials/
│       ├── header.ejs         ← Navbar + flash messages
│       └── footer.ejs         ← Footer + script tags
│
└── public/
    ├── css/
    │   └── style.css          ← Complete responsive stylesheet
    └── js/
        └── script.js          ← Frontend JavaScript
```

---

## ⚙️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime for backend |
| Express.js | Web framework, routing, middleware |
| MongoDB Atlas | Cloud NoSQL database for tickets |
| Mongoose | MongoDB ODM for schema validation |
| EJS | Server-side HTML templating |
| CSS3 | Custom responsive dark-theme styling |
| JavaScript | Inference Engine logic (IF-THEN rules) |
| connect-flash | Flash success/error messages |
| express-session | Session management |
| method-override | DELETE/PUT from HTML forms |

---

## 🚀 Installation & Setup Guide

### Step 1: Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas) (free tier works)
- [Git](https://git-scm.com/) (optional)

### Step 2: Create Project Folder

```bash
# Create and navigate to project folder
mkdir helpdesk-expert-system
cd helpdesk-expert-system
```

### Step 3: Copy All Project Files

Copy all files from this project maintaining the folder structure shown above.

### Step 4: Install Dependencies

```bash
npm install
```

This installs: express, mongoose, ejs, connect-flash, express-session, method-override, dotenv, nodemon

### Step 5: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a new **Cluster** (free M0 tier)
3. Click **Connect** → **Connect your application**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with your actual password

**OR use Local MongoDB:**
```
mongodb://localhost:27017/helpdeskDB
```

### Step 6: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/helpdeskDB
SESSION_SECRET=anyRandomLongStringHere123
PORT=3000
```

### Step 7: Run the Project

```bash
# For development (auto-restart on changes)
npm run dev

# For production
npm start
```

### Step 8: Open in Browser

```
http://localhost:3000          ← Home Page
http://localhost:3000/query    ← Ask a Query
http://localhost:3000/admin    ← Admin Dashboard
http://localhost:3000/about    ← About Expert System
```

---

## 🧠 How the Expert System Works

### AI Core: Inference Engine (routes/index.js)

```javascript
// Rule Set Example: Internet Problem
if (category === 'internet') {
  if (answers.wifi === 'no') {
    solutions.push('Connect to WiFi...');
    resolved = true;
  }
  if (answers.router === 'no') {
    solutions.push('Power on your router...');
    resolved = true;
  }
}
// IF unresolved → generate support ticket
```

### Flow Diagram

```
User → Select Category → Answer Questions
              ↓
       Inference Engine
       (IF-THEN Rules)
              ↓
    ┌─────────────────┐
    │   Resolved?     │
    └────┬────────────┘
         │ YES → Show Solutions
         │ NO  → Generate Ticket → Save to MongoDB
```

### Issue Categories & Rules

| Category | Questions Asked | Rules Applied |
|----------|----------------|---------------|
| Internet Problem | WiFi status, Router power, Cable, Browser-only | 4 IF-THEN rules |
| Password Reset | Forgotten, Locked, Email access | 3 IF-THEN rules |
| Printer Issue | Power, Cable, Paper jam, Driver | 4 IF-THEN rules |
| Slow Computer | Startup, Storage, RAM, Virus | 4 IF-THEN rules |
| Software Install | Admin rights, Space, Compatibility, Antivirus | 4 IF-THEN rules |
| Email Not Working | Login, Sending, Storage, Config | 4 IF-THEN rules |

---

## 📊 Admin Dashboard Features

- **View all tickets** sorted by newest first
- **Search tickets** by name, email, ticket ID, or category
- **Update status** (Open → In Progress → Resolved)
- **Delete tickets** with confirmation dialog
- **Statistics cards** showing total/open/resolved counts

---

## 🎓 SPPU AI Concepts Demonstrated

| AI Concept | Implementation |
|------------|---------------|
| Knowledge Base | IF-THEN rule sets in `inferenceEngine()` function |
| Inference Engine | `inferenceEngine(category, answers)` in routes/index.js |
| Forward Chaining | Rules evaluated top-to-bottom based on given facts |
| Fact Base | User answers become "facts" fed into the engine |
| Expert Recommendation | Solutions array returned by inference engine |
| Working Memory | `answers` object holds current session facts |
| Conflict Resolution | First matching rule wins; multiple rules can fire |

---

## 🔑 Key Files Reference

| File | Description |
|------|-------------|
| `server.js` | App entry, middleware, DB connection |
| `routes/index.js` | All user routes + **Inference Engine AI logic** |
| `routes/admin.js` | Admin CRUD operations |
| `models/Ticket.js` | MongoDB ticket schema with auto-ID |
| `views/diagnose.ejs` | Dynamic question form with progress bar |
| `views/result.ejs` | Solution display + ticket form |
| `views/admin.ejs` | Full admin dashboard with search/delete |
| `public/css/style.css` | Complete dark-theme UI |

---

## ✅ Troubleshooting

**MongoDB Connection Error:**
- Check your `.env` file has the correct MONGO_URI
- Whitelist your IP in MongoDB Atlas (Network Access → Add IP)
- Try `0.0.0.0/0` to allow all IPs during development

**Port Already in Use:**
- Change PORT in `.env` to 3001 or 4000

**Module Not Found:**
- Run `npm install` again in the project folder

---

## 📝 License

SPPU TE Artificial Intelligence Project — Educational Use Only

---

*Built with ❤️ for SPPU Third Year Engineering AI Examination*
