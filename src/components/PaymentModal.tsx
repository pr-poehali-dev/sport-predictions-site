import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { apiBuyPrediction } from '@/api';

const CARD_NUMBER = '5586 2000 7208 9508';

interface Prediction {
  sport: string;
  match: string;
  league: string;
  analyst: string;
  price: number;
  dateStr: string;
}

interface Props {
  prediction: Prediction;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ prediction, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'info' | 'sent'>('info');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleConfirmPayment() {
    setLoading(true);
    await apiBuyPrediction({
      match_name: prediction.match,
      league: prediction.league,
      sport: prediction.sport,
      analyst: prediction.analyst,
      price: prediction.price,
      prediction: '',
      match_date: prediction.dateStr,
    });
    setLoading(false);
    setStep('sent');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

        {/* Шапка */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{prediction.sport}</span>
            <div>
              <div className="font-700 text-sm text-white">{prediction.match}</div>
              <div className="text-xs text-muted-foreground">{prediction.league}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:text-white transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {step === 'info' && (
          <div className="p-5 space-y-4">
            {/* Сумма */}
            <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">Сумма к оплате</div>
              <div className="font-display text-4xl font-900 text-secondary">{prediction.price} ₽</div>
              <div className="text-xs text-muted-foreground mt-1">Прогноз: {prediction.analyst}</div>
            </div>

            {/* Инструкция */}
            <div className="space-y-3">
              <div className="text-sm font-700 text-white">Как оплатить:</div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-black text-xs font-800">1</div>
                <p className="text-sm text-muted-foreground">Переведите <span className="font-700 text-white">{prediction.price} ₽</span> на карту:</p>
              </div>

              {/* Карта */}
              <button onClick={copyCard}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-muted px-4 py-3 transition-all hover:border-primary/50 active:scale-[0.98]">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Номер карты (нажмите, чтобы скопировать)</div>
                  <div className="font-display text-lg font-800 tracking-widest text-white">{CARD_NUMBER}</div>
                </div>
                <div className={`ml-3 shrink-0 transition-colors ${copied ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon name={copied ? 'Check' : 'Copy'} size={20} />
                </div>
              </button>
              {copied && <div className="text-xs text-primary text-center">Скопировано!</div>}

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-black text-xs font-800">2</div>
                <p className="text-sm text-muted-foreground">В комментарии к переводу укажите ваш email</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-black text-xs font-800">3</div>
                <p className="text-sm text-muted-foreground">Нажмите кнопку ниже — мы проверим оплату и откроем прогноз</p>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 flex gap-2">
              <Icon name="Clock" size={15} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-400">Подтверждение обычно занимает до 30 минут в рабочее время</p>
            </div>

            <Button onClick={handleConfirmPayment} disabled={loading}
              className="w-full bg-primary text-black font-700 hover:bg-primary/90 h-11">
              {loading
                ? <Icon name="Loader2" size={18} className="animate-spin" />
                : <><Icon name="CheckCircle2" size={18} className="mr-2" />Я оплатил(а), жду подтверждения</>
              }
            </Button>
          </div>
        )}

        {step === 'sent' && (
          <div className="p-8 text-center space-y-4">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/15 border border-primary/30">
              <Icon name="Clock" size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-xl font-800 text-white">Заявка отправлена!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                После подтверждения оплаты прогноз появится в вашем личном кабинете.
                Обычно это занимает до 30 минут.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
              Статус можно проверить в разделе <span className="font-700 text-white">Кабинет → История прогнозов</span>
            </div>
            <Button onClick={onSuccess} className="w-full bg-primary text-black font-700 h-11">
              Перейти в кабинет
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
