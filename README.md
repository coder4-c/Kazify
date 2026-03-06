# Kenya Youth Opportunity Hub (KYOH)

A MERN stack web application connecting Kenyan youth with employment, training, and entrepreneurship opportunities.

## Features

- Job listings from top employers (Google, Microsoft, Safaricom, etc.)
- Internship opportunities
- Scholarships and grants
- Training programs
- Youth business marketplace
- User authentication with JWT
- Admin verification for marketplace submissions

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/coder4-c/Kazify.git
cd Kazify
```

2. Install Backend dependencies:
```bash
cd Backend
npm install
```

3. Install Frontend dependencies:
```bash
cd ../Frontend
npm install
```

### Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start Backend (Terminal 1):
```bash
cd Backend
npm start
```

3. Start Frontend (Terminal 2):
```bash
cd Frontend
npm run dev
```

4. Open http://localhost:5176 in your browser

## Project Structure

```
KYOH/
├── Backend/
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── data/
│   │   └── services/
│   └── package.json
└── README.md
```

## License

MIT
