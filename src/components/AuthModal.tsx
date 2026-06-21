import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { apiLogin, apiRegister } from '@/api';

interface User { id: number; email: string; first_name: string; last_name: string; }
interface Props {
  onSuccess: (user: User, token: string) => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await apiLogin(form.email, form.password)
        : await apiRegister(form.email, form.first_name, form.last_name, form.password);
      if (res.ok) {
        localStorage.setItem('pp_token', res.token);
        onSuccess(res.user, res.token);
      } else {
        setError(res.error || 'Ошибка');
      }
    } catch {
      setError('Ошибка соединения');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Шапка */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-800 text-white">
              {mode === 'login' ? 'Войти' : 'Регистрация'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === 'login' ? 'Доступ к личному кабинету' : 'Создайте аккаунт ПрофиПрогноз'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-600 text-muted-foreground">Имя</label>
                <input value={form.first_name} onChange={set('first_name')} required placeholder="Иван"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-600 text-muted-foreground">Фамилия</label>
                <input value={form.last_name} onChange={set('last_name')} required placeholder="Петров"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-600 text-muted-foreground">Email</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-600 text-muted-foreground">Пароль</label>
            <input type="password" value={form.password} onChange={set('password')} required placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-700 hover:bg-primary/90 h-11">
            {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>Нет аккаунта?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="font-700 text-primary hover:underline">
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>Уже есть аккаунт?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="font-700 text-primary hover:underline">
                Войти
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}