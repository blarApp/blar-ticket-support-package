// Plugin
export { BlarioPlugin } from './plugin/BlarioPlugin';
export type {
  BlarioPluginOptions,
  BlarioState,
  BlarioActions,
  BlarioContext,
} from './plugin/BlarioPlugin';

// Composables
export { useBlario } from './composables/useBlario';
export type { UseBlarioReturn } from './composables/useBlario';

export { useBlarioUpload } from './composables/useBlarioUpload';
export type { UseBlarioUploadReturn, UploadProgress } from './composables/useBlarioUpload';

// Components
export { default as IssueReporterButton } from './components/IssueReporterButton.vue';
export { default as IssueReporterModal } from './components/IssueReporterModal.vue';

// Core schemas and types (re-exported from @blario/core)
export type {
  User,
  Viewport,
  Meta,
  ConsoleLog,
  NetworkLog,
  FormData,
  Attachment,
  IssueReportPayload,
  Diagnostic,
  DiagnosticResponse,
  BlarioConfig,
} from '@blario/core';

// Export utility functions
export { cn } from './lib/cn';
export {
  buttonVariants,
  inputVariants,
  labelVariants,
  cardVariants,
  alertVariants,
  badgeVariants,
} from './lib/variants';

// Import styles
import './styles/theme.css';
import './styles/modal.css';
