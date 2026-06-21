import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ADMIN_URL = 'https://functions.poehali.dev/537479e8-3068-4a67-aba4-0ebfec8d4dcf';

const ANALYSTS = ['Руслан Zidane', 'Роман Juventino', 'Игорь Соколов'];
const SPORTS = [
  { icon: '⚽', label: 'Футбол' },
  { icon: '🏀', label: 'Баскетбол' },
  { icon: '🎾', label: 'Теннис' },
  { icon: '🏒', label: 'Хоккей' },
];

interface Dashboard {
  users_total: number; orders_total: number; orders_pending: number;
  orders_confirmed: number; revenue: number; predictions_active: number;
}
interface Order {
  id: number; match_name: string; league: string; sport: string; analyst: string;
  price: number; prediction: string; purchase_date: string; match_date: string;
  status: string; payment_note: string; user_name: string; user_email: string;
}
interface Prediction {
  id: number; sport: string; match_name: string; league: string; analyst: string;
  description: string; price: number; match_date: string; prediction_text: string;
  is_active: boolean; created_at: string;
}
interface User {
  id: number; first_name: string; last_name: string; email: string;
  created_at: string; orders: number; spent: number;
}

function api(method: string, section: string, body?: object, key?: string) {
  return fetch(`${ADMIN_URL}?section=${section}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key || '' },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

const emptyPred = { sport: '⚽', match_name: '', league: '', analyst: ANALYSTS[0], description: '', price: 990, match_date: '', prediction_text: '', is_active: true };

export default function Admin() {
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('admin_key') || '');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [section, setSection] = useState<'dashboard' | 'orders' | 'predictions' | 'users'>('dashboard');

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Редактирование заявки
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [orderPrediction, setOrderPrediction] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Редактирование прогноза
  const [editPred, setEditPred] = useState<typeof emptyPred & { id?: number } | null>(null);
  const [predSaving, setPredSaving] = useState(false);

  const load = useCallback(async (sec: string, key: string) => {
    setLoading(true);
    const res = await api('GET', sec, undefined, key);
    setLoading(false);
    if (!res.ok) return false;
    if (sec === 'dashboard') setDashboard(res.dashboard);
    if (sec === 'orders') setOrders(res.orders);
    if (sec === 'predictions') setPredictions(res.predictions);
    if (sec === 'users') setUsers(res.users);
    return true;
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const res = await api('GET', 'dashboard', undefined, password);
    if (res.ok) {
      localStorage.setItem('admin_key', password);
      setAdminKey(password);
      setDashboard(res.dashboard);
      setAuthed(true);
    } else {
      setLoginError('Неверный пароль');
    }
  }

  useEffect(() => {
    if (adminKey) {
      api('GET', 'dashboard', undefined, adminKey).then(res => {
        if (res.ok) { setDashboard(res.dashboard); setAuthed(true); }
        else { localStorage.removeItem('admin_key'); setAdminKey(''); }
      });
    }
  }, []);

  useEffect(() => {
    if (authed && section !== 'dashboard') load(section, adminKey);
  }, [section, authed]);

  async function handleOrderSave() {
    if (!editOrder) return;
    await api('PUT', 'orders', { id: editOrder.id, status: orderStatus, prediction: orderPrediction, payment_note: orderNote }, adminKey);
    setEditOrder(null);
    load('orders', adminKey);
  }

  async function handlePredSave() {
    if (!editPred) return;
    setPredSaving(true);
    if (editPred.id) await api('PUT', 'predictions', editPred, adminKey);
    else await api('POST', 'predictions', editPred, adminKey);
    setPredSaving(false);
    setEditPred(null);
    load('predictions', adminKey);
  }

  async function handlePredDelete(id: number) {
    if (!confirm('Удалить прогноз?')) return;
    await api('DELETE', 'predictions', { id }, adminKey);
    load('predictions', adminKey);
  }

  // ── LOGIN ──
  if (!authed) return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-primary text-black mb-4">
            <Icon name="ShieldCheck" size={28} />
          </div>
          <h1 className="font-display text-2xl font-900 text-white">Профи<span className="text-primary">Прогноз</span></h1>
          <p className="text-sm text-muted-foreground mt-1">Панель администратора</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-700 text-muted-foreground mb-1.5">Пароль администратора</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white outline-none focus:border-primary transition-colors" />
          </div>
          {loginError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <Icon name="AlertCircle" size={15} />{loginError}
            </div>
          )}
          <Button type="submit" className="w-full bg-primary text-black font-700 h-11">
            Войти в панель
          </Button>
        </form>
      </div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
    { id: 'orders', label: 'Заявки', icon: 'ClipboardList', badge: dashboard?.orders_pending },
    { id: 'predictions', label: 'Прогнозы', icon: 'TrendingUp' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
  ] as const;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

      {/* SIDEBAR */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border md:flex" style={{ background: 'hsl(220 20% 6%)' }}>
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-black">
            <Icon name="Zap" size={14} />
          </div>
          <span className="font-display text-sm font-800 text-white">Профи<span className="text-primary">Прогноз</span></span>
          <span className="ml-auto text-xs font-700 text-muted-foreground">ADMIN</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-600 transition-all text-left ${
                section === n.id ? 'bg-primary text-black font-700' : 'text-muted-foreground hover:bg-muted hover:text-white'
              }`}>
              <Icon name={n.icon} size={16} />
              {n.label}
              {n.badge ? <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-800 text-white">{n.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button onClick={() => { localStorage.removeItem('admin_key'); setAuthed(false); setAdminKey(''); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
            <Icon name="LogOut" size={15} /> Выйти
          </button>
        </div>
      </aside>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card md:hidden">
        {navItems.map(n => (
          <button key={n.id} onClick={() => setSection(n.id)}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-600 transition-colors ${
              section === n.id ? 'text-primary' : 'text-muted-foreground'
            }`}>
            <Icon name={n.icon} size={18} />
            {n.label}
            {n.badge ? <span className="absolute top-1 right-1/4 h-4 w-4 rounded-full bg-red-500 text-center text-xs font-800 text-white leading-4">{n.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">

        {/* ДАШБОРД */}
        {section === 'dashboard' && dashboard && (
          <div className="p-5 space-y-5">
            <h1 className="font-display text-2xl font-900 text-white">Дашборд</h1>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { icon: 'Users', v: dashboard.users_total, l: 'Пользователей', c: 'text-white' },
                { icon: 'ClipboardList', v: dashboard.orders_total, l: 'Заявок всего', c: 'text-white' },
                { icon: 'Clock', v: dashboard.orders_pending, l: 'Ожидают оплаты', c: 'text-yellow-400' },
                { icon: 'CheckCircle2', v: dashboard.orders_confirmed, l: 'Подтверждено', c: 'text-primary' },
                { icon: 'Banknote', v: `${dashboard.revenue.toLocaleString()} ₽`, l: 'Выручка', c: 'text-secondary' },
                { icon: 'TrendingUp', v: dashboard.predictions_active, l: 'Активных прогнозов', c: 'text-primary' },
              ].map(c => (
                <div key={c.l} className="rounded-xl border border-border bg-card p-4">
                  <div className={`flex items-center gap-2 ${c.c}`}>
                    <Icon name={c.icon} size={18} />
                    <span className="font-display text-2xl font-800">{c.v}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.l}</div>
                </div>
              ))}
            </div>
            {dashboard.orders_pending > 0 && (
              <button onClick={() => setSection('orders')}
                className="flex w-full items-center justify-between rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                    <Icon name="Clock" size={16} className="text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-700 text-yellow-400">{dashboard.orders_pending} заявки ждут подтверждения</div>
                    <div className="text-xs text-muted-foreground">Нажмите, чтобы перейти к заявкам</div>
                  </div>
                </div>
                <Icon name="ArrowRight" size={18} className="text-yellow-400" />
              </button>
            )}
          </div>
        )}

        {/* ЗАЯВКИ */}
        {section === 'orders' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-900 text-white">Заявки на оплату</h1>
              <button onClick={() => load('orders', adminKey)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-white transition-colors">
                <Icon name="RefreshCw" size={16} />
              </button>
            </div>

            {loading && <div className="flex items-center justify-center py-16 text-muted-foreground"><Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...</div>}

            {/* Фильтр */}
            <div className="flex gap-2 flex-wrap text-sm">
              {['all', 'pending', 'confirmed', 'rejected'].map(s => {
                const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
                const labels: Record<string, string> = { all: 'Все', pending: '⏳ Ожидают', confirmed: '✅ Подтверждены', rejected: '❌ Отклонены' };
                return (
                  <span key={s} className="rounded-lg border border-border bg-card px-3 py-1 text-muted-foreground">
                    {labels[s]} {count}
                  </span>
                );
              })}
            </div>

            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className={`rounded-xl border bg-card overflow-hidden ${
                  o.status === 'confirmed' ? 'border-primary/30' :
                  o.status === 'rejected' ? 'border-red-500/20' : 'border-yellow-500/30'
                }`}>
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{o.sport}</span>
                      <div className="min-w-0">
                        <div className="font-700 text-white text-sm">{o.match_name}</div>
                        <div className="text-xs text-muted-foreground">{o.league} · {o.match_date}</div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-white font-700">{o.user_name}</span>
                          <span className="text-xs text-muted-foreground">{o.user_email}</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{new Date(o.purchase_date).toLocaleString('ru-RU')}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-display text-lg font-800 text-secondary">{o.price} ₽</span>
                      {o.status === 'confirmed' && <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-700 text-primary">✅ Подтверждено</span>}
                      {o.status === 'pending' && <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-700 text-yellow-400">⏳ Ожидает</span>}
                      {o.status === 'rejected' && <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-700 text-red-400">❌ Отклонено</span>}
                      <Button size="sm" onClick={() => { setEditOrder(o); setOrderStatus(o.status || 'confirmed'); setOrderPrediction(o.prediction || ''); setOrderNote(o.payment_note || ''); }}
                        className="bg-muted text-white hover:bg-muted/80 text-xs font-600 h-7 px-2.5">
                        <Icon name="Edit2" size={13} className="mr-1" /> Изменить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && orders.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
                  <Icon name="ClipboardList" size={32} className="mx-auto mb-3 opacity-40" />
                  Нет заявок
                </div>
              )}
            </div>
          </div>
        )}

        {/* ПРОГНОЗЫ */}
        {section === 'predictions' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-900 text-white">Прогнозы</h1>
              <Button onClick={() => setEditPred({ ...emptyPred })} className="bg-primary text-black font-700 h-9 px-4">
                <Icon name="Plus" size={16} className="mr-1.5" /> Добавить
              </Button>
            </div>

            {loading && <div className="flex items-center justify-center py-16 text-muted-foreground"><Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...</div>}

            <div className="space-y-3">
              {predictions.map(p => (
                <div key={p.id} className={`rounded-xl border bg-card p-4 ${p.is_active ? 'border-border' : 'border-border opacity-50'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{p.sport}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-700 text-white text-sm">{p.match_name}</span>
                          {p.is_active
                            ? <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-xs font-700 text-primary">Активен</span>
                            : <span className="rounded-full border border-border px-1.5 py-0.5 text-xs text-muted-foreground">Скрыт</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.league} · {p.match_date} · {p.analyst}</div>
                        <div className="text-xs font-700 text-secondary mt-0.5">{p.price} ₽</div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditPred({ ...p })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-white transition-colors">
                        <Icon name="Edit2" size={14} />
                      </button>
                      <button onClick={() => handlePredDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && predictions.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <Icon name="TrendingUp" size={32} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">Нет прогнозов. Создайте первый!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ПОЛЬЗОВАТЕЛИ */}
        {section === 'users' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-900 text-white">Пользователи</h1>
              <button onClick={() => load('users', adminKey)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-white transition-colors">
                <Icon name="RefreshCw" size={16} />
              </button>
            </div>
            {loading && <div className="flex items-center justify-center py-16 text-muted-foreground"><Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...</div>}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-2.5 grid grid-cols-[1fr_auto_auto] text-xs font-700 uppercase tracking-wider text-muted-foreground gap-4">
                <span>Пользователь</span>
                <span className="hidden sm:block">Заявок</span>
                <span>Потрачено</span>
              </div>
              {users.map(u => (
                <div key={u.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors">
                  <div>
                    <div className="font-700 text-sm text-white">{u.first_name} {u.last_name}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                    <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('ru-RU')}</div>
                  </div>
                  <span className="hidden sm:block text-center text-sm font-700 text-white">{u.orders}</span>
                  <span className="text-sm font-700 text-secondary">{u.spent > 0 ? `${u.spent.toLocaleString()} ₽` : '—'}</span>
                </div>
              ))}
              {!loading && users.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">Нет пользователей</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* МОДАЛКА: Изменить заявку */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-800 text-white">Заявка #{editOrder.id}</h2>
              <button onClick={() => setEditOrder(null)} className="text-muted-foreground hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3 text-sm">
              <div className="font-700 text-white">{editOrder.match_name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{editOrder.user_name} · {editOrder.user_email}</div>
              <div className="text-xs text-secondary font-700 mt-0.5">{editOrder.price} ₽</div>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Статус</label>
              <div className="grid grid-cols-3 gap-2">
                {[['confirmed', '✅ Подтвердить', 'border-primary/40 bg-primary/10 text-primary'], ['pending', '⏳ В ожидании', 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'], ['rejected', '❌ Отклонить', 'border-red-500/30 bg-red-500/10 text-red-400']].map(([val, label, cls]) => (
                  <button key={val} onClick={() => setOrderStatus(val)}
                    className={`rounded-lg border px-2 py-2 text-xs font-700 transition-all ${orderStatus === val ? cls : 'border-border bg-card text-muted-foreground'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Текст прогноза (откроется клиенту)</label>
              <textarea value={orderPrediction} onChange={e => setOrderPrediction(e.target.value)} rows={4} placeholder="Рекомендуем ставку П1 на победу Реала..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none" />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Заметка (видит только клиент при отклонении)</label>
              <input value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="Перевод не найден, попробуйте ещё раз"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={() => setEditOrder(null)} variant="ghost" className="flex-1 text-muted-foreground">Отмена</Button>
              <Button onClick={handleOrderSave} className="flex-1 bg-primary text-black font-700">Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА: Создать/редактировать прогноз */}
      {editPred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-800 text-white">{editPred.id ? 'Редактировать' : 'Новый прогноз'}</h2>
              <button onClick={() => setEditPred(null)} className="text-muted-foreground hover:text-white"><Icon name="X" size={20} /></button>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Вид спорта</label>
              <div className="flex gap-2">
                {SPORTS.map(s => (
                  <button key={s.icon} onClick={() => setEditPred(p => p ? { ...p, sport: s.icon } : p)}
                    className={`flex-1 rounded-lg border py-2 text-base transition-all ${editPred.sport === s.icon ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: 'match_name', label: 'Матч', placeholder: 'Реал Мадрид — Барселона' },
              { key: 'league', label: 'Лига / Турнир', placeholder: 'Ла Лига' },
              { key: 'match_date', label: 'Дата матча', placeholder: '25 июня 2026' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-700 text-muted-foreground mb-1.5">{f.label}</label>
                <input value={(editPred as Record<string, string>)[f.key] || ''} onChange={e => setEditPred(p => p ? { ...p, [f.key]: e.target.value } : p)}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1.5">Цена (₽)</label>
                <input type="number" value={editPred.price} onChange={e => setEditPred(p => p ? { ...p, price: +e.target.value } : p)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1.5">Аналитик</label>
                <select value={editPred.analyst} onChange={e => setEditPred(p => p ? { ...p, analyst: e.target.value } : p)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white outline-none focus:border-primary transition-colors">
                  {ANALYSTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Описание (видят все)</label>
              <textarea value={editPred.description} onChange={e => setEditPred(p => p ? { ...p, description: e.target.value } : p)} rows={2}
                placeholder="Краткое описание прогноза для карточки..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary resize-none transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1.5">Текст прогноза (только после оплаты)</label>
              <textarea value={editPred.prediction_text} onChange={e => setEditPred(p => p ? { ...p, prediction_text: e.target.value } : p)} rows={3}
                placeholder="Рекомендуем ставку на победу команды X..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary resize-none transition-colors" />
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
              <button onClick={() => setEditPred(p => p ? { ...p, is_active: !p.is_active } : p)}
                className={`relative h-5 w-9 rounded-full transition-colors ${editPred.is_active ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${editPred.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm font-600 text-white">{editPred.is_active ? 'Показывать на сайте' : 'Скрыт от пользователей'}</span>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={() => setEditPred(null)} variant="ghost" className="flex-1 text-muted-foreground">Отмена</Button>
              <Button onClick={handlePredSave} disabled={predSaving} className="flex-1 bg-primary text-black font-700">
                {predSaving ? <Icon name="Loader2" size={16} className="animate-spin" /> : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
