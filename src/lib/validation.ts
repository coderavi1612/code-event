import { z } from "zod";

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Team name is required" })
  .max(50, { message: "Team name must be less than 50 characters" })
  .regex(/^[a-zA-Z0-9\s\-_]+$/, {
    message: "Team name can only contain letters, numbers, spaces, hyphens, and underscores",
  });

export type TeamNameInput = z.infer<typeof teamNameSchema>;
