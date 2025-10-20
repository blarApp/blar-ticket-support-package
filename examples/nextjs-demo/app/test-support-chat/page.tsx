'use client';

import { SupportChatButton } from '@blario/nextjs';
import { useBlarioContext } from '@blario/nextjs';

export default function TestSupportChat() {
  const { openSupportChat } = useBlarioContext();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Support Chat</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Floating Button (Default)</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              The default floating button appears in the bottom-right corner. Click it to open the support chat.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm">
                ℹ️ Look for the chat button in the bottom-right corner of the screen!
              </p>
            </div>
            <SupportChatButton />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Inline Button</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You can also use an inline button within your content.
            </p>
            <SupportChatButton variant="inline">
              Chat with Support
            </SupportChatButton>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Custom Styled Buttons</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Customize button styles with Tailwind classes.
            </p>
            <div className="flex flex-wrap gap-4">
              <SupportChatButton
                variant="inline"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                💬 Get Help
              </SupportChatButton>

              <SupportChatButton
                variant="inline"
                buttonVariant="outline"
                className="border-2 border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Ask a Question
              </SupportChatButton>

              <SupportChatButton
                variant="inline"
                buttonVariant="destructive"
              >
                Report Problem
              </SupportChatButton>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Programmatic Control</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Open the chat programmatically using the hook.
            </p>
            <button
              onClick={() => openSupportChat()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
            >
              Open Support Chat (Hook)
            </button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Different Positions (Props Only)</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You can configure the floating button position using the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">position</code> prop.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Available positions: <code className="bg-white dark:bg-gray-800 px-1 rounded">bottom-right</code>, <code className="bg-white dark:bg-gray-800 px-1 rounded">bottom-left</code>, <code className="bg-white dark:bg-gray-800 px-1 rounded">top-right</code>, <code className="bg-white dark:bg-gray-800 px-1 rounded">top-left</code>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Note: Only render ONE SupportChatButton per page to avoid multiple WebSocket connections.
              </p>
            </div>
          </section>

          <section className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Support Chat Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Real-time WebSocket Connection</strong> - Direct connection to support backend</li>
              <li><strong>Streaming AI Responses</strong> - See answers appear in real-time as the AI generates them</li>
              <li><strong>Typing Indicators</strong> - Know when the support agent is composing a response</li>
              <li><strong>Optimistic UI Updates</strong> - Your messages appear instantly, no waiting for server confirmation</li>
              <li><strong>Auto-Reconnect</strong> - Automatically reconnects if connection drops</li>
              <li><strong>Message Persistence</strong> - Chat history saved locally, continue conversations later</li>
              <li><strong>File Attachments</strong> - Send images and files to help explain issues</li>
              <li><strong>Connection Status Badge</strong> - See your connection state (connected/reconnecting/offline)</li>
              <li><strong>Dark Mode Support</strong> - Automatically adapts to your theme preference</li>
            </ul>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">1. WebSocket Connection</h3>
                <p className="text-sm">
                  Connects to <code className="bg-white dark:bg-gray-800 px-1 rounded">ws://api.blar.io/ws/support/chat/&lt;room_id&gt;</code> with your publishable key
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">2. Chat Room Creation</h3>
                <p className="text-sm">
                  A unique chat room ID (UUID) is automatically generated for your session
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">3. AI Agent Initialization</h3>
                <p className="text-sm">
                  Backend initializes AI agent with access to your frontend repositories for context-aware support
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">4. Streaming Responses</h3>
                <p className="text-sm">
                  Messages stream in chunks (<code className="bg-white dark:bg-gray-800 px-1 rounded">agent_message_chunk</code>) for real-time display
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">5. Message Flow</h3>
                <p className="text-sm">
                  Send message → Optimistic UI → Echo acknowledgment → Typing indicator → Streaming chunks → Complete message
                </p>
              </div>
            </div>
          </section>

          <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Click any support chat button to open the modal</li>
              <li>Wait for the "Connected" badge to appear (green with Wi-Fi icon)</li>
              <li>Type a message and press Enter or click Send</li>
              <li>Watch your message appear instantly (optimistic update)</li>
              <li>See the "Support agent is typing..." indicator</li>
              <li>Watch the AI response stream in real-time</li>
              <li>Try sending multiple messages in a row</li>
              <li>Try attaching a file (click the paperclip icon)</li>
              <li>Close and reopen the chat to see message persistence</li>
              <li>Test the connection status by disconnecting your network</li>
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
