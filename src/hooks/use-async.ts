import { useEffect, useState } from "react";

export default function useAsync<T, E = any>(func: () => Promise<T>) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<T>();
  const [error, setError] = useState<E>();

  useEffect(() => {
    func()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { value, loading, error };
}
