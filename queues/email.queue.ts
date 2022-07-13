import Bull from "bull";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

import sendConfirmationEmail from "../processes/confirmationEmail.process";
import addToGroups from "../processes/groups.process";
import addToSpreadsheet from "../processes/spreadsheet.process";

const queue = new Bull("/email", "redis://127.0.0.1:6379");

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullAdapter(queue)],
  serverAdapter
});

const createJob = (name: string, data: any) => {
  queue.add(name, data, {
    attempts: 2
  });
};

const GROUPS_PROCESS_NAME = "Add to Google Groups";
const SPREADSHEET_PROCESS_NAME = "Add to Google Spreadsheet";
const CONFIRMATION_EMAIL_PROCESS_NAME = "Send Confirmation Email";

queue.process(GROUPS_PROCESS_NAME, (job: any) => addToGroups(job));
queue.process(SPREADSHEET_PROCESS_NAME, (job: any) => addToSpreadsheet(job));
queue.process(CONFIRMATION_EMAIL_PROCESS_NAME, (job: any) =>
  sendConfirmationEmail(job)
);

const addNewEmail = async (email: string, firstName: string) => {
  const data = {
    email,
    firstName
  };
  createJob(GROUPS_PROCESS_NAME, data);
  createJob(SPREADSHEET_PROCESS_NAME, data);
  createJob(CONFIRMATION_EMAIL_PROCESS_NAME, data);
};

export { addNewEmail, serverAdapter };
