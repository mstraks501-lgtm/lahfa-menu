import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'lahfa2024'; // كلمة مرور بسيطة - يمكن تغييرها

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('lahfa_admin_authenticated', 'true');
      navigate('/admin/dashboard');
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-accent/20 p-4 rounded-full">
            <Lock className="h-8 w-8 text-accent" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
          لوحة التحكم
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Admin Panel
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              كلمة المرور
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="bg-input border-border text-foreground"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            تسجيل الدخول
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          كلمة المرور الافتراضية: lahfa2024
        </p>
      </Card>
    </div>
  );
}
