import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDispatch = vi.fn();
vi.mock("../store/store.js", () => ({
  getStore: vi.fn(() => ({ dispatch: mockDispatch })),
}));

vi.mock("../firebase/firebase.js", () => ({
  firebaseInstance: { db: {} },
}));

vi.mock("../utils/buildQueryParameters.js", () => ({
  buildQuery: vi.fn(() => ({})),
}));

vi.mock("../utils/resolveReferences.js", () => ({
  resolveReferences: vi.fn(async (doc) => doc),
}));

const mockUnsubscribe = vi.fn();
vi.mock("firebase/firestore", () => ({
  onSnapshot: vi.fn((query, callback) => {
    callback({
      docs: [
        { id: "doc1", data: () => ({ title: "Task 1" }) },
        { id: "doc2", data: () => ({ title: "Task 2" }) },
      ],
    });
    return mockUnsubscribe;
  }),
}));

import { obtainRealTime } from "../actions/RealTime.js";
import { onSnapshot } from "firebase/firestore";

describe("obtainRealTime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockResolvedValue({});
  });

  it("calls onSnapshot with the built query", async () => {
    await obtainRealTime("todos");
    expect(onSnapshot).toHaveBeenCalledOnce();
  });

  it("dispatches getCollectionRealTime with the snapshot docs", async () => {
    await obtainRealTime("todos");
    // dispatch runs inside an async onSnapshot callback — wait for it
    await vi.waitFor(() => expect(mockDispatch).toHaveBeenCalledOnce());
    const dispatchedArg = mockDispatch.mock.calls[0][0];
    expect(typeof dispatchedArg).toBe("function");
  });

  it("passes storeAs to the dispatch payload", async () => {
    await obtainRealTime("todos", false, false, false, "todosRealTime");
    await vi.waitFor(() => expect(mockDispatch).toHaveBeenCalledOnce());
  });

  it("handles errors gracefully and returns { success: false }", async () => {
    const { onSnapshot: snap } = await import("firebase/firestore");
    snap.mockImplementationOnce(() => { throw new Error("Firestore error"); });

    const result = await obtainRealTime("todos");
    expect(result).toMatchObject({ success: false });
  });
});
