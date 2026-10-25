import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { SchoolStats, Student, SyncReport, SchoolEvent, VisitorStats } from '../types';
import {
  Sliders,
  CloudUpload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  Users,
  School,
  Award,
  Bell,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Eye
} from 'lucide-react';

interface DashboardSectionProps {
  stats: SchoolStats;
  students: Student[];
  events: SchoolEvent[];
  visitorStats: VisitorStats;
  announcement: string;
  onUpdateStats: (newStats: SchoolStats) => void;
  onUpdateVisitorStats: (newVisitorStats: VisitorStats) => void;
  onSyncStudents: (incomingStudents: Student[], newStats: SchoolStats, report: SyncReport) => void;
  onUpdateAnnouncement: (text: string) => void;
  onOpenAddEvent: () => void;
  onEditEvent: (event: SchoolEvent) => void;
  onDeleteEvent: (id: number) => void;
  onResetData: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  students,
  events,
  visitorStats,
  announcement,
  onUpdateStats,
  onUpdateVisitorStats,
  onSyncStudents,
  onUpdateAnnouncement,
  onOpenAddEvent,
  onEditEvent,
  onDeleteEvent,
  onResetData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual Stats State
  const [editStudents, setEditStudents] = useState<number>(stats.students);
  const [editTeachers, setEditTeachers] = useState<number>(stats.teachers);
  const [editClasses, setEditClasses] = useState<number>(stats.classes);
  const [editAwards, setEditAwards] = useState<number>(stats.awards);
  const [editVisitors, setEditVisitors] = useState<number>(visitorStats?.totalVisitors || 18450);
  const [statsSavedMessage, setStatsSavedMessage] = useState(false);

