import { backlogSchema } from "./backlogSchema";
import { sprintSchema } from "./sprintSchema";
import { taskSchema } from "./taskSchema";

export const validationSchemas: Record<string, any> = {
  sprint: sprintSchema,
  backlog: backlogSchema,
  task: taskSchema
}
