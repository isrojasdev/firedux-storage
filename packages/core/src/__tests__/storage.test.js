import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDispatch = vi.fn();
vi.mock("../store/store.js", () => ({
  getStore: vi.fn(() => ({ dispatch: mockDispatch })),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
  deleteObject: vi.fn(),
}));

import { uploadFile, removeFile } from "../actions/Storage.js";

describe("storage actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uploadFile dispatches setFile thunk and returns the download URL", async () => {
    const url = "https://storage.example.com/users/avatar_abc123.jpg";
    mockDispatch.mockResolvedValue({ payload: url });

    const file = new Blob(["image"]);
    const result = await uploadFile({ file, fileName: "avatar", folder: "users" });

    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toBe(url);
  });

  it("uploadFile returns false when upload fails", async () => {
    mockDispatch.mockResolvedValue({ payload: false });

    const file = new Blob(["image"]);
    const result = await uploadFile({ file, fileName: "avatar", folder: "users" });

    expect(result).toBe(false);
  });

  it("removeFile dispatches deleteFile thunk and returns true on success", async () => {
    mockDispatch.mockResolvedValue({ payload: true });

    const result = await removeFile({ fileUrl: "https://storage.example.com/file.jpg" });

    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

  it("removeFile returns false when deletion fails", async () => {
    mockDispatch.mockResolvedValue({ payload: false });

    const result = await removeFile({ fileUrl: "https://storage.example.com/file.jpg" });

    expect(result).toBe(false);
  });
});
