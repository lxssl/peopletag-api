# Setting Up peopletag-api Repository

## Step-by-Step Guide

### 1. Initialize Git Repository (if not already done)

```bash
git init
```

### 2. Add Remote Repository

```bash
# Replace with your actual repository URL
git remote add origin https://github.com/lxssl/peopletag-api.git

# Or if using SSH
git remote add origin git@github.com:lxssl/peopletag-api.git
```

### 3. Verify Remote

```bash
git remote -v
```

### 4. Stage All Files

```bash
# Add all files
git add .

# Or add specific directories
git add server/
git add functions/
git add README.md
git add LICENSE
git add .gitignore
git add package.json
git add firebase.json
```

### 5. Create Initial Commit

```bash
git commit -m "Initial commit: PeopleTag API server

- Add Express API server with profile search and retrieval
- Add Firebase Cloud Functions version
- Add authentication middleware with wallet signature verification
- Add rate limiting and error handling
- Add comprehensive documentation
- Add SDK examples"
```

### 6. Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Repository Structure

Your repository should have:

```
peopletag-api/
├── .gitignore
├── LICENSE
├── README.md
├── SETUP_REPO.md
├── FIREBASE_DEPLOYMENT.md
├── OPEN_SOURCE_GUIDE.md
├── API_SUMMARY.md
├── package.json
├── firebase.json
├── server/
│   ├── index.js
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── examples/
└── functions/
    ├── index.js
    ├── package.json
    ├── routes/
    ├── controllers/
    ├── services/
    ├── middleware/
    └── utils/
```

## Next Steps After Pushing

### 1. Add Repository Description

On GitHub, add a description:
```
RESTful API server for the PeopleTag protocol - enabling dApps to interact with encrypted interest graphs
```

### 2. Add Topics/Tags

Add relevant topics:
- `api`
- `rest-api`
- `firebase-functions`
- `ethereum`
- `ipfs`
- `web3`
- `peopletag`

### 3. Create GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

### 4. Add Badges to README

Update README.md with badges:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/lxssl/peopletag-api.svg)](https://github.com/lxssl/peopletag-api/stargazers)
```

### 5. Create Release

After initial push, create a v1.0.0 release:

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

## Verification Checklist

Before pushing, verify:

- [ ] All sensitive data removed (API keys, secrets)
- [ ] `.env` files in `.gitignore`
- [ ] `LICENSE` file added
- [ ] `README.md` is comprehensive
- [ ] All code is properly commented
- [ ] No hardcoded credentials
- [ ] Documentation is complete

## Troubleshooting

### If you get "repository not found"

```bash
# Check remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/lxssl/peopletag-api.git
```

### If you need to remove files from git

```bash
# Remove file from git but keep locally
git rm --cached filename

# Remove directory
git rm -r --cached directory/
```

### If you need to update .gitignore

```bash
# Remove cached files
git rm -r --cached .
git add .
git commit -m "Update .gitignore"
```

## Quick Commands Reference

```bash
# Check status
git status

# See what will be committed
git diff --cached

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Push with tags
git push --tags
```

