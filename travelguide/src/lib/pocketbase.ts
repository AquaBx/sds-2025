// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.DATABASE);
