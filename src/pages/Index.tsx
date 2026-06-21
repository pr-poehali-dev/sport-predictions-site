import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { historyData } from '@/data/historyData';

const HERO_IMG = 'https://cdn.poehali.dev/projects/aa16d5c7-c763-4514-bc5e-2499ef91f2f8/files/cc9d23a4-7ede-41dc-8e68-2c98c565e584.jpg';

// Все анонсы — автоматически попадают в статистику если дата прошла
const allPredictions = [
  { sport: '⚽', match: 'Испания — Франция', league: 'Лига Наций · финал', desc: 'Разбор тактики, статистика личных встреч, составы.', dateObj: new Date('2026-06-22'), dateStr: '22 июня 2026', analyst: 'Алексей Громов', price: 990 },
  { sport: '🏀', match: 'Евробаскет 2026', league: 'Групповой этап · старт', desc: 'Серия прогнозов на групповой этап от Дмитрия Орлова.', dateObj: new Date('2026-06-26'), dateStr: '26 июня 2026', analyst: 'Дмитрий Орлов', price: 790 },
  { sport: '🎾', match: 'Уимблдон 2026', league: 'Старт турнира', desc: 'Сетка, фавориты, ставки на первые круги.', dateObj: new Date('2026-06-30'), dateStr: '30 июня 2026', analyst: 'Игорь Соколов', price: 690 },
  { sport: '⚽', match: 'Суперкубок Испании', league: 'Реал — Барселона', desc: 'Детальный предматчевый разбор эль-класико.', dateObj: new Date('2026-07-12'), dateStr: '12 июля 2026', analyst: 'Алексей Громов', price: 1290 },
];

const TODAY = new Date('2026-06-20');
const upcoming = allPredictions.filter(p => p.dateObj > TODAY);

const wonCount = historyData.filter(h => h.won).length;
const lostCount = historyData.filter(h => !h.won).length;
const winRate = Math.round((wonCount / historyData.length) * 100);

const analysts = [
  { name: 'Алексей Громов', spec: 'Футбол · ТОП-аналитик', roi: '+47%', online: true },
  { name: 'Дмитрий Орлов', spec: 'Баскетбол · NBA', roi: '+38%', online: true },
  { name: 'Игорь Соколов', spec: 'Теннис · ATP/WTA', roi: '+31%', online: false },
];

const chatMessages = [
  { user: 'Алексей Громов', analyst: true, text: 'Финал ЛЧ ПСЖ — Арсенал: давал «обе забьют», прошло в дополнительное время 1:1, серия пенальти. Поздравляю всех кто взял! ✅', time: '30 мая, 23:47' },
  { user: 'Максим К.', analyst: false, text: 'Огромное спасибо! Поставил на обе забьют по твоей рекомендации, зашло в идеальный момент 🎉', time: '30 мая, 23:51' },
  { user: 'Дмитрий Орлов', analyst: true, text: 'Никс взяли чемпионство! Кто брал победу Никс с кф 2.05 — отличный заход. Разбор по Евробаскету выйдет в пятницу.', time: '18 июн, 10:22' },
  { user: 'Андрей В.', analyst: false, text: 'Дмитрий, спасибо! Третий прогноз подряд в плюс 🔥', time: '18 июн, 10:35' },
  { user: 'Игорь Соколов', analyst: true, text: 'Готовлю разбор Уимблдона — старт 30 июня. Алькарас главный фаворит. Публикую в пятницу.', time: '20 июн, 11:04' },
  { user: 'Сергей М.', analyst: false, text: 'Подписка на этот месяц точно отбилась 😄 Жду Уимблдон!', time: '20 июн, 12:18' },
];

const tabs = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'predictions', label: 'Прогнозы', icon: 'TrendingUp' },
  { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
  { id: 'stats', label: 'Статистика', icon: 'ListChecks' },
  { id: 'chat', label: 'Чат', icon: 'MessagesSquare' },
];

const Brand = () => (
  <span className="font-display text-lg font-800 tracking-tight leading-none">
    Профи<span className="text-secondary">Прогноз</span>
  </span>
);

