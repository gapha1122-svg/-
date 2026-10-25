import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Sparkles, Smile, MessageCircle } from 'lucide-react';
import { StudentPost } from '../types';

interface BoardSectionProps {
  posts: StudentPost[];
  onAddPost: (author: string, grade: string, content: string) => void;
  onLikePost: (id: number) => void;
}

export const BoardSection: React.FC<BoardSectionProps> = ({ posts, onAddPost, onLikePost }) => {
  const [author, setAuthor] = useState('');
  const [grade, setGrade] = useState('الصف السادس');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    onAddPost(author.trim(), grade, content.trim());
    setAuthor('');
    setContent('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const grades = [
    'الصف السادس',
    'الصف الخامس',
    'الصف الرابع'
  ];

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>التفاعل الطلابي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          منبر إبداع وكلمات الطلاب
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          مساحتك الحرة للتعبير عن شكرك لمعلميك، مشاركة أفكارك، وافتخارك بمدرستك
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Composer Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">شارك كلمتك الآن</h3>
              <p className="text-xs text-slate-500">أضف رسالة حب أو فكرة ملهمة لزملائك</p>
            </div>
          </div>

          {submitted && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>تم نشر كلمتك بنجاح على المنبر! شكراً لمشاركتك.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسمك الكريم:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="مثال: تركي محمد الغامدي"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الصف الدراسي:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رسالتك أو فكرتك:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="اكتب مشاعرك تجاه مدرستك ومعلميك، أو تجربة جميلة عشتها في الفصل..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>نشر الكلمة على المنبر</span>
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>أحدث مشاركات الطلاب ({posts.length})</span>
            </span>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{post.author}</h4>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {post.grade}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">{post.createdAt}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => onLikePost(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{post.likes} إعجاب وتأييد</span>
                </button>

                <span className="text-[11px] font-semibold text-slate-400">
                  مشاركة طلابية معتمدة
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
