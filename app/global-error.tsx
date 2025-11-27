'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '20px', fontFamily: 'system-ui', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <button onClick={() => reset()} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
