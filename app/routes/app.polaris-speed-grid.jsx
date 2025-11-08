import { Page, LegacyCard, DataTable, Spinner } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { prisma } from "../utils/prisma.server";
import { useLoaderData } from "@remix-run/react";

// ----------------- Loader -----------------
export async function loader() {
  try {
    const data = await prisma.speedGrid.findMany({
      orderBy: { createdAt: "desc" },
    });

    return json({ ok: true, data });
  } catch (error) {
    console.error("Error fetching SpeedGrid data:", error);
    return json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// ----------------- Component -----------------
export default function SpeedGrid() {
  const { ok, data } = useLoaderData();

  if (!ok) {
    return (
      <Page title="Speed Grid Quiz Results">
        <LegacyCard>
          <p style={{ padding: "20px" }}>Error loading data</p>
        </LegacyCard>
      </Page>
    );
  }

  const rows = data.map((item) => [
    item.id,
    item.Customer_Name,
    item.Test_Duration,
    item.Test_Errors,
    item.Customer_Email,
    item.createdAt,
  ]);

  return (
    <Page
      title="Speed Grid Entries"
      backAction={{ content: "Quizzes", url: "/app/quizzes-entries" }}
      style={{ paddingBottom: "60px" }}
    >
      <LegacyCard>
        {rows.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Spinner accessibilityLabel="Loading data" size="large" />
          </div>
        ) : (
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
            ]}
            headings={[
              "ID",
              "Customer Name",
              "Time Taken",
              "Errors",
              "Email",
              "Date",
            ]}
            rows={rows}
          />
        )}
      </LegacyCard>
    </Page>
  );
}
