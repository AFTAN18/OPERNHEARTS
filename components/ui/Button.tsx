import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  isLoading,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 font-bold',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 font-bold',
    secondary: 'bg-white text-slate-900 hover:bg-slate-50 shadow-md border-2 border-slate-200 font-semibold',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100/50 hover:text-slate-900 font-semibold',
    outline: 'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative rounded-full font-medium transition-colors flex items-center justify-center gap-2 overflow-hidden',
        variants[variant],
        sizes[size],
        isLoading && 'opacity-70 cursor-not-allowed',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
      {(variant === 'primary' || variant === 'accent') && (
        <span className="absolute inset-0 rounded-full bg-white/20 scale-0 transition-transform duration-500 hover:scale-150 origin-center opacity-0 hover:opacity-100" />
      )}
    </motion.button>
  );
};