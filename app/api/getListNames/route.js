import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import CryptoList from "../../../models/CryptoList";

export async function GET(req, res) {
  connectDB(); // Make sure this function establishes a database connection

  try {
    const listNames = await CryptoList.distinct("listname");
    return NextResponse.json(listNames);
  } catch (error) {
    console.error("Error fetching list names:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
