# Deploy BuildWithMe Studio (Vercel + MongoDB Atlas)

Recommended host: **[Vercel](https://vercel.com)** (built for Next.js 14).

## 1. Push code to GitHub

Repo: [github.com/shreyabadakundri/buildyourown](https://github.com/shreyabadakundri/buildyourown)

```bash
git push origin develop
# or merge develop → main and push main
```

## 2. MongoDB Atlas (production)

1. In [Atlas](https://cloud.mongodb.com), open database **`buildyourown`**, collection **`pitches`**.
2. **Network Access** → add **`0.0.0.0/0`** (allow Vercel) or restrict later.
3. Copy connection string: **Database → Connect → Drivers**.

## 3. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** `shreyabadakundri/buildyourown`.
3. Framework: **Next.js** (auto-detected).
4. Root directory: `.` (default).
5. Before deploy, open **Environment Variables** and add:

| Name | Value | Environments |
|------|--------|----------------|
| `MONGODB_URI` | `mongodb+srv://...` from Atlas | Production, Preview, Development |
| `MONGODB_DB_NAME` | `buildyourown` | All |
| `COHERE_API_KEY` | your Cohere key | All |
| `ADMIN_USERNAME` | `admin` (change in prod) | All |
| `ADMIN_PASSWORD` | strong password | All |
| `USE_LOCAL_DB` | `0` | Production only |
| `NEXT_PUBLIC_CALCOM_LINK` | optional booking URL | All |
| `CALCOM_LINK` | same as above | All |
| `RESEND_API_KEY` | optional emails | All |
| `ADMIN_EMAIL` | optional shortlist alerts | All |

6. Click **Deploy**.

## 4. After deploy

- Site: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin/login`
- Test: **1-Click Demo Mode** → submit pitch → check Atlas `pitches` collection.

## 5. Custom domain (optional)

Vercel → Project → **Settings → Domains** → add your domain.

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| `Database not configured` on Vercel | Set `MONGODB_URI`, `USE_LOCAL_DB=0` in Production env |
| Atlas connection timeout | Network Access includes `0.0.0.0/0` |
| Cohere 503 | `COHERE_API_KEY` set for Production |
| Admin login fails | `ADMIN_USERNAME` / `ADMIN_PASSWORD` set on Vercel (redeploy after adding) |

## Alternative: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
# add secrets in Vercel dashboard or: vercel env add MONGODB_URI
vercel --prod
```

Do **not** commit `.env.local` or paste API keys into the repo.