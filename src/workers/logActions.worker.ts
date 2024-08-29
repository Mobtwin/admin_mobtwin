import { updateLogsAndActionsQueue } from "../config/queue.config";
import redisClient from "../utils/redis";
import { Job, Worker } from "bullmq";
import { v4 as uuidv4 } from "uuid";
import { logEvents } from "../middlewares/logger";
import { createActionLog } from "../services/actionLogs.service";
import { PerformedBy } from "../models/actionLog.schema";
import { Schema } from "mongoose";

export const LOG_ACTIONS_JOBS_NAMES = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ASSIGN: "ASSIGN",
  UNASSIGN: "UNASSIGN",
  STATUS: "STATUS",
};

export interface UpdateLogsAndActionsJobData {
  adminId:string,
  action:string,
  message:string,
  itemId?:string,
  table:string,
}

const updateLogsAndActionsWorker = new Worker(
  updateLogsAndActionsQueue.name,
  async (job: Job) => {
    try {
      const { adminId, action, message,itemId,table } = job.data as UpdateLogsAndActionsJobData;
      // TODO: Add logic to update action table and action logs
      await createActionLog({adminId:new Schema.ObjectId(adminId),performedBy:PerformedBy.ADMIN,actionType:action,table,itemId:itemId ? new Schema.ObjectId(itemId) : undefined,description:message})
      await logEvents(message, "actions.log");
      await job.moveToCompleted("success", job.token || "");
    } catch (error: any) {
      console.error(`Job ${job.id} failed: ${error.message}`);
      await job.moveToFailed(
        { message: error.message, name: error.name || "unknown error" },
        job.token || ""
      ); // Mark job as failed
      throw new Error(error.message);
    }
  },
  {
    connection: redisClient,
    concurrency: 10,
    limiter: { max: 1000, duration: 1200 },
    lockDuration: 1200,
    maxStalledCount: 1,
  }
);
updateLogsAndActionsWorker.on("completed", async (job) => {
  job.updateProgress(100);
  await logEvents(`Job ${job.name} with the id : ${job.id} completed successfully`, "jobSuccess.logs");
});

updateLogsAndActionsWorker.on("failed", async(job, err) => {
  await logEvents(`Job ${job?.name} with the id : ${job?.id} failed with the error: ${err.message}\nError Object: \t ${JSON.stringify(err)}`, "jobFailed.logs");
});
// Listen for error events from the worker
updateLogsAndActionsWorker.on('error', async(error) => {
    if (error.message.includes('Missing lock for job')) {
      return ;
    } else {
      await logEvents(`Job failed with the error: ${error.message}\nError Object: \t ${JSON.stringify(error)}`, "jobFailed.logs");
    }
  });

export default async function addLogActionsJob(
  jobName: string,
  data: UpdateLogsAndActionsJobData
): Promise<Job | undefined> {
  try {
    const job = await updateLogsAndActionsQueue.add(jobName, data, { jobId: uuidv4() });
    return job;
  } catch (error: any) {
    if (error.message !== "Job already exists") {
      await logEvents(`job with the data ${JSON.stringify(data)} thrown error ${error.message}\nError Object: \t ${JSON.stringify(error)}`, "jobFailed.logs");
      throw error;
    }
  }
}
