'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FolderCheck,
  GraduationCap,
  HardDriveUpload,
  Lightbulb,
  MapPin,
  PartyPopper,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

type Placement = 'university' | 'self';
type PracticeKind = 'production' | 'study';

const documents = [
  {
    id: 'assignment',
    number: '01',
    title: 'Индивидуальное задание',
    format: 'PDF',
    action: 'Заполнить и поставить свою электронную подпись на последней странице.',
    check: 'В PDF видны ФИО, группа, модуль и подпись.',
    color: '#FFD500',
  },
  {
    id: 'presentation',
    number: '02',
    title: 'Отчёт-презентация',
    format: 'PDF',
    action: 'Заполнить шаблон PowerPoint и экспортировать готовую презентацию в PDF.',
    check: 'Загружается именно PDF, а не незаполненный PPTX.',
    color: '#00A6FF',
  },
  {
    id: 'project',
    number: '03',
    title: 'Отчёт о выполнении проекта',
    format: 'DOCX',
    action: 'Раскрыть четыре этапа: система, сопровождение, инциденты, качество.',
    check: 'Нет многоточий и подсказок из шаблона.',
    color: '#D1E000',
  },
  {
    id: 'certificate',
    number: '04',
    title: 'Справка',
    format: 'PDF',
    action: 'Заполнить, получить подпись ответственного лица и печать, если она используется.',
    check: 'Совпадают организация, ФИО и даты практики.',
    color: '#00A299',
  },
  {
    id: 'attestation',
    number: '05',
    title: 'Аттестационный лист',
    format: 'DOCX',
    action: 'Заполнить только первый абзац: ФИО, группу, объём и период практики из задания.',
    check: 'Разделы I и II оставлены руководителю практики.',
    color: '#FF8C00',
  },
] as const;

const timeline = [
  { date: 'До старта', title: 'Разобраться', text: 'Открыть задание, выбрать систему и пройти инструктаж по безопасности.' },
  { date: 'В ходе практики', title: 'Собрать факты', text: 'Изучить организацию и систему, собрать данные, выполнить практическую часть.' },
  { date: 'Накануне сдачи', title: 'Собрать результат', text: 'Систематизировать материалы, сделать анализ, выводы и рекомендации.' },
  { date: 'Последний день', title: 'Финиш', text: 'Оформить комплект и загрузить его в поле «Ответ» в LMS.' },
] as const;

const reportStages = [
  {
    level: 'Уровень 1',
    title: 'Понять систему',
    items: ['назначение и функции', 'пользователи и их зависимость', 'среда эксплуатации', 'критичность отказов', 'факторы сопровождения'],
    color: '#FFD500',
  },
  {
    level: 'Уровень 2',
    title: 'Организовать сопровождение',
    items: ['роли и схема взаимодействия', 'матрица RACI', 'основные и вспомогательные процессы', 'каналы обращений', 'SLA'],
    color: '#00A6FF',
  },
  {
    level: 'Уровень 3',
    title: 'Разобрать проблемы',
    items: ['инциденты и сервисные обращения', 'таблица типовых инцидентов', 'разбор 2–3 случаев', 'жизненный цикл инцидента', 'процесс изменений'],
    color: '#FF8C00',
  },
  {
    level: 'Уровень 4',
    title: 'Обеспечить качество',
    items: ['резервное копирование', 'восстановление', 'журналирование и мониторинг', 'метрики качества', 'меры по улучшению'],
    color: '#D1E000',
  },
] as const;

