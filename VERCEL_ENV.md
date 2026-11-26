# Fix buildyourown-seven.vercel.app (database + admin + Cohere)

Your **live site does not use `.env.local`**. Add **all** of these in Vercel:

**Vercel** → **buildyourown-seven** → **Settings** → **Environment Variables** → **Production**

| Name | Example / notes |
|------|-----------------|
| `COHERE_API_KEY` | `cohere_...` from [Cohere dashboard](https://dashboard.cohere.com) |
| `MONGODB_URI` | Full string from Atlas → Connect → Drivers |
| `MONGODB_DB_NAME` | `buildyourown` |
| `USE_LOCAL_DB` | `0` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin` (or stronger) — **required on Vercel** or login returns 503 |

Then: **Deployments** → **⋯** → **Redeploy**.

**MongoDB Atlas** → **Network Access** → **Add IP** → `0.0.0.0/0`.

**Verify:** https://buildyourown-seven.vercel.app/api/health  

All checks should be `"set"`. Login at `/admin/login` with the same username/password you set in Vercel.