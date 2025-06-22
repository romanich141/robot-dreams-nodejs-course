import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB = join(__dirname, '..', 'db', 'users.db.json');

const read = async () => {
  try {
    const db = await readFile(DB, 'utf8');

    return JSON.parse(db);
  } catch (error) {
    console.log(error);
  }
};

const save = async (data) => {
  try {
    writeFile(DB, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

const getAll = async () => {
  return read();
};

const create = async (payload) => {
  const db = await read();
  await save([...db, payload]);
  return payload;
};

const remove = async (id) => {
  const db = await read();
  const next = db.filter((u) => Number(u.id) !== Number(id));

  if (next.length === db.length) {
    return false;
  }

  await save(next);
  return true;
};

const getById = async (id) => {
  const db = await read();

  return db.find((u) => u.id === id);
};

const update = async (id, payload) => {
  const db = await read();
  const idx = db.findIndex((u) => u.id === id);

  if (idx === -1) {
    return null;
  }

  db[idx] = { ...db[idx], ...payload };
  await save(db);

  return db[idx];
};

export { getAll, create, remove, update, getById };
