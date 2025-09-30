'use client';

import { IssueReporterButton, IssueReporterModal, DiagnosticBanner } from '@blario/nextjs';

export function ClientIssueReporterButton(props: any) {
  return (
    <>
      <IssueReporterModal />
      <IssueReporterButton {...props} />
    </>
  );
}

export function ClientDiagnosticBanner(props: any) {
  return <DiagnosticBanner {...props} />;
}