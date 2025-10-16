// Translations for the Issue Reporter Modal

// Define the translation structure
const en = {
  title: 'Report an Issue',
  description: 'Help us improve by reporting any issues you encounter',
  summary: 'Summary',
  summaryPlaceholder: 'Brief description of the issue',
  steps: 'Steps to Reproduce',
  stepsPlaceholder: '1. Go to...\n2. Click on...\n3. See error',
  expected: 'Expected Behavior',
  expectedPlaceholder: 'What should happen?',
  actual: 'Actual Behavior',
  actualPlaceholder: 'What actually happened?',
  severity: 'Severity',
  severityPlaceholder: 'Select severity',
  severityLow: 'Low',
  severityMedium: 'Medium',
  severityHigh: 'High',
  severityCritical: 'Critical',
  category: 'Category',
  categoryPlaceholder: 'e.g., UI, Performance, API',
  attachments: 'Attachments',
  dragDrop: 'Drag and drop files here, or click to browse',
  fileSupport: 'Supports images and videos up to 5MB/50MB • Max 3 files',
  chooseFiles: 'Choose Files',
  uploadedFiles: 'Uploaded files',
  verifying: 'Verifying...',
  verified: '✓ Verified',
  cancel: 'Cancel',
  submit: 'Submit Issue',
  creatingIssue: 'Creating Issue...',
  verifyingAttachments: 'Verifying Attachments...',
  uploadingFiles: 'Uploading Files...',
  preparingUpload: 'Preparing Upload...',
  required: '*',
} as const;

type Translation = typeof en;

const es: Translation = {
  title: 'Reportar un Problema',
  description: 'Ayúdanos a mejorar reportando cualquier problema que encuentres',
  summary: 'Resumen',
  summaryPlaceholder: 'Descripción breve del problema',
  steps: 'Pasos para Reproducir',
  stepsPlaceholder: '1. Ir a...\n2. Hacer clic en...\n3. Ver error',
  expected: 'Comportamiento Esperado',
  expectedPlaceholder: '¿Qué debería suceder?',
  actual: 'Comportamiento Real',
  actualPlaceholder: '¿Qué sucedió realmente?',
  severity: 'Severidad',
  severityPlaceholder: 'Seleccionar severidad',
  severityLow: 'Baja',
  severityMedium: 'Media',
  severityHigh: 'Alta',
  severityCritical: 'Crítica',
  category: 'Categoría',
  categoryPlaceholder: 'ej., UI, Rendimiento, API',
  attachments: 'Archivos Adjuntos',
  dragDrop: 'Arrastra y suelta archivos aquí, o haz clic para explorar',
  fileSupport: 'Soporta imágenes y videos hasta 5MB/50MB • Máximo 3 archivos',
  chooseFiles: 'Elegir Archivos',
  uploadedFiles: 'Archivos subidos',
  verifying: 'Verificando...',
  verified: '✓ Verificado',
  cancel: 'Cancelar',
  submit: 'Enviar Reporte',
  creatingIssue: 'Creando Reporte...',
  verifyingAttachments: 'Verificando Archivos Adjuntos...',
  uploadingFiles: 'Subiendo Archivos...',
  preparingUpload: 'Preparando Subida...',
  required: '*',
};

export const translations = { en, es } as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = keyof Translation;
