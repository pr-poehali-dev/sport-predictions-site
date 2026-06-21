import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { historyData } from '@/data/historyData';

const HERO_IMG = 'https://cdn.poehali.dev/projects/aa16d5c7-c763-4514-bc5e-2499ef91f2f8/files/cc9d23a4-7ede-41dc-8e68-2c98c565e584.jpg';

const allPredictions = [
  { sport: '⚽', match: 'Испания — Франция', league: 'Лига Наций · финал', desc: 'Разбор тактики, статистика личных встреч, составы.', dateObj: new Date('2026-06-22'), dateStr: '22 июня 2026', analyst: 'Руслан Zidane', price: 990 },
  { sport: '🏀', match: 'Евробаскет 2026', league: 'Групповой этап · старт', desc: 'Серия прогнозов на групповой этап от Романа Juventino.', dateObj: new Date('2026-06-26'), dateStr: '26 июня 2026', analyst: 'Роман Juventino', price: 790 },
  { sport: '🎾', match: 'Уимблдон 2026', league: 'Старт турнира', desc: 'Сетка, фавориты, ставки на первые круги.', dateObj: new Date('2026-06-30'), dateStr: '30 июня 2026', analyst: 'Игорь Соколов', price: 690 },
  { sport: '⚽', match: 'Суперкубок Испании', league: 'Реал — Барселона', desc: 'Детальный предматчевый разбор эль-класико.', dateObj: new Date('2026-07-12'), dateStr: '12 июля 2026', analyst: 'Руслан Zidane', price: 1290 },
];

const tickerItems = [
  '✅ ПСЖ — Арсенал · Обе забьют · +1.72',
  '✅ Никс — Оклахома · Победа Никс · +2.05',
  '✅ Зверев — Кобель · Roland Garros · +1.55',
  '✅ Алькарас — Джокович · AO финал · +1.90',
  '✅ Синнер — Зверев · Мадрид финал · +1.80',
  '✅ Испания — Нидерланды · Победа Испании · +1.70',
  '❌ Алькарас — Медведев · Мадрид п/ф · +1.70',
  '✅ Реал — Барселона · Тотал 2.5+ · +1.60',
];

const TODAY = new Date('2026-06-20');
const upcoming = allPredictions.filter(p => p.dateObj > TODAY);

const wonCount = historyData.filter(h => h.won).length;
const lostCount = historyData.filter(h => !h.won).length;
const winRate = Math.round((wonCount / historyData.length) * 100);

const analysts = [
  { name: 'Руслан Zidane', spec: 'Футбол · ТОП-аналитик', roi: '+47%', online: true, wins: 94 },
  { name: 'Роман Juventino', spec: 'Баскетбол · NBA', roi: '+38%', online: true, wins: 78 },
  { name: 'Игорь Соколов', spec: 'Теннис · ATP/WTA', roi: '+31%', online: false, wins: 43 },
];

