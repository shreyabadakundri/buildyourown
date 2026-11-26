# Fix live site (buildyourown-seven.vercel.app)

Code is on GitHub `main` — Vercel redeploys automatically. **You must set these in Vercel** (not `.env.local`):

1. [Vercel Dashboard](https://vercel.com) → **buildyourown-seven** → **Settings** → **Environment Variables**
2. Add each for **Production** (and Preview optional):

```
COHERE_API_KEY = (from dashboard.cohere.com)
MONGODB_URI = mongodb+srv://...
MONGODB_DB_NAME = buildyourown
USE_LOCAL_DB = 0
ADMIN_USERNAME = admin
ADMIN_PASSWORD = (choose a strong password)
```

3. **Deployments** → latest → **⋯** → **Redeploy**
4. Open: https://buildyourown-seven.vercel.app/api/health  
   Expect `"status": "ready"`.

Atlas: **Network Access** → `0.0.0.0/0` allowed.