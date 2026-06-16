import { BadgeDetails } from '@/components/badge/badge-details';
import { mockBadge } from '@/features/badges/mock-data';

export default function BadgePage() {
  return (
    <main className="mx-auto w-full max-w-md p-4 pb-24">
      <BadgeDetails badge={mockBadge} />
    </main>
  );
}
