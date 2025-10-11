'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Check,
  Zap,
  Mail,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  BarChart,
  Package,
  Settings
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  connected: boolean;
  category: 'analytics' | 'payment' | 'shipping' | 'marketing' | 'communication';
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments and manage subscriptions',
      icon: CreditCard,
      color: 'bg-purple-500',
      connected: true,
      category: 'payment',
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      icon: BarChart,
      color: 'bg-orange-500',
      connected: true,
      category: 'analytics',
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation platform',
      icon: Mail,
      color: 'bg-yellow-500',
      connected: false,
      category: 'marketing',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: MessageSquare,
      color: 'bg-pink-500',
      connected: false,
      category: 'communication',
    },
    {
      id: 'shipstation',
      name: 'ShipStation',
      description: 'Shipping and fulfillment management',
      icon: Package,
      color: 'bg-blue-500',
      connected: false,
      category: 'shipping',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps and automate workflows',
      icon: Zap,
      color: 'bg-indigo-500',
      connected: false,
      category: 'analytics',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/demo-dashboard"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Integrations
              </h1>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Browse Integrations
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Connected Apps</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {integrations.filter(i => i.connected).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Apps</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {integrations.filter(i => !i.connected).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Categories</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">5</div>
          </div>
        </div>

        {/* Connected Integrations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Connected Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.filter(i => i.connected).map(integration => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${integration.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      Connected
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {integration.description}
                  </p>
                  <button className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Integrations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Available Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.filter(i => !i.connected).map(integration => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${integration.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {integration.description}
                  </p>
                  <button
                    onClick={() => handleConnect(integration)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Connect
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Connection Modal */}
      {showModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-lg ${selectedIntegration.color}`}>
                {(() => {
                  const Icon = selectedIntegration.icon;
                  return <Icon className="h-6 w-6 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Connect {selectedIntegration.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedIntegration.description}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workspace URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-workspace.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sync-data"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sync-data" className="text-sm text-gray-700 dark:text-gray-300">
                  Automatically sync data every hour
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIntegrations(prev =>
                    prev.map(i =>
                      i.id === selectedIntegration.id ? { ...i, connected: true } : i
                    )
                  );
                  setShowModal(false);
                  setSelectedIntegration(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
