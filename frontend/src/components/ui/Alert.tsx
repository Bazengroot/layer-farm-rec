import React from 'react';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'info' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-slate-50 text-slate-900 border-slate-200',
    destructive: 'bg-rose-50 text-rose-900 border-rose-200',
    danger: 'bg-rose-50 text-rose-900 border-rose-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
  };

  return (
    <div className={`relative w-full rounded-lg border p-4 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
);

export default Alert;
