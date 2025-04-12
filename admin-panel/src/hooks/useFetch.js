import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); // re-show loading on manual refetch
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.get(`http://localhost:4000${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setData(response.data);
      setError(null); // reset previous errors
    } catch (err) {
      console.error("Fetch error:", err.response?.data?.message || err.message);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;
    fetchData();
  }, [url, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
