import { ConvexClientProvider } from '@/components/convex-client-provider';
import { Modals } from './_components/modals';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ConvexClientProvider>
        <Modals />
        {children}
      </ConvexClientProvider>
    </section>
  );
}
