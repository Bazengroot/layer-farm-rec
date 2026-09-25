import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t('auth.unauthorized')}
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          {t('auth.unauthorizedMessage')}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.backToDashboard')}
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
