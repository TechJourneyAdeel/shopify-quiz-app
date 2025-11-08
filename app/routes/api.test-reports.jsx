import { json } from "@remix-run/node";
import { prisma } from "../utils/prisma.server";

const allowedOrigins = ["https://ohio-quiz-system.myshopify.com", "http://localhost:58619"];

function addCorsHeaders(response, request) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// ✅ Handle OPTIONS preflight
function handleOptionsRequest(request) {
  return addCorsHeaders(new Response(null, { status: 200 }), request);
}

// ----------------- GET loader -----------------
export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest(request);
  }

  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");

    if (!customerId) {
      return addCorsHeaders(
        json({ ok: false, message: "CustomerId required" }, { status: 400 }),
        request,
      );
    }

    const [targetFinder, speedGrid, findAllDigits, numberRecall] =
      await Promise.all([
        prisma.targetFinder.findMany({ where: { Customer_Id: customerId } }),
        prisma.speedGrid.findMany({ where: { Customer_Id: customerId } }),
        prisma.findAllDigits.findMany({ where: { Customer_Id: customerId } }),
        prisma.numberRecall.findMany({ where: { Customer_Id: customerId } }),
      ]);

    return addCorsHeaders(
      json({
        ok: true,
        data: {
          targetFinder,
          speedGrid,
          findAllDigits,
          numberRecall,
        },
      }),
      request,
    );
  } catch (error) {
    console.error("Error fetching tests (loader):", error);
    return addCorsHeaders(
      json(
        { ok: false, message: "Server error", error: error.message },
        { status: 500 },
      ),
      request,
    );
  }
}

// ----------------- POST action -----------------
export async function action({ request }) {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest(request);
  }

  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return addCorsHeaders(
        json({ ok: false, message: "CustomerId required" }, { status: 400 }),
        request,
      );
    }

    const [targetFinder, speedGrid, findAllDigits, numberRecall] =
      await Promise.all([
        prisma.targetFinder.findMany({ where: { Customer_Id: customerId } }),
        prisma.speedGrid.findMany({ where: { Customer_Id: customerId } }),
        prisma.findAllDigits.findMany({ where: { Customer_Id: customerId } }),
        prisma.numberRecall.findMany({ where: { Customer_Id: customerId } }),
      ]);

    return addCorsHeaders(
      json({
        ok: true,
        data: {
          targetFinder,
          speedGrid,
          findAllDigits,
          numberRecall,
        },
      }),
      request,
    );
  } catch (error) {
    console.error("Error fetching tests (action):", error);
    return addCorsHeaders(
      json(
        { ok: false, message: "Server error", error: error.message },
        { status: 500 },
      ),
      request,
    );
  }
}
