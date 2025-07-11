import type { ActiveStream } from "../entities/active-stream-entities.ts";


export interface IStreamRepository {
    findByName(streamName: string): Promise<ActiveStream | undefined>;
    findAll(): Promise<ActiveStream[]>;
    save(stream: ActiveStream): Promise<void>;
    deleteByName(streamName: string): Promise<void>;
}
