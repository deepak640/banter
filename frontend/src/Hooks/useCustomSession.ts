'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';

export function useCustomSession() {
  const { data: session, status } = useSession();
  const [customSession, setCustomSession] = useState<Session | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      setCustomSession(session);
    } else if (typeof window !== 'undefined') {
      fetch('/api/auth/session')
        .then((res) => res.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setCustomSession(data);
          }
        });
    }
  }, [session, status]);

  return { session: customSession, status };
}
