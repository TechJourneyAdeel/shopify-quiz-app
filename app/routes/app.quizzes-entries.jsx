import { Link, Page, LegacyCard, DataTable, Badge } from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../utils/prisma.server";

// ----------------- Loader -----------------
export async function loader() {
  try {
    // Count total entries from each quiz table
    const [speedGrid, targetFinder, numberRecall, findAllDigits] =
      await Promise.all([
        prisma.speedGrid.count(),
        prisma.targetFinder.count(),
        prisma.numberRecall.count(),
        prisma.findAllDigits.count(),
      ]);

    return json({
      ok: true,
      data: {
        speedGrid,
        targetFinder,
        numberRecall,
        findAllDigits,
      },
    });
  } catch (error) {
    console.error("Error loading quiz entries:", error);
    return json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

// ----------------- Component -----------------
export default function QuizDataTable() {
  const { ok, data } = useLoaderData();

  if (!ok) {
    return (
      <Page title="Quizzes">
        <LegacyCard>
          <p style={{ padding: "20px" }}>Error loading quizzes</p>
        </LegacyCard>
      </Page>
    );
  }

  const rows = [
    [
      <Link removeUnderline url="/app/polaris-speed-grid" key="speed-grid">
        Speed Grid
      </Link>,
      <div style={{ textAlign: "center", width: "100%" }}>
        {data.speedGrid}
      </div>,
      <Badge tone="success">Active</Badge>,
    ],
    [
      <Link
        removeUnderline
        url="/app/polaris-target-finder"
        key="target-finder"
      >
        Target Finder
      </Link>,
      <div style={{ textAlign: "center", width: "100%" }}>
        {data.targetFinder}
      </div>,
      <Badge tone="success">Active</Badge>,
    ],
    [
      <Link
        removeUnderline
        url="/app/polaris-number-recall"
        key="number-recall"
      >
        Number Recall
      </Link>,
      <div style={{ textAlign: "center", width: "100%" }}>
        {data.numberRecall}
      </div>,
      <Badge tone="success">Active</Badge>,
    ],
    [
      <Link
        removeUnderline
        url="/app/polaris-find-all-digits"
        key="find-all-digits"
      >
        Find All Digits
      </Link>,
      <div style={{ textAlign: "center", width: "100%" }}>
        {data.findAllDigits}
      </div>,
      <Badge tone="success">Active</Badge>,
    ],
  ];

  return (
    <Page title="Quizzes">
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "numeric", "text"]}
          headings={[
            "Quiz Name",
            <div style={{ textAlign: "center", width: "100%" }}>
              Total Entries
            </div>,
            "Status",
          ]}
          rows={rows}
        />
      </LegacyCard>
    </Page>
  );
}
