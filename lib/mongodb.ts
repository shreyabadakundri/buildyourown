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
    global._mongoClientPromise = client.connect();
  }

  const client = await global._mongoClientPromise;
  return client.db(getMongoDbName());
}

export const PITCHES_COLLECTION = "pitches";