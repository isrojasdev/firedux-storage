import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((db, name) => ({ _col: name })),
  query: vi.fn((...args) => ({ _query: args })),
  where: vi.fn((f, op, v) => ({ _where: [f, op, v] })),
  limit: vi.fn((n) => ({ _limit: n })),
  orderBy: vi.fn((f, dir) => ({ _orderBy: [f, dir] })),
}));

import { buildQuery } from "../utils/buildQueryParameters.js";
import { collection, query, where, limit, orderBy } from "firebase/firestore";

describe("buildQuery", () => {
  const db = {};

  beforeEach(() => vi.clearAllMocks());

  it("builds a basic collection query with no conditions", () => {
    buildQuery(db, "todos", false, false, false);
    expect(collection).toHaveBeenCalledWith(db, "todos");
    expect(where).not.toHaveBeenCalled();
    expect(limit).not.toHaveBeenCalled();
    expect(orderBy).not.toHaveBeenCalled();
  });

  it("applies a single where condition", () => {
    buildQuery(db, "todos", ["status", "==", "pending"], false, false);
    expect(where).toHaveBeenCalledWith("status", "==", "pending");
  });

  it("applies multiple where conditions (array of arrays)", () => {
    buildQuery(
      db,
      "todos",
      [
        ["status", "==", "pending"],
        ["priority", ">", 1],
      ],
      false,
      false
    );
    expect(where).toHaveBeenCalledTimes(2);
    expect(where).toHaveBeenCalledWith("status", "==", "pending");
    expect(where).toHaveBeenCalledWith("priority", ">", 1);
  });

  it("applies a limit condition", () => {
    buildQuery(db, "todos", false, 10, false);
    expect(limit).toHaveBeenCalledWith(10);
  });

  it("applies an orderBy condition", () => {
    buildQuery(db, "todos", false, false, ["createdAt", "desc"]);
    expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
  });

  it("applies all conditions together", () => {
    buildQuery(db, "todos", ["status", "==", "done"], 5, ["createdAt", "asc"]);
    expect(where).toHaveBeenCalledWith("status", "==", "done");
    expect(limit).toHaveBeenCalledWith(5);
    expect(orderBy).toHaveBeenCalledWith("createdAt", "asc");
  });

  it("returns the result of query()", () => {
    const result = buildQuery(db, "todos", false, false, false);
    expect(query).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ _query: expect.any(Array) }));
  });
});
