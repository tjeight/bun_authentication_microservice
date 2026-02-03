import "dotenv/config";

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const ACCESS_TOKEN_EXPIRES_IN = Number(
	process.env.ACCESS_TOKEN_EXPIRES_IN,
);
export const REFRESH_TOKEN_EXPIRES_IN_SECONDS =
	Number(process.env.REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60;

export const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

if (!JWT_SECRET_KEY) {
	throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

if (!ACCESS_TOKEN_EXPIRES_IN) {
	throw new Error(
		"ACCESS_TOKEN_EXPIRES_IN is not defined in environment variables",
	);
}

if (!REFRESH_TOKEN_EXPIRES_IN_SECONDS) {
	throw new Error(
		"REFRESH_TOKEN_EXPIRES_IN_SECONDS is not defined in environment variables",
	);
}

if (!JWT_ALGORITHM) {
	throw new Error("JWT_ALGORITHM is not defined in environment variables");
}
