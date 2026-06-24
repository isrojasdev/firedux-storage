import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import {
  registerSchemas,
  getSchema,
  clearRegistry,
} from "../schemas/schemaRegistry.js";

describe("schemaRegistry", () => {
  beforeEach(() => clearRegistry());

  it("returns undefined for an unregistered collection", () => {
    expect(getSchema("todos")).toBeUndefined();
  });

  it("registers and retrieves a schema by collection name", () => {
    const schema = z.object({ title: z.string() });
    registerSchemas({ todos: schema });
    expect(getSchema("todos")).toBe(schema);
  });

  it("registers multiple schemas in one call", () => {
    const todosSchema = z.object({ title: z.string() });
    const usersSchema = z.object({ name: z.string() });
    registerSchemas({ todos: todosSchema, users: usersSchema });
    expect(getSchema("todos")).toBe(todosSchema);
    expect(getSchema("users")).toBe(usersSchema);
  });

  it("clearRegistry removes all registered schemas", () => {
    registerSchemas({ todos: z.object({ title: z.string() }) });
    clearRegistry();
    expect(getSchema("todos")).toBeUndefined();
  });

  it("overrides an existing schema when re-registered", () => {
    const schema1 = z.object({ title: z.string() });
    const schema2 = z.object({ title: z.string().min(5) });
    registerSchemas({ todos: schema1 });
    registerSchemas({ todos: schema2 });
    expect(getSchema("todos")).toBe(schema2);
  });

  it("does not affect other collections when one is overridden", () => {
    const todosSchema = z.object({ title: z.string() });
    const usersSchema = z.object({ name: z.string() });
    registerSchemas({ todos: todosSchema, users: usersSchema });
    registerSchemas({ todos: z.object({ title: z.string().min(1) }) });
    expect(getSchema("users")).toBe(usersSchema);
  });
});
