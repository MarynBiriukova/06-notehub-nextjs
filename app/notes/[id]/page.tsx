import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';
import NoteDetailsClient from './NoteDetails.client';
import type { Note } from '../../../types/note'; 


interface PageProps{
    params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage(
    { params }: PageProps) {
    const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery <Note>({
    queryKey: ['note', id] as const,
    queryFn: () => fetchNoteById(id) as unknown as Promise <Note>,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <NoteDetailsClient />
  </HydrationBoundary>
  );
}
