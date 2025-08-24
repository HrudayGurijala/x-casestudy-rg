import { useState, useCallback } from "react";

export const useRefreshData = (refetchFunctions: (() => Promise<any>)[]) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all(refetchFunctions.map(refetch => refetch()));
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchFunctions]);

  return {
    isRefreshing,
    handleRefresh,
  };
};
