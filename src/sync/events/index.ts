// import { Filter } from "@ethersproject/abstract-provider";
import _, { forInRight } from "lodash";
import pLimit from "p-limit";

// import { logger } from "@/common/logger";
// import { getNetworkSettings } from "@/config/network";
// import { baseProvider } from "@/common/provider";
// import { EventKind, getEventData } from "@/events-sync/data";
// import { EventsBatch, EventsByKind } from "@/events-sync/handlers";
// import { EnhancedEvent } from "@/events-sync/handlers/utils";
// import { parseEvent } from "@/events-sync/parser";
// import * as es from "@/events-sync/storage";
import * as syncEventsUtils from "@/events-sync/utils";
import * as blocksModel from "@/models/blocks";

// // import * as removeUnsyncedEventsActivities from "@/jobs/activities/remove-unsynced-events-activities";
// import * as blockCheck from "@/jobs/events-sync/block-check-queue";
// import * as eventsSyncBackfillProcess from "@/jobs/events-sync/process/backfill";
// import * as eventsSyncRealtimeProcess from "@/jobs/events-sync/process/realtime";
// import { BlocksToCheck } from "@/jobs/events-sync/block-check-queue";

export const syncEvents = async (
  fromBlock: number,
  toBlock: number,
  options?: {
    // When backfilling, certain processes will be disabled
    backfill?: boolean;
    syncDetails:
      | {
          method: "events";
          events: string[];
        }
      | {
          method: "address";
          address: string;
        };
  }
) => {

  // Cache the blocks for efficiency
  const blocksCache = new Map<number, blocksModel.Block>();
  // Keep track of all handled `${block}-${blockHash}` pairs
  const blocksSet = new Set<string>();

  const backfill = Boolean(options?.backfill);

  // If the block range we're trying to sync is small enough, then fetch everything
  // related to every of those blocks a priori for efficiency. Otherwise, it can be
  // too inefficient to do it and in this case we just proceed (and let any further
  // processes fetch those blocks as needed / if needed).
  if (!backfill && toBlock - fromBlock + 1 <= 32) {
    const limit = pLimit(32);
    await Promise.all(
      _.range(fromBlock, toBlock + 1).map((block) => limit(() => syncEventsUtils.fetchBlock(block)))
    );
  }

  // // Generate the events filter with one of the following options:
  // // - fetch all events
  // // - fetch a subset of events
  // // - fetch all events from a particular address

  // // By default, we want to get all events
  // let eventFilter: Filter = {
  //   topics: [[...new Set(getEventData().map(({ topic }) => topic))]],
  //   fromBlock,
  //   toBlock,
  // };
  // if (options?.syncDetails?.method === "events") {
  //   // Filter to a subset of events
  //   eventFilter = {
  //     // Remove any duplicate topics
  //     topics: [[...new Set(getEventData(options.syncDetails.events).map(({ topic }) => topic))]],
  //     fromBlock,
  //     toBlock,
  //   };
  // } else if (options?.syncDetails?.method === "address") {
  //   // Filter to all events of a particular address
  //   eventFilter = {
  //     address: options.syncDetails.address,
  //     fromBlock,
  //     toBlock,
  //   };
  // }

  // const enhancedEvents: EnhancedEvent[] = [];
  // await baseProvider.getLogs(eventFilter).then(async (logs) => {
  //   const availableEventData = getEventData();

  //   for (const log of logs) {
  //     try {
  //       const baseEventParams = await parseEvent(log, blocksCache);

  //       // Cache the block data
  //       if (!blocksCache.has(baseEventParams.block)) {
  //         // It's very important from a performance perspective to have
  //         // the block data available before proceeding with the events
  //         // (otherwise we might have to perform too many db reads)
  //         blocksCache.set(
  //           baseEventParams.block,
  //           await blocksModel.saveBlock({
  //             number: baseEventParams.block,
  //             hash: baseEventParams.blockHash,
  //             timestamp: baseEventParams.timestamp,
  //           })
  //         );
  //       }

  //       // Keep track of the block
  //       blocksSet.add(`${log.blockNumber}-${log.blockHash}`);

  //       // Find first matching event:
  //       // - matching topic
  //       // - matching number of topics (eg. indexed fields)
  //       // - matching address
  //       const eventData = availableEventData.find(
  //         ({ addresses, numTopics, topic }) =>
  //           log.topics[0] === topic &&
  //           log.topics.length === numTopics &&
  //           (addresses ? addresses[log.address.toLowerCase()] : true)
  //       );
  //       if (eventData) {
  //         enhancedEvents.push({
  //           kind: eventData.kind,
  //           subKind: eventData.subKind,
  //           baseEventParams,
  //           log,
  //         });
  //       }
  //     } catch (error) {
  //       logger.info("sync-events", `Failed to handle events: ${error}`);
  //       throw error;
  //     }
  //   }

  //   // Process the retrieved events asynchronously
  //   const eventsBatches = await extractEventsBatches(enhancedEvents, backfill);
  //   const eventsSyncProcess = backfill ? eventsSyncBackfillProcess : eventsSyncRealtimeProcess;
  //   await eventsSyncProcess.addToQueue(eventsBatches);

  //   // Make sure to recheck the ingested blocks with a delay in order to undo any reorgs
  //   const ns = getNetworkSettings();
  //   if (!backfill && ns.enableReorgCheck) {
  //     for (const blockData of blocksSet.values()) {
  //       const block = Number(blockData.split("-")[0]);
  //       const blockHash = blockData.split("-")[1];

  //       // Act right away if the current block is a duplicate
  //       if ((await blocksModel.getBlocks(block)).length > 1) {
  //         await blockCheck.addToQueue(block, blockHash, 10);
  //         await blockCheck.addToQueue(block, blockHash, 30);
  //       }
  //     }

  //     const blocksToCheck: BlocksToCheck[] = [];

  //     // Put all fetched blocks on a delayed queue
  //     [...blocksSet.values()].map(async (blockData) => {
  //       const block = Number(blockData.split("-")[0]);
  //       const blockHash = blockData.split("-")[1];

  //       ns.reorgCheckFrequency.map((frequency) =>
  //         blocksToCheck.push({
  //           block,
  //           blockHash,
  //           delay: frequency * 60,
  //         })
  //       );
  //     });

  //     await blockCheck.addBulk(blocksToCheck);
  //   }
  // });
};
