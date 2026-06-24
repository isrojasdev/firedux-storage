import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { registerSchemas, clearRegistry } from "../schemas/schemaRegistry.js";

// Mock all action modules so we only test executeQueries routing logic
vi.mock("../actions/Database.js", () => ({
  getDocumentById: vi.fn(async () => ({ id: "1", title: "Test" })),
  getCollectionData: vi.fn(async () => []),
  addDocument: vi.fn(async () => ({ id: "new" })),
  removeDocument: vi.fn(async () => true),
  updateDocument: vi.fn(async () => true),
}));
vi.mock("../actions/RealTime.js", () => ({
  obtainRealTime: vi.fn(async () => {}),
}));
vi.mock("../actions/auth.js", () => ({
  signInEmail: vi.fn(async () => ({ uid: "u1" })),
  signUpEmail: vi.fn(async () => ({ uid: "u2" })),
  signInGoogle: vi.fn(async () => ({ uid: "u3" })),
  signInFacebook: vi.fn(async () => ({ uid: "u4" })),
  signOutUser: vi.fn(async () => true),
  resetPassword: vi.fn(async () => true),
}));
vi.mock("../actions/Storage.js", () => ({
  uploadFile: vi.fn(async () => "https://example.com/file.jpg"),
  removeFile: vi.fn(async () => true),
}));

import { executeQueries } from "../actions/Queries.js";
import { addDocument, updateDocument, removeDocument } from "../actions/Database.js";
import { signInEmail, signInGoogle } from "../actions/auth.js";
import { uploadFile, removeFile } from "../actions/Storage.js";

describe("executeQueries — routing and validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearRegistry();
  });

  // ── Input validation ─────────────────────────────────────────────────────

  it("returns [] for an empty array", async () => {
    const result = await executeQueries([]);
    expect(result).toEqual([]);
  });

  it("returns [] for a non-array input", async () => {
    const result = await executeQueries("not an array");
    expect(result).toEqual([]);
  });

  it("returns failed status when queryType is missing", async () => {
    const [res] = await executeQueries([{ collectionName: "todos" }]);
    expect(res.status).toBe("failed");
  });

  it("returns failed status when collectionName is missing for a Firestore queryType", async () => {
    const [res] = await executeQueries([{ queryType: "addDocument", documentData: { title: "x" } }]);
    expect(res.status).toBe("failed");
  });

  // ── Firestore routing ────────────────────────────────────────────────────

  it("routes addDocument and returns succeeded", async () => {
    const [res] = await executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title: "Buy milk" } },
    ]);
    expect(addDocument).toHaveBeenCalled();
    expect(res.status).toBe("succeeded");
  });

  it("routes removeDocument and returns succeeded", async () => {
    const [res] = await executeQueries([
      { queryType: "removeDocument", collectionName: "todos", documentId: "abc" },
    ]);
    expect(removeDocument).toHaveBeenCalled();
    expect(res.status).toBe("succeeded");
  });

  // ── Auth routing (no collectionName required) ────────────────────────────

  it("routes signInEmail without collectionName", async () => {
    const [res] = await executeQueries([
      { queryType: "signInEmail", email: "a@b.com", password: "pass123" },
    ]);
    expect(signInEmail).toHaveBeenCalledWith({ email: "a@b.com", password: "pass123" });
    expect(res.status).toBe("succeeded");
  });

  it("routes signInGoogle without collectionName", async () => {
    const [res] = await executeQueries([{ queryType: "signInGoogle" }]);
    expect(signInGoogle).toHaveBeenCalled();
    expect(res.status).toBe("succeeded");
  });

  // ── Storage routing (no collectionName required) ─────────────────────────

  it("routes uploadFile without collectionName", async () => {
    const file = new Blob(["data"]);
    const [res] = await executeQueries([
      { queryType: "uploadFile", file, fileName: "avatar", folder: "users" },
    ]);
    expect(uploadFile).toHaveBeenCalledWith({ file, fileName: "avatar", folder: "users" });
    expect(res.status).toBe("succeeded");
  });

  it("routes deleteFile without collectionName", async () => {
    const [res] = await executeQueries([
      { queryType: "deleteFile", fileUrl: "https://example.com/file.jpg" },
    ]);
    expect(removeFile).toHaveBeenCalledWith({ fileUrl: "https://example.com/file.jpg" });
    expect(res.status).toBe("succeeded");
  });

  // ── Zod validation ───────────────────────────────────────────────────────

  it("throws a validation error for addDocument when schema fails", async () => {
    registerSchemas({ todos: z.object({ title: z.string().min(1) }) });
    const [res] = await executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title: "" } },
    ]);
    expect(res.status).toBe("failed");
    expect(res.error).toMatch(/Validation failed/);
  });

  it("passes validation for addDocument when schema is satisfied", async () => {
    registerSchemas({ todos: z.object({ title: z.string().min(1) }) });
    const [res] = await executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title: "Valid title" } },
    ]);
    expect(addDocument).toHaveBeenCalled();
    expect(res.status).toBe("succeeded");
  });

  it("does not validate reads even when schema is registered", async () => {
    registerSchemas({ todos: z.object({ title: z.string().min(1) }) });
    const [res] = await executeQueries([
      { queryType: "getCollectionData", collectionName: "todos" },
    ]);
    expect(res.status).toBe("succeeded");
  });

  it("skips validation when no schema is registered (backward compat)", async () => {
    const [res] = await executeQueries([
      { queryType: "addDocument", collectionName: "unregistered", documentData: { anything: true } },
    ]);
    expect(addDocument).toHaveBeenCalled();
    expect(res.status).toBe("succeeded");
  });

  // ── Parallel execution ───────────────────────────────────────────────────

  it("executes multiple queries in parallel and returns all results", async () => {
    const results = await executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title: "A" } },
      { queryType: "signInGoogle" },
      { queryType: "deleteFile", fileUrl: "https://example.com/f.jpg" },
    ]);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.status === "succeeded")).toBe(true);
  });
});
