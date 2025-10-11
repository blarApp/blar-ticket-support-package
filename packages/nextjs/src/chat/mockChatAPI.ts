import type { ChatAssistantResponse } from '../tour/types';

/**
 * Mock chat API that simulates backend responses with dynamically generated tour data.
 *
 * IN PRODUCTION:
 * The backend receives the user's question and dynamically generates a list of steps
 * based on AI/LLM analysis of the question and the current app's DOM/structure.
 *
 * The backend is responsible for:
 * 1. Understanding the user's intent
 * 2. Analyzing the app's structure (could crawl DOM, use existing knowledge)
 * 3. Generating a list of elements to highlight (using text, selectors, etc.)
 * 4. Returning the tour steps with descriptions
 *
 * The frontend (this SDK) just:
 * 1. Sends the user's question to the backend
 * 2. Receives the tour steps
 * 3. Displays the tour using the element finder
 */
export async function mockChatAPI(userMessage: string): Promise<ChatAssistantResponse> {
  // Simulate network delay (backend processing time)
  await new Promise(resolve => setTimeout(resolve, 1000));

  const messageLower = userMessage.toLowerCase();

  // ========================================
  // MOCK BACKEND LOGIC (Replace with real API call)
  // ========================================
  // In production, this would be:
  // const response = await fetch('/api/chat/ask', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     message: userMessage,
  //     projectId: 'your-project-id',
  //     currentUrl: window.location.href
  //   }),
  // });
  // return response.json();
  // ========================================

  // Pattern matching for different questions
  if (
    messageLower.includes('report') &&
    (messageLower.includes('issue') || messageLower.includes('bug') || messageLower.includes('problem'))
  ) {
    return {
      message: "I'll show you how to report an issue in 3 easy steps. Click 'Start Tour' below to begin!",
      tour: {
        id: 'report-issue-tour',
        steps: [
          {
            target: {
              tourId: 'issue-reporter-button',
              selector: 'button[class*="floating"]',
              text: 'Report Issue',
            },
            title: 'Step 1: Open Issue Reporter',
            description: 'Click the floating button in the bottom-right corner to open the issue reporter.',
            position: 'left',
          },
          {
            target: {
              tourId: 'issue-description-input',
              selector: 'textarea[name="description"]',
            },
            title: 'Step 2: Describe Your Issue',
            description: 'Fill in the description field with details about your issue or bug.',
            position: 'top',
          },
          {
            target: {
              tourId: 'issue-submit-button',
              selector: 'button[type="submit"]',
              text: 'Submit',
            },
            title: 'Step 3: Submit Report',
            description: 'Click the Submit button to send your issue report to our team.',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('navigate') || messageLower.includes('explore') || messageLower.includes('app')) {
    return {
      message: "Let me give you a complete tour of the app! I'll show you all the main features in 6 steps.",
      tour: {
        id: 'full-app-tour',
        steps: [
          {
            target: {
              selector: 'h1',
              text: 'Blario Next.js Demo',
            },
            title: 'Welcome to Blario',
            description: 'This is the main demo application showcasing all Blario features. Let me show you around!',
            position: 'bottom',
          },
          {
            target: {
              selector: 'a[href="/test-modal"]',
              text: 'Test Modal',
            },
            title: 'Test Modal',
            description: 'This section lets you test the issue reporter modal with different configurations.',
            position: 'bottom',
          },
          {
            target: {
              selector: 'a[href="/test-hook"]',
              text: 'Test Hook',
            },
            title: 'Test Hook',
            description: 'Here you can test programmatic issue reporting using the useBlario hook.',
            position: 'bottom',
          },
          {
            target: {
              selector: 'a[href="/test-error"]',
              text: 'Test Error Boundary',
            },
            title: 'Error Boundary',
            description: 'This page demonstrates error boundary integration and automatic error reporting.',
            position: 'bottom',
          },
          {
            target: {
              selector: 'a[href="/test-styles"]',
              text: 'Test Styles',
            },
            title: 'Test Styles',
            description: 'Explore different button styles and positions for the issue reporter.',
            position: 'bottom',
          },
          {
            target: {
              tourId: 'issue-reporter-button',
              selector: 'button[data-tour-id="issue-reporter-button"]',
            },
            title: 'Report Issue Button',
            description: 'Click this floating button anytime to report an issue or bug you encounter.',
            position: 'left',
          },
        ],
      },
    };
  }

  if (messageLower.includes('feature') || messageLower.includes('what can')) {
    return {
      message: "Here are the key features you can explore:",
      tour: {
        id: 'features-tour',
        steps: [
          {
            target: {
              tourId: 'issue-reporter-button',
              selector: 'button[data-tour-id="issue-reporter-button"]',
            },
            title: 'Issue Reporting',
            description: 'Report bugs, issues, or feature requests with automatic context capture (console logs, network requests, etc.)',
            position: 'left',
          },
          {
            target: {
              selector: '.blario-wrapper',
            },
            title: 'Theme Support',
            description: 'Full dark mode support that automatically adapts to your app\'s theme.',
            position: 'center',
          },
          {
            target: {
              selector: 'a[href="/test-error"]',
              text: 'Test Error Boundary',
            },
            title: 'Error Boundaries',
            description: 'Automatic error catching and reporting with custom error boundaries.',
            position: 'bottom',
          },
        ],
      },
    };
  }

  // Dashboard-specific tours
  if (messageLower.includes('dashboard') || messageLower.includes('stats') || messageLower.includes('metrics')) {
    return {
      message: "Let me show you around the dashboard! I'll highlight key metrics and features in 7 steps.",
      tour: {
        id: 'dashboard-tour',
        steps: [
          {
            target: {
              text: 'ShopDash',
            },
            title: 'Welcome to ShopDash',
            description: 'Your e-commerce analytics dashboard. Track sales, orders, and customer data in real-time.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Total Revenue',
            },
            title: 'Total Revenue',
            description: 'Monitor your total revenue with month-over-month growth tracking. This card shows $45,231 in revenue with a 12.5% increase.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Orders',
            },
            title: 'Order Tracking',
            description: 'View your total order count and growth trends. Currently showing 1,234 orders with 8.2% growth.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Products',
            },
            title: 'Product Inventory',
            description: 'Keep track of your product catalog. Shows total products (567) and stock alerts (23 out of stock).',
            position: 'bottom',
          },
          {
            target: {
              text: 'Customers',
            },
            title: 'Customer Base',
            description: 'Monitor your growing customer base. Currently at 8,492 customers with 18.3% growth.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Recent Orders',
            },
            title: 'Recent Orders',
            description: 'View and manage your latest orders with status tracking and quick actions.',
            position: 'top',
          },
          {
            target: {
              text: 'Quick Actions',
            },
            title: 'Quick Actions',
            description: 'Access common tasks quickly: add products, create orders, or manage customers.',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('order') && (messageLower.includes('create') || messageLower.includes('make') || messageLower.includes('new'))) {
    return {
      message: "I'll guide you through creating a new order in 3 simple steps!",
      tour: {
        id: 'create-order-tour',
        steps: [
          {
            target: {
              text: 'Quick Actions',
            },
            title: 'Navigate to Quick Actions',
            description: 'Scroll down to the Quick Actions section at the bottom of the dashboard.',
            position: 'top',
          },
          {
            target: {
              text: 'Create Order',
            },
            title: 'Create Order Button',
            description: 'Click this card to manually create a new order for a customer.',
            position: 'top',
          },
          {
            target: {
              text: 'Recent Orders',
            },
            title: 'View Your Orders',
            description: 'After creating an order, it will appear here in the recent orders table.',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('product') && (messageLower.includes('add') || messageLower.includes('new') || messageLower.includes('create'))) {
    return {
      message: "Here's how to add a new product to your catalog:",
      tour: {
        id: 'add-product-tour',
        steps: [
          {
            target: {
              text: 'Products',
            },
            title: 'Products Overview',
            description: 'This shows your current product count and inventory status.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Add New Product',
            },
            title: 'Add New Product',
            description: 'Click here to create a new product listing in your catalog.',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('notification')) {
    return {
      message: "Let me show you the notification system:",
      tour: {
        id: 'notifications-tour',
        steps: [
          {
            target: {
              selector: 'button:has(svg.lucide-bell)',
            },
            title: 'Notifications',
            description: 'Click the bell icon to view your notifications. You currently have 3 unread notifications.',
            position: 'bottom',
          },
          {
            target: {
              selector: 'button:has(svg.lucide-settings)',
            },
            title: 'Settings',
            description: 'Access your dashboard settings and preferences here.',
            position: 'bottom',
          },
        ],
      },
    };
  }

  // Integration-specific tours
  if (messageLower.includes('integrate') || messageLower.includes('integration') || messageLower.includes('connect app')) {
    return {
      message: "I'll walk you through connecting a new app integration in 8 easy steps! This works for any third-party service.",
      tour: {
        id: 'integration-walkthrough',
        steps: [
          {
            target: {
              text: 'Integrations',
            },
            title: 'Step 1: Navigate to Integrations',
            description: 'Click on the "Integrations" link in the navigation menu to access the integrations page.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Available Integrations',
            },
            title: 'Step 2: Browse Available Apps',
            description: 'Scroll down to see all available integrations. You can connect with popular services like Mailchimp, Slack, and more.',
            position: 'top',
          },
          {
            target: {
              text: 'Mailchimp',
            },
            title: 'Step 3: Select an Integration',
            description: 'Let\'s connect Mailchimp for email marketing. You can choose any app that fits your needs.',
            position: 'top',
          },
          {
            target: {
              text: 'Connect',
            },
            title: 'Step 4: Click Connect',
            description: 'Click the "Connect" button on the integration card to start the connection process.',
            position: 'top',
          },
          {
            target: {
              selector: 'input[placeholder="Enter your API key"]',
            },
            title: 'Step 5: Enter API Key',
            description: 'Enter your API key from the third-party service. You can find this in your account settings on their platform.',
            position: 'top',
          },
          {
            target: {
              selector: 'input[placeholder*="workspace"]',
            },
            title: 'Step 6: Add Workspace URL',
            description: 'Provide your workspace or organization URL if required by the integration.',
            position: 'top',
          },
          {
            target: {
              selector: 'input[type="checkbox"]',
            },
            title: 'Step 7: Configure Sync Settings',
            description: 'Choose whether to automatically sync data. This keeps your information up-to-date across both platforms.',
            position: 'left',
          },
          {
            target: {
              text: 'Connect Integration',
            },
            title: 'Step 8: Complete Connection',
            description: 'Click "Connect Integration" to finalize the setup. The app will now appear in your Connected Integrations!',
            position: 'top',
          },
        ],
      },
    };
  }

  if (
    messageLower.includes('mailchimp') ||
    (messageLower.includes('email') && (messageLower.includes('connect') || messageLower.includes('integrate'))) ||
    (messageLower.includes('integrate') && messageLower.includes('mail'))
  ) {
    return {
      message: "I'll show you exactly how to connect Mailchimp for email marketing in 8 easy steps!",
      tour: {
        id: 'mailchimp-integration',
        steps: [
          {
            target: {
              text: 'Integrations',
            },
            title: 'Step 1: Navigate to Integrations',
            description: 'Click on "Integrations" in the navigation menu to access the integrations page.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Available Integrations',
            },
            title: 'Step 2: Find Available Apps',
            description: 'Scroll down to see all available integrations you can connect.',
            position: 'top',
          },
          {
            target: {
              text: 'Mailchimp',
            },
            title: 'Step 3: Locate Mailchimp',
            description: 'Find the Mailchimp card in the Available Integrations section. It has a yellow icon.',
            position: 'top',
          },
          {
            target: {
              text: 'Connect',
            },
            title: 'Step 4: Click Connect',
            description: 'Click the "Connect" button on the Mailchimp card to start the integration process.',
            position: 'top',
          },
          {
            target: {
              selector: 'input[placeholder="Enter your API key"]',
            },
            title: 'Step 5: Enter API Key',
            description: 'Enter your Mailchimp API key. You can find this in your Mailchimp account under Account > Extras > API keys.',
            position: 'top',
          },
          {
            target: {
              selector: 'input[placeholder*="workspace"]',
            },
            title: 'Step 6: Add Workspace URL',
            description: 'Enter your Mailchimp workspace URL (e.g., https://us1.admin.mailchimp.com)',
            position: 'top',
          },
          {
            target: {
              selector: 'input[type="checkbox"]',
            },
            title: 'Step 7: Enable Auto-Sync',
            description: 'Check this box to automatically sync your customer data with Mailchimp every hour.',
            position: 'left',
          },
          {
            target: {
              text: 'Connect Integration',
            },
            title: 'Step 8: Complete Setup',
            description: 'Click "Connect Integration" to finalize. Mailchimp will now sync with your customer data!',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('slack')) {
    return {
      message: "Let me show you how to set up Slack notifications:",
      tour: {
        id: 'slack-integration',
        steps: [
          {
            target: {
              text: 'Integrations',
            },
            title: 'Go to Integrations',
            description: 'Click on Integrations in the navigation menu.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Slack',
            },
            title: 'Find Slack',
            description: 'Locate the Slack integration card in the available integrations section.',
            position: 'top',
          },
          {
            target: {
              text: 'Connect',
            },
            title: 'Connect Slack',
            description: 'Click Connect to integrate Slack and receive real-time notifications in your workspace.',
            position: 'top',
          },
        ],
      },
    };
  }

  if (messageLower.includes('disconnect') || messageLower.includes('remove integration')) {
    return {
      message: "Here's how to manage and disconnect integrations:",
      tour: {
        id: 'manage-integrations',
        steps: [
          {
            target: {
              text: 'Integrations',
            },
            title: 'Open Integrations',
            description: 'Navigate to the Integrations page.',
            position: 'bottom',
          },
          {
            target: {
              text: 'Connected Integrations',
            },
            title: 'View Connected Apps',
            description: 'Here you can see all your currently connected integrations.',
            position: 'top',
          },
          {
            target: {
              text: 'Configure',
            },
            title: 'Configure Integration',
            description: 'Click Configure on any connected integration to modify settings or disconnect it.',
            position: 'top',
          },
        ],
      },
    };
  }

  // Default response for unknown questions
  return {
    message: "I'm here to help! Try asking me:\n\n• How do I report an issue?\n• Show me the dashboard\n• How do I integrate a new app?\n• How do I create an order?\n• How do I connect Mailchimp?",
  };
}

/**
 * In a real implementation, this would be:
 *
 * export async function chatAPI(userMessage: string, projectId: string): Promise<ChatAssistantResponse> {
 *   const response = await fetch('/api/chat/ask', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message: userMessage, projectId }),
 *   });
 *
 *   return response.json();
 * }
 */
