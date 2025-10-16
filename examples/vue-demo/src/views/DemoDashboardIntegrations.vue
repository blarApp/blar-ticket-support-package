<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <router-link
              to="/demo-dashboard"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft class="h-5 w-5" />
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Integrations
            </h1>
          </div>

          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Browse Integrations
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Connected Apps</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {{ integrations.filter(i => i.connected).length }}
          </div>
        </div>
        <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Apps</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {{ integrations.filter(i => !i.connected).length }}
          </div>
        </div>
        <div class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Categories</div>
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">5</div>
        </div>
      </div>

      <!-- Connected Integrations -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Connected Integrations
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="integration in integrations.filter(i => i.connected)"
            :key="integration.id"
            class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div :class="['p-3 rounded-lg', integration.color]">
                <component :is="integration.icon" class="h-6 w-6 text-white" />
              </div>
              <span class="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <Check class="h-4 w-4" />
                Connected
              </span>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {{ integration.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ integration.description }}
            </p>
            <button class="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium flex items-center gap-1">
              <Settings class="h-4 w-4" />
              Configure
            </button>
          </div>
        </div>
      </div>

      <!-- Available Integrations -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Available Integrations
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="integration in integrations.filter(i => !i.connected)"
            :key="integration.id"
            class="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div :class="['p-3 rounded-lg', integration.color]">
                <component :is="integration.icon" class="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {{ integration.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ integration.description }}
            </p>
            <button
              @click="handleConnect(integration)"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Connection Modal -->
    <div
      v-if="showModal && selectedIntegration"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-4 mb-6">
          <div :class="['p-3 rounded-lg', selectedIntegration.color]">
            <component :is="selectedIntegration.icon" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connect {{ selectedIntegration.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedIntegration.description }}
            </p>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="text"
              placeholder="Enter your API key"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workspace URL
            </label>
            <input
              type="text"
              placeholder="https://your-workspace.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="sync-data"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="sync-data" class="text-sm text-gray-700 dark:text-gray-300">
              Automatically sync data every hour
            </label>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmConnect"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Integration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ArrowLeft,
  Plus,
  Check,
  Zap,
  Mail,
  MessageSquare,
  CreditCard,
  BarChart,
  Package,
  Settings
} from 'lucide-vue-next';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  connected: boolean;
  category: 'analytics' | 'payment' | 'shipping' | 'marketing' | 'communication';
}

const integrations = ref<Integration[]>([
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

const showModal = ref(false);
const selectedIntegration = ref<Integration | null>(null);

const handleConnect = (integration: Integration) => {
  selectedIntegration.value = integration;
  showModal.value = true;
};

const confirmConnect = () => {
  if (selectedIntegration.value) {
    const index = integrations.value.findIndex(i => i.id === selectedIntegration.value!.id);
    if (index !== -1) {
      integrations.value[index].connected = true;
    }
  }
  showModal.value = false;
  selectedIntegration.value = null;
};
</script>
