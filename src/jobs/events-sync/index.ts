import cron from "node-cron";

import { logger } from "@/common/logger";
// import { safeWebSocketSubscription } from "@/common/provider";
import { redlock } from "@/common/redis";
import { config } from "@/config/index";
import { getNetworkSettings } from "@/config/network";
import * as realtimeEventsSync from "@/jobs/events-sync/realtime-queue";

import "@/jobs/events-sync/realtime-queue";

// BACKGROUND WORKER ONLY
if (config.doBackgroundWork && config.catchup) {
    const networkSettings = getNetworkSettings();
  
    // Keep up with the head of the blockchain by polling for new blocks every once in a while
    cron.schedule(
      `*/${networkSettings.realtimeSyncFrequencySeconds} * * * * *`,
      async () => {
            await redlock
            .acquire(
                ["events-sync-catchup-lock"],
                (networkSettings.realtimeSyncFrequencySeconds - 1) * 1000
            )
            .then(async () => {
                try {
                await realtimeEventsSync.addToQueue();
                logger.info("events-sync-catchup", "Catching up events");
                } catch (error) {
                logger.error("events-sync-catchup", `Failed to catch up events: ${error}`);
                }
            })
            .catch(() => {
                // Skip on any errors
            })
        }
    );
  }
  