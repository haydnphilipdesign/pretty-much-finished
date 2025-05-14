import React, { useState, useEffect, useRef } from 'react';

function AsyncData() {
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getData();
      if (isMounted.current) {
        setData(data);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return <div>{/* component content */}</div>;
}

export default AsyncData; 