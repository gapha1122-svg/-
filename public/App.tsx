/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initialStrategies,
  initialTeachers,
  initialStudents,
  initialPosts,
  initialGallery,
  initialStats,
  initialEvents,
  initialVisitorStats
} from './data/initialData';
import {
  Teacher,
  Student,
  LearningStrategy,
  StudentPost,
  GalleryItem,
  SchoolStats,
  UserSession,
  SyncReport,
  SchoolEvent,
  VisitorStats
} from './types';

import { TickerBar } from './components/TickerBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StatsCounter } from './components/StatsCounter';
import { QuickPortals } from './components/QuickPortals';
import { SchoolCalendar } from './components/SchoolCalendar';
import { StrategiesSection } from './components/StrategiesSection';
import { TeachersSection } from './components/TeachersSection';
import { StudentsSection } from './components/StudentsSection';
import { GallerySection } from './components/GallerySection';
import { BoardSection } from './components/BoardSection';
import { DashboardSection } from './components/DashboardSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AddPersonModal } from './components/AddPersonModal';
import { ActivitiesModal } from './components/ActivitiesModal';
import { EventModal } from './components/EventModal';
import { VisitorCounter } from './components/VisitorCounter';
import { Calendar, AlertTriangle, ArrowLeft, Clock } from 'lucide-react';

