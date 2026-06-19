import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG = 'https://cdn.poehali.dev/projects/aa16d5c7-c763-4514-bc5e-2499ef91f2f8/files/56154eb8-5323-4288-a0db-94100268e123.jpg';

const nav = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'predictions', label: 'Прогнозы', icon: 'TrendingUp' },
  { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
  { id: 'chat', label: 'Чат', icon: 'MessagesSquare' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const ticker = [
  'Реал — Барселона · П1 · кф 2.10',
  'Лейкерс — Бостон · ТБ 215.5 · кф 1.85',
  'Манчестер Сити — Арсенал · ТМ 3.5 · кф 1.70',
  'Джокович — Алькарас · П1 · кф 1.95',
  'Бавария — Дортмунд · Обе забьют · кф 1.60',
];

const predictions = [
  { sport: '⚽', match: 'Реал Мадрид — Барселона', league: 'Ла Лига', bet: 'Победа Реала', coef: '2.10', conf: 92, time: 'Сегодня 22:00', price: 990, hot: true },
  { sport: '🏀', match: 'Лейкерс — Бостон Селтикс', league: 'NBA', bet: 'Тотал больше 215.5', coef: '1.85', conf: 88, time: 'Завтра 04:30', price: 790, hot: false },
  { sport: '🎾', match: 'Джокович — Алькарас', league: 'ATP Finals', bet: 'Победа Джоковича', coef: '1.95', conf: 85, time: 'Сегодня 19:00', price: 690, hot: false },
  { sport: '⚽', match: 'Бавария — Боруссия Д', league: 'Бундеслига', bet: 'Обе забьют', coef: '1.60', conf: 90, time: 'Завтра 19:30', price: 890, hot: true },
];

const analysts = [
  { name: 'Алексей Громов', spec: 'Футбол · ТОП-аналитик', roi: '+47%', online: true },
  { name: 'Дмитрий Орлов', spec: 'Баскетбол · NBA', roi: '+38%', online: true },
  { name: 'Игорь Соколов', spec: 'Теннис · ATP/WTA', roi: '+31%', online: false },
];

const chatMessages = [
  { user: 'Алексей Громов', analyst: true, text: 'Сегодня даю экспресс на ЛЧ. Проходимость высокая, разбор внутри.', time: '14:02' },
  { user: 'Сергей М.', analyst: false, text: 'Спасибо за вчерашний прогноз, зашло 🔥', time: '14:05' },
  { user: 'Дмитрий Орлов', analyst: true, text: 'По NBA вечером будет инсайд по травмам. Следите за каналом.', time: '14:11' },
];

const Index = () => {
  const [active, setActive] = useState('home');
  const [msg, setMsg] = useState('');

  return (
    <div className="min-h-screen text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon name="Zap" size={20} />
            </div>
            <span className="font-display text-2xl font-700 tracking-tight">
              PROGNOZ<span className="text-primary">.PRO</span>
            </span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-500 transition-colors ${
                  active === n.id ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex">Войти</Button>
            <Button className="font-600">Личный кабинет</Button>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div className="overflow-hidden border-b border-border bg-card py-2">
        <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="container relative px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-500 text-primary">
              <Icon name="Flame" size={16} />
              Проходимость прогнозов 87% за месяц
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-700 uppercase leading-[0.95] tracking-tight md:text-7xl" style={{ animationDelay: '0.1s' }}>
              Ставь<br />
              <span className="text-primary">на победу</span><br />
              вместе с про
            </h1>
            <p className="mt-6 max-w-xl animate-fade-in text-lg text-muted-foreground" style={{ animationDelay: '0.2s' }}>
              Платные прогнозы от профессиональных аналитиков. Глубокий разбор матчей, статистика и чат с экспертами в реальном времени.
            </p>
            <div className="mt-8 flex animate-fade-in flex-wrap gap-3" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="h-13 animate-glow px-8 text-base font-700">
                <Icon name="Rocket" size={20} className="mr-2" />
                Купить прогноз
              </Button>
              <Button size="lg" variant="outline" className="h-13 border-secondary px-8 text-base font-600 text-secondary hover:bg-secondary hover:text-secondary-foreground">
                Смотреть аналитику
              </Button>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[['12 400+', 'клиентов'], ['87%', 'проходимость'], ['+42%', 'средний ROI']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-700 text-primary md:text-4xl">{v}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREDICTIONS */}
      <section className="container px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-display text-sm font-600 uppercase tracking-widest text-secondary">Витрина</span>
            <h2 className="font-display text-4xl font-700 uppercase tracking-tight md:text-5xl">Прогнозы дня</h2>
          </div>
          <Button variant="ghost" className="hidden text-primary sm:inline-flex">
            Все прогнозы <Icon name="ArrowRight" size={18} className="ml-1" />
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {predictions.map((p, i) => (
            <div
              key={i}
              className="group relative animate-scale-in overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {p.hot && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-700 text-secondary-foreground">
                  <Icon name="Flame" size={12} /> HOT
                </span>
              )}
              <div className="mb-3 flex items-center gap-2 text-3xl">{p.sport}</div>
              <div className="text-xs font-500 uppercase tracking-wider text-muted-foreground">{p.league}</div>
              <h3 className="mt-1 font-display text-xl font-600 leading-tight">{p.match}</h3>
              <div className="mt-4 rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Ставка аналитика</div>
                <div className="font-600 text-foreground">{p.bet}</div>
                <div className="mt-1 font-display text-2xl font-700 text-primary">{p.coef}</div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Уверенность</span>
                  <span className="font-600 text-primary">{p.conf}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${p.conf}%` }} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{p.time}</span>
                <Button size="sm" className="font-600">{p.price} ₽</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="border-y border-border bg-card/50">
        <div className="container grid gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <span className="font-display text-sm font-600 uppercase tracking-widest text-secondary">Аналитика</span>
            <h2 className="font-display text-4xl font-700 uppercase tracking-tight md:text-5xl">Цифры, которым доверяют</h2>
            <p className="mt-4 text-muted-foreground">
              Каждый прогноз подкреплён статистикой: форма команд, личные встречи, травмы и движение коэффициентов. Прозрачная история результатов.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { l: 'Футбол', v: 89, c: 'bg-primary' },
                { l: 'Баскетбол', v: 84, c: 'bg-secondary' },
                { l: 'Теннис', v: 81, c: 'bg-primary' },
                { l: 'Хоккей', v: 78, c: 'bg-secondary' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="mb-1 flex justify-between text-sm font-500">
                    <span>{s.l}</span><span className="text-muted-foreground">{s.v}% проходимость</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              { icon: 'Target', v: '2 840', l: 'прогнозов за сезон' },
              { icon: 'TrendingUp', v: '+42%', l: 'средний ROI клиента' },
              { icon: 'Trophy', v: '187', l: 'удачных экспрессов' },
              { icon: 'Users', v: '12.4K', l: 'активных подписчиков' },
            ].map((c) => (
              <div key={c.l} className="rounded-2xl border border-border bg-background p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon name={c.icon} size={22} />
                </div>
                <div className="mt-4 font-display text-3xl font-700">{c.v}</div>
                <div className="text-sm text-muted-foreground">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section className="container px-4 py-20">
        <div className="mb-10 text-center">
          <span className="font-display text-sm font-600 uppercase tracking-widest text-secondary">Сообщество</span>
          <h2 className="font-display text-4xl font-700 uppercase tracking-tight md:text-5xl">Чат с аналитиками</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Общайтесь с экспертами и игроками в реальном времени, получайте инсайды и обсуждайте матчи.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* analysts */}
          <div className="space-y-3">
            {analysts.map((a) => (
              <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted font-display font-600">
                    {a.name[0]}
                  </div>
                  {a.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-primary" />}
                </div>
                <div className="flex-1">
                  <div className="font-600">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.spec}</div>
                </div>
                <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-700 text-primary">{a.roi}</span>
              </div>
            ))}
          </div>
          {/* chat window */}
          <div className="flex flex-col rounded-2xl border border-border bg-card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2 font-600">
                <Icon name="MessagesSquare" size={18} className="text-primary" />
                Общий чат
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> 348 онлайн
              </span>
            </div>
            <div className="flex-1 space-y-4 p-4">
              {chatMessages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-600 ${m.analyst ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {m.user[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-600">{m.user}</span>
                      {m.analyst && <span className="rounded bg-secondary/20 px-1.5 text-xs font-600 text-secondary">аналитик</span>}
                      <span className="text-xs text-muted-foreground">{m.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-4">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Написать сообщение..."
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <Button className="font-600"><Icon name="Send" size={18} /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card to-background p-10 text-center md:p-16">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <h2 className="font-display text-4xl font-700 uppercase tracking-tight md:text-5xl">Готов выигрывать?</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">Оформи подписку и получай прогнозы от лучших аналитиков каждый день.</p>
            <Button size="lg" className="mt-8 h-13 px-10 text-base font-700">
              <Icon name="Rocket" size={20} className="mr-2" /> Купить прогноз
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <span className="font-display text-lg font-700 text-foreground">PROGNOZ<span className="text-primary">.PRO</span></span>
          <span>© 2026 · Прогнозы 18+. Делайте ставки ответственно.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
