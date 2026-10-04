import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../lib/api';
import Notes from './Notes.client';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '' }] as const,
    queryFn: () => fetchNotes('', 1),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <Notes />
  </HydrationBoundary>
  );
}

