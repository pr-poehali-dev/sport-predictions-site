import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { apiGetPurchases } from '@/api';

interface User { id: number; email: string; first_name: string; last_name: string; created_at?: string; }
interface Purchase {
  id: number; match_name: string; league: string; sport: string;
  analyst: string; price: number; prediction: string;
  purchase_date: string; match_date: string;
  status: string; payment_note?: string;
}

interface Props {
  user: User;
  onLogout: () => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'confirmed') return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-700 text-primary whitespace-nowrap">
      <Icon name="CheckCircle2" size={11} /> Подтверждено
    </span>
  );
  if (status === 'rejected') return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-700 text-red-400 whitespace-nowrap">
      <Icon name="XCircle" size={11} /> Отклонено
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-700 text-yellow-400 whitespace-nowrap">
      <Icon name="Clock" size={11} /> Ожидает оплаты
    </span>
  );
}

export default function ProfilePage({ user, onLogout }: Props) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    apiGetPurchases().then(res => {
      if (res.ok) setPurchases(res.purchases);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []);

  const confirmed = purchases.filter(p => p.status === 'confirmed').length;

  return (
    <div className="p-4 space-y-4">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="font-display text-xl font-800 uppercase text-white">Личный кабинет</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="text-muted-foreground hover:text-white transition-colors p-1.5 rounded-lg hover:bg-muted">
            <Icon name="RefreshCw" size={15} />
          </button>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-white text-xs gap-1.5">
            <Icon name="LogOut" size={15} /> Выйти
          </Button>
        </div>
      </div>

      {/* Карточка пользователя */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-black font-display font-800 text-xl">
          {user.first_name[0]}{user.last_name[0]}
        </div>
        <div>
          <div className="font-display text-lg font-800 text-white">{user.first_name} {user.last_name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-700 text-primary">
            <Icon name="BadgeCheck" size={12} /> Подписчик ПрофиПрогноз
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: 'ShoppingCart', v: String(purchases.length), l: 'заявок', c: 'text-white' },
          { icon: 'CheckCircle2', v: String(confirmed), l: 'подтверждено', c: 'text-primary' },
          { icon: 'Star', v: confirmed >= 5 ? 'PRO' : 'BASE', l: 'статус', c: 'text-secondary' },
        ].map(c => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className={`flex justify-center ${c.c}`}><Icon name={c.icon} size={18} /></div>
            <div className={`mt-1 font-display text-lg font-800 ${c.c}`}>{c.v}</div>
            <div className="text-xs text-muted-foreground leading-tight">{c.l}</div>
          </div>
        ))}
      </div>

      {/* Реквизиты для оплаты */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-700 text-yellow-400">
          <Icon name="CreditCard" size={16} /> Реквизиты для оплаты
        </div>
        <div className="font-display text-base font-800 tracking-widest text-white">5586 2000 7208 9508</div>
        <p className="text-xs text-muted-foreground">В комментарии к переводу укажите ваш email · Подтверждение до 30 мин.</p>
      </div>

      {/* История */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-secondary" />
          <h3 className="font-display text-base font-700 uppercase text-white">История прогнозов</h3>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Icon name="Loader2" size={22} className="animate-spin mr-2" /> Загрузка...
          </div>
        )}

        {!loading && purchases.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Icon name="ShoppingCart" size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">У вас пока нет купленных прогнозов</p>
            <p className="text-xs text-muted-foreground mt-1">Перейдите в раздел «Прогнозы» и купите первый</p>
          </div>
        )}

        {!loading && purchases.length > 0 && (
          <div className="space-y-2">
            {purchases.map(p => (
              <div key={p.id} className={`rounded-xl border bg-card overflow-hidden ${
                p.status === 'confirmed' ? 'border-primary/30' :
                p.status === 'rejected' ? 'border-red-500/20' : 'border-yellow-500/20'
              }`}>
                <button
                  onClick={() => setOpenId(openId === p.id ? null : p.id)}
                  className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-muted/20 transition-colors"
                >
                  <span className="text-xl">{p.sport}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-700 text-sm text-white truncate">{p.match_name}</div>
                    <div className="text-xs text-muted-foreground">{p.league} · {p.match_date}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-700 text-secondary">{p.price} ₽</span>
                    <StatusBadge status={p.status} />
                  </div>
                </button>

                {openId === p.id && (
                  <div className="border-t border-border bg-background/40 px-4 py-3 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon name="User" size={13} /> Аналитик: <span className="font-700 text-white">{p.analyst}</span>
                    </div>

                    {p.status === 'confirmed' ? (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <div className="text-xs font-700 text-primary mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                          <Icon name="Unlock" size={12} /> Прогноз открыт
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                          {p.prediction || 'Аналитик добавит прогноз за 2 часа до матча'}
                        </p>
                      </div>
                    ) : p.status === 'rejected' ? (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                        <div className="text-xs font-700 text-red-400 mb-1">Оплата не подтверждена</div>
                        <p className="text-sm text-muted-foreground">
                          {p.payment_note || 'Свяжитесь с поддержкой или повторите оплату'}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2.5">
                        <Icon name="Lock" size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-700 text-yellow-400 mb-0.5">Ожидает подтверждения оплаты</div>
                          <p className="text-xs text-muted-foreground">
                            После подтверждения перевода прогноз откроется автоматически. Обычно до 30 минут.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Заявка создана: {new Date(p.purchase_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
