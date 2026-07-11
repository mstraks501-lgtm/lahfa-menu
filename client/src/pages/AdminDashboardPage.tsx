import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // التحقق من المصادقة
    const isAuthenticated = localStorage.getItem('lahfa_admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return <AdminDashboard />;
}
