import { useCallback, useEffect, useState } from "react";

interface IUserAsync<T = unknown> {
  queryFn: () => Promise<T>;
}

export const useAsync = <T>({ queryFn }: IUserAsync<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const runQueryFn = useCallback(() => {
    setLoading(true);
    setError(undefined);

    queryFn()
      .then((response) => {
        setData(response);
      })
      .catch((error: any) => {
        setError(error.message || "Erro ao buscar dados");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryFn]);

  useEffect(() => {
    runQueryFn();
  }, [runQueryFn]);

  return { data, isError: !!error, error, loading };
};
