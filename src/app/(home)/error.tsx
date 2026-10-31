'use client';

import RouteError from '../_components/shared/RouteError';

interface HomeErrorProps {
  error: Error;
  unstable_retry: () => void;
}

export default function HomeError({ error, unstable_retry }: HomeErrorProps) {
  return <RouteError title="Home" message={`Something went wrong: ${error.message}`} onRetry={unstable_retry} />;
}
