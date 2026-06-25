import type { z } from "zod";
import type { todoSchema } from "../config/schemas";

export type TodoInput = z.infer<typeof todoSchema>;
export type Todo = TodoInput & { id: string };
