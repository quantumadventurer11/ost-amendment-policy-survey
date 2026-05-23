import { LayoutShell } from "@/components/LayoutShell";
import { ReportView } from "@/components/ReportView";
import { getAdminResponses } from "@/lib/adminResponses";
import { buildSurveyReport } from "@/lib/report";

export const dynamic = "force-dynamic";

export default async function AdminReportPage() {
  const { responses, usingMockData, liveDataEnabled } = await getAdminResponses();
  const report = buildSurveyReport(responses);

  return (
    <LayoutShell>
      <ReportView report={report} responses={responses} usingMockData={usingMockData} liveDataEnabled={liveDataEnabled} />
    </LayoutShell>
  );
}
