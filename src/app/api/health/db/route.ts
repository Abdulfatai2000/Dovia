import { connectToDatabase } from "@/lib/db/mongoose";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const name = db.connection.db?.databaseName ?? process.env.MONGODB_DB_NAME ?? "dovia";
    return Response.json({ status: "ok", database: name });
  } catch {
    return Response.json({ status: "error", database: "disconnected" }, { status: 503 });
  }
}