export default function Index() {
  const [tab, setTab] = useState('home');
  const [msg, setMsg] = useState('');
  const [statsFilter, setStatsFilter] = useState<'all' | 'won' | 'lost'>('all');
  const [statsPage, setStatsPage] = useState(1);
  const PER_PAGE = 25;

  const filteredHistory = useMemo(() =>
    historyData.filter(h => statsFilter === 'all' ? true : statsFilter === 'won' ? h.won : !h.won),
    [statsFilter]
  );
  const totalPages = Math.ceil(filteredHistory.length / PER_PAGE);
  const pagedHistory = filteredHistory.slice((statsPage - 1) * PER_PAGE, statsPage * PER_PAGE);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

      {/* SIDEBAR — desktop */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon name="LineChart" size={18} />
          </div>
          <Brand />
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-600 transition-colors text-left ${
                tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}>
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3 space-y-2">
          <Button className="w-full font-600" size="sm">Личный кабинет</Button>
          <Button variant="ghost" className="w-full font-600" size="sm">Войти</Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* TOP BAR — mobile */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Icon name="LineChart" size={15} />
            </div>
            <span className="font-display text-base font-800">Профи<span className="text-secondary">Прогноз</span></span>
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}>
                <Icon name={t.icon} size={16} />
              </button>
            ))}
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">

          {/* ── ГЛАВНАЯ ── */}
          {tab === 'home' && (
            <div>
              {/* Hero */}
              <div className="relative overflow-hidden">
                <img src={HERO_IMG} alt="" className="h-64 w-full object-cover md:h-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-600 text-white backdrop-blur">
                    <Icon name="BadgeCheck" size={14} className="text-secondary" />
                    Проходимость 85% с января 2026
                  </div>
                  <h1 className="font-display text-3xl font-900 uppercase leading-tight text-white md:text-5xl">
                    Точная <span className="text-secondary">аналитика</span><br />для побед
                  </h1>
                  <div className="mt-4 flex gap-3">
                    <Button size="sm" onClick={() => setTab('predictions')} className="bg-secondary text-secondary-foreground font-700 hover:bg-secondary/90">
                      <Icon name="ShoppingCart" size={16} className="mr-1.5" /> Купить прогноз
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setTab('stats')} className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary font-600">
                      Статистика
                    </Button>
                  </div>
                </div>
              </div>

              {/* Метрики */}
              <div className="grid grid-cols-3 border-b border-border">
                {[['12 400+', 'клиентов'], [`${winRate}%`, 'проходимость'], ['+42%', 'ROI']].map(([v, l]) => (
                  <div key={l} className="border-r last:border-r-0 border-border py-4 text-center">
                    <div className="font-display text-xl font-800 text-secondary md:text-2xl">{v}</div>
                    <div className="text-xs text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>

              {/* Ближайшие прогнозы */}
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-800 uppercase text-primary">Ближайшие прогнозы</h2>
                  <button onClick={() => setTab('predictions')} className="flex items-center gap-1 text-sm font-600 text-primary">
                    Все <Icon name="ArrowRight" size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
                      <span className="text-2xl">{p.sport}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-700 text-primary truncate">{p.match}</div>
                        <div className="text-xs text-muted-foreground">{p.league} · {p.dateStr}</div>
                      </div>
                      <Button size="sm" className="shrink-0 font-700 text-xs">{p.price} ₽</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Аналитики */}
              <div className="border-t border-border p-4">
                <h2 className="mb-3 font-display text-xl font-800 uppercase text-primary">Наши аналитики</h2>
                <div className="space-y-2">
                  {analysts.map(a => (
                    <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-700 text-sm">{a.name[0]}</div>
                        {a.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-700 text-sm text-primary">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.spec}</div>
                      </div>
                      <span className="rounded-md bg-secondary/15 px-2 py-0.5 text-xs font-700 text-secondary">{a.roi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ПРОГНОЗЫ ── */}
          {tab === 'predictions' && (
            <div className="p-4">
              <h2 className="mb-4 font-display text-2xl font-800 uppercase text-primary">Ближайшие прогнозы</h2>
              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                  Нет доступных прогнозов — все прошедшие матчи в разделе Статистика
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {upcoming.map((p, i) => (
                    <div key={i} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                      <div className="mb-2 text-3xl">{p.sport}</div>
                      <div className="text-xs font-600 uppercase tracking-wider text-muted-foreground">{p.league}</div>
                      <h3 className="mt-1 font-display text-lg font-700 text-primary">{p.match}</h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                        <Icon name="Calendar" size={13} className="text-muted-foreground" />
                        <span className="font-600">{p.dateStr}</span>
                        <span className="ml-auto text-muted-foreground">{p.analyst}</span>
                      </div>
                      <Button className="mt-3 w-full font-700">
                        <Icon name="ShoppingCart" size={16} className="mr-2" /> {p.price} ₽
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── АНАЛИТИКА ── */}
          {tab === 'analytics' && (
            <div className="p-4 space-y-4">
              <h2 className="font-display text-2xl font-800 uppercase text-primary">Аналитика</h2>

              {/* Большие карточки */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: 'Target', v: String(historyData.length), l: 'прогнозов за сезон', color: 'text-primary' },
                  { icon: 'TrendingUp', v: '+42%', l: 'средний ROI', color: 'text-secondary' },
                  { icon: 'Trophy', v: String(wonCount), l: 'успешных', color: 'text-green-600' },
                  { icon: 'Users', v: '12.4K', l: 'подписчиков', color: 'text-primary' },
                ].map(c => (
                  <div key={c.l} className="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
                    <div className={`flex justify-center ${c.color}`}><Icon name={c.icon} size={22} /></div>
                    <div className={`mt-2 font-display text-2xl font-800 ${c.color}`}>{c.v}</div>
                    <div className="text-xs text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>

              {/* Проходимость по спортам */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 font-display text-lg font-700 text-primary">Проходимость по видам спорта</h3>
                <div className="space-y-4">
                  {[
                    { l: 'Футбол', v: 87, c: 'bg-primary' },
                    { l: 'Баскетбол', v: 84, c: 'bg-secondary' },
                    { l: 'Теннис', v: 80, c: 'bg-primary' },
                    { l: 'Хоккей', v: 78, c: 'bg-secondary' },
                  ].map(s => (
                    <div key={s.l}>
                      <div className="mb-1.5 flex justify-between text-sm font-600">
                        <span>{s.l}</span>
                        <span className="text-muted-foreground">{s.v}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Win/loss полоска */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-3 font-display text-lg font-700 text-primary">Общий результат (янв — июн 2026)</h3>
                <div className="mb-2 flex justify-between text-sm font-700">
                  <span className="text-green-600">✅ Зашло {winRate}%</span>
                  <span className="text-red-500">❌ Не зашло {100 - winRate}%</span>
                </div>
                <div className="flex h-5 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-green-500" style={{ width: `${winRate}%` }} />
                  <div className="h-full flex-1 bg-red-400" />
                </div>
              </div>
            </div>
          )}

          {/* ── СТАТИСТИКА ── */}
          {tab === 'stats' && (
            <div className="p-4 space-y-4">
              <h2 className="font-display text-2xl font-800 uppercase text-primary">Статистика за 2026 год</h2>
              <p className="text-sm text-muted-foreground">Прошедшие матчи переносятся сюда автоматически.</p>

              {/* Итоги */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: 'ListChecks', v: String(historyData.length), l: 'всего', color: 'text-primary' },
                  { icon: 'CheckCircle2', v: String(wonCount), l: 'зашло', color: 'text-green-600' },
                  { icon: 'XCircle', v: String(lostCount), l: 'не зашло', color: 'text-red-500' },
                  { icon: 'Percent', v: `${winRate}%`, l: 'проходимость', color: 'text-secondary' },
                ].map(c => (
                  <div key={c.l} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                    <div className={`flex justify-center ${c.color}`}><Icon name={c.icon} size={22} /></div>
                    <div className={`mt-1 font-display text-2xl font-800 ${c.color}`}>{c.v}</div>
                    <div className="text-xs text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>

              {/* Полоска */}
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="mb-2 flex justify-between text-xs font-700">
                  <span className="text-green-600">✅ {winRate}% зашло</span>
                  <span className="text-red-500">❌ {100 - winRate}% не зашло</span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-green-500" style={{ width: `${winRate}%` }} />
                  <div className="h-full flex-1 bg-red-400" />
                </div>
              </div>

              {/* Фильтры */}
              <div className="flex gap-2 flex-wrap">
                {([['all', 'Все ' + historyData.length], ['won', '✅ Зашло ' + wonCount], ['lost', '❌ Не зашло ' + lostCount]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => { setStatsFilter(k); setStatsPage(1); }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-600 transition-colors ${
                      statsFilter === k ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Таблица */}
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/50 px-4 py-2.5 text-xs font-700 uppercase tracking-wider text-muted-foreground grid grid-cols-[1fr_auto_auto]">
                  <span>Матч / Дата</span>
                  <span className="hidden sm:block pr-8">Ставка</span>
                  <span>Итог</span>
                </div>
                <div className="divide-y divide-border">
                  {pagedHistory.map((h, i) => (
                    <div key={i} className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3 text-sm hover:bg-muted/20 ${!h.won ? 'opacity-70' : ''}`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-600 text-primary truncate">
                          <span className="shrink-0">{h.sport}</span>
                          <span className="truncate">{h.match}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{h.league} · {h.date}</div>
                        <div className="hidden sm:block text-xs text-muted-foreground mt-0.5">{h.bet} · <span className="font-600 text-secondary">{h.coef}</span></div>
                      </div>
                      <div className="hidden sm:block text-xs text-muted-foreground">{h.bet}</div>
                      <div>
                        {h.won
                          ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-700 text-green-700 whitespace-nowrap"><Icon name="Check" size={11} />Зашло</span>
                          : <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-700 text-red-600 whitespace-nowrap"><Icon name="X" size={11} />Нет</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setStatsPage(p => Math.max(1, p - 1))} disabled={statsPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-40">
                    <Icon name="ChevronLeft" size={16} />
                  </button>
                  <span className="text-sm font-600">{statsPage} / {totalPages}</span>
                  <button onClick={() => setStatsPage(p => Math.min(totalPages, p + 1))} disabled={statsPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card disabled:opacity-40">
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ЧАТ ── */}
          {tab === 'chat' && (
            <div className="flex h-full flex-col">
              {/* Аналитики */}
              <div className="shrink-0 border-b border-border bg-card">
                <div className="flex gap-2 overflow-x-auto p-3 scrollbar-none">
                  {analysts.map(a => (
                    <div key={a.name} className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-700 text-sm">{a.name[0]}</div>
                        {a.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-700 text-primary whitespace-nowrap">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.roi} ROI</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Сообщения */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {chatMessages.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-700 font-display ${m.analyst ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-700">{m.user}</span>
                        {m.analyst && <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-xs font-600 text-secondary">аналитик</span>}
                        <span className="text-xs text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Инпут */}
              <div className="shrink-0 flex gap-2 border-t border-border p-3">
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  placeholder="Написать сообщение..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
                <Button className="shrink-0 font-600"><Icon name="Send" size={17} /></Button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}