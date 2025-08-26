import React, { ReactNode, MouseEvent, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'green' | 'yellow' | 'blue' | 'red' | 'orange' | 'gray';
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    icon?: ReactNode; // Adicionando o novo parâmetro de ícone
    width?: string; // Valor padrão é 100%
    type?: 'button' | 'submit' | 'reset';
};

export function ButtonComponent({
    variant,
    onClick,
    icon,
    width = 'w-max', // Valor padrão
    children,
    type,
    disabled,
    ...props
}: ButtonProps) {
    const getVariantClasses = (): string => {
        switch (variant) {
            case 'green':
                return `bg-green-600 ${!disabled && 'hover:bg-green-700'} text-white`;
            case 'orange':
                return `bg-orange-100 ${!disabled && 'hover:bg-orange-200'} text-blue font-medium`;
            case 'blue':
                return `bg-blue-600 text-white ${!disabled && 'hover:bg-blue-700'}`;
            case 'red':
                return `bg-red-500 ${!disabled && 'hover:bg-red-600'} text-white`;
            case 'gray':
                return `bg-[#dadada] ${!disabled && 'hover:bg-[#b2b2b2]'}`;
            default:
                return `bg-gray-500 ${!disabled && 'hover:bg-gray-600'} text-white`;
        }
    };

    return (
        <button
            className={`flex mt-8 items-center disabled:cursor-not-allowed disabled:bg-opacity-40 gap-2 text-sm px-4 font-semibold py-3 rounded-md justify-center ${width} ${getVariantClasses()} transition duration-500`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
}