import "dotenv/config"


export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
export const ACCESS_TOKEN_EXPIRES_IN = Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
export const REFRESH_TOKEN_EXPIRES_IN_SECONDS =
    Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) * 24 * 60 * 60

export const JWT_ALGORITHM = process.env.JWT_ALGORITHM


