import { NextResponse } from "next/server";
import CryptoList from "../../../models/CryptoList";
import connectDB from "@/utils/db";
import mongoose from "mongoose";

export async function POST(req) {
  connectDB();
  try {
    const body = await req.json();
    const userData = body;

    await Promise.all(
      userData.map(async (data) => {
        // Check if a document with the same list name and currency already exists
        const existingData = await CryptoList.findOne({
          listname: data.listname,
          currency: data.currency,
        });

        if (!existingData) {
          // If not, create a new document
          await CryptoList.create(data);
        }
      })
    );

    return NextResponse.json({ message: "List Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}

export async function GET(req) {
  connectDB();
  try {
    const cryptoData = await CryptoList.find(); // Fetch all crypto data from the database
    return NextResponse.json(cryptoData, { status: 200 });
  } catch (error) {
    console.error("Error fetching list:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}

export async function DELETE(req) {
  connectDB();

  let passedValue = await new Response(req.body).text();
  let bodyreq = JSON.parse(passedValue);

  const id = bodyreq;

  try {
    // Validate id as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid id format" },
        { status: 400 }
      );
    }

    const deletedItem = await CryptoList.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.error(error.message, { status: 500 });
  }
}
