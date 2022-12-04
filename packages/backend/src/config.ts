export const BACKBLAZE_CONFIG = {
    applicationKeyId: process.env.BACKBLAZE_APPLICATION_KEY_ID,
    applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
    bucket: process.env.BACKBLAZE_BUCKET,
    bucketName: process.env.BACKBLAZE_BUCKET_NAME,
};

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