const faq = [
  {
    category: 'Сроки',
    question: 'Когда всё сдавать?',
    answer: 'Универсальное правило: комплект сдают не позднее последнего дня практики. Точную дату и время берите из задания в LMS. Если в LMS стоит отдельное время закрытия, ориентируйтесь на него.',
  },
  {
    category: 'Сдача',
    question: 'Куда загружать документы?',
    answer: 'Электронные файлы загрузите в личном кабинете LMS в поле «Ответ». Бумажный договор, если он вам нужен, передайте тьютору в деканат.',
  },
  {
    category: 'Сдача',
    question: 'Сколько всего файлов?',
    answer: 'Для производственной практики в LMS — пять: индивидуальное задание PDF, отчёт-презентация PDF, отчёт о выполнении проекта DOCX, справка PDF и аттестационный лист DOCX. Если место практики нашли самостоятельно, дополнительно нужен бумажный договор. Для учебной практики справка не нужна.',
  },
  {
    category: 'Договор',
    question: 'Мне нужен договор?',
    answer: 'Да — только если место практики вы нашли самостоятельно. Если вас направил университет, отдельный договор из этого комплекта не требуется.',
  },
  {
    category: 'Договор',
    question: 'Что делать с договором?',
    answer: 'Заполнить данные профильной организации, приложения, актуальный модуль и период. Получить живую синюю подпись руководителя и печать, если организация её использует. Бумажный экземпляр передать тьютору в деканат.',
  },
  {
    category: 'Важно',
    question: 'В шаблоне договора стоят другие модули или даты. Оставлять?',
    answer: 'Нет. В шаблоне есть примеры, которые могут не совпадать с вашей практикой. Перед подписью проверьте каждую страницу и приложение: специальность, модуль, ФИО, количество обучающихся, место и период должны соответствовать заданию в LMS.',
  },
  {
    category: 'Подписи',
    question: 'Где нужны подписи и печати?',
    answer: 'В индивидуальном задании — ваша электронная подпись на последней странице. В справке производственной практики — подпись ответственного лица профильной организации и печать при наличии. В договоре — живая синяя подпись и печать при наличии.',
  },
  {
    category: 'Подписи',
    question: 'Что делать, если у организации нет печати?',
    answer: 'В шаблонах прямо указано «при наличии». Если организация печать не использует, оставьте место печати пустым, но получите требуемую подпись ответственного лица.',
  },
  {
    category: 'Аттестация',
    question: 'Что заполнять в аттестационном листе?',
    answer: 'Только первый абзац: полные ФИО, группа, объём и период из вашего задания. Разделы I и II, оценки, замечания и итог заполняет руководитель практики от образовательной организации.',
  },
  {
    category: 'Отчёт',
    question: 'В каком формате сдавать презентацию?',
    answer: 'Сначала заполните шаблон PowerPoint, затем экспортируйте готовую презентацию в PDF. В LMS по этому комплекту размещается PDF, а не исходный PPTX.',
  },
  {
    category: 'Отчёт',
    question: 'Что должно быть в отчёте DOCX?',
    answer: 'Четыре блока: характеристика системы; организация сопровождения; инциденты и изменения; качество и непрерывность. В конце свяжите систему, процессы сопровождения, проблемы и итоговую оценку эффективности.',
  },
  {
    category: 'Отчёт',
    question: 'Нужно разбирать реальные инциденты?',
    answer: 'Нужно подробно разобрать не менее 2–3 конкретных инцидентов: что произошло, почему, к чему привело, кто отвечал и как проблему устранили. Если система смоделированная, случаи могут быть реалистичными сценариями.',
  },
  {
    category: 'Тема',
    question: 'Как выбрать тему?',
    answer: 'Лучший вариант — тема вашего дипломного проекта: комплект прямо рекомендует использовать практику для сбора данных к ДП. Также можно взять систему продаж, CRM, документооборот, обращения пользователей, проекты, логистику, обслуживание техники или другую систему из списка предметных областей.',
  },
  {
    category: 'Тема',
    question: 'Система обязательно должна быть реальной?',
    answer: 'Нет. В индивидуальном задании разрешена реальная или смоделированная информационная система. Главное — последовательно описать пользователей, среду, отказы, сопровождение, инциденты, метрики и улучшения.',
  },
  {
    category: 'Комплект',
    question: 'Нужен дневник практики?',
    answer: 'В этом комплекте дневник не указан среди документов для сдачи. Не создавайте лишний файл. Если дневник отдельно появился в LMS или его попросил руководитель, выполните это дополнительное требование.',
  },
  {
    category: 'Сроки',
    question: 'Можно сдать после крайнего срока?',
    answer: 'Официальное правило — сдать комплект не позднее крайнего срока в LMS. Если срок уже пропущен, сразу свяжитесь с руководителем практики или тьютором: только они могут подтвердить дальнейший порядок сдачи.',
  },
  {
    category: 'Файлы',
    question: 'Что проверить после экспорта в PDF?',
    answer: 'Откройте PDF заново. Проверьте, что все страницы на месте, текст не обрезан, схемы и таблицы читаются, подпись видна, а вместо заполненных полей не остались многоточия или подсказки.',
  },
  {
    category: 'Часы',
    question: 'Что писать в строке про объём практики?',
    answer: 'Перенесите объём из индивидуального задания или аттестационного шаблона. Не придумывайте часы и не заменяйте период практики своими датами.',
  },
] as const;

