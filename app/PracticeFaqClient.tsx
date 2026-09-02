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
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  Landmark,
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

type EducationLevel = 'bachelor' | 'master';
type PracticeKind = 'study' | 'production';
type Placement = 'university' | 'organization';
type TrackId = 'bachelor-study' | 'bachelor-production' | 'master-study-research' | 'master-production-research';
type FaqFilter = 'all' | 'bachelor' | 'master' | 'study' | 'production' | 'research';

type DocumentItem = {
  id: string;
  title: string;
  format: string;
  action: string;
  check: string;
  color: string;
};

type Track = {
  id: TrackId;
  level: EducationLevel;
  kind: PracticeKind;
  title: string;
  eyebrow: string;
  description: string;
  note: string;
  isResearch?: boolean;
  hasCertificate?: boolean;
  hasAdditional?: boolean;
};

const commonDocuments: DocumentItem[] = [
  {
    id: 'assignment',
    title: 'Индивидуальное задание',
    format: 'PDF',
    action: 'Заполните даты, данные обучающегося и содержание задания. Добавьте свою электронную подпись, если она предусмотрена шаблоном.',
    check: 'Одинаковые ФИО, группа, направление и даты; подпись видна после экспорта.',
    color: '#d8f04b',
  },
  {
    id: 'attestation',
    title: 'Аттестационный лист',
    format: 'DOCX · Word',
    action: 'Заполните только сведения об обучающемся и периоде практики. Оценку, критерии и заключение оставьте руководителю.',
    check: 'Заполнена информация о студенте, а поля руководителя не заполнены вместо него.',
    color: '#ffb24a',
  },
  {
    id: 'report',
    title: 'Отчёт о прохождении практики',
    format: 'PDF',
    action: 'Раскройте кейсы из индивидуального задания, добавьте титульный лист и экспортируйте итоговый документ в PDF.',
    check: 'Все кейсы получили содержательные ответы; в PDF нет пустых полей, примеров и обрезанного текста.',
    color: '#72c7ff',
  },
];

const certificateDocument: DocumentItem = {
  id: 'certificate',
  title: 'Справка о прохождении практики',
  format: 'PDF',
  action: 'Заполните справку по месту практики и получите подпись ответственного лица. Печать ставится при наличии у организации.',
  check: 'Совпадают организация, ФИО и даты; подпись и печать читаются после сканирования.',
  color: '#83dfc4',
};

const additionalDocument: DocumentItem = {
  id: 'additional',
  title: 'Дополнительные материалы · Приложение 1',
  format: 'DOCX · Word',
  action: 'Для НИР прикрепите приложение с перечнем тем или другими дополнительными материалами из комплекта практики.',
  check: 'Используется приложение именно к вашей теме НИР; в документе не осталось чужих примеров.',
  color: '#c8a7ff',
};

const contractDocument: DocumentItem = {
  id: 'contract',
  title: 'Скан подписанного договора',
  format: 'PDF',
  action: 'Подготовьте подписанный договор о практической подготовке. Скан приложите в LMS, если это предусмотрено заданием; оригинал передайте в деканат.',
  check: 'Все страницы и приложения на месте, подписи стоят, реквизиты и период совпадают с заданием.',
  color: '#ff8db3',
};

const tracks: Track[] = [
  {
    id: 'bachelor-study',
    level: 'bachelor',
    kind: 'study',
    title: 'Учебная практика',
    eyebrow: 'Ознакомительная',
    description: 'Знакомство с организацией, её ИТ-структурой и будущей профессиональной деятельностью.',
    note: 'Базовый комплект — 3 файла.',
  },
  {
    id: 'bachelor-production',
    level: 'bachelor',
    kind: 'production',
    title: 'Производственная практика',
    eyebrow: 'По профилю профессиональной деятельности',
    description: 'Практические задачи по профилю подготовки, сбор материалов и аналитический отчёт.',
    note: 'Базовый комплект — 4 файла; договор зависит от места практики.',
    hasCertificate: true,
  },
  {
    id: 'master-study-research',
    level: 'master',
    kind: 'study',
    title: 'Учебная практика · НИР',
    eyebrow: 'Научно-исследовательская работа',
    description: 'Выбор темы, постановка исследования, библиографический поиск и подготовка материалов для ВКР.',
    note: 'К базовым документам добавляется приложение к НИР.',
    isResearch: true,
    hasAdditional: true,
  },
  {
    id: 'master-production-research',
    level: 'master',
    kind: 'production',
    title: 'Производственная практика · НИР',
    eyebrow: 'Научно-исследовательская работа',
    description: 'Углублённая работа с научным материалом, кейсами, методологией и результатами исследования.',
    note: 'К базовым документам добавляется приложение к НИР; договор — по месту практики.',
    isResearch: true,
    hasCertificate: true,
    hasAdditional: true,
  },
];

