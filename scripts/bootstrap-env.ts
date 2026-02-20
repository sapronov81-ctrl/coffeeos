import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(".env.local"),
});

console.log("ENV loaded:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
