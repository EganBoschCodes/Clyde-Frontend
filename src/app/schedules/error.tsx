'use client';

import RouteError from '../_components/shared/RouteError';

interface SchedulesErrorProps {
  error: Error;
  unstable_retry: () => void;
}

export default function SchedulesError({ error, unstable_retry }: SchedulesErrorProps) {
  return <RouteError title="Schedules" message={`Something went wrong: ${error.message}`} onRetry={unstable_retry} />;
}