const timeline = [
  { date: 'До старта', title: 'Определиться', text: 'Выберите уровень, вид практики и место прохождения. Проверьте сроки договора, если нужна профильная организация.' },
  { date: 'В ходе практики', title: 'Собрать материал', text: 'Изучите задание, ведите рабочие заметки, сохраняйте источники и обсуждайте вопросы с руководителем.' },
  { date: 'Перед финишем', title: 'Оформить', text: 'Ответьте на кейсы, заполните шаблоны, проверьте ФИО, даты, подписи и формат каждого файла.' },
  { date: 'После окончания', title: 'Загрузить', text: 'Прикрепите комплект в поле «Ответ» в LMS не позднее срока, который указан в вашем задании.' },
] as const;

const standardReportStages = [
  { level: '01', title: 'Разобрать задание', items: ['цель и ожидаемый результат', 'объект или место практики', 'исходные данные и ограничения', 'критерии готовности'], color: '#d8f04b' },
  { level: '02', title: 'Показать работу', items: ['каждый пункт индивидуального задания', 'последовательность действий', 'полученный результат', 'связь результата с целью'], color: '#72c7ff' },
  { level: '03', title: 'Приложить доказательства', items: ['скриншоты и схемы', 'таблицы, расчёты или примеры', 'ссылки на использованные материалы', 'подписи к иллюстрациям'], color: '#ffb24a' },
  { level: '04', title: 'Сделать выводы', items: ['что выполнено', 'что показал анализ', '3–5 собственных выводов', 'рекомендации или следующий шаг'], color: '#c8a7ff' },
] as const;

const researchReportStages = [
  { level: '01', title: 'Сформулировать тему', items: ['актуальность исследования', 'объект и предмет', 'цель и 3–5 задач', 'научная новизна или гипотеза'], color: '#d8f04b' },
  { level: '02', title: 'Собрать базу', items: ['литературный обзор', 'библиографический список', 'методы исследования', 'план научной работы'], color: '#72c7ff' },
  { level: '03', title: 'Разобрать кейсы', items: ['ответы на все кейс-задачи', 'скриншоты и подтверждения', 'связь с темой НИР', 'обсуждение с руководителем'], color: '#ffb24a' },
  { level: '04', title: 'Зафиксировать результат', items: ['полученные выводы', 'практическая значимость', 'следующий этап исследования', 'источники без выдуманных ссылок'], color: '#c8a7ff' },
] as const;

const finalChecks = [
  'Во всех файлах одинаковые ФИО, группа, направление, тема и период.',
  'В шаблонах не осталось многоточий, примеров и чужих данных.',
  'PDF и DOCX открываются после скачивания или экспорта.',
  'Подписи видны, а печати стоят там, где их использует организация.',
  'В аттестационном листе студентом заполнена только своя часть.',
  'В LMS прикреплены все файлы выбранного варианта, а не несколько версий одного файла.',
] as const;

const scoring = [
  ['10', 'Индивидуальное задание по программе практики'],
  ['50', 'Выполнение практических кейсов-задач'],
  ['40', 'Качество анализа собранных материалов'],
] as const;

