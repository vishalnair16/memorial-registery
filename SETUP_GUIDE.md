# Setup Guide - Memorial Registry

## ✅ What's Already Done

Your Memorial Registry application has been fully implemented with:

- ✅ Next.js 14 App Router with TypeScript
- ✅ Tailwind CSS styling
- ✅ NextAuth.js v5 admin authentication
- ✅ GitHub API integration for data persistence
- ✅ QR code generation and download
- ✅ Admin dashboard and forms
- ✅ Public memorial pages
- ✅ Image upload and storage
- ✅ Production-ready build configuration

## 🚀 Next Steps - Local Testing

### 1. Create GitHub Personal Access Token

You need a GitHub Personal Access Token to test GitHub API operations locally:

1. Go to: https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Set name to: `memorial-registry-local`
4. **Repository access**: Select only `memorial-registery`
5. **Permissions**: Click "Repository permissions"
   - Find "Contents" → Select "Read and write"
6. Click "Generate token"
7. **Copy the token** (you won't see it again!)

### 2. Update .env.local

Edit `.env.local` in the project root:

```bash
# Replace: your_github_pat_here
GITHUB_PAT=ghp_your_actual_token_here
```

### 3. Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
```

### 4. Test the App

1. **Admin Panel**: Go to http://localhost:3000/admin
   - Login with: `admin` / `admin123`
   - Should redirect you to the dashboard

2. **Create a Tomb**:
   - Click "Create New Tomb" or go to `/admin/tombs/new`
   - Enter location: "Section A, Row 1"
   - Click "Create Tomb"
   - After creation, you should see a success message

3. **Add a Person**:
   - Go to `/admin/persons/new`
   - Fill in the form:
     - Name: Your choice
     - Birth/Death dates: 1950-01-15 and 2024-11-20
     - Description: A brief description
     - Photo: Optional (upload any image)
   - Click "Create Person"

4. **Download QR Code**:
   - Go to `/admin/tombs`
   - Click "Download QR Code (PNG)" button
   - A PNG file should download
   - Try scanning it with your phone!

5. **View Public Pages**:
   - Scan the QR code or manually navigate to `/tomb/T001`
   - You should see the person card
   - Click on the name to see the full memorial page

## 📦 Deployment to Vercel

When ready to deploy:

### Step 1: Push to GitHub

```bash
git add .
git commit -m "ready for vercel deployment"
git push origin main
```

### Step 2: Create GitHub Personal Access Token for Vercel

1. Go to: https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Name: `memorial-registry-vercel`
4. **Repository access**: Select only `memorial-registery`
5. **Permissions**: 
   - Contents → Read and write
6. Generate and copy the token

### Step 3: Import Project to Vercel

1. Go to: https://vercel.com
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Enter: `https://github.com/vishalnair16/memorial-registery`
5. Click "Import"
6. Framework should auto-detect as "Next.js"
7. Click "Deploy"

### Step 4: Add Environment Variables in Vercel

After deployment starts, go to Project Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` | Production, Preview, Dev |
| `NEXTAUTH_URL` | (Leave blank for now) | (skip for now) |
| `ADMIN_USERNAME` | Your username | All |
| `ADMIN_PASSWORD` | Your strong password | All |
| `GITHUB_PAT` | Your GitHub PAT from Step 2 | All |
| `GITHUB_OWNER` | `vishalnair16` | All |
| `GITHUB_REPO` | `memorial-registery` | All |
| `GITHUB_BRANCH` | `main` | All |
| `NEXT_PUBLIC_APP_URL` | (Will set after getting domain) | (skip for now) |

**Important**: After Vercel assigns your domain (e.g., `my-app-xyz.vercel.app`):

1. Go back to Settings → Environment Variables
2. For Production only, set:
   - `NEXTAUTH_URL=https://my-app-xyz.vercel.app`
   - `NEXT_PUBLIC_APP_URL=https://my-app-xyz.vercel.app`
3. Redeploy from the Deployments tab

### Step 5: Test Deployment

- Navigate to your Vercel domain
- Login with your credentials
- Try creating a tomb and person
- Download QR code and scan it
- Verify the public pages work

## 📋 Architecture Overview

### Public Routes (No Login Required)
- `/tomb/[tombId]` - Shows all persons in a tomb
- `/person/[personId]` - Full memorial page for a person
- `/` - Redirects to admin (you can customize this)

### Admin Routes (Login Required)
- `/admin/login` - Login page
- `/admin` - Dashboard
- `/admin/tombs` - List all tombs
- `/admin/tombs/new` - Create tomb
- `/admin/persons` - List all persons
- `/admin/persons/new` - Add person

### API Routes (All require admin auth except public pages)
- `POST /api/tombs` - Create tomb
- `GET /api/tombs` - List tombs
- `PUT /api/tombs/[id]` - Update tomb
- `POST /api/persons` - Create person
- `GET /api/persons` - List persons
- `PUT /api/persons/[id]` - Update person

### Data Structure
```
memorial-registery/
├── data/
│   ├── tombs/
│   │   └── T001.json, T002.json, ...
│   └── persons/
│       └── P001.json, P002.json, ...
├── public/
│   └── images/persons/
│       └── P001.jpg, P002.jpg, ...
└── src/
    └── (application code)
```

## 🎨 Customization Ideas

### Change Admin Credentials
Edit `.env.local` or Vercel environment variables:
```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-very-strong-password
```

### Customize Styling
Edit `src/app/globals.css` and component files for:
- Colors, fonts, spacing
- Dark mode
- Responsive layouts
- Custom branding

### Add More Fields
Modify `src/types/index.ts` to add new Person or Tomb fields, then:
1. Update database schema JSON
2. Update forms in `src/components/admin/`
3. Update display pages

### Custom Domain
On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` in environment variables

## ⚠️ Important Notes

### GitHub API Usage
- Free tier: 5,000 API calls/hour (plenty for normal use)
- Each save = ~3-5 API calls
- Rate limits reset hourly

### Deployment Lag
After saving data:
1. GitHub API commits file (~1 second)
2. GitHub triggers Vercel webhook (~5 seconds)
3. Vercel starts building (~30 seconds)
4. Build completes (~1-2 minutes)
5. New version is live

**Total**: ~2-3 minutes from save to production

### QR Code URLs
QR codes encode the full URL. Once printed, they're permanent!
- Test thoroughly before printing
- Set your custom domain before printing production QR codes
- Old QR codes will still work if you change domains (they redirect)

### Security
- Admin credentials stored in env variables (never committed)
- GitHub PAT is sensitive (regenerate if exposed)
- All data in your private repository
- HTTPS enforced on Vercel

## 📞 Troubleshooting

### "Unauthorized" Error When Saving
- Check `GITHUB_PAT` is valid
- Verify token hasn't expired
- Ensure token has "Contents read and write" permission
- Check token is scoped to `memorial-registery` repo

### Images Don't Upload
- Maximum file size: ~5MB compressed
- Client compresses images to < 3MB before upload
- Supported formats: JPEG, PNG, WebP
- Check browser console for upload errors

### QR Code Not Scanning
- Ensure `NEXT_PUBLIC_APP_URL` is correct
- Try different QR scanner apps
- Generate new QR codes if URL changes
- Check file downloaded correctly

### Vercel Build Fails
- Check all env variables are set
- Review build logs for errors
- Ensure `GITHUB_PAT` is valid
- Try redeploying from Vercel dashboard

## 🎯 Next Milestones

- [ ] Test locally with sample data
- [ ] Set up GitHub PAT for Vercel
- [ ] Deploy to Vercel
- [ ] Configure custom domain (optional)
- [ ] Create first tomb record
- [ ] Print and test QR codes
- [ ] Customize styling to match your brand

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)

---

**Questions or issues?** Review the README.md and this guide's troubleshooting section, or check the application code in `src/`.
