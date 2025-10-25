# @blario/nextjs

## 1.1.1-alpha.0

### Patch Changes

- Add Spanish translations for attachments section, clipboard paste functionality for attachments, and success animation after report submission

## 1.1.0

### Minor Changes

- Add reportBy field to provider and payload schema

## 1.0.0

### Major Changes

- c8b16de: Remove SupportChatModal from BlarioProvider to prevent automatic WebSocket connections

## 0.2.1

### Patch Changes

- 242ce1c: make standalone form properly scrollable within fixed-height containers

## 0.2.1-alpha.1

### Patch Changes

- make standalone form properly scrollable within fixed-height containers

## 0.2.1-alpha.0

### Patch Changes

- add standalone prop to IssueReporterForm for using the form with AI triage outside the modal

## 0.2.0

### Minor Changes

- add IssueReporterForm component and fix className on provider

## 0.1.10

### Patch Changes

- enhance IssueReporterModal with focus management and prevent closing on interactions outside

## 0.1.8

### Patch Changes

- remove unnecessary babel/core dependency

## 0.1.7

### Patch Changes

- add babel-core dependency

## 0.1.2

### Patch Changes

- Add chatHistory prop to IssueReporterButton for AI-powered form prefilling
- Separate triage data from reporter options for cleaner architecture
- Improve loading message with "Prefilling your bug report..." text and proper contrast

## 0.1.1

### Patch Changes

- f1b26d4: Remove websocket ping messages and fix duplicate connection messages

## 0.1.0

### Minor Changes

- c2f7f65: Add AI-powered issue triage with prefill functionality and improve attachment UI. Users can now pass chat history to openReporter() for AI-suggested issue details. Attachment limit increased to 5 files with compact thumbnail design.
