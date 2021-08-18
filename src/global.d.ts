import { DriveAdapter } from "@src/interface/DriveAdapter"

export {}

declare global {
  const MY_ENV_VAR: string
  const MY_SECRET: string
  const STORE: KVNamespace
  var drive: DriveAdapter
}