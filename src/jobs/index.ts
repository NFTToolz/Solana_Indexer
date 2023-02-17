// WARNING! For ease of accounting, make sure to keep the below lists sorted!

// Initialize all background job queues and crons
import "@/jobs/events-sync";

import * as eventsSyncRealtime from "@/jobs/events-sync/realtime-queue";

export const gracefulShutdownJobWorkers = [];

export const allJobQueues = [
   eventsSyncRealtime.queue
];
