<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-overline mb-1">{{ stat.title }}</div>
            <div class="text-h4 mb-1">{{ stat.value }}</div>
            <v-progress-linear
              :model-value="stat.progress"
              :color="stat.color"
              height="4"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Recent Activity</v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="activity in activities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div>
                  <strong>{{ activity.title }}</strong>
                  <div class="text-caption">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              block
              class="mb-2"
              prepend-icon="mdi-bug"
              @click="reportIssueQuick"
            >
              Report Issue
            </v-btn>
            <v-btn
              color="secondary"
              block
              class="mb-2"
              prepend-icon="mdi-comment-question"
              @click="giveFeedback"
            >
              Give Feedback
            </v-btn>
            <v-btn
              color="info"
              block
              prepend-icon="mdi-help-circle"
              @click="getHelp"
            >
              Get Help
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Issue Reporter Stats</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span>Issues Reported:</span>
              <strong>{{ issueStats.reported }}</strong>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Resolved:</span>
              <strong class="text-success">{{ issueStats.resolved }}</strong>
            </div>
            <div class="d-flex justify-space-between">
              <span>Pending:</span>
              <strong class="text-warning">{{ issueStats.pending }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBlario } from '@blario/vue';

const { openReporter } = useBlario();

const stats = ref([
  { title: 'Total Users', value: '1,234', progress: 75, color: 'primary' },
  { title: 'Active Sessions', value: '567', progress: 60, color: 'success' },
  { title: 'Issues Reported', value: '42', progress: 40, color: 'warning' },
  { title: 'Uptime', value: '99.9%', progress: 99, color: 'info' },
]);

const activities = ref([
  { id: 1, title: 'User registered', time: '2 minutes ago', color: 'success' },
  { id: 2, title: 'Issue reported', time: '5 minutes ago', color: 'warning' },
  { id: 3, title: 'Bug fixed', time: '1 hour ago', color: 'info' },
  { id: 4, title: 'Feature deployed', time: '2 hours ago', color: 'primary' },
  { id: 5, title: 'Maintenance completed', time: '3 hours ago', color: 'success' },
]);

const issueStats = ref({
  reported: 42,
  resolved: 35,
  pending: 7,
});

const reportIssueQuick = () => {
  openReporter({
    category: 'quick-action',
    prefill: {
      summary: 'Quick report from dashboard',
    },
  });
};

const giveFeedback = () => {
  openReporter({
    category: 'feedback',
    prefill: {
      summary: 'User feedback',
      severity: 'low',
    },
  });
};

const getHelp = () => {
  openReporter({
    category: 'help',
    prefill: {
      summary: 'Help request',
    },
  });
};
</script>
