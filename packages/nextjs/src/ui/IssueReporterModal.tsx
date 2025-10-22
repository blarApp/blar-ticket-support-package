'use client';

import { useBlarioContext } from '../provider/BlarioProvider';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './components/dialog';
import { IssueReporterForm } from './IssueReporterForm';

export interface IssueReporterModalProps {
  onSuccess?: (issueId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function IssueReporterModal({
  onSuccess,
  onError,
  className,
}: IssueReporterModalProps) {
  const { isModalOpen, closeReporter } = useBlarioContext();

  const handleSuccess = (issueId: string) => {
    onSuccess?.(issueId);
    closeReporter();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeReporter()}>
      <DialogContent
        className="blario-wrapper blario-issue-reporter max-w-3xl max-h-[90vh] flex flex-col p-0"
        showCloseButton={false}
        style={{ zIndex: 10000, pointerEvents: 'auto' }}
        data-blario-modal="true"
      >
        <DialogTitle className="sr-only">Report Issue</DialogTitle>
        <IssueReporterForm
          onSuccess={handleSuccess}
          onError={onError}
          onCancel={closeReporter}
          className={className}
        />
      </DialogContent>
    </Dialog>
  );
}
