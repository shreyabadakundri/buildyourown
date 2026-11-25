import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AIEvaluation, PitchStatus, Telemetry } from "@/types";
import type { PitchFormInput } from "@/types";
import type { PitchDocument } from "@/lib/db/pitches";
import { ObjectId } from "mongodb";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "pitches.json");

interface StoredPitch extends Omit<PitchDocument, "_id"> {
  _id: string;
}

async function loadAll(): Promise<StoredPitch[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredPitch[];
  } catch {
    return [];
  }
}

async function saveAll(rows: StoredPitch[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
}

function toDoc(row: StoredPitch): PitchDocument {
  const id = ObjectId.isValid(row._id) ? new ObjectId(row._id) : new ObjectId();
  return {
    ...row,
    _id: id,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

export async function localInsertPitch(
  pitch: PitchFormInput,
  evaluation: AIEvaluation,
  telemetry: Telemetry
): Promise<string> {
  const rows = await loadAll();
  const now = new Date();
  const id = randomBytes(12).toString("hex");
  rows.unshift({
    _id: id,
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
    status: "New",
  });
  await saveAll(rows);
  return id;
}

export async function localUpdatePitchTelemetry(
  id: string,
  telemetry: Telemetry
): Promise<void> {
  const rows = await loadAll();
  const row = rows.find((r) => r._id === id);
  if (!row) return;
  row.telemetry = telemetry;
  row.updated_at = new Date();
  await saveAll(rows);
}

export async function localGetPitchById(id: string): Promise<PitchDocument | null> {
  const rows = await loadAll();
  const row = rows.find((r) => r._id === id);
  if (!row) return null;
  return toDoc(row);
}

export async function localListPitches(): Promise<PitchDocument[]> {
  const rows = await loadAll();
  return rows.map((r) => toDoc(r));
}

export async function localUpdatePitchStatus(
  id: string,
  status: PitchStatus
): Promise<void> {
  const rows = await loadAll();
  const row = rows.find((r) => r._id === id);
  if (!row) throw new Error("Pitch not found");
  row.status = status;
  row.updated_at = new Date();
  await saveAll(rows);
}