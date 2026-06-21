import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { apiGetPurchases } from '@/api';

interface User { id: number; email: string; first_name: string; last_name: string; created_at?: string; }
interface Purchase {
  id: number; match_name: string; league: string; sport: string;
  analyst: string; price: number; prediction: string; purchase_date: string; match_date: string;
}

interface Props {
  user: User;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: Props) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    apiGetPurchases().then(res => {
      if (res.ok) setPurchases(res.purchases);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Шапка профиля */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="font-display text-xl font-800 uppercase text-white">Личный кабинет</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-white text-xs gap-1.5">
          <Icon name="LogOut" size={15} /> Выйти
        </Button>
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
          { icon: 'ShoppingCart', v: String(purchases.length), l: 'куплено прогнозов', c: 'text-white' },
          { icon: 'TrendingUp', v: purchases.length > 0 ? `${purchases.reduce((s, p) => s + p.price, 0).toLocaleString()} ₽` : '0 ₽', l: 'потрачено', c: 'text-secondary' },
          { icon: 'Star', v: purchases.length >= 5 ? 'PRO' : 'BASE', l: 'статус', c: 'text-primary' },
        ].map(c => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-3 text-center">
            <div className={`flex justify-center ${c.c}`}><Icon name={c.icon} size={18} /></div>
            <div className={`mt-1 font-display text-lg font-800 ${c.c}`}>{c.v}</div>
            <div className="text-xs text-muted-foreground leading-tight">{c.l}</div>
          </div>
        ))}
      </div>

      {/* История покупок */}
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
              <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Шапка */}
                <button
                  onClick={() => setOpenId(openId === p.id ? null : p.id)}
                  className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-muted/20 transition-colors"
                >
                  <span className="text-xl">{p.sport}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-700 text-sm text-white truncate">{p.match_name}</div>
                    <div className="text-xs text-muted-foreground">{p.league} · {p.match_date}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-700 text-secondary">{p.price} ₽</span>
                    <Icon name={openId === p.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
                  </div>
                </button>

                {/* Прогноз — открывается при клике */}
                {openId === p.id && (
                  <div className="border-t border-border bg-primary/5 px-4 py-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon name="User" size={13} /> Аналитик: <span className="font-700 text-white">{p.analyst}</span>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-background p-3">
                      <div className="text-xs font-700 text-primary mb-1 uppercase tracking-wide">Прогноз</div>
                      <p className="text-sm text-white leading-relaxed">{p.prediction || 'Прогноз будет добавлен аналитиком перед матчем'}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Куплено: {new Date(p.purchase_date).toLocaleDateString('ru-RU')}
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
