import { openDB } from "idb";
import { Target, User } from "@/utils/types";

const DB_NAME = "fiscalizacao-db";
const DB_VERSION = 2;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }
      // ✅ Adiciona store para targets
      if (!db.objectStoreNames.contains("targets")) {
        db.createObjectStore("targets", { keyPath: "id" });
      }
    },
  });
}

// --- Funções para Users (já existentes) ---
export async function salvarUserData(users: User | User[]) {
  const arr = Array.isArray(users) ? users : [users];
  const db = await getDB();
  const tx = db.transaction("users", "readwrite");
  const store = tx.objectStore("users");
  for (const u of arr) await store.put(u);
  await tx.done;
}

export async function carregarTodosUsers(): Promise<User[]> {
  const db = await getDB();
  return db.getAll("users");
}

// --- Novas funções para Targets ---
export async function salvarTargets(targets: Target[]) {
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  const store = tx.objectStore("targets");
  for (const t of targets) await store.put(t);
  await tx.done;
}

export async function carregarTodosTargets(): Promise<Target[]> {
  const db = await getDB();
  return db.getAll("targets");
}

// Opcional: limpar os dados antigos
export async function limparTargets() {
  const db = await getDB();
  const tx = db.transaction("targets", "readwrite");
  await tx.objectStore("targets").clear();
  await tx.done;
}