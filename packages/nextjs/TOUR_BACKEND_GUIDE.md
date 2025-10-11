# Backend Integration Guide for Dynamic Tours

## Overview

The tour system is **fully dynamic** - the frontend SDK has **NO hardcoded tours**. All tour generation happens on the backend based on user questions.

## Architecture

```
User asks question → Backend analyzes → Backend generates tour steps → Frontend displays tour
```

### Frontend Responsibilities (SDK)
1. ✅ Capture user's question from chat
2. ✅ Send question to backend API
3. ✅ Receive tour steps from backend
4. ✅ Find elements using multiple strategies (text, selector, data-tour-id)
5. ✅ Display tour overlay and guide user through steps

### Backend Responsibilities (Your API)
1. ❗ Understand user intent from question (using LLM/AI)
2. ❗ Know your app structure (buttons, pages, workflows)
3. ❗ Generate appropriate tour steps dynamically
4. ❗ Return tour data as JSON

## API Specification

### Endpoint
```
POST /api/chat/ask
```

### Request
```typescript
{
  message: string;        // User's question: "How do I create an order?"
  projectId: string;      // Your Blario project ID
  currentUrl?: string;    // Current page URL for context
  sessionId?: string;     // Optional: track conversation
}
```

### Response
```typescript
{
  message: string;        // Text response to show user
  tour?: {
    id: string;          // Auto-generated unique ID
    steps: [{
      target: {
        text?: string;          // RECOMMENDED: "Create Order"
        selector?: string;      // OPTIONAL: "button.create-btn"
        tourId?: string;        // OPTIONAL: "create-order-btn"
        index?: number;         // OPTIONAL: if multiple matches
      },
      title: string;            // "Step 1: Click Create Order"
      description: string;      // "Click this button to..."
      position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
    }]
  }
}
```

## Element Targeting Strategy (Recommended Priority)

### 1. Text Content (Best - No Developer Setup Required!)
```json
{
  "target": { "text": "Create Order" },
  "title": "Click Create Order",
  "description": "..."
}
```
✅ Works immediately, no setup needed
✅ Resilient to minor DOM changes
✅ Natural for AI to generate

### 2. CSS Selector + Text Validation
```json
{
  "target": {
    "selector": "button.primary",
    "text": "Create Order"
  }
}
```
✅ More precise
✅ Validates correct element found

### 3. data-tour-id (Optional Enhancement)
```json
{
  "target": { "tourId": "create-order-btn" }
}
```
✅ Most reliable
❌ Requires developer to add attributes

## Backend Implementation Options

### Option 1: Pre-Mapped App Structure (Recommended for MVP)
Store a map of your app's key flows:

```typescript
const appFlows = {
  "create-order": {
    steps: [
      { text: "Quick Actions", title: "...", description: "..." },
      { text: "Create Order", title: "...", description: "..." },
      { text: "Submit", title: "...", description: "..." }
    ]
  },
  "add-product": { ... }
};

// Backend logic
app.post('/api/chat/ask', async (req, res) => {
  const { message } = req.body;

  // Use LLM to map question to flow
  const intent = await llm.classify(message, Object.keys(appFlows));

  res.json({
    message: "I'll show you how!",
    tour: {
      id: generateId(),
      steps: appFlows[intent].steps
    }
  });
});
```

### Option 2: Full AI Generation (Advanced)
Let AI generate tours on-the-fly:

```typescript
app.post('/api/chat/ask', async (req, res) => {
  const { message, currentUrl } = req.body;

  // 1. Get app structure (from DB or crawl)
  const appStructure = await getAppStructure(currentUrl);

  // 2. Use LLM to generate tour
  const tourSteps = await llm.generate({
    prompt: `
      User question: "${message}"
      App structure: ${JSON.stringify(appStructure)}

      Generate a step-by-step tour to answer their question.
      Return array of steps with target (text/selector), title, description.
    `
  });

  res.json({
    message: "Here's how to do it!",
    tour: {
      id: generateId(),
      steps: tourSteps
    }
  });
});
```

### Option 3: Hybrid Approach
Combine pre-mapped flows with AI enhancement:

```typescript
// Use AI to improve descriptions, handle variations
const baseFlow = appFlows[intent];
const enhancedSteps = await llm.enhance(baseFlow, message);
```

## Example LLM Prompts

### Intent Classification
```
Given user question: "How do I create a new order?"
Available intents: ["create-order", "add-product", "view-analytics", "manage-customers"]

Which intent matches best? Return: "create-order"
```

