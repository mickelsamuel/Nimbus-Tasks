import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { organizationRouter } from "./routers/organization";
import { projectRouter } from "./routers/project";
import { taskRouter } from "./routers/task";
import { tagRouter } from "./routers/tag";
import { commentRouter } from "./routers/comment";
import { attachmentRouter } from "./routers/attachment";
import { realtimeRouter } from "./routers/realtime";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organization: organizationRouter,
  project: projectRouter,
  task: taskRouter,
  tag: tagRouter,
  comment: commentRouter,
  attachment: attachmentRouter,
  realtime: realtimeRouter,
});

export type AppRouter = typeof appRouter;