import fs from "node:fs/promises";
import { env } from "../../../config/env.ts";
import type { ActiveStream } from "../../../core/entities/active-stream-entities.ts";
import type { IStreamRepository } from "../../../core/repositories/IStream-repository.ts";

export class JsonStreamRepository implements IStreamRepository {
  private dbPath = env.DB_PATH;

  constructor() {
    this.initializeDb();
  }

  private async initializeDb() {
    try {
      await fs.access(this.dbPath);
    } catch {
      await fs.writeFile(this.dbPath, JSON.stringify([]));
    }
  }

  private async readDb(): Promise<ActiveStream[]> {
    const data = await fs.readFile(this.dbPath, "utf-8");
    return JSON.parse(data);
  }

  private async writeDb(data: ActiveStream[]): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
  }

  async findByName(streamName: string): Promise<ActiveStream | undefined> {
    const db = await this.readDb();
    return db.find((s) => s.streamName === streamName);
  }

  async findAll(): Promise<ActiveStream[]> {
    return this.readDb();
  }

  async save(stream: ActiveStream): Promise<void> {
    const db = await this.readDb();
    const index = db.findIndex((s) => s.streamName === stream.streamName);
    if (index > -1) {
      db[index] = stream;
    } else {
      db.push(stream);
    }
    await this.writeDb(db);
  }

  async deleteByName(streamName: string): Promise<void> {
    const db = await this.readDb();
    const filteredDb = db.filter((s) => s.streamName !== streamName);
    await this.writeDb(filteredDb);
  }
}
