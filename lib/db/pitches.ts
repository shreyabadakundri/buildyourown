import { ObjectId } from "mongodb";
import type { AIEvaluation, PitchStatus, Telemetry } from "@/types";
import { getDb, PITCHES_COLLECTION } from "@/lib/mongodb";
import type { PitchFormInput } from "@/types";
import { useLocalPitchStore } from "@/lib/env";
import * as local from "@/lib/db/pitches-local";

let indexesReady = false;
let loggedLocal = false;

function logLocalOnce() {
  if (!loggedLocal && useLocalPitchStore()) {
    loggedLocal = true;
    console.warn(
      "[BuildWithMe] Using local file store (data/pitches.json). Add MONGODB_URI for Atlas database buildyourown/pitches."
    );
  }
}

async function ensureIndexes(): Promise<void> {
  if (indexesReady) return;
  const db = await getDb();
  if (!db) return;
  await db.collection(PITCHES_COLLECTION).createIndexes([
    { key: { created_at: -1 } },
    { key: { status: 1 } },
    { key: { email: 1 } },
  ]);
  indexesReady = true;
}

export interface PitchDocument {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  founder_name: string;
  email: string;
  social_url: string | null;
  project_title: string;
  target_audience: string;
  problem_statement: string;
  unfair_advantage: string;
  deal_model: string;
  legal_agreed: boolean;
  ai_evaluation: AIEvaluation;
  telemetry: Telemetry;
  status: PitchStatus;
}

export function pitchIdString(doc: PitchDocument): string {
  return doc._id.toHexString();
}

export function toAdminRow(doc: PitchDocument) {
  return {
    id: pitchIdString(doc),
    created_at: doc.created_at.toISOString(),
    founder_name: doc.founder_name,
    email: doc.email,
    project_title: doc.project_title,
    deal_model: doc.deal_model,
    ai_evaluation: doc.ai_evaluation,
    telemetry: doc.telemetry,
    status: doc.status,
  };
}

async function requireDb() {
  const db = await getDb();
  if (db) return db;
  if (process.env.MONGODB_URI?.trim()) {
    throw new Error(
      "Database connection failed. Check MONGODB_URI and Atlas Network Access."
    );
  }
  throw new Error("Database not configured");
}

export async function insertPitch(
  pitch: PitchFormInput,
  evaluation: AIEvaluation,
  telemetry: Telemetry
): Promise<string> {
  if (useLocalPitchStore()) {
    logLocalOnce();
    return local.localInsertPitch(pitch, evaluation, telemetry);
  }

  const db = await requireDb();
  await ensureIndexes();

  const now = new Date();
  const doc = {
    created_at: now,
    updated_at: now,
    founder_name: pitch.founder_name,
    email: pitch.email,
    social_url: pitch.social_url || null,
    project_title: pitch.project_title,
    target_audience: pitch.target_audience,
    problem_statement: pitch.problem_statement,
    unfair_advantage: pitch.unfair_advantage,
    deal_model: pitch.deal_model,
    legal_agreed: pitch.legal_agreed,
    ai_evaluation: evaluation,
    telemetry,
    status: "New" as PitchStatus,
  };

  const result = await db.collection(PITCHES_COLLECTION).insertOne(doc);
  return result.insertedId.toHexString();
}

export async function updatePitchTelemetry(
  id: string,
  telemetry: Telemetry
): Promise<void> {
  if (useLocalPitchStore()) {
    await local.localUpdatePitchTelemetry(id, telemetry);
    return;
  }

  const db = await requireDb();
  if (!ObjectId.isValid(id)) return;

  await db.collection(PITCHES_COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { telemetry, updated_at: new Date() } }
  );
}

export async function getPitchById(
  id: string
): Promise<PitchDocument | null> {
  if (useLocalPitchStore()) {
    return local.localGetPitchById(id);
  }

  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;

  const doc = await db
    .collection<PitchDocument>(PITCHES_COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  return doc;
}

export async function listPitches(): Promise<PitchDocument[]> {
  if (useLocalPitchStore()) {
    logLocalOnce();
    return local.localListPitches();
  }

  const db = await requireDb();
  await ensureIndexes();

  return db
    .collection<PitchDocument>(PITCHES_COLLECTION)
    .find({})
    .sort({ created_at: -1 })
    .toArray();
}

export async function updatePitchStatus(
  id: string,
  status: PitchStatus
): Promise<void> {
  if (useLocalPitchStore()) {
    await local.localUpdatePitchStatus(id, status);
    return;
  }

  const db = await requireDb();
  if (!ObjectId.isValid(id)) throw new Error("Invalid pitch id");

  const result = await db.collection(PITCHES_COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updated_at: new Date() } }
  );
  if (result.matchedCount === 0) throw new Error("Pitch not found");
}