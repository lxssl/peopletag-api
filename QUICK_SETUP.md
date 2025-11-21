# Quick Setup Guide for peopletag-api Repository

## 🚀 Quick Start (5 minutes)

### Step 1: Copy API Files to New Repository

If you're setting up a fresh repository, copy these directories and files:

**Required Files:**
```
✅ server/              (entire directory)
✅ functions/           (entire directory)
✅ README.md
✅ LICENSE
✅ .gitignore
✅ firebase.json
✅ package-api.json     (rename to package.json)
```

### Step 2: Initialize Git Repository

```bash
# Navigate to your new repository directory
cd peopletag-api

# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/lxssl/peopletag-api.git
```

### Step 3: Install Dependencies

```bash
# Install root dependencies (for standalone server)
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### Step 4: Configure Environment

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
FIREBASE_PROJECT_ID=peopletag-demo-1
```

### Step 5: Commit and Push

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit: PeopleTag API server"

# Push to GitHub
git branch -M main
git push -u origin main
```

## 📋 What to Copy from Current Repository

If you're copying from the current `peopletag` repository:

### Copy These Directories:
```bash
# From peopletag/ to peopletag-api/
cp -r server/ peopletag-api/
cp -r functions/ peopletag-api/
```

### Copy These Files:
```bash
cp README.md peopletag-api/
cp LICENSE peopletag-api/
cp .gitignore peopletag-api/
cp firebase.json peopletag-api/
cp package-api.json peopletag-api/package.json
cp FIREBASE_DEPLOYMENT.md peopletag-api/
cp OPEN_SOURCE_GUIDE.md peopletag-api/
cp API_SUMMARY.md peopletag-api/
cp SETUP_REPO.md peopletag-api/
```

### Don't Copy:
```
❌ src/              (React frontend - not needed)
❌ public/           (React public files - not needed)
❌ build/            (Build output - not needed)
❌ node_modules/     (Will be reinstalled)
❌ .env              (Contains secrets - create new one)
```

## 🔧 After Setup

### Test the API Locally

```bash
# Start standalone server
npm run server

# Or start Firebase emulator
npm run functions:serve
```

### Verify Everything Works

```bash
# Health check
curl http://localhost:3001/health

# Search profiles
curl "http://localhost:3001/api/v1/profiles/search?tags=DeFi&limit=5"
```

## 📝 Next Steps

1. ✅ Push code to GitHub
2. ✅ Add repository description on GitHub
3. ✅ Add topics/tags (api, rest-api, firebase-functions, etc.)
4. ✅ Create first release (v1.0.0)
5. ✅ Update README with badges
6. ✅ Set up GitHub Actions (optional)

## 🆘 Troubleshooting

### "Cannot find module" errors

```bash
# Make sure dependencies are installed
npm install
cd functions && npm install && cd ..
```

### Firebase Functions not working

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if needed)
firebase init functions
```

### Git remote issues

```bash
# Check remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/lxssl/peopletag-api.git
```

## ✅ Checklist

Before pushing to GitHub:

- [ ] All API code copied to new repo
- [ ] `.gitignore` includes `.env` and `node_modules/`
- [ ] No secrets in code (check for API keys)
- [ ] `LICENSE` file added
- [ ] `README.md` is complete
- [ ] Dependencies installed
- [ ] Tested locally
- [ ] Git initialized
- [ ] Remote added

## 🎉 You're Ready!

Once you've completed these steps, your repository is ready to be open-sourced!

