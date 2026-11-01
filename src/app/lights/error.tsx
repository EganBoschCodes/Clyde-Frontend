'use client';

import RouteError from '../_components/shared/RouteError';

interface LightsErrorProps {
  error: Error;
  unstable_retry: () => void;
}

export default function LightsError({ error, unstable_retry }: LightsErrorProps) {
  return <RouteError title="Lights" message={`Something went wrong: ${error.message}`} onRetry={unstable_retry} />;
}