const STORAGE_KEY = 'balshaham_school_portal_v2';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('balshaham_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Data State
  const [announcement, setAnnouncement] = useState<string>(
    'مرحباً بكم في بوابة مدرسة بالشهم الابتدائية للعام 1448هـ / 2026م • تكريم الطلاب الأوائل يوم الخميس القادم • نرحب بزيارة أولياء الأمور الكرام لمتابعة التحصيل الدراسي'
  );
  const [stats, setStats] = useState<SchoolStats>(initialStats);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [strategies] = useState<LearningStrategy[]>(initialStrategies);
  const [posts, setPosts] = useState<StudentPost[]>(initialPosts);
  const [gallery] = useState<GalleryItem[]>(initialGallery);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => {
    try {
      const saved = localStorage.getItem('balshaham_visitor_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading visitor stats:', e);
    }
    return initialVisitorStats;
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [addPersonType, setAddPersonType] = useState<'teacher' | 'student'>('teacher');
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<SchoolEvent | null>(null);

  // Load from LocalStorage on mount and track visits
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.students && Array.isArray(parsed.students)) {
          const validGrades = ['الصف السادس', 'الصف الخامس', 'الصف الرابع'];
          const cleanedStudents = parsed.students.map((s: Student) => {
            if (!validGrades.some((g) => s.role.includes(g))) {
              return { ...s, role: 'الصف الرابع' };
            }
            return s;
          });
          setStudents(cleanedStudents);
        }
        if (parsed.posts) setPosts(parsed.posts);
        if (parsed.announcement) setAnnouncement(parsed.announcement);
        if (parsed.events) setEvents(parsed.events);
      }

      // Check visit in this browser session
      const hasCountedSession = sessionStorage.getItem('balshaham_session_counted');
      const todayStr = new Date().toISOString().split('T')[0];

      setVisitorStats((prev) => {
        const isNewDay = prev.lastVisitDate !== todayStr;
        const newToday = isNewDay ? 1 : prev.todayVisitors + (hasCountedSession ? 0 : 1);
        const newTotal = prev.totalVisitors + (hasCountedSession ? 0 : 1);
        const updated: VisitorStats = {
          ...prev,
          totalVisitors: newTotal,
          todayVisitors: newToday,
          lastVisitDate: todayStr
        };
        try {
          localStorage.setItem('balshaham_visitor_stats', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not save visitor stats:', e);
        }
        return updated;
      });

      if (!hasCountedSession) {
        sessionStorage.setItem('balshaham_session_counted', 'true');
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }

    // Subtle realistic fluctuation for active online visitors
    const interval = setInterval(() => {
      setVisitorStats((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const newOnline = Math.max(5, Math.min(24, prev.onlineNow + delta));
        return { ...prev, onlineNow: newOnline };
      });
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // Save changes to LocalStorage
  const persistData = (
    newStats = stats,
    newTeachers = teachers,
    newStudents = students,
    newPosts = posts,
    newAnnouncement = announcement,
    newEvents = events
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stats: newStats,
          teachers: newTeachers,
          students: newStudents,
          posts: newPosts,
          announcement: newAnnouncement,
          events: newEvents
        })
      );
    } catch (e) {
      console.warn('Failed to save to local storage:', e);
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    localStorage.setItem('balshaham_admin_session', JSON.stringify(session));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('balshaham_admin_session');
    if (activeTab === 'dashboard') setActiveTab('home');
  };

  // Add Person Handlers
  const handleOpenAddPerson = (type: 'teacher' | 'student') => {
    setAddPersonType(type);
    setIsAddPersonModalOpen(true);
  };

  const handleAddTeacher = (teacher: Teacher) => {
    const updated = [teacher, ...teachers];
    const newStats = { ...stats, teachers: updated.length };
    setTeachers(updated);
    setStats(newStats);
    persistData(newStats, updated, students, posts, announcement, events);
    setActiveTab('teachers');
  };

  const handleDeleteTeacher = (id: number) => {
    const updated = teachers.filter((t) => t.id !== id);
    const newStats = { ...stats, teachers: updated.length };
    setTeachers(updated);
    setStats(newStats);
    persistData(newStats, updated, students, posts, announcement, events);
  };

  const handleAddStudent = (student: Student) => {
    const updated = [student, ...students];
    const newStats = { ...stats, students: stats.students + 1 };
    setStudents(updated);
    setStats(newStats);
    persistData(newStats, teachers, updated, posts, announcement, events);
    setActiveTab('students');
  };

  const handleDeleteStudent = (id: number) => {
    const updated = students.filter((s) => s.id !== id);
    const newStats = { ...stats, students: Math.max(0, stats.students - 1) };
    setStudents(updated);
    setStats(newStats);
    persistData(newStats, teachers, updated, posts, announcement, events);
  };

  // Posts Handlers
  const handleAddPost = (author: string, grade: string, content: string) => {
    const newPost: StudentPost = {
      id: Date.now(),
      author,
      grade,
      content,
      likes: 0,
      createdAt: 'الآن'
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    persistData(stats, teachers, students, updated, announcement, events);
  };

  const handleLikePost = (id: number) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
    setPosts(updated);
    persistData(stats, teachers, students, updated, announcement, events);
  };

  // Calendar Event Handlers
  const handleOpenAddEvent = () => {
    setEventToEdit(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: SchoolEvent) => {
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (savedEvent: SchoolEvent) => {
    let updated: SchoolEvent[];
    if (events.some((e) => e.id === savedEvent.id)) {
      updated = events.map((e) => (e.id === savedEvent.id ? savedEvent : e));
    } else {
      updated = [savedEvent, ...events];
    }
    setEvents(updated);
    persistData(stats, teachers, students, posts, announcement, updated);
  };

  const handleDeleteEvent = (id: number) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    persistData(stats, teachers, students, posts, announcement, updated);
  };

  // Dashboard Sync Handlers
  const handleSyncStudents = (
    incomingStudents: Student[],
    updatedStats: SchoolStats,
    _report: SyncReport
  ) => {
    setStudents(incomingStudents);
    setStats(updatedStats);
    persistData(updatedStats, teachers, incomingStudents, posts, announcement, events);
  };

  const handleUpdateStats = (newStats: SchoolStats) => {
    setStats(newStats);
    persistData(newStats, teachers, students, posts, announcement, events);
  };

  const handleUpdateAnnouncement = (text: string) => {
    setAnnouncement(text);
    persistData(stats, teachers, students, posts, text, events);
  };

  const handleUpdateVisitorStats = (newVisitorStats: VisitorStats) => {
    setVisitorStats(newVisitorStats);
    try {
      localStorage.setItem('balshaham_visitor_stats', JSON.stringify(newVisitorStats));
    } catch (e) {
      console.warn('Could not save visitor stats:', e);
    }
  };

  const handleResetData = () => {
    setStats(initialStats);
    setTeachers(initialTeachers);
    setStudents(initialStudents);
    setPosts(initialPosts);
    setEvents(initialEvents);
    setVisitorStats(initialVisitorStats);
    setAnnouncement(
      'مرحباً بكم في بوابة مدرسة بالشهم الابتدائية للعام 1448هـ / 2026م • تكريم الطلاب الأوائل يوم الخميس القادم • نرحب بزيارة أولياء الأمور الكرام لمتابعة التحصيل الدراسي'
    );
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('balshaham_visitor_stats');
  };

  // Top 3 upcoming events for home teaser
  const upcomingEventsPreview = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800" dir="rtl">
      {/* Top Ticker Announcements */}
      <TickerBar announcement={announcement} visitorStats={visitorStats} />

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {activeTab === 'home' && (
          <div>
            <HeroBanner
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenActivities={() => setIsActivitiesModalOpen(true)}
            />
            <StatsCounter stats={stats} />
            <VisitorCounter stats={visitorStats} variant="full" />
            <QuickPortals
              onOpenAddTeacher={() => handleOpenAddPerson('teacher')}
              onOpenActivities={() => setIsActivitiesModalOpen(true)}
              onNavigate={(tab) => setActiveTab(tab)}
            />

            {/* Upcoming School Events Teaser */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white mb-12 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      أقرب الفعاليات والمواعيد المدرسية القادمة
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مواعيد الاختبارات والإجازات والأنشطة للفصل الدراسي الحالي
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleOpenAddEvent}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                  >
                    <span>+ إضافة موعد</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>عرض التقويم الكامل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEventsPreview.map((ev) => {
                  const isExam = ev.category === 'exam';
                  const isHoliday = ev.category === 'holiday';

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setActiveTab('calendar')}
                      className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isExam
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : isHoliday
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isExam ? 'اختبارات' : isHoliday ? 'إجازة رسمية' : 'نشاط مدرسي'}
                          </span>

                          {ev.isImportant && (
                            <span className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              <span>مهم</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors mb-2">
                          {ev.title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {ev.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{ev.date}</span>
                        </div>
                        {ev.hijriDate && (
                          <span className="text-slate-400 font-sans">{ev.hijriDate}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Teasers on Home for rich experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
              {/* Highlight from Strategies */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800">
                      دليل المعلمين
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {strategies.length} استراتيجيات معتمدة
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    استراتيجيات التعلم النشط داخل الصف
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    خطط تطبيقية تفاعلية تعزز مهارات التفكير الناقد والعمل الجماعي لدى طلاب المرحلة
                    الابتدائية (فكر-زاوج-شارك، الرؤوس المرقمة، جدول التعلم، والكرسي الساخن).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('strategies')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  استعراض الدليل الشامل &larr;
                </button>
              </div>

              {/* Highlight from Honor Roll */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800">
                      لوحة الشرف
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      تكريم الأوائل والمبدعين
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    نحتفي بأبطالنا في التحصيل والسلوك
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    سجل فخري يوثق إنجازات فرسان مدرسة بالشهم في الصفوف العليا (الصف السادس، الصف الخامس، الصف الرابع) في مسابقات القرآن الكريم، الأولمبياد العلمي، الإلقاء، والمواظبة اليومية.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  استعراض لوحة شرف المتميزين &larr;
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <SchoolCalendar
            events={events}
            currentUser={currentUser}
            onOpenAddEvent={handleOpenAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'teachers' && (
          <TeachersSection
            teachers={teachers}
            currentUser={currentUser}
            onOpenAddTeacher={() => handleOpenAddPerson('teacher')}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'students' && (
          <StudentsSection
            students={students}
            currentUser={currentUser}
            onOpenAddStudent={() => handleOpenAddPerson('student')}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {activeTab === 'strategies' && <StrategiesSection strategies={strategies} />}

        {activeTab === 'gallery' && <GallerySection gallery={gallery} />}

        {activeTab === 'board' && (
          <BoardSection posts={posts} onAddPost={handleAddPost} onLikePost={handleLikePost} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardSection
            stats={stats}
            students={students}
            events={events}
            visitorStats={visitorStats}
            announcement={announcement}
            onUpdateStats={handleUpdateStats}
            onUpdateVisitorStats={handleUpdateVisitorStats}
            onSyncStudents={handleSyncStudents}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onOpenAddEvent={handleOpenAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer with Saudi Emergency Badges & Visitor Counter */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} visitorStats={visitorStats} />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        type={addPersonType}
        onClose={() => setIsAddPersonModalOpen(false)}
        onAddTeacher={handleAddTeacher}
        onAddStudent={handleAddStudent}
      />

      <ActivitiesModal
        isOpen={isActivitiesModalOpen}
        onClose={() => setIsActivitiesModalOpen(false)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        eventToEdit={eventToEdit}
        onClose={() => setIsEventModalOpen(false)}
        onSaveEvent={handleSaveEvent}
      />
    </div>
  );
}