const faqFilters: { id: FaqFilter; label: string }[] = [
  { id: 'all', label: 'Все вопросы' },
  { id: 'bachelor', label: 'Бакалавриат' },
  { id: 'master', label: 'Магистратура' },
  { id: 'study', label: 'Учебная практика' },
  { id: 'production', label: 'Производственная практика' },
  { id: 'research', label: 'НИР' },
];

const faq = [
  {
    category: 'Разделение',
    question: 'Как устроено деление практик?',
    answer: 'Сначала выберите уровень образования: бакалавриат или магистратура. В бакалавриате доступны учебная ознакомительная и производственная практика по профилю. В магистратуре — учебная НИР и производственная НИР. После выбора система показывает только документы выбранного варианта.',
  },
  {
    category: 'Сроки',
    question: 'Когда загружать комплект?',
    answer: 'Ориентируйтесь на дату и время в вашем задании LMS. В материалах практики указано прикрепить отчётность не позднее следующего дня после окончания, но прямое указание в LMS имеет приоритет.',
  },
  {
    category: 'Сдача',
    question: 'Куда загружать документы?',
    answer: 'Электронные файлы прикрепляются в личном кабинете LMS в поле «Ответ». Если для договора или оригиналов указан отдельный канал, используйте его и не подменяйте оригинал сканом.',
  },
  {
    category: 'Форматы',
    question: 'В каких форматах сдавать файлы?',
    answer: 'Индивидуальное задание и отчёт — PDF. Аттестационный лист — DOCX (Word). Справка — PDF. Для веток НИР дополнительное приложение обычно хранится как DOCX, если в комплекте не указан другой формат. Договор загружается как PDF, если LMS просит его скан.',
  },
  {
    category: 'Договор',
    question: 'Когда нужен договор с профильной организацией?',
    answer: 'Если производственную практику проходите в профильной организации или по месту работы, подготовьте договор о практической подготовке. Если практика проходит в университете, отдельный договор обычно не нужен — проверьте карточку задания и указания деканата.',
  },
  {
    category: 'Договор',
    question: 'Как предоставить онлайн-договор?',
    answer: 'Есть два безопасных варианта. Если договор подписан на бумаге: отсканируйте полностью подписанный документ в один PDF, загрузите его в LMS при наличии такого требования, а оригинал передайте в деканат. Если договор подписан электронной подписью: сохраните исходный подписанный PDF и загрузите именно его; отдельный файл подписи прикладывайте только по прямому запросу LMS или деканата.',
  },
  {
    category: 'Договор',
    question: 'За сколько дней передавать договор?',
    answer: 'В приложенной инструкции для практики в профильной организации указан срок не позднее чем за 30 календарных дней до начала практики. Если срок уже близко, свяжитесь с деканатом или куратором до даты начала и уточните способ согласования.',
  },
  {
    category: 'Договор',
    question: 'Достаточно ли отправить только скан договора?',
    answer: 'Скан может быть частью электронного комплекта, но не всегда заменяет оригинал. В инструкции к производственной практике оригинал подписанного договора передаётся в деканат; в LMS прикрепляется скан, если это указано в задании.',
  },
  {
    category: 'Подписи',
    question: 'Где нужны подписи и печати?',
    answer: 'В индивидуальном задании и отчёте подпись обучающегося ставится там, где это предусмотрено шаблоном. В аттестационном листе оценочную часть заполняет руководитель. В справке и договоре нужна подпись ответственного лица организации; печать — при наличии.',
  },
  {
    category: 'Аттестация',
    question: 'Что заполнять в аттестационном листе?',
    answer: 'Заполните свои ФИО, группу, направление, профиль и период практики. Разделы с оценкой, заключением, замечаниями и итоговыми баллами оставьте руководителю практики.',
  },
  {
    category: 'Отчёт',
    question: 'Что должно быть в отчёте?',
    answer: 'Отчёт должен отвечать на практические кейсы из индивидуального задания. Покажите ход работы, фактические результаты, доказательства и выводы. Не заменяйте содержательные ответы пересказом теории или одним набором скриншотов.',
  },
  {
    category: 'НИР',
    question: 'Что добавляется в магистратуре?',
    answer: 'Для учебной НИР и производственной НИР появляется дополнительное приложение к комплекту. В нём может быть перечень тем НИР или другие материалы, указанные в вашем архиве и задании. Не прикладывайте приложение от другой темы.',
  },
  {
    category: 'НИР',
    question: 'Что важно для отчёта по НИР?',
    answer: 'Сформулируйте тему, актуальность, объект, предмет, цель, задачи и методы; соберите литературный обзор и библиографию; ответьте на кейс-задачи и свяжите результат с будущей ВКР. Конкретный объём источников смотрите в индивидуальном задании.',
  },
  {
    category: 'PDF',
    question: 'Что проверить после экспорта в PDF?',
    answer: 'Откройте PDF заново: проверьте страницы, поля, таблицы, подписи, читаемость схем и отсутствие многоточий или подсказок шаблона. Имя файла можно сделать понятным: «Фамилия_вид-практики_документ.pdf».',
  },
  {
    category: 'Важно',
    question: 'Что делать, если LMS требует другое?',
    answer: 'Приоритет у прямого требования LMS и руководителя практики. Эта памятка помогает выбрать вид практики и проверить комплект, но не заменяет официальное задание, договорную инструкцию или сообщение куратора.',
  },
] as const;

