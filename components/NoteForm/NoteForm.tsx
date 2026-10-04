//import React, { useState, useId} from 'react';
import css from './NoteForm.module.css'
//import ReactDOM from 'react-dom';
import { Formik, Field, Form , ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query' 
import { createNote } from '../../lib/api'
import type { NewNoteData } from '../../types/note';



interface NoteFormProps {
  onClose?: () => void;
  onSuccess: () => void;
}

interface FormValues {
    title: string;
    content: string;
    tag: string;
}

const ALLOWED_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters!")
    .max(50, "Title is too long!")
        .required("Title is required!"),
  content: Yup.string()
    .max(500, "Content cannot exceed 500 characters!")
    .optional(),  
  tag: Yup.string()
    .oneOf(ALLOWED_TAGS, "Invalid tag selection")
    .required("Tag is required!"),
});

export default function NoteForm({ onSuccess,  onClose = onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({ 
    mutationFn: (newNoteData: NewNoteData) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], }); 
      onSuccess();
    },
    onError: (error) => { console.error('Помилка при create Note:', error); }
  });

    const initialValues: FormValues = {
        title: '',
        content: '',
        tag: 'Todo',
    };

    const handleSubmit = (values: FormValues, {resetForm}: {resetForm: () => void}) => {
      mutation.mutate({
        title: values.title,
        content: values.content,
        tag: values.tag
      });
        resetForm();
    };


    return (
   /*********************************************************** */  
   <Formik 
   initialValues={initialValues}
   validationSchema={NoteSchema}
   onSubmit={handleSubmit}>
            <Form className={css.form}>
                
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
                <Field
                    id="title"
                    type="text"
                    name="title"
                    className={css.input}
                />
    <ErrorMessage name="title" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
                    <Field
                        
      id="content"
      name="content"
                        as="textarea"
                        rows={8}
                    className={css.textarea}
    />
    <ErrorMessage name="content" component="span" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
                    <Field
                    as = "select"
                    id="tag"
                    name="tag"
                    className={css.select}
                >
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" component="span" className={css.error} />
  </div>

  <div className={css.actions}>
    <button type="button" className={css.cancelButton} onClick={onClose}>
      Cancel
    </button>
    <button
                    type="submit"
                    className={css.submitButton}
                    disabled={mutation.isPending}
    >
      Create note
    </button>
  </div>
        </Form>
       </Formik> 

  )
}