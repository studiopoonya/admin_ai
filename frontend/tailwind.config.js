import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        '../backend/vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        '../backend/storage/framework/views/*.php',
        '../backend/resources/views/**/*.blade.php',
        './src/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                slideIn: {
                    '0%':   { opacity: '0', transform: 'translateX(100%) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%':   { opacity: '0', transform: 'translateY(14px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeDown: {
                    '0%':   { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%':   { opacity: '0', transform: 'scale(0.93)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideLeft: {
                    '0%':   { opacity: '0', transform: 'translateX(-12px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulse2: {
                    '0%, 100%': { opacity: '1' },
                    '50%':      { opacity: '0.4' },
                },
            },
            animation: {
                slideIn:    'slideIn 0.22s cubic-bezier(0.16,1,0.3,1)',
                fadeIn:     'fadeIn 0.2s ease',
                fadeUp:     'fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
                fadeDown:   'fadeDown 0.25s cubic-bezier(0.16,1,0.3,1) both',
                scaleIn:    'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
                slideLeft:  'slideLeft 0.25s cubic-bezier(0.16,1,0.3,1) both',
                shimmer:    'shimmer 1.5s infinite linear',
                pulse2:     'pulse2 1.8s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};
