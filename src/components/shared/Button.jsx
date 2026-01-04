import React from 'react';

export default function Button({ children, variant = 'primary', onClick, className = '' }) {
    const baseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        fontSize: '1rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.4)'
        },
        secondary: {
            backgroundColor: 'transparent',
            color: 'var(--color-secondary)',
            border: '2px solid var(--color-secondary)'
        }
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant] }}
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    );
}
