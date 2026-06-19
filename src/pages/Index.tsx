import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG = 'https://cdn.poehali.dev/projects/aa16d5c7-c763-4514-bc5e-2499ef91f2f8/files/cc9d23a4-7ede-41dc-8e68-2c98c565e584.jpg';

const nav = [
  { id: 'home', label: 'Главная' },
  { id: 'predictions', label: 'Прогнозы' },
  { id: 'analytics', label: 'Аналитика' },
  { id: 'chat', label: 'Чат' },
  { id: 'profile', label: 'Профиль' },
];

const predictions = [
  { sport: '⚽', match: 'ПСЖ — Арсенал', league: 'Финал ЛЧ · 30 мая 2026', bet: 'Обе команды забьют', coef: '1.72', conf: 91, time: '✅ Зашло: 1:1 д.в., пен. 4:3', price: 1490, hot: true, result: true },
  { sport: '⚽', match: 'ПСЖ — Бавария', league: 'Полуфинал ЛЧ · май 2026', bet: 'Тотал больше 3.5 (2 матча)', coef: '1.88', conf: 87, time: '✅ Зашло: 6:5 по итогам', price: 990, hot: true, result: true },
  { sport: '🏀', match: 'Никс — Оклахома', league: 'Финал NBA · июнь 2026', bet: 'Победа Никс', coef: '2.05', conf: 83, time: '✅ Зашло: Никс — чемпионы', price: 890, hot: false, result: true },
  { sport: '⚽', match: 'Арсенал — Ньюкасл', league: 'АПЛ · 5 апреля 2026', bet: 'Победа Арсенала', coef: '1.65', conf: 89, time: '✅ Зашло: 2:0', price: 690, hot: false, result: true },
];

const analysts = [
  { name: 'Алексей Громов', spec: 'Футбол · ТОП-аналитик', roi: '+47%', online: true },
  { name: 'Дмитрий Орлов', spec: 'Баскетбол · NBA', roi: '+38%', online: true },
  { name: 'Игорь Соколов', spec: 'Теннис · ATP/WTA', roi: '+31%', online: false },
];

const chatMessages = [
  { user: 'Алексей Громов', analyst: true, text: 'Финал ЛЧ ПСЖ — Арсенал: давал «обе забьют», прошло в дополнительное время 1:1, серия пенальти. Поздравляю всех кто взял! ✅', time: '30 мая, 23:47' },
  { user: 'Максим К.', analyst: false, text: 'Огромное спасибо! Поставил на обе забьют по твоей рекомендации, зашло в идеальный момент 🎉', time: '30 мая, 23:51' },
  { user: 'Дмитрий Орлов', analyst: true, text: 'По финалу NBA — Никс взяли чемпионство! Кто брал победу Никс с кф 2.05 — отличный заход. Следующий разбор по Евробаскету выйдет в пятницу.', time: '18 июн, 10:22' },
  { user: 'Андрей В.', analyst: false, text: 'Дмитрий, спасибо! Третий прогноз подряд в плюс. Никс взял, плюс ещё ПСЖ на выход из полуфинала ЛЧ зашло 🔥', time: '18 июн, 10:35' },
  { user: 'Игорь Соколов', analyst: true, text: 'Ребята, готовлю разбор Roland Garros — финал мужчин. Алькарас в отличной форме, коэф привлекательный. Публикую вечером.', time: '8 июн, 16:04' },
  { user: 'Сергей М.', analyst: false, text: 'Игорь, по Арсенал — Ньюкасл 2:0 тоже зашло на прошлой неделе! Подписка на этот месяц точно отбилась 😄', time: '6 апр, 09:18' },
];

const Brand = ({ className = '' }: { className?: string }) => (
  <span className={`font-display font-800 tracking-tight ${className}`}>
    Аналитика<span className="text-secondary">&</span>Прогнозы
  </span>
);