  // Announcement state
  const [editAnnouncement, setEditAnnouncement] = useState<string>(announcement);
  const [announcementSavedMessage, setAnnouncementSavedMessage] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleSyncExcel = async () => {
    if (!selectedFile) {
      setErrorMessage('يرجى اختيار ملف كشف الطلاب أولاً بصيغة (.xlsx أو .xls أو .csv).');
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      if (!rows || rows.length === 0) {
        setErrorMessage('الملف المرفوع فارغ ولا يحتوي على سجلات بيانات.');
        setIsSyncing(false);
        return;
      }

      const incomingStudents: Student[] = [];
      const distinctClasses = new Set<string>();

      rows.forEach((row, idx) => {
        const nameVal =
          (row['اسم الطالب'] ||
            row['الاسم'] ||
            row['اسم_الطالب'] ||
            row['الطالب'] ||
            row['اسم الطالب الثلاثي'] ||
            row['Name'] ||
            row['name']) as string | undefined;

        const roleVal =
          (row['الصف'] ||
            row['الصف الدراسي'] ||
            row['الفصل'] ||
            row['المرحلة'] ||
            row['Grade'] ||
            'الصف الابتدائي') as string | undefined;

        const infoVal =
          (row['معلومات'] ||
            row['ملاحظات'] ||
            row['الحالة'] ||
            row['الإنجاز'] ||
            'مسجل رسمياً عبر منصة مدرستي') as string | undefined;

        if (nameVal && String(nameVal).trim().length > 0) {
          const sName = String(nameVal).trim();
          const sRole = String(roleVal).trim() || 'الصف الابتدائي';
          const sInfo = String(infoVal).trim() || 'مسجل رسمياً عبر منصة مدرستي';

          incomingStudents.push({
            id: Date.now() + idx,
            name: sName,
            role: sRole,
            info: sInfo
          });
          distinctClasses.add(sRole);
        }
      });

      if (incomingStudents.length === 0) {
        setErrorMessage(
          'لم يتم العثور على عمود يحتوي على (اسم الطالب) داخل الملف. يرجى التأكد من تسمية رأس العمود أو تنزيل النموذج التجريبي المرفق.'
        );
        setIsSyncing(false);
        return;
      }

      const oldNames = new Set(students.map((s) => s.name));
      const newNames = new Set(incomingStudents.map((s) => s.name));

      let addedCount = 0;
      let removedCount = 0;
      const newlyAddedNames: string[] = [];

      incomingStudents.forEach((s) => {
        if (!oldNames.has(s.name)) {
          addedCount++;
          newlyAddedNames.push(s.name);
        }
      });

      students.forEach((s) => {
        if (!newNames.has(s.name)) {
          removedCount++;
        }
      });

      const updatedStats: SchoolStats = {
        ...stats,
        students: incomingStudents.length,
        classes: distinctClasses.size > 0 ? distinctClasses.size : stats.classes
      };

      const report: SyncReport = {
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        addedCount,
        removedCount,
        totalStudents: incomingStudents.length,
        classesCount: distinctClasses.size > 0 ? distinctClasses.size : stats.classes,
        addedNames: newlyAddedNames
      };

      onSyncStudents(incomingStudents, updatedStats, report);
      setSyncReport(report);
      setEditStudents(incomingStudents.length);
      if (distinctClasses.size > 0) setEditClasses(distinctClasses.size);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        'حدث خطأ غير متوقع أثناء معالجة الملف. يرجى التأكد من سلامة ملف Excel وصيغته.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        'اسم الطالب': 'فيصل خالد السبيعي',
        الصف: 'الصف السادس',
        معلومات: 'الأول على المدرسة - معدل 99.8%'
      },
      {
        'اسم الطالب': 'ريان أحمد الغامدي',
        الصف: 'الصف السادس',
        معلومات: 'المركز الأول في مسابقة القرآن الكريم'
      },
      {
        'اسم الطالب': 'عمر ماجد الغامدي',
        الصف: 'الصف الخامس',
        معلومات: 'الفائز ببطولة الإلقاء والخطابة'
      },
      {
        'اسم الطالب': 'سعود فيصل العمري',
        الصف: 'الصف الخامس',
        معلومات: 'بطل مسابقة الرياضيات الذكية'
      },
      {
        'اسم الطالب': 'محمد تركي الشهري',
        الصف: 'الصف الرابع',
        معلومات: 'فارس الانضباط والسلوك المتميز'
      },
      {
        'اسم الطالب': 'عبدالله فهد الزهراني',
        الصف: 'الصف الرابع',
        معلومات: 'مبتكر نادي العلوم والذكاء الاصطناعي'
      },
      {
        'اسم الطالب': 'يزيد سلطان الحارثي',
        الصف: 'الصف السادس',
        معلومات: 'الأول في أولمبياد الرياضيات والذكاء الاصطناعي'
      },
      {
        'اسم الطالب': 'نايف عبدالهادي الغامدي',
        الصف: 'الصف الخامس',
        معلومات: 'متفوق في الإملاء والخط العربي والتعبير'
      },
      {
        'اسم الطالب': 'بسام حمود الزهراني',
        الصف: 'الصف الرابع',
        معلومات: 'بطل التهجئة والقراءة السريعة'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'كشف الطلاب');
    XLSX.writeFile(wb, 'كشف_طلاب_مدرستي_بالشهم_نموذج_تجريبي.xlsx');
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStats({
      students: Number(editStudents),
      teachers: Number(editTeachers),
      classes: Number(editClasses),
      awards: Number(editAwards),
      visitors: Number(editVisitors)
    });
    onUpdateVisitorStats({
      ...visitorStats,
      totalVisitors: Number(editVisitors)
    });
    setStatsSavedMessage(true);
    setTimeout(() => setStatsSavedMessage(false), 3000);
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncement(editAnnouncement);
    setAnnouncementSavedMessage(true);
    setTimeout(() => setAnnouncementSavedMessage(false), 3000);
  };

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
          <Sliders className="w-3.5 h-3.5 text-emerald-700" />
          <span>لوحة التحكم الإدارية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          إدارة بوابة مدرسة بالشهم الابتدائية
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          المزامنة التلقائية مع منصة مدرستي ونظام نور، تحديث الإحصائيات، وضبط التنبيهات
        </p>
      </div>

