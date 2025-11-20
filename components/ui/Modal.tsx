'use client';
import { FC, useEffect } from "react";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
    onConfirm?: () => void;
    isDeleting?: boolean; // Accept the new prop
    isRestoring?: boolean;
    isDeleteDisabled?: boolean;
    modalName?: string;
    isDeactivating?: string;
    isActivating?: string;
    isReapproving?: string;
    isAdding?: string;

}

const Modal: FC<ModalProps> = ({ isOpen, onClose, onConfirm, isAdding,modalName,children }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen) return null;
    // if(isDeleting || isRestoring || isDeactivating || isActivating || isReapproving){
    //     isDeleteDisabled = true;
    // }
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
                {children}
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 cursor-pointer">
                        Cancel
                    </button>
                    {
                        modalName === "Add Activity" && (
                            <button
                                onClick={onConfirm} 
                                disabled={isAdding ? true : false}
                                className={`mt-4 px-6 py-2.5 bg-[#046307] text-white font-semibold rounded-lg hover:bg-[#035406] disabled:bg-green-300 cursor-pointer`}
                            >
                                {isAdding ? 'Adding...' : 'Add Activity'}
                            </button>
                        ) 
                    }
                </div>
            </div>
        </div>
    );
};
export default Modal;