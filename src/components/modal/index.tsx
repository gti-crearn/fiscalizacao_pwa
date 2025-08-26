// src/components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal ({ isOpen, onClose, children }:ModalProps){
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop escuro */}
        <div
        className="fixed inset-0 bg-black/65 z-40 transition-opacity"
        onClick={onClose}
      />
  
        {/* Conteúdo da Modal */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar no canto superior direito */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
  
            {/* Renderiza o conteúdo passado como children */}
            <div className="p-6 pt-4">{children}</div>
          </div>
        </div>
      </>
    );
};

