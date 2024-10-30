'use client';

import { useEffect } from 'react';

const ClientDB: React.FC = () => {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        // IndexedDB operations here
      }
    }, []);
  
    return null;
  };

export default ClientDB;