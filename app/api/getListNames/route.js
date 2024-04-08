import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import CryptoList from "../../../models/CryptoList";

export async function GET(req, res) {
  connectDB(); // Make sure this function establishes a database connection

  try {
    const listNames = await CryptoList.distinct("listname");
    return NextResponse.json(listNames, {
      status: 200,
      headers: { "Cache-Control": "no-store" }, // Set Cache-Control header
      revalidate: 0, // Disable ISR for this route
    });
  } catch (error) {
    console.error("Error fetching list names:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}
