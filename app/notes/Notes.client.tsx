"use client"

import css from "./page.module.css";
//import Image from "next/image";
import React from "react";

import { useDebouncedCallback } from 'use-debounce'
import { useQuery, keepPreviousData} from '@tanstack/react-query';// useMutation,, useQueryClient 
import { useState, useEffect } from 'react'

import NoteList from '../../components/NoteList/NoteList';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import SearchBox from '../../components/SearchBox/SearchBox';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';


import { fetchNotes} from '../../lib/api';
import { Toaster, toast } from 'react-hot-toast';

const toastConfig = {
  style: {
    borderRadius: '10px',
    background: '#fff',
    color: '#000',
  },
};

const Notes = () => {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)

  const closeModal = () => setIsModalOpen(false)


  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: async () => {
      const res = await fetchNotes(query, currentPage);

      return res;
    },

    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data && data.notes && data.notes.length === 0 && query.trim() !== '') {
      toast.error('No notes found for your request.', { ...toastConfig });
    }
  }, [isSuccess, data, query]);

  const debouncedSetQuery = useDebouncedCallback((text: string) => {
    setQuery(text);
    setCurrentPage(1);
  }, 1000);

  const handleSearch = (text: string) => {
    if (text.includes('!')) return;
    setInputValue(text);
    debouncedSetQuery(text);
  };


/********************************************************** */

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox value={inputValue} onSearch={handleSearch} />

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {/* Пагінація */}
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {/* Кнопка створення нотатки */}
              <button className={css.button}
                  onClick={() => setIsModalOpen(true)}>
                  Create note +</button>

      </header>
       {isSuccess && data && data.notes && data.notes.length > 0 && ( 
      <NoteList
        notes={data?.notes || []}
      />
)}
{isModalOpen && (
              <Modal
                  onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}

    </div>

  )
}

export default Notes;