import axios, { type AxiosResponse } from 'axios';
import type {NewNoteData, Note } from '../types/note';

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number; 
}


export const fetchNotes = async (query: string, page: number = 1): Promise<FetchNotesResponse> => {

    const queryParams: Record<string, string> = {
        page: String(page),
        perPage: '12',
    }; 
    
    if (query && query.trim() !== '') {
    queryParams.search = query;
  }

  const options = {
    method: 'GET',
    url: '/notes',
    params: queryParams,
    headers: {
      accept: 'application/json',
    }
    };
    
    const response: AxiosResponse<FetchNotesResponse> = await axios.request<FetchNotesResponse>(options);
  
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {

 /*   const queryParams: Record<string, string> = {
        page: String(page),
        perPage: '12',
    }; 
    
    if (query && query.trim() !== '') {
    queryParams.search = query;
  }*/

  const options = {
    method: 'GET',
    url: `/notes/${id}`,
    //params: queryParams,
    headers: {
      accept: 'application/json',
    }
    };
    
    const response: AxiosResponse<Note> = await axios.request<Note>(options);
  
  return response.data;
};



export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${id}`)
  return res.data
}

export const createNote = async (newNoteData: NewNoteData): Promise<Note> => {
  const res = await axios.post<Note>('/notes', newNoteData)
  return res.data
}