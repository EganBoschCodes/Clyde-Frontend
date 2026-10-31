import LoadingShell from '../_components/shared/LoadingShell';
import { Skeleton } from '../_components/shared/Skeleton';

export default function HomeLoading() {
  return (
    <LoadingShell isWide>
      <Skeleton $height="44px" $radius="12px" />
      <Skeleton $height="196px" />
      <Skeleton $height="196px" />
      <Skeleton $height="196px" />
    </LoadingShell>
  );
}
