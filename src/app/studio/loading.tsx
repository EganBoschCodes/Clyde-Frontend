import PageHeader from '../_components/shared/PageHeader';
import PageShell from '../_components/shared/PageShell';
import { MutedText } from '../_components/shared/Section';

export default function StudioLoading() {
  return (
    <PageShell>
      <PageHeader title="Studio" />
      <MutedText role="status">Loading your routines...</MutedText>
    </PageShell>
  );
}