const finalChecks = [
  'Во всех файлах одинаковые ФИО, группа, модуль и период из задания.',
  'В шаблонах не осталось многоточий, примеров и чужих данных.',
  'PDF и DOCX открываются после скачивания или экспорта.',
  'Подписи видны, печати стоят там, где они есть у организации.',
  'В аттестационном листе студентом заполнен только первый абзац.',
  'В LMS прикреплены все файлы по выбранной практике, а не версии одного файла.',
] as const;

export default function Home() {
  const [practiceKind, setPracticeKind] = useState<PracticeKind | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('practice-faq-checklist');
      const savedKind = window.localStorage.getItem('practice-faq-kind') as PracticeKind | null;
      const savedPlacement = window.localStorage.getItem('practice-faq-placement') as Placement | null;
      if (saved) setCompleted(JSON.parse(saved));
      if (savedKind === 'production' || savedKind === 'study') setPracticeKind(savedKind);
      if (savedPlacement === 'university' || savedPlacement === 'self') setPlacement(savedPlacement);
    } catch {
      // The checklist still works for this visit when storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem('practice-faq-checklist', JSON.stringify(completed));
      if (practiceKind) window.localStorage.setItem('practice-faq-kind', practiceKind);
      if (placement) window.localStorage.setItem('practice-faq-placement', placement);
    } catch {
      // Local persistence is a convenience, not a requirement.
    }
  }, [completed, hydrated, placement, practiceKind]);

  const visibleDocuments = practiceKind === 'study' ? documents.filter((document) => document.id !== 'certificate') : documents;
  const completedCount = visibleDocuments.filter((document) => completed[document.id]).length;
  const progress = Math.round((completedCount / visibleDocuments.length) * 100);

  const displayFaq = useMemo(() => {
    if (practiceKind !== 'study') return faq;
    return faq
      .filter((item) => !['Мне нужен договор?', 'Что делать с договором?', 'В шаблоне договора стоят другие модули или даты. Оставлять?'].includes(item.question))
      .map((item) => {
        if (item.question === 'Сколько всего файлов?') {
          return { ...item, answer: 'Для учебной практики в LMS — четыре файла: индивидуальное задание PDF, отчёт-презентация PDF, отчёт о выполнении проекта DOCX и аттестационный лист DOCX. Справка для учебной практики не нужна.' };
        }
        if (item.question === 'Куда загружать документы?') {
          return { ...item, answer: 'Четыре электронных файла загрузите в личном кабинете LMS в поле «Ответ». Договор и справка для учебной практики не нужны, если LMS не указала иное.' };
        }
        if (item.question === 'Где нужны подписи и печати?') {
          return { ...item, answer: 'В индивидуальном задании — ваша электронная подпись на последней странице. Для учебной практики справка не нужна. Остальные подписи выполняются только там, где это прямо указано в вашем задании.' };
        }
        return item;
      });
  }, [practiceKind]);

  const filteredFaq = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ru');
    if (!needle) return displayFaq;
    return displayFaq.filter((item) =>
      `${item.category} ${item.question} ${item.answer}`.toLocaleLowerCase('ru').includes(needle),
    );
  }, [displayFaq, query]);

  function toggleDocument(id: string, checked: boolean) {
    setCompleted((current) => ({ ...current, [id]: checked }));
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3 font-extrabold tracking-[-0.04em]">
            <img src="/synergy-mark.png" alt="Синергия" className="size-8 shrink-0 rounded-[3px] object-cover" />
            <span className="truncate">СИНЕРГИЯ · ПРАКТИКА</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex" aria-label="Основная навигация">
            <a className="hover:text-primary" href="#documents">Что сдавать</a>
            <a className="hover:text-primary" href="#report">Отчёт</a>
            <a className="hover:text-primary" href="#faq">ЧАВО</a>
          </nav>
          <Badge variant="outline" className="h-7 shrink-0 border-black/15 bg-[#f3f3f5] px-3 text-black">ПАМЯТКА ДЛЯ ПРАКТИКИ</Badge>
        </div>
      </header>

      <div id="top" className="scroll-mt-24" />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[1.12fr_.88fr] lg:py-10">
        <div className="relative overflow-hidden rounded-[30px] bg-primary p-6 text-black sm:p-9">
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full border-[46px] border-white/18" />
          <Badge className="relative mb-8 bg-black text-white">Квест: сдать практику</Badge>
          <p className="relative mb-3 text-sm font-extrabold uppercase tracking-[0.16em]">Учебная и производственная практика</p>
          <h1 className="relative max-w-3xl text-5xl font-extrabold leading-[0.9] tracking-[-0.06em] sm:text-7xl">Практика без паники</h1>
          <p className="relative mt-5 max-w-2xl text-lg font-medium leading-snug sm:text-xl">Один экран вместо пачки файлов. Выберите тип практики — и получите только свои шаги.</p>
          <div className="relative mt-9 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/15 bg-white/22 p-4">
              <CalendarDays className="mb-5 size-6" />
              <p className="text-sm font-semibold">Период</p>
              <p className="mt-1 text-xl font-extrabold">Смотрите в LMS</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-black shadow-sm">
              <ArrowRight className="mb-5 size-6 text-primary" />
              <p className="text-sm font-semibold text-black/60">Крайний срок</p>
              <p className="mt-1 text-xl font-extrabold">Последний день практики</p>
            </div>
          </div>
          <p className="relative mt-4 text-sm font-semibold">Универсальное правило: сдайте комплект не позднее последнего дня, указанного в задании.</p>
        </div>

        <div className="rounded-[30px] border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-black/50">Первый выбор</p>
            <Badge variant="secondary" className="bg-[#e0e1e5] text-black">30 секунд</Badge>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Какая у вас практика?</h2>
          <p className="mt-3 leading-relaxed text-black/60">Справка нужна только для производственной практики. Для учебной — убираем её из списка.</p>

          <div className="mt-7 grid gap-3">
            <Button aria-pressed={practiceKind === 'production'} variant={practiceKind === 'production' ? 'default' : 'outline'} className="h-auto justify-start gap-4 rounded-2xl px-4 py-4 text-left" onClick={() => setPracticeKind('production')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-black/6"><Building2 className="size-5" /></span>
              <span><strong className="block text-base">Производственная</strong><span className="mt-0.5 block text-sm font-normal opacity-70">Справка + договор по ситуации</span></span>
            </Button>
            <Button aria-pressed={practiceKind === 'study'} variant={practiceKind === 'study' ? 'default' : 'outline'} className="h-auto justify-start gap-4 rounded-2xl px-4 py-4 text-left" onClick={() => { setPracticeKind('study'); setPlacement(null); }}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-black/6"><GraduationCap className="size-5" /></span>
              <span><strong className="block text-base">Учебная</strong><span className="mt-0.5 block text-sm font-normal opacity-70">Справка не нужна</span></span>
            </Button>
          </div>

          {practiceKind === 'production' && <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-black/50">Для производственной</p>
            <p className="mt-2 text-sm text-black/60">Как нашли место практики?</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button aria-pressed={placement === 'university'} variant={placement === 'university' ? 'secondary' : 'outline'} className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => setPlacement('university')}><GraduationCap className="size-4" /><span className="ml-2"><strong className="block text-sm">Направил университет</strong><span className="block text-xs font-normal opacity-65">без договора</span></span></Button>
              <Button aria-pressed={placement === 'self'} variant={placement === 'self' ? 'secondary' : 'outline'} className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => setPlacement('self')}><MapPin className="size-4" /><span className="ml-2"><strong className="block text-sm">Нашёл(ла) сам(а)</strong><span className="block text-xs font-normal opacity-65">договор в деканат</span></span></Button>
            </div>
          </div>}

          <div className="mt-6 min-h-32 rounded-2xl bg-[#f0f1f3] p-5" aria-live="polite">
            {!practiceKind && <div className="flex gap-3 text-sm text-black/60"><ArrowDown className="mt-0.5 size-4 shrink-0 text-primary" /><p>Выберите тип практики — покажем только вашу инструкцию.</p></div>}
            {practiceKind === 'study' && (
              <div>
                <p className="flex items-center gap-2 font-extrabold"><CheckCircle2 className="size-5 text-[#008f87]" /> Учебная практика выбрана.</p>
                <p className="mt-2 text-sm leading-relaxed text-black/60">Справку убрали. В LMS остаются четыре файла.</p>
                <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="#documents">Открыть чек-лист <ArrowRight className="size-4" /></a>
              </div>
            )}
            {practiceKind === 'production' && placement === 'university' && (
              <div>
                <p className="flex items-center gap-2 font-extrabold"><CheckCircle2 className="size-5 text-[#008f87]" /> Договор можно пропустить.</p>
                <p className="mt-2 text-sm leading-relaxed text-black/60">Переходите к пяти файлам для LMS.</p>
                <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="#documents">Открыть чек-лист <ArrowRight className="size-4" /></a>
              </div>
            )}
            {placement === 'self' && (
              <div>
                <p className="flex items-center gap-2 font-extrabold"><MapPin className="size-5 text-primary" /> Договор — в деканат.</p>
                <p className="mt-2 text-sm leading-relaxed text-black/60">Нужны живая синяя подпись и печать организации, если она используется.</p>
                <p className="mt-2 text-sm font-bold text-primary">Проверьте приложения: в шаблоне могут быть чужие примеры.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="documents" className="scroll-mt-24 bg-black py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Badge className="bg-primary text-white">Главная миссия</Badge>
              <h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">{practiceKind === 'study' ? 'Четыре файла в LMS' : 'Пять файлов в LMS'}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">Отмечайте готовое. Прогресс хранится только на вашем устройстве — можно закрыть страницу и вернуться.</p>

              <Progress value={progress} className="mt-8 gap-2 text-white">
                <ProgressLabel className="text-white">Готовность комплекта</ProgressLabel>
                <ProgressValue className="text-white/70">{completedCount} из {visibleDocuments.length}</ProgressValue>
              </Progress>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-white/60">{progress}% готово</p>
                {completedCount > 0 && <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setCompleted({})}><RefreshCcw /> Сбросить</Button>}
              </div>
              {completedCount === visibleDocuments.length && (
                <div className="mt-6 rounded-2xl bg-[#d1e000] p-5 text-black" role="status">
                  <PartyPopper className="mb-3 size-7" />
                  <p className="text-xl font-extrabold">Комбо собрано!</p>
                  <p className="mt-1 text-sm font-semibold">Теперь пройдите финальную проверку ниже.</p>
                </div>
              )}
            </div>

            <div className="grid gap-3">
              {visibleDocuments.map((document) => {
                const isDone = Boolean(completed[document.id]);
                return (
                  <label key={document.id} className={`group grid cursor-pointer gap-4 rounded-[24px] border p-5 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-center ${isDone ? 'border-white/35 bg-white text-black' : 'border-white/15 bg-[#191919] hover:border-white/35'}`}>
                    <span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl text-sm font-black text-black" style={{ backgroundColor: document.color }}>{isDone ? <Check className="size-6" /> : document.number}</span>
                    <span>
                      <span className="flex flex-wrap items-center gap-2"><strong className="text-lg">{document.title}</strong><Badge variant="outline" className={isDone ? 'border-black/15 text-black' : 'border-white/25 text-white'}>{document.format}</Badge></span>
                      <span className={`mt-2 block text-sm leading-relaxed ${isDone ? 'text-black/65' : 'text-white/65'}`}>{document.action}</span>
                      <span className={`mt-2 block text-xs font-semibold ${isDone ? 'text-black/55' : 'text-white/45'}`}>Проверка: {document.check}</span>
                    </span>
                    <span className="flex items-center gap-3 sm:justify-end">
                      <span className={`text-sm font-bold ${isDone ? 'text-black' : 'text-white/55'}`}>{isDone ? 'Готово' : 'Отметить'}</span>
                      <Checkbox checked={isDone} onCheckedChange={(checked) => toggleDocument(document.id, checked === true)} className="size-6 border-white/40 data-checked:border-primary data-checked:bg-primary" aria-label={`${isDone ? 'Снять отметку' : 'Отметить готовым'}: ${document.title}`} />
                    </span>
                  </label>
                );
              })}

              <div className="mt-3 rounded-[24px] border border-primary/50 bg-primary/12 p-5">
                <div className="flex gap-4">
                  <AlertTriangle className="mt-0.5 size-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-extrabold">{practiceKind === 'study' ? 'Для учебной практики проще' : 'Договор не входит в эти файлы'}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{practiceKind === 'study' ? 'Справка и договор не нужны, если в вашем задании нет отдельного требования.' : 'Договор нужен только при самостоятельном поиске места и сдаётся бумажным оригиналом тьютору в деканат. Если LMS отдельно требует скан, следуйте указанию в LMS.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Badge variant="outline" className="border-black/15 bg-white text-black">Маршрут на неделю</Badge><h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Что делать и когда</h2></div>
          <p className="max-w-md text-sm leading-relaxed text-black/55">Не пытайтесь сделать всё в последний день. Сначала собирайте факты, потом оформляйте.</p>
        </div>
        <div className="mt-8 grid overflow-hidden rounded-[28px] border border-black/10 bg-white md:grid-cols-4">
          {timeline.map((item, index) => (
            <article key={item.date} className="relative border-black/10 p-6 not-last:border-b md:not-last:border-b-0 md:not-last:border-r">
              <div className="flex items-center justify-between gap-4"><span className="text-2xl font-black text-primary">{item.date}</span><span className="text-xs font-bold text-black/35">0{index + 1}</span></div>
              <h3 className="mt-8 text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="report" className="scroll-mt-24 border-y border-black/10 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><Badge className="bg-primary text-white">Квест отчёта</Badge><h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Четыре уровня — и финал</h2></div>
            <p className="max-w-2xl text-lg leading-relaxed text-black/60">Один и тот же материал идёт в подробный DOCX и в короткую презентацию. Сначала заполните смысл, потом сокращайте его для слайдов.</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {reportStages.map((stage) => (
              <article key={stage.level} className="rounded-[26px] border border-black/10 bg-[#f4f4f5] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4"><Badge className="text-black" style={{ backgroundColor: stage.color }}>{stage.level}</Badge><BadgeCheck className="size-6 text-black/30" /></div>
                <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em]">{stage.title}</h3>
                <ul className="mt-5 grid gap-3">{stage.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 rounded-[26px] bg-black p-6 text-white sm:grid-cols-[auto_1fr] sm:items-center sm:p-7">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-white"><Sparkles className="size-7" /></span>
            <div><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/50">Финальный босс</p><h3 className="mt-1 text-2xl font-extrabold">Общий вывод + источники</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">Свяжите цепочку «система → сопровождение → проблемы → качество», сформулируйте 3–5 выводов и перечислите реально использованные источники.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[28px] bg-[#ffd500] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em]">Система оценивания</p><h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em]">Где лежат 100 баллов</h2></div><BookOpenCheck className="size-8" /></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['10', 'Источники и актуальные данные'],
              ['60', 'Содержание, самостоятельность и анализ'],
              ['20', 'Экспериментально-практическая работа'],
              ['10', 'Оформление отчёта-презентации'],
            ].map(([points, title]) => <div key={points + title} className="rounded-2xl bg-white/70 p-4"><p className="text-3xl font-black">{points}</p><p className="mt-2 text-sm font-bold leading-snug">{title}</p></div>)}
          </div>
          <p className="mt-5 text-sm font-semibold leading-relaxed">Главный вывод: красивого шаблона мало. Больше всего баллов даёт содержательный и самостоятельный анализ.</p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-black/45">Перед кнопкой «Отправить»</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">Финальная проверка</h2></div><ShieldCheck className="size-8 text-primary" /></div>
          <ul className="mt-7 grid gap-4">{finalChecks.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#d1e000]"><Check className="size-3.5" /></span>{item}</li>)}</ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#e0e1e5] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center"><Badge className="bg-black text-white">ЧАВО без канцелярита</Badge><h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">Спросить нормально — получить короткий ответ</h2><p className="mx-auto mt-4 max-w-2xl text-black/60">Введите слово: «договор», «подпись», «PDF», «срок», «аттестационный».</p></div>
          <div className="relative mx-auto mt-8 max-w-2xl"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-black/40" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Что непонятно?" aria-label="Поиск по частым вопросам" className="h-14 rounded-2xl border-black/15 bg-white pl-12 pr-4 text-base shadow-sm" /></div>
          <div className="mt-7 rounded-[26px] border border-black/10 bg-white px-5 sm:px-7">
            {filteredFaq.length > 0 ? (
              <Accordion multiple>
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.question} value={item.question} className="border-black/10 py-2">
                    <AccordionTrigger className="gap-4 py-4 text-base font-extrabold hover:no-underline sm:text-lg"><span className="flex min-w-0 items-start gap-3"><CircleHelp className="mt-0.5 size-5 shrink-0 text-primary" /><span><span className="mb-1 block text-xs font-bold uppercase tracking-[0.11em] text-black/40">{item.category}</span>{item.question}</span></span></AccordionTrigger>
                    <AccordionContent className="pb-5 pl-8 text-base leading-relaxed text-black/65">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-12 text-center"><CircleHelp className="mx-auto size-8 text-black/30" /><p className="mt-3 font-extrabold">Такого вопроса пока нет</p><p className="mt-1 text-sm text-black/55">Попробуйте короче: «договор», «даты» или «отчёт».</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-5 rounded-[30px] bg-primary p-6 text-black sm:grid-cols-[1fr_auto] sm:items-center sm:p-9">
          <div><div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.13em]"><Lightbulb className="size-5" /> Главное правило</div><h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">Если LMS или руководитель дали новое прямое указание — оно важнее этой памятки.</h2><p className="mt-3 max-w-3xl font-semibold">Памятка собрана по комплекту практики и помогает не потеряться, но не меняет официальные требования.</p></div>
          <a href="#top" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white hover:bg-black/80">Наверх <Upload className="size-4 rotate-180" /></a>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-black/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold">Памятка по сдаче практики</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" /> дедлайн без времени</span><span className="inline-flex items-center gap-1.5"><HardDriveUpload className="size-4" /> статический сайт</span><span className="inline-flex items-center gap-1.5"><FolderCheck className="size-4" /> 4 или 5 файлов</span></div>
        </div>
      </footer>
    </main>
  );
}
