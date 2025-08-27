import { openDB } from "idb";
import { User } from "@/utils/types";

const DB_NAME = "fiscalizacao-db";
const DB_VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
      }
    },
  });
}

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
