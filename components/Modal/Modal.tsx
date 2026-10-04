import { createPortal } from 'react-dom'
import css from './Modal.module.css'
//import NoteForm from '../NoteForm/NoteForm'
import { useEffect, useState } from 'react';

interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  /*  useEffect(() => {

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);*/
  


  
  useEffect(() => {
    setMounted(true); // Спрацює тільки в браузері
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root');

  const targetContainer = modalRoot || document.body;
  
  return createPortal(
    /*********************************************************** */
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
                
      </div>
    </div>,

    targetContainer

    //document.getElementById('modal-root') as HTMLDivElement,
  );
}