// Imports
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAsync } from "../lib/use-async";

const mockQueryFnSuccess = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("mock data");
    }, 100);
  });
};

const mockQueryFnError = () => {
  return new Promise<string>((_, reject) => {
    setTimeout(() => {
      reject(new Error("mock error"));
    }, 100);
  });
};

describe("useAsync hook", () => {
  it("should return data on successful queryFn", async () => {
    const { result } = renderHook(() =>
      useAsync({ queryFn: mockQueryFnSuccess })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe("mock data");
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should return error on failed queryFn", async () => {
    const { result } = renderHook(() =>
      useAsync<string>({ queryFn: mockQueryFnError })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe("mock error");
  });
});