      {/* Main Smart Sync Box */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-800/40 mb-10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                المزامنة الذكية مع مدرستي ونظام نور
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80">
                قراءة وتحليل كشوف الطلاب المعتمدة بصيغة Excel أو CSV وتحديث البوابة فورياً
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            ارفع ملف الكشف المصدر من مدرستي أو نور، وسيقوم النظام تلقائياً باستخراج بيانات الطلاب،
            إضافة المستجدين، وحساب إحصائية الفصول وتحديث كامل الموقع بلحظة واحدة!
          </p>

          {/* Upload and Action Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="w-full text-xs sm:text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 file:cursor-pointer cursor-pointer bg-slate-900/60 p-2 rounded-xl border border-slate-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleSyncExcel}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/30 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSyncing ? 'جارٍ التحليل والمزامنة...' : 'بدء المزامنة والتحديث الفوري'}</span>
              </button>

              <button
                onClick={handleDownloadSample}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>تحميل نموذج كشف تجريبي (Excel)</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Sync Report */}
          {syncReport && (
            <div className="mt-6 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-5 animate-in fade-in duration-300">
              <h4 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تقرير المزامنة والتحديث الأخير (الساعة: {syncReport.timestamp})</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-emerald-400">
                    +{syncReport.addedCount}
                  </span>
                  <span className="text-[11px] text-slate-300 font-bold">طالب مستجد</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-rose-400">
                    -{syncReport.removedCount}
                  </span>
                  <span className="text-[11px] text-slate-300 font-bold">طالب غير مدرج</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-sky-400">
                    {syncReport.totalStudents}
                  </span>
                  <span className="text-[11px] text-slate-300 font-bold">إجمالي الطلاب المعتمد</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="block text-xl font-black text-amber-400">
                    {syncReport.classesCount}
                  </span>
                  <span className="text-[11px] text-slate-300 font-bold">الفصول الدراسية</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Manual Stats Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <School className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">تعديل الإحصائيات العامة</h3>
              <p className="text-xs text-slate-500">
                تحديث أرقام الطلاب والمعلمين والفصول الظاهرة في الصفحة الرئيسية
              </p>
            </div>
          </div>

          {statsSavedMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ الأرقام والإحصائيات بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleSaveStats} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>عدد الطلاب:</span>
                </label>
                <input
                  type="number"
                  value={editStudents}
                  onChange={(e) => setEditStudents(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>عدد المعلمين:</span>
                </label>
                <input
                  type="number"
                  value={editTeachers}
                  onChange={(e) => setEditTeachers(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-amber-600" />
                  <span>عدد الفصول الدراسية:</span>
                </label>
                <input
                  type="number"
                  value={editClasses}
                  onChange={(e) => setEditClasses(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>جوائز التميز:</span>
                </label>
                <input
                  type="number"
                  value={editAwards}
                  onChange={(e) => setEditAwards(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>عداد إجمالي زوار البوابة (معايرة الرقم التراكمي):</span>
                </label>
                <input
                  type="number"
                  value={editVisitors}
                  onChange={(e) => setEditVisitors(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  يمكن تعديل قراءة العداد لتتوافق مع إحصائيات زوار البوابة الرسمية للمدرسة.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإحصائيات المحدثة</span>
            </button>
          </form>
        </div>

        {/* Announcement & System Settings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Announcement Ticker Editor */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-600" />
              <h3 className="font-extrabold text-sm text-slate-900">شريط الإعلانات العاجل</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              النص المتحرك في أعلى الصفحة لتبليغ أولياء الأمور والطلاب
            </p>

            {announcementSavedMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم تحديث نص الشريط بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <textarea
                value={editAnnouncement}
                onChange={(e) => setEditAnnouncement(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>تحديث نص الإعلان</span>
              </button>
            </form>
          </div>

          {/* Reset / Backup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1">استعادة البيانات الافتراضية</h3>
            <p className="text-xs text-slate-500 mb-4">
              إعادة تعيين كافة المعلمين والطلاب والمنشورات للبيانات التأسيسية
            </p>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات إلى الإعدادات الأولية؟')) {
                  onResetData();
                }
              }}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors w-full cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط المصنع للبيانات</span>
            </button>
          </div>
        </div>

        {/* Calendar & Events Manager Card */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  إدارة فعاليات ومواعيد التقويم المدرسي
                </h3>
                <p className="text-xs text-slate-500">
                  إضافة، تعديل، أو حذف مواعيد الاختبارات والإجازات والأنشطة المدرسية ({events.length} فعالية مسجلة)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAddEvent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة موعد أو فعالية جديدة</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="pb-3 px-3">الفعالية / الموعد</th>
                  <th className="pb-3 px-3">التصنيف</th>
                  <th className="pb-3 px-3">التاريخ الميلادي</th>
                  <th className="pb-3 px-3">التاريخ الهجري</th>
                  <th className="pb-3 px-3">المستهدفون</th>
                  <th className="pb-3 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{ev.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{ev.description}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {ev.category === 'exam'
                          ? 'اختبارات'
                          : ev.category === 'holiday'
                          ? 'إجازة'
                          : ev.category === 'activity'
                          ? 'نشاط'
                          : 'لقاء'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono" dir="ltr">{ev.date}</td>
                    <td className="py-3 px-3 text-slate-600">{ev.hijriDate || '-'}</td>
                    <td className="py-3 px-3 text-slate-600">{ev.targetAudience || 'الجميع'}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditEvent(ev)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                          title="تعديل الفعالية"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف فعالية "${ev.title}"؟`)) {
                              onDeleteEvent(ev.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف الفعالية"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