const Index = () => {
  const [active, setActive] = useState('home');
  const [msg, setMsg] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex h-18 items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon name="LineChart" size={20} />
            </div>
            <Brand className="text-xl" />
          </div>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`relative text-sm font-600 transition-colors ${
                  active === n.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {n.label}
                {active === n.id && <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-secondary" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex">Войти</Button>
            <Button className="font-600">Личный кабинет</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        </div>
        <div className="container relative px-4 py-24 md:py-36">
          <div className="max-w-3xl text-primary-foreground">
            <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-500 backdrop-blur">
              <Icon name="BadgeCheck" size={16} className="text-secondary" />
              Проходимость прогнозов 87% за месяц
            </div>
            <h1 className="animate-fade-in font-display text-5xl font-900 uppercase leading-[0.95] tracking-tight md:text-7xl" style={{ animationDelay: '0.1s' }}>
              Точная<br />
              <span className="text-secondary">аналитика</span><br />
              для побед
            </h1>
            <p className="mt-6 max-w-xl animate-fade-in text-lg text-white/80" style={{ animationDelay: '0.2s' }}>
              Глубокий разбор матчей, статистика и прогнозы от профессиональных аналитиков. Принимайте решения на основе цифр, а не эмоций.
            </p>
            <div className="mt-8 flex animate-fade-in flex-wrap gap-3" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="h-13 bg-secondary px-8 text-base font-700 text-secondary-foreground hover:bg-secondary/90">
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Купить прогноз
              </Button>
              <Button size="lg" variant="outline" className="h-13 border-white/40 bg-transparent px-8 text-base font-600 text-white hover:bg-white hover:text-primary">
                Смотреть аналитику
              </Button>
            </div>
            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[['12 400+', 'клиентов'], ['87%', 'проходимость'], ['+42%', 'средний ROI']].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-800 text-secondary md:text-4xl">{v}</div>
                  <div className="text-sm text-white/70">{l}</div>
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
            <span className="font-display text-sm font-700 uppercase tracking-widest text-secondary">История побед</span>
            <h2 className="font-display text-4xl font-800 uppercase tracking-tight text-primary md:text-5xl">Наши прогнозы</h2>
          </div>
          <Button variant="ghost" className="hidden text-primary sm:inline-flex">
            Все прогнозы <Icon name="ArrowRight" size={18} className="ml-1" />
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {predictions.map((p, i) => (
            <div
              key={i}
              className="group relative animate-scale-in overflow-hidden rounded-xl border border-green-200 bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-700 text-green-700">
                <Icon name="CheckCircle2" size={12} /> ЗАШЛО
              </span>
              <div className="mb-3 text-3xl">{p.sport}</div>
              <div className="text-xs font-600 uppercase tracking-wider text-muted-foreground">{p.league}</div>
              <h3 className="mt-1 font-display text-lg font-700 leading-tight text-primary">{p.match}</h3>
              <div className="mt-4 rounded-lg bg-muted p-3">
                <div className="text-xs text-muted-foreground">Ставка аналитика</div>
                <div className="font-600">{p.bet}</div>
                <div className="mt-1 font-display text-2xl font-800 text-secondary">{p.coef}</div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Уверенность</span>
                  <span className="font-700 text-primary">{p.conf}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${p.conf}%` }} />
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-600 text-green-700">
                {p.time}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="border-y border-border bg-muted/40">
        <div className="container grid gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <span className="font-display text-sm font-700 uppercase tracking-widest text-secondary">Аналитика</span>
            <h2 className="font-display text-4xl font-800 uppercase tracking-tight text-primary md:text-5xl">Цифры, которым доверяют</h2>
            <p className="mt-4 text-muted-foreground">
              Каждый прогноз подкреплён статистикой: форма команд, личные встречи, травмы и движение коэффициентов. Прозрачная история результатов.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { l: 'Футбол', v: 89 },
                { l: 'Баскетбол', v: 84 },
                { l: 'Теннис', v: 81 },
                { l: 'Хоккей', v: 78 },
              ].map((s, idx) => (
                <div key={s.l}>
                  <div className="mb-1 flex justify-between text-sm font-600">
                    <span>{s.l}</span><span className="text-muted-foreground">{s.v}% проходимость</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${idx % 2 ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${s.v}%` }} />
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
              <div key={c.l} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={c.icon} size={22} />
                </div>
                <div className="mt-4 font-display text-3xl font-800 text-primary">{c.v}</div>
                <div className="text-sm text-muted-foreground">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <section className="container px-4 py-20">
        <div className="mb-10 text-center">
          <span className="font-display text-sm font-700 uppercase tracking-widest text-secondary">Сообщество</span>
          <h2 className="font-display text-4xl font-800 uppercase tracking-tight text-primary md:text-5xl">Чат с аналитиками</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Общайтесь с экспертами и игроками в реальном времени, получайте инсайды и обсуждайте матчи.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3">
            {analysts.map((a) => (
              <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-700">
                    {a.name[0]}
                  </div>
                  {a.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />}
                </div>
                <div className="flex-1">
                  <div className="font-700 text-primary">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.spec}</div>
                </div>
                <span className="rounded-md bg-secondary/15 px-2 py-1 text-xs font-700 text-secondary">{a.roi}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2 font-700 text-primary">
                <Icon name="MessagesSquare" size={18} />
                Общий чат
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500" /> 348 онлайн
              </span>
            </div>
            <div className="flex-1 space-y-4 p-4">
              {chatMessages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-700 ${m.analyst ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    {m.user[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-700">{m.user}</span>
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
        <div className="relative overflow-hidden rounded-2xl bg-primary p-10 text-center text-primary-foreground md:p-16">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative">
            <h2 className="font-display text-4xl font-900 uppercase tracking-tight md:text-5xl">Готов выигрывать?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">Оформи подписку и получай прогнозы от лучших аналитиков каждый день.</p>
            <Button size="lg" className="mt-8 h-13 bg-secondary px-10 text-base font-700 text-secondary-foreground hover:bg-secondary/90">
              <Icon name="ShoppingCart" size={20} className="mr-2" /> Купить прогноз
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <Brand className="text-lg text-primary" />
          <span>© 2026 · Прогнозы 18+. Делайте ставки ответственно.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;