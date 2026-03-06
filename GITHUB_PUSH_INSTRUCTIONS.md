# How to Push Your Project to GitHub

## Steps to Push EYOB Project to GitHub

### Step 1: Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 2: Initialize Git Repository
```bash
cd c:/Users/user/Downloads/EYOB
git init
```

### Step 3: Add Remote Repository
```bash
git remote add origin https://github.com/coder4-c/Kazify.git
```

### Step 4: Create .gitignore File
Create a `.gitignore` file in the project root:
```
# Dependencies
node_modules/
Backend/node_modules/
Frontend/node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Cache
.cache/
```

### Step 5: Stage All Files
```bash
git add .
```

### Step 6: Create Initial Commit
```bash
git commit -m "Initial commit: Kazify - MERN Stack Application"
```

### Step 7: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

### Step 8: Verify
- Go to https://github.com/coder4-c/Kazify
- You should see your project files there

---

## Important Notes:

1. **Repository already exists:** The URL you provided (Kazify) seems to be an existing repository. Make sure you have push access.

2. **If you get authentication error:**
   - Use GitHub Personal Access Token as password
   - Or set up SSH keys

3. **To update later:**
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Project Structure Being Pushed:
```
EYOB/
├── Backend/
│   ├── server.js          # Express server with MongoDB
│   ├── package.json
│   └── node_modules/      # (ignored)
├── Frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── data/         # Opportunities data
│   │   └── services/     # API services
│   ├── package.json
│   └── node_modules/     # (ignored)
├── Kenya_Youth_Opportunity_Hub_Business_Plan.md
├── RUNNING_INSTRUCTIONS.md
├── GITHUB_PUSH_INSTRUCTIONS.md
├── package.json
└── .gitignore
```