function faqMatchesFilter(item: (typeof faq)[number], filter: FaqFilter) {
  if (filter === 'all') return true;

  const text = `${item.category} ${item.question} ${item.answer}`.toLocaleLowerCase('ru');
  const keywords: Record<Exclude<FaqFilter, 'all'>, string[]> = {
    bachelor: ['бакалавр'],
    master: ['магистрат', 'магистрант'],
    study: ['учебн'],
    production: ['производствен', 'профильн'],
    research: ['нир', 'научно-исследователь', 'исследован', 'вкр'],
  };

  return keywords[filter].some((keyword) => text.includes(keyword));
}

function getDocuments(track: Track | null, placement: Placement | null) {
  if (!track) return [];

  const result = [...commonDocuments];
  if (track.hasCertificate) result.push(certificateDocument);
  if (track.hasAdditional) result.push(additionalDocument);
  if (track.kind === 'production' && placement === 'organization') result.push(contractDocument);

  return result.map((document, index) => ({ ...document, number: String(index + 1).padStart(2, '0') }));
}

function getRouteKey(trackId: TrackId | null, placement: Placement | null) {
  return `${trackId ?? 'none'}:${placement ?? 'none'}`;
}

export default function Home() {
  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(null);
  const [trackId, setTrackId] = useState<TrackId | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [completedByRoute, setCompletedByRoute] = useState<Record<string, Record<string, boolean>>>({});
  const [query, setQuery] = useState('');
  const [faqFilter, setFaqFilter] = useState<FaqFilter>('all');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('higher-education-practice-faq');
      if (saved) {
        const parsed = JSON.parse(saved) as {
          educationLevel?: EducationLevel | null;
          trackId?: TrackId | null;
          placement?: Placement | null;
          completedByRoute?: Record<string, Record<string, boolean>>;
        };
        if (parsed.educationLevel === 'bachelor' || parsed.educationLevel === 'master') setEducationLevel(parsed.educationLevel);
        if (tracks.some((track) => track.id === parsed.trackId)) setTrackId(parsed.trackId ?? null);
        if (parsed.placement === 'university' || parsed.placement === 'organization') setPlacement(parsed.placement);
        if (parsed.completedByRoute && typeof parsed.completedByRoute === 'object') setCompletedByRoute(parsed.completedByRoute);
      }
    } catch {
      // The checklist still works for this visit when storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        'higher-education-practice-faq',
        JSON.stringify({ educationLevel, trackId, placement, completedByRoute }),
      );
    } catch {
      // Local persistence is a convenience, not a requirement.
    }
  }, [completedByRoute, educationLevel, hydrated, placement, trackId]);

  const selectedTrack = tracks.find((track) => track.id === trackId) ?? null;
  const levelTracks = tracks.filter((track) => track.level === educationLevel);
  const activeDocuments = useMemo(() => getDocuments(selectedTrack, placement), [placement, selectedTrack]);
  const routeKey = getRouteKey(trackId, placement);
  const completed = completedByRoute[routeKey] ?? {};
  const completedCount = activeDocuments.filter((document) => completed[document.id]).length;
  const progress = activeDocuments.length > 0 ? Math.round((completedCount / activeDocuments.length) * 100) : 0;

  const filteredFaq = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ru');
    return faq.filter((item) => {
      const inType = faqMatchesFilter(item, faqFilter);
      const inSearch = !needle || `${item.category} ${item.question} ${item.answer}`.toLocaleLowerCase('ru').includes(needle);
      return inType && inSearch;
    });
  }, [faqFilter, query]);

  const reportStages = selectedTrack?.isResearch ? researchReportStages : standardReportStages;
  const reportIntro = selectedTrack?.isResearch
    ? 'Для НИР свяжите тему исследования, литературную базу, методы, кейс-задачи и результат. Приложение помогает зафиксировать тему, но не заменяет ответы в отчёте.'
    : 'Для учебной и производственной практики раскройте кейсы из задания, покажите реальные действия и приложите проверяемые результаты.';

  function selectEducationLevel(level: EducationLevel) {
    setEducationLevel(level);
    setTrackId(null);
    setPlacement(null);
    setQuery('');
    setFaqFilter('all');
  }

  function selectTrack(id: TrackId) {
    setTrackId(id);
    setPlacement(null);
    setQuery('');
    setFaqFilter('all');
  }

  function toggleDocument(id: string, checked: boolean) {
    if (!trackId) return;
    setCompletedByRoute((current) => ({
      ...current,
      [routeKey]: { ...current[routeKey], [id]: checked },
    }));
  }

  function resetChecklist() {
    setCompletedByRoute((current) => ({ ...current, [routeKey]: {} }));
  }

  const placeLabel = placement === 'organization' ? 'профильная организация' : placement === 'university' ? 'университет' : 'место ещё не выбрано';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3 font-extrabold tracking-[-0.04em]">
            <img src="/practice-logo.png" alt="Логотип" className="size-8 shrink-0 rounded-[3px] object-cover" />
            <span className="hidden truncate sm:inline">ПРАКТИКА · ВО</span>
          </a>
          <nav className="ml-auto flex max-w-[60%] items-center gap-4 overflow-x-auto whitespace-nowrap text-xs font-bold sm:ml-0 sm:max-w-none sm:gap-5 sm:text-sm" aria-label="Основная навигация">
            <a className="shrink-0 hover:text-primary" href="#choice">Выбор практики</a>
            <a className="shrink-0 hover:text-primary" href="#documents">Документы</a>
            <a className="shrink-0 hover:text-primary" href="#report">Отчёт</a>
            <a className="shrink-0 hover:text-primary" href="#faq">ЧАВО</a>
          </nav>
          <Badge variant="outline" className="hidden h-7 shrink-0 border-black/15 bg-[#f3f3f5] px-3 text-black md:inline-flex">ПАМЯТКА</Badge>
        </div>
      </header>

      <div id="top" className="scroll-mt-24" />

      <section id="choice" className="scroll-mt-24 mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-10">
        <div className="relative overflow-hidden rounded-[30px] bg-primary p-6 text-black sm:p-9">
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full border-[46px] border-white/20" />
          <Badge className="relative mb-8 bg-black text-white">Навигатор по документам</Badge>
          <p className="relative mb-3 text-sm font-extrabold uppercase tracking-[0.16em]">Учебная и производственная практика</p>
          <h1 className="relative max-w-3xl text-5xl font-extrabold leading-[0.9] tracking-[-0.06em] sm:text-7xl">Навигатор по практике</h1>
          <p className="relative mt-5 max-w-2xl text-lg font-medium leading-snug sm:text-xl">Сначала выберите уровень образования, затем вид практики. Памятка покажет состав файлов, формат и следующий шаг.</p>
          <div className="relative mt-9 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/15 bg-white/22 p-4">
              <GraduationCap className="mb-5 size-6" />
              <p className="text-sm font-semibold">Начало</p>
              <p className="mt-1 text-xl font-extrabold">Уровень и вид</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-black shadow-sm">
              <CalendarDays className="mb-5 size-6 text-primary" />
              <p className="text-sm font-semibold text-black/60">Срок</p>
              <p className="mt-1 text-xl font-extrabold">Смотрите в LMS</p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-black/50">Шаг 1 из 2</p>
            <Badge variant="secondary" className="bg-[#e0e1e5] text-black">30 секунд</Badge>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Какой у вас уровень?</h2>
          <p className="mt-3 leading-relaxed text-black/60">Это главное разделение: названия и дополнительные материалы зависят от уровня образования.</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Button aria-pressed={educationLevel === 'bachelor'} variant={educationLevel === 'bachelor' ? 'default' : 'outline'} className="h-auto justify-start gap-4 rounded-2xl px-4 py-4 text-left" onClick={() => selectEducationLevel('bachelor')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-black/6"><GraduationCap className="size-5" /></span>
              <span><strong className="block text-base">Бакалавриат</strong><span className="mt-0.5 block text-sm font-normal opacity-70">учебная или производственная</span></span>
            </Button>
            <Button aria-pressed={educationLevel === 'master'} variant={educationLevel === 'master' ? 'default' : 'outline'} className="h-auto justify-start gap-4 rounded-2xl px-4 py-4 text-left" onClick={() => selectEducationLevel('master')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-black/6"><BookOpenCheck className="size-5" /></span>
              <span><strong className="block text-base">Магистратура</strong><span className="mt-0.5 block text-sm font-normal opacity-70">учебная НИР или производственная НИР</span></span>
            </Button>
          </div>

          {educationLevel && <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-black/50">Шаг 2 из 2</p>
            <p className="mt-2 text-sm text-black/60">Выберите вид практики</p>
            <div className="mt-3 grid gap-2">
              {levelTracks.map((track) => (
                <Button key={track.id} aria-pressed={trackId === track.id} variant={trackId === track.id ? 'secondary' : 'outline'} className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => selectTrack(track.id)}>
                  {track.kind === 'production' ? <Building2 className="size-4 shrink-0" /> : <ClipboardCheck className="size-4 shrink-0" />}
                  <span className="ml-2 min-w-0"><strong className="block text-sm">{track.title}</strong><span className="mt-0.5 block text-xs font-normal opacity-65">{track.eyebrow}</span></span>
                  <ChevronRight className="ml-auto size-4 shrink-0 opacity-45" />
                </Button>
              ))}
            </div>
          </div>}

          {selectedTrack?.kind === 'production' && <div className="mt-7 border-t border-black/10 pt-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-black/50">Дополнительный выбор</p>
            <p className="mt-2 text-sm text-black/60">Где проходит производственная практика?</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button aria-pressed={placement === 'university'} variant={placement === 'university' ? 'secondary' : 'outline'} className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => setPlacement('university')}><Landmark className="size-4" /><span className="ml-2"><strong className="block text-sm">В университете</strong><span className="block text-xs font-normal opacity-65">договор обычно не нужен</span></span></Button>
              <Button aria-pressed={placement === 'organization'} variant={placement === 'organization' ? 'secondary' : 'outline'} className="h-auto justify-start rounded-xl px-3 py-3 text-left" onClick={() => setPlacement('organization')}><MapPin className="size-4" /><span className="ml-2"><strong className="block text-sm">В организации</strong><span className="block text-xs font-normal opacity-65">договор + справка</span></span></Button>
            </div>
          </div>}

          <div className="mt-6 min-h-32 rounded-2xl bg-[#f0f1f3] p-5" aria-live="polite">
            {!educationLevel && <div className="flex gap-3 text-sm text-black/60"><ArrowDown className="mt-0.5 size-4 shrink-0 text-primary" /><p>Выберите бакалавриат или магистратуру — покажем соответствующие виды практики.</p></div>}
            {educationLevel && !selectedTrack && <div className="flex gap-3 text-sm text-black/60"><ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" /><p>Теперь выберите вид практики. У НИР будет дополнительное приложение к комплекту.</p></div>}
            {selectedTrack && <div>
              <p className="flex items-center gap-2 font-extrabold"><CheckCircle2 className="size-5 text-[#008f87]" /> {selectedTrack.title} выбрана.</p>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{selectedTrack.note} {selectedTrack.kind === 'production' && !placement ? 'Выберите место практики, чтобы увидеть полный комплект.' : ''}</p>
              <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href="#documents">Открыть чек-лист <ArrowRight className="size-4" /></a>
            </div>}
          </div>
        </div>
      </section>

      <section id="documents" className="scroll-mt-24 bg-black py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Badge className="bg-primary text-white">Чек-лист комплекта</Badge>
              <h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">{selectedTrack ? selectedTrack.title : 'Сначала выберите вид практики'}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">{selectedTrack ? `${selectedTrack.description} Сейчас выбрано: ${placeLabel}.` : 'Здесь появятся только документы выбранной практики. Это не общий список для всех студентов.'}</p>

              <div className="mt-8" aria-label={`Готовность комплекта: ${progress}%`}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold">Готовность комплекта</span>
                  <span className="tabular-nums text-white/70">{completedCount} из {activeDocuments.length || 0}</span>
                </div>
                <progress className="practice-progress mt-3 h-3 w-full overflow-hidden rounded-full bg-white/12" value={progress} max={100} aria-label="Готовность комплекта" aria-valuetext={`${progress}% готово`} />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-white/60">{progress}% готово</p>
                  {completedCount > 0 && <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={resetChecklist}><RefreshCcw /> Сбросить</Button>}
                </div>
              </div>
              {selectedTrack && completedCount === activeDocuments.length && activeDocuments.length > 0 && (
                <output className="mt-6 block rounded-2xl bg-[#d8f04b] p-5 text-black">
                  <PartyPopper className="mb-3 size-7" />
                  <p className="text-xl font-extrabold">Комплект собран</p>
                  <p className="mt-1 text-sm font-semibold">Откройте финальную проверку и только потом отправляйте файлы.</p>
                </output>
              )}
            </div>

            <div className="grid gap-3">
              {activeDocuments.length > 0 ? activeDocuments.map((document) => {
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
              }) : (
                <div className="rounded-[24px] border border-dashed border-white/20 bg-[#191919] p-8 text-white/65"><FileText className="size-8 text-primary" /><p className="mt-4 text-lg font-extrabold text-white">Документы появятся после выбора вида практики</p><p className="mt-2 text-sm leading-relaxed">Выберите уровень образования и один из двух видов практики выше.</p></div>
              )}

              {selectedTrack?.kind === 'production' && <div className="mt-3 rounded-[24px] border border-primary/50 bg-primary/12 p-5">
                <div className="flex gap-4">
                  <AlertTriangle className="mt-0.5 size-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-extrabold">Договор — отдельная подсказка</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{placement === 'organization' ? 'Скан договора добавлен в чек-лист. Оригинал с подписями передайте в деканат не позднее чем за 30 календарных дней до старта, если такой срок указан для вашего потока.' : placement === 'university' ? 'Для практики в университете договор обычно не нужен. Если LMS показывает отдельный запрос, следуйте ему и уточните способ передачи в деканате.' : 'Выберите место практики. Для профильной организации появятся скан договора и справка, а для университета — только документы выбранного варианта.'}</p>
                  </div>
                </div>
              </div>}
              {selectedTrack?.kind === 'study' && <div className="mt-3 rounded-[24px] border border-white/15 bg-[#191919] p-5">
                <div className="flex gap-4">
                  <FileCheck2 className="mt-0.5 size-6 shrink-0 text-[#d8f04b]" />
                  <div><h3 className="font-extrabold">Для учебной практики</h3><p className="mt-2 text-sm leading-relaxed text-white/65">В предоставленных учебных комплектах договор и справка не входят в базовый список. Не добавляйте лишние файлы, если LMS или руководитель прямо их не запросили.</p></div>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Badge variant="outline" className="border-black/15 bg-white text-black">Маршрут</Badge><h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Что делать и когда</h2></div>
          <p className="max-w-md text-sm leading-relaxed text-black/55">Сначала проверьте вид и место практики, затем собирайте доказательства и оформляйте файлы.</p>
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
            <div><Badge className="bg-primary text-white">Скелет отчёта</Badge><h2 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Четыре уровня — один результат</h2></div>
            <p className="max-w-2xl text-lg leading-relaxed text-black/60">{reportIntro}</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {reportStages.map((stage) => (
              <article key={stage.level} className="rounded-[26px] border border-black/10 bg-[#f4f4f5] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4"><Badge className="text-black" style={{ backgroundColor: stage.color }}>Уровень {stage.level}</Badge><BadgeCheck className="size-6 text-black/30" /></div>
                <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.035em]">{stage.title}</h3>
                <ul className="mt-5 grid gap-3">{stage.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 rounded-[26px] bg-black p-6 text-white sm:grid-cols-[auto_1fr] sm:items-center sm:p-7">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-white"><Sparkles className="size-7" /></span>
            <div><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/50">Финальная связка</p><h3 className="mt-1 text-2xl font-extrabold">Факты → анализ → вывод</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">Каждый вывод должен быть связан с тем, что вы сделали, увидели или проверили в ходе практики.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[.95fr_1.05fr]">
        <div className="rounded-[28px] bg-[#d8f04b] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em]">Оценивание</p><h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em]">Что оценивают</h2></div><BookOpenCheck className="size-8" /></div>
          <div className="mt-8 grid gap-3">
            {scoring.map(([points, title]) => <div key={points + title} className="flex items-center gap-4 rounded-2xl bg-white/70 p-4"><p className="w-16 shrink-0 text-3xl font-black">{points}</p><p className="text-sm font-bold leading-snug">{title}</p></div>)}
          </div>
          <p className="mt-5 text-sm font-semibold leading-relaxed">Шаблон важен, но основная ценность — в самостоятельном содержании, ответах на кейсы и качестве анализа.</p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em] text-black/45">Перед отправкой</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">Финальная проверка</h2></div><ShieldCheck className="size-8 text-primary" /></div>
          <ul className="mt-7 grid gap-4">{finalChecks.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/65"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#d8f04b]"><Check className="size-3.5" /></span>{item}</li>)}</ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#e0e1e5] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center"><Badge className="bg-black text-white">Частые вопросы</Badge><h2 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] sm:text-6xl">Короткий ответ на сложный момент</h2><p className="mx-auto mt-4 max-w-2xl text-black/60">Ищите по словам: «бакалавриат», «НИР», «договор», «PDF», «справка», «аттестационный».</p></div>
          <div className="relative mx-auto mt-8 max-w-2xl"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-black/40" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Что непонятно?" aria-label="Поиск по частым вопросам" className="h-14 rounded-2xl border-black/15 bg-white pl-12 pr-4 text-base shadow-sm" /></div>
          <fieldset className="mx-auto mt-4 max-w-2xl">
            <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-black/45">Показать вопросы по типу</legend>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {faqFilters.map((filter) => <Button key={filter.id} type="button" size="sm" variant={faqFilter === filter.id ? 'default' : 'outline'} className="shrink-0 rounded-full border-black/15 bg-white text-xs" onClick={() => setFaqFilter(filter.id)}>{filter.label}</Button>)}
            </div>
          </fieldset>
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
          <div><div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.13em]"><Lightbulb className="size-5" /> Главное правило</div><h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.04em] sm:text-4xl">Если LMS или руководитель дали новое прямое указание — оно важнее этой памятки.</h2><p className="mt-3 max-w-3xl font-semibold">Памятка обезличена и помогает выбрать нужный вид практики, но не меняет официальные требования.</p></div>
          <a href="#top" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-bold text-white hover:bg-black/80">Наверх <Upload className="size-4" /></a>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-black/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-semibold">Памятка для высшего образования</p>
          <p>Проверяйте актуальную версию задания в LMS.</p>
        </div>
      </footer>
    </main>
  );
}
