import LoadingShell from '../_components/shared/LoadingShell';
import { Skeleton } from '../_components/shared/Skeleton';

export default function LightsLoading() {
  return (
    <LoadingShell isWide>
      <Skeleton $height="52px" $radius="12px" />
      <Skeleton $height="72px" $radius="16px" />
      <Skeleton $height="72px" $radius="16px" />
      <Skeleton $height="72px" $radius="16px" />
      <Skeleton $height="72px" $radius="16px" />
    </LoadingShell>
  );
}
