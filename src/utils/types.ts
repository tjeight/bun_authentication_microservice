import type { Variables } from "hono/types";
import type { AppContext } from "./context";

export type AdminEnv = {
	Variables: {
		db: AppContext["db"];
	};
};
