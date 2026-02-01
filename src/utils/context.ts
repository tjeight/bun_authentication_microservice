import type { db } from "../configs/pg"

export type AppContext = {
    db: typeof db
}
