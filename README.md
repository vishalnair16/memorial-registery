# Memorial Registry

A digital memorial registry web application built with Next.js for recording and sharing memories of loved ones. Includes QR code generation for physical tomb locations that link to digital memorial pages.

## Features

- **Admin Dashboard**: Manage tombs and person records with an intuitive interface
- **QR Code Generation**: Generate and download QR codes for each tomb location
- **Memorial Pages**: Beautiful, sharable memorial pages with photos, biographies, and family information
- **GitHub-based Storage**: All data stored as JSON files in the repository (no external database needed)
- **Secure Admin Access**: NextAuth.js credentials-based authentication
- **Image Management**: Store and serve memorial photos from the repository
- **ISR (Incremental Static Regeneration)**: Fast, fresh content updates

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js v5
- **GitHub API**: Octokit REST
- **QR Codes**: react-qr-code
- **Forms**: react-hook-form + Zod
- **Hosting**: Vercel (free tier compatible)

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub Personal Access Token (for local development with GitHub API)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/vishalnair16/memorial-registery.git
cd memorial-registery

# Install dependencies
npm install
```

### Step 2: Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

NEXTAUTH_URL=http://localhost:3000

# Choose your own admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# GitHub Personal Access Token Setup:
# 1. Go to https://github.com/settings/tokens?type=beta
# 2. Click "Generate new token"
# 3. Name: "memorial-registry"
# 4. Select only this repository: memorial-registery
# 5. Permissions: Repository → Contents → Read and write
# 6. Generate and copy the token
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=vishalnair16
GITHUB_REPO=memorial-registery
GITHUB_BRANCH=main

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 4: Access Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Login with your credentials from `.env.local`
3. Create your first tomb
4. Add persons to the tomb
5. Download QR codes

## How It Works

### Data Architecture

- **Tombs**: Stored in `data/tombs/T001.json`, `T002.json`, etc.
- **Persons**: Stored in `data/persons/P001.json`, `P002.json`, etc.
- **Images**: Stored in `public/images/persons/P001.jpg`, `P002.jpg`, etc.

All files are committed to the GitHub repository. When you save data via the admin panel:

1. API route receives the form submission
2. Files are committed to GitHub via the GitHub REST API
3. GitHub triggers a Vercel deployment
4. Vercel rebuilds and deploys the latest code + data (~1-2 minutes)

### QR Code Flow

1. Admin creates a tomb and generates QR code
2. QR code encodes URL: `https://site.vercel.app/tomb/T001`
3. QR code is printed and attached to the physical tomb
4. Visitor scans QR → lands on public `/tomb/T001` page
5. Page shows all persons buried in that tomb
6. Visitor clicks a name → sees full memorial page at `/person/P001`

## Admin Pages

- `/admin/login` - Login page
- `/admin` - Dashboard with statistics
- `/admin/tombs` - List all tombs with QR code downloads
- `/admin/tombs/new` - Create a new tomb
- `/admin/persons` - List all persons with preview cards
- `/admin/persons/new` - Add a new person with photo upload

## Public Pages

- `/tomb/[tombId]` - QR code landing page showing all persons in a tomb
- `/person/[personId]` - Full memorial page with photo, biography, family info

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Choose `vishalnair16/memorial-registery`
5. Framework: Next.js (auto-detected)
6. Click "Deploy"

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Production, Preview, Dev |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production only |
| `ADMIN_USERNAME` | Your admin username | All |
| `ADMIN_PASSWORD` | Your strong password | All |
| `GITHUB_PAT` | Your GitHub PAT | All |
| `GITHUB_OWNER` | `vishalnair16` | All |
| `GITHUB_REPO` | `memorial-registery` | All |
| `GITHUB_BRANCH` | `main` | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Production only |

### Step 4: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens?type=beta)
2. Click "Generate new token"
3. Name: `memorial-registry-vercel`
4. Repository access: Select only `memorial-registery`
5. Permissions: **Contents** → Read and write
6. Generate token and copy
7. Paste as `GITHUB_PAT` in Vercel settings

### Step 5: Verify Deployment

- Vercel will auto-deploy immediately
- Every admin save will trigger a new GitHub commit → Vercel auto-deploys
- Check Vercel Deployments tab to monitor build status

## Development Notes

### Adding Data Locally

You can manually create JSON files in `data/` to test:

`data/tombs/T001.json`:
```json
{
  "id": "T001",
  "location": "Section A, Row 3",
  "personIds": ["P001"],
  "createdAt": "2026-05-28T00:00:00Z"
}
```

`data/persons/P001.json`:
```json
{
  "id": "P001",
  "name": "John Doe",
  "dateOfBirth": "1950-01-15",
  "dateOfDeath": "2024-11-20",
  "tombId": "T001",
  "description": "A loving father and friend.",
  "imagePath": "/images/persons/P001.jpg",
  "familyMembers": [{"relation": "Son", "name": "Jane Doe"}],
  "history": "John lived a full life...",
  "createdAt": "2026-05-28T00:00:00Z"
}
```

Then refresh the page to see the changes (ISR revalidates every 60 seconds).

### Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### GitHub API Errors

**Error**: "Unauthorized" when saving data
- Check `GITHUB_PAT` is correct and not expired
- Verify the PAT has "Contents read and write" permission
- Ensure the PAT is scoped to the correct repository

### QR Code Not Scannable

- Ensure `NEXT_PUBLIC_APP_URL` matches your actual deployment URL
- Try scanning with multiple phones/QR readers
- QR codes are saved as PNG — ensure the file downloaded correctly

### Images Not Loading

- Verify image file is committed to `public/images/persons/`
- Check file naming: should be `{personId}.jpg` (e.g., `P001.jpg`)
- Images must be valid JPEG files under 5MB (compressed client-side)

### Vercel Deploy Fails

- Check environment variables are all set correctly
- Ensure `GITHUB_PAT` is valid and has proper permissions
- Review Vercel build logs for TypeScript or dependency errors

## Performance Notes

- Memorial pages are pre-rendered with ISR (revalidate every 60 seconds)
- Initial page loads are blazing fast (static HTML)
- Admin pages are server-rendered with authentication
- Images are optimized via Next.js Image component
- JSON files are small (~1-5KB each) for fast loading

## License

This project is provided as-is for memorial registry purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review your environment variable configuration
3. Check GitHub Personal Access Token permissions
4. Review Vercel deployment logs

---

Built with ❤️ for memorial registries.