### Tour Generation
```
User wants to: "create an order"

Available UI elements:
- Button: "Quick Actions" (section heading)
- Button: "Create Order" (in Quick Actions section)
- Input: "Customer Name"
- Input: "Order Amount"
- Button: "Submit Order"

Generate 3-5 step tour to guide user through creating an order.

Return JSON:
[
  {
    "target": { "text": "Quick Actions" },
    "title": "Navigate to Quick Actions",
    "description": "First, scroll down to the Quick Actions section",
    "position": "top"
  },
  ...
]
```

## Storing App Structure

### Method 1: Developer-Provided Map
```typescript
// In your backend config
const appMap = {
  pages: {
    "/dashboard": {
      elements: [
        { text: "Create Order", type: "button", workflow: "create-order" },
        { text: "Add Product", type: "button", workflow: "add-product" }
      ]
    }
  }
};
```

### Method 2: Auto-Crawl on Deploy
```typescript
// Crawl your app and extract interactive elements
const crawler = new AppCrawler();
const structure = await crawler.analyze('https://yourapp.com');
// Store in database
```

### Method 3: Client-Side Reporting
```typescript
// SDK sends DOM snapshot to backend periodically
window.blario.reportStructure({
  buttons: document.querySelectorAll('button'),
  links: document.querySelectorAll('a'),
  // ...
});
```

## Testing Your Backend

### Sample Requests
```bash
# Test: Create Order
curl -X POST https://your-api.com/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create an order?",
    "projectId": "proj_123",
    "currentUrl": "https://app.example.com/dashboard"
  }'

# Expected Response:
{
  "message": "I'll guide you through creating an order in 3 steps!",
  "tour": {
    "id": "tour_abc123",
    "steps": [
      {
        "target": { "text": "Quick Actions" },
        "title": "Navigate to Quick Actions",
        "description": "Scroll down to the Quick Actions section",
        "position": "top"
      },
      {
        "target": { "text": "Create Order" },
        "title": "Click Create Order",
        "description": "Click the Create Order button to start",
        "position": "top"
      },
      {
        "target": { "text": "Submit" },
        "title": "Submit Order",
        "description": "Fill in details and submit",
        "position": "top"
      }
    ]
  }
}
```

## Frontend Element Finder Logic

The SDK tries these strategies in order:

1. **data-tour-id** (if provided): `[data-tour-id="create-order"]`
2. **CSS selector + text**: Find elements matching selector, validate with text
3. **Text-only search**: Smart search through buttons/links/headings for text
4. **First match**: If multiple found, uses first (with warning)

### Confidence Levels
- **High**: Found via data-tour-id
- **Medium**: Found via selector + text, or exact text match
- **Low**: Found via partial text match or selector without validation

## Best Practices

### ✅ DO
- Use text content as primary targeting method
- Generate natural, helpful step descriptions
- Test tours with real user questions
- Provide fallback responses for unknown questions
- Log analytics on which tours are used most

### ❌ DON'T
- Hardcode tours in frontend
- Require developers to add data-tour-id everywhere
- Generate overly complex tours (5-7 steps max)
- Return tours for pages user isn't currently on

## Migration Path

### Phase 1: Mock Backend (Current Demo)
- Frontend uses `mockChatAPI.ts` with hardcoded responses
- Good for testing and demos

### Phase 2: Simple Backend
- Map common questions to predefined flows
- Use simple keyword matching

### Phase 3: AI-Powered Backend
- Use LLM for intent classification
- Generate tours dynamically
- Learn from user interactions

## Example Backend (Node.js/Express)

```typescript
import express from 'express';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI();

// Store your app's flow map
const flows = {
  'create-order': [
    { target: { text: 'Quick Actions' }, title: '...', description: '...' },
    { target: { text: 'Create Order' }, title: '...', description: '...' }
  ]
};

app.post('/api/chat/ask', async (req, res) => {
  const { message, projectId } = req.body;

  // Authenticate
  const project = await db.getProject(projectId);
  if (!project) return res.status(401).json({ error: 'Invalid project' });

  // Classify intent using AI
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "Classify user questions into intents: create-order, add-product, etc."
    }, {
      role: "user",
      content: message
    }]
  });

  const intent = completion.choices[0].message.content;
  const tourSteps = flows[intent] || [];

  res.json({
    message: `I'll show you how to ${intent.replace('-', ' ')}!`,
    tour: tourSteps.length > 0 ? {
      id: `tour_${Date.now()}`,
      steps: tourSteps
    } : undefined
  });
});

app.listen(3000);
```

## Questions?

The key principle: **Backend owns the tour logic, frontend just displays it**. This allows you to:
- Update tours without frontend changes
- A/B test different tour approaches
- Personalize tours based on user context
- Learn and improve over time