const chatMessages = [
  { user: 'Руслан Zidane', analyst: true, text: 'Финал ЛЧ ПСЖ — Арсенал: давал «обе забьют», прошло в дополнительное время 1:1, серия пенальти. Поздравляю всех кто взял! ✅', time: '30 мая, 23:47' },
  { user: 'Максим К.', analyst: false, text: 'Огромное спасибо! Поставил на обе забьют, зашло в идеальный момент 🎉', time: '30 мая, 23:51' },
  { user: 'Роман Juventino', analyst: true, text: 'Никс взяли чемпионство! Кто брал победу Никс с кф 2.05 — отличный заход. Разбор по Евробаскету выйдет в пятницу.', time: '18 июн, 10:22' },
  { user: 'Андрей В.', analyst: false, text: 'Роман, спасибо! Третий прогноз подряд в плюс 🔥', time: '18 июн, 10:35' },
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
  <span className="font-display text-lg font-800 tracking-tight leading-none text-white">
    Профи<span className="text-primary">Прогноз</span>
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
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border lg:flex" style={{ background: 'hsl(220 20% 6%)' }}>
        {/* Лого */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-black font-800">
            <Icon name="Zap" size={18} />
          </div>
          <Brand />
        </div>

        {/* Лайв-бейдж */}
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-700 text-primary">LIVE · 3 матча</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 mt-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-600 transition-all text-left ${
                tab === t.id
                  ? 'bg-primary text-black font-700 glow-green'
                  : 'text-muted-foreground hover:bg-muted hover:text-white'
              }`}>
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          <Button className="w-full font-700 bg-primary text-black hover:bg-primary/90 glow-green" size="sm">
            Личный кабинет
          </Button>
          <Button variant="ghost" className="w-full font-600 text-muted-foreground hover:text-white" size="sm">Войти</Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* TOP BAR — mobile */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black">
              <Icon name="Zap" size={16} />
            </div>
            <Brand />
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  tab === t.id ? 'bg-primary text-black' : 'text-muted-foreground'
                }`}>
                <Icon name={t.icon} size={16} />
              </button>
            ))}
          </div>
        </header>

        {/* Бегущая строка */}
        <div className="flex h-8 shrink-0 items-center overflow-hidden border-b border-border bg-muted/60">
          <div className="flex shrink-0 items-center border-r border-border bg-primary px-3 h-full">
            <span className="text-xs font-800 text-black uppercase tracking-wider">Результаты</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex animate-ticker whitespace-nowrap gap-8 px-4">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className={`text-xs font-600 shrink-0 ${item.startsWith('✅') ? 'text-primary' : 'text-red-400'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">

          {/* ── ГЛАВНАЯ ── */}
          {tab === 'home' && (
            <div>
              {/* Hero */}
              <div className="relative overflow-hidden min-h-[220px] md:min-h-[280px]">
                <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(220 20% 5% / 0.97) 0%, hsl(220 20% 8% / 0.80) 60%, transparent 100%)' }} />
                <div className="relative flex flex-col justify-center px-5 py-8 md:px-10 md:py-12">
                  {/* Бейдж */}
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 backdrop-blur">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-xs font-700 text-primary uppercase tracking-wide">Проходимость {winRate}% · 2026 год</span>
                  </div>

                  <h1 className="font-display text-3xl font-900 uppercase leading-tight text-white md:text-5xl">
                    Бей точно.<br />
                    <span className="text-primary">Выигрывай</span> стабильно.
                  </h1>
                  <p className="mt-3 max-w-sm text-sm text-white/60 md:text-base">
                    Профессиональные прогнозы от аналитиков с многолетним опытом. Только цифры, никаких эмоций.
                  </p>

                  <div className="mt-5 flex gap-3 flex-wrap">
                    <Button onClick={() => setTab('predictions')}
                      className="bg-primary text-black font-700 hover:bg-primary/90 glow-green h-10 px-5">
                      <Icon name="ShoppingCart" size={16} className="mr-2" /> Купить прогноз
                    </Button>
                    <Button variant="outline" onClick={() => setTab('stats')}
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 font-600 h-10 px-5">
                      Статистика
                    </Button>
                  </div>

                  {/* Метрики прямо в героe */}
                  <div className="mt-6 flex gap-6">
                    {[['12 400+', 'клиентов'], [`${winRate}%`, 'проходимость'], ['+42%', 'средний ROI']].map(([v, l]) => (
                      <div key={l}>
                        <div className="font-display text-2xl font-800 text-primary">{v}</div>
                        <div className="text-xs text-white/50">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ближайшие прогнозы */}
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-primary" />
                    <h2 className="font-display text-base font-800 uppercase tracking-wide text-white">Ближайшие прогнозы</h2>
                  </div>
                  <button onClick={() => setTab('predictions')} className="flex items-center gap-1 text-xs font-600 text-primary">
                    Все <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {upcoming.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/40">
                      <span className="text-2xl">{p.sport}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-700 text-white truncate text-sm">{p.match}</div>
                        <div className="text-xs text-muted-foreground">{p.league} · {p.dateStr}</div>
                      </div>
                      <Button size="sm" className="shrink-0 bg-secondary text-white font-700 text-xs hover:bg-secondary/90 glow-orange">
                        {p.price} ₽
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Аналитики */}
              <div className="border-t border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-4 w-1 rounded-full bg-secondary" />
                  <h2 className="font-display text-base font-800 uppercase tracking-wide text-white">Наши аналитики</h2>
                </div>
                <div className="space-y-2">
                  {analysts.map(a => (
                    <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black font-display font-800 text-sm">{a.name[0]}</div>
                        {a.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-700 text-sm text-white">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.spec}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-800 text-primary">{a.roi}</div>
                        <div className="text-xs text-muted-foreground">{a.wins} прогн.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ПРОГНОЗЫ ── */}
          {tab === 'predictions' && (
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-primary" />
                <h2 className="font-display text-xl font-800 uppercase text-white">Ближайшие прогнозы</h2>
              </div>
              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                  Нет доступных прогнозов — все прошедшие матчи в разделе Статистика
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {upcoming.map((p, i) => (
                    <div key={i} className="flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-3xl">{p.sport}</span>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-700 text-primary uppercase">Скоро</span>
                      </div>
                      <div className="text-xs font-600 uppercase tracking-wider text-muted-foreground">{p.league}</div>
                      <h3 className="mt-1 font-display text-lg font-700 text-white">{p.match}</h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.desc}</p>
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                        <Icon name="Calendar" size={13} className="text-primary" />
                        <span className="font-600 text-white">{p.dateStr}</span>
                        <span className="ml-auto text-muted-foreground">{p.analyst}</span>
                      </div>
                      <Button className="mt-3 w-full font-700 bg-secondary text-white hover:bg-secondary/90 glow-orange">
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
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-primary" />
                <h2 className="font-display text-xl font-800 uppercase text-white">Аналитика</h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: 'Target', v: String(historyData.length), l: 'прогнозов за сезон', accent: 'text-primary', bg: 'bg-primary/10 border-primary/25' },
                  { icon: 'TrendingUp', v: '+42%', l: 'средний ROI', accent: 'text-secondary', bg: 'bg-secondary/10 border-secondary/25' },
                  { icon: 'Trophy', v: String(wonCount), l: 'успешных', accent: 'text-primary', bg: 'bg-primary/10 border-primary/25' },
                  { icon: 'Users', v: '12.4K', l: 'подписчиков', accent: 'text-secondary', bg: 'bg-secondary/10 border-secondary/25' },
                ].map(c => (
                  <div key={c.l} className={`rounded-xl border ${c.bg} bg-card p-4 text-center shadow-sm`}>
                    <div className={`flex justify-center ${c.accent}`}><Icon name={c.icon} size={22} /></div>
                    <div className={`mt-1 font-display text-2xl font-800 ${c.accent}`}>{c.v}</div>
                    <div className="text-xs text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 flex items-center gap-2 font-display text-base font-700 text-white">
                  <Icon name="BarChart3" size={18} className="text-primary" />
                  Проходимость по видам спорта
                </h3>
                <div className="space-y-4">
                  {[
                    { l: 'Футбол', v: 87, icon: '⚽' },
                    { l: 'Баскетбол', v: 84, icon: '🏀' },
                    { l: 'Теннис', v: 80, icon: '🎾' },
                    { l: 'Хоккей', v: 78, icon: '🏒' },
                  ].map((s, idx) => (
                    <div key={s.l}>
                      <div className="mb-1.5 flex justify-between text-sm font-600">
                        <span className="flex items-center gap-1.5 text-white"><span>{s.icon}</span>{s.l}</span>
                        <span className="font-700 text-primary">{s.v}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}
                          style={{ width: `${s.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-700 text-white">
                  <Icon name="PieChart" size={18} className="text-secondary" />
                  Общий результат за 2026 год
                </h3>
                <div className="mb-2 flex justify-between text-sm font-700">
                  <span className="text-primary">✅ Зашло {winRate}%</span>
                  <span className="text-red-400">❌ Не зашло {100 - winRate}%</span>
                </div>
                <div className="flex h-5 w-full overflow-hidden rounded-full">
                  <div className="h-full bg-primary" style={{ width: `${winRate}%` }} />
                  <div className="h-full flex-1 bg-red-500/60" />
                </div>
              </div>
            </div>
          )}

          {/* ── СТАТИСТИКА ── */}
          {tab === 'stats' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 w-1 rounded-full bg-primary" />
                <div>
                  <h2 className="font-display text-xl font-800 uppercase text-white">Статистика за 2026 год</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Прошедшие матчи переносятся сюда автоматически</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: 'ListChecks', v: String(historyData.length), l: 'всего', color: 'text-white', bg: 'border-border' },
                  { icon: 'CheckCircle2', v: String(wonCount), l: 'зашло', color: 'text-primary', bg: 'border-primary/30' },
                  { icon: 'XCircle', v: String(lostCount), l: 'не зашло', color: 'text-red-400', bg: 'border-red-500/20' },
                  { icon: 'Percent', v: `${winRate}%`, l: 'проходимость', color: 'text-secondary', bg: 'border-secondary/30' },
                ].map(c => (
                  <div key={c.l} className={`rounded-xl border ${c.bg} bg-card p-4 text-center`}>
                    <div className={`flex justify-center ${c.color}`}><Icon name={c.icon} size={22} /></div>
                    <div className={`mt-1 font-display text-2xl font-800 ${c.color}`}>{c.v}</div>
                    <div className="text-xs text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="mb-2 flex justify-between text-xs font-700">
                  <span className="text-primary">✅ {winRate}% зашло</span>
                  <span className="text-red-400">❌ {100 - winRate}% не зашло</span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${winRate}%` }} />
                  <div className="h-full flex-1 bg-red-500/60" />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {([['all', `Все ${historyData.length}`], ['won', `✅ Зашло ${wonCount}`], ['lost', `❌ Не зашло ${lostCount}`]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => { setStatsFilter(k); setStatsPage(1); }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-600 transition-colors ${
                      statsFilter === k
                        ? 'bg-primary text-black font-700'
                        : 'border border-border bg-card text-muted-foreground hover:text-white'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-700 uppercase tracking-wider text-muted-foreground grid grid-cols-[1fr_auto]">
                  <span>Матч / Дата</span>
                  <span>Итог</span>
                </div>
                <div className="divide-y divide-border">
                  {pagedHistory.map((h, i) => (
                    <div key={i} className={`grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/20 ${!h.won ? 'opacity-60' : ''}`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-600 text-white truncate">
                          <span className="shrink-0">{h.sport}</span>
                          <span className="truncate">{h.match}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{h.league} · {h.date} · <span className="font-600 text-secondary">{h.coef}</span></div>
                        <div className="text-xs text-muted-foreground">{h.bet}</div>
                      </div>
                      <div>
                        {h.won
                          ? <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-xs font-700 text-primary whitespace-nowrap">
                              <Icon name="Check" size={11} />Зашло
                            </span>
                          : <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-xs font-700 text-red-400 whitespace-nowrap">
                              <Icon name="X" size={11} />Нет
                            </span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setStatsPage(p => Math.max(1, p - 1))} disabled={statsPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-white disabled:opacity-30">
                    <Icon name="ChevronLeft" size={16} />
                  </button>
                  <span className="text-sm font-600 text-white">{statsPage} / {totalPages}</span>
                  <button onClick={() => setStatsPage(p => Math.min(totalPages, p + 1))} disabled={statsPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-white disabled:opacity-30">
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ЧАТ ── */}
          {tab === 'chat' && (
            <div className="flex h-full flex-col">
              <div className="shrink-0 border-b border-border bg-card">
                <div className="flex gap-2 overflow-x-auto p-3 scrollbar-none">
                  {analysts.map(a => (
                    <div key={a.name} className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-all hover:border-primary/40">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black font-display font-800 text-sm">{a.name[0]}</div>
                        {a.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />}
                      </div>
                      <div>
                        <div className="text-xs font-700 text-white whitespace-nowrap">{a.name}</div>
                        <div className="text-xs text-primary font-600">{a.roi} ROI</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {chatMessages.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-800 font-display ${m.analyst ? 'bg-primary text-black' : 'bg-muted text-white'}`}>
                      {m.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-700 text-white">{m.user}</span>
                        {m.analyst && <span className="rounded bg-primary/20 border border-primary/30 px-1.5 py-0.5 text-xs font-600 text-primary">аналитик</span>}
                        <span className="text-xs text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shrink-0 flex gap-2 border-t border-border p-3">
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  placeholder="Написать сообщение..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
                <Button className="shrink-0 bg-primary text-black font-700 hover:bg-primary/90">
                  <Icon name="Send" size={17} />
                </Button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}