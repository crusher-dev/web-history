export const AZURE_CONFIG = {
    accountName: process.env.AZURE_ACCOUNT_NAME,
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || "web-history",
}

export const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
};

export const REDIS_CONFIG = {
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}