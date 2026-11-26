import { MongoClient, type Db } from "mongodb";
import { getMongoDbName, getMongoUri } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
  }

  const client = await global._mongoClientPromise;
  return client.db(getMongoDbName());
}

export async function pingMongo(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.command({ ping: 1 });
  return true;
}

export const PITCHES_COLLECTION = "pitches";