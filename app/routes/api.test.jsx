import { json } from "@remix-run/node";
import { addCorsHeaders, handleOptionsRequest } from "../utils/core";
import { prisma } from "../utils/prisma.server";

// const prisma = new PrismaClient();

export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  return addCorsHeaders(
    json({
      ok: true,
      message: "Hello (GET request)",
    }),
  );
}

export async function action({ request }) {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  try{
    const data = await request.json();
    console.log("Received data:", data);

    // Required fields check
    if (!data.Test_Name || !data.Customer_Id) {
      return addCorsHeaders(
        json({ ok: false, message: "Missing required fields" }),
        { status: 400 },
      );
    }

    const commonData = {
      Customer_Name: data.Customer_Name || "Guest",
      Customer_Email: data.Customer_Email || null,
      Customer_Id: String(data.Customer_Id),
      Test_Name: data.Test_Name,
      Test_Duration: data.Test_Duration || "0",
      Test_Errors: data.Test_Errors || "0",
    };

    let savedRecord;
    switch (data.Test_Name) {
      case "Target Finder":
        savedRecord = await prisma.targetFinder.create({
          data: {
            ...commonData,
            Correct_Taps: data.Correct_Taps || "0",
            Missing_Taps: data.Missing_Taps || "0",
          },
        });
        break;

      case "Number Recall":
        savedRecord = await prisma.numberRecall.create({
          data: {
            ...commonData,
            Correct_Answer: data.Correct_Answer || "0",
            Max_Length: data.Max_Length || "0",
          },
        });
        break;

      case "Speed Grid":
        savedRecord = await prisma.speedGrid.create({ data: commonData });
        break;

      case "Find All Digits":
        savedRecord = await prisma.findAllDigits.create({
          data: {
            ...commonData,
            Correct_Taps: data.Correct_Taps || "0",
            Missing_Taps: data.Missing_Taps || "0",
          },
        });
        break;
    }

    return addCorsHeaders(
      json({
        ok: true,
        message: "Data saved successfully",
        saved: savedRecord,
      }),
    );
  } catch (error) {
    console.error("Database error:", error);
    return addCorsHeaders(
      json({
        ok: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
