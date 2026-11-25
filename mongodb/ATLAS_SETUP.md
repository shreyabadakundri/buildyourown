# MongoDB Atlas setup for BuildWithMe Studio

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add your IP (or `0.0.0.0/0` for quick dev only).
4. **Connect** → Drivers → copy the connection string.
5. Add to `.env.local`:

   ```env
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=buildwithme
   ```

6. Replace `USER` and `PASSWORD` in the URI (URL-encode special characters in the password).

The app creates the `pitches` collection and indexes automatically on first write if it does not exist yet.

### Cluster vs database vs collection (Atlas UI)

| Atlas concept | Example | In this app |
|---------------|---------|-------------|
| **Cluster** (label e.g. “Build your own”) | Your server group | **Not** configured by name — only the host inside `MONGODB_URI` |
| **Database** | Whatever you chose when creating the DB | `MONGODB_DB_NAME` in `.env.local` |
| **Collection** | `pitches` | Fixed in code as **`pitches`** |

Your collection name **`pitches`** matches the app. Set **`MONGODB_DB_NAME`** to the **database** name shown in Atlas above that collection (not the cluster display name). Database names cannot contain spaces; Atlas may use something like `buildyourown` or `build_your_own`.

### Document shape

Collection: `pitches`

- `_id` — MongoDB ObjectId (used in URLs as hex string)
- Form fields, `ai_evaluation`, `telemetry`, `status`, `created_at`, `updated_at`