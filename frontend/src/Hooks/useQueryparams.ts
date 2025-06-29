"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Custom hook to manage query parameters
function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters from URL
  const queryParams = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);

  // Get specific query parameter
  const getParam = useCallback(
    (key: string) => {
      return queryParams.get(key);
    },
    [queryParams]
  );

  // Set or update query parameters
  const setParams = useCallback(
    (
      params: Record<string, string | number | null | undefined>,
      { replace = true } = {}
    ) => {
      const newQueryParams = new URLSearchParams(queryParams);

      // Update params
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newQueryParams.delete(key);
        } else {
          newQueryParams.set(key, String(value)); // Ensure value is a string
        }
      });

      // Update URL
      const queryString = newQueryParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [router, pathname, queryParams]
  );

  // Remove specific query parameter
  const removeParam = useCallback(
    (key: string, { replace = true } = {}) => {
      const newQueryParams = new URLSearchParams(queryParams);
      newQueryParams.delete(key);

      // Update URL
      const queryString = newQueryParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [router, pathname, queryParams]
  );

  // Clear all query parameters
  const clearParams = useCallback(
    ({ replace = true } = {}) => {
      if (replace) {
        router.replace(pathname, { scroll: false });
      } else {
        router.push(pathname, { scroll: false });
      }
    },
    [router, pathname]
  );

  return {
    queryParams, // URLSearchParams object
    getParam, // Get single parameter value
    setParams, // Set or update parameters
    removeParam, // Remove single parameter
    clearParams, // Clear all parameters
  };
}

export default useQueryParams;
