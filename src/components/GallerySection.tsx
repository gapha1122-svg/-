import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'activities', label: 'أنشطة وفعاليات' },
    { id: 'events', label: 'مناسبات وتكريم' },
    { id: 'classes', label: 'الفصول والمختبرات' }
  ];

  const filteredItems =
    selectedCat === 'all' ? gallery : gallery.filter((i) => i.cat === selectedCat);

  return (
    <section className="mb-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>المعرض التوثيقي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          نبض مدرسة بالشهم بالصور
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          لحظات مفعمة بالفرح، والمثابرة، والإنجاز داخل أسوار مدرستنا
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCat === c.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative bg-slate-100 rounded-3xl overflow-hidden aspect-4/3 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600/80 text-white w-fit mb-2 backdrop-blur-xs">
                {item.catLabel}
              </span>
              <h3 className="font-bold text-base sm:text-lg leading-snug">{item.title}</h3>
              {item.date && (
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{item.date}</span>
                </div>
              )}
            </div>

            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.img}
              alt={activePhoto.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-6 text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  {activePhoto.catLabel}
                </span>
                <h3 className="text-lg sm:text-xl font-bold">{activePhoto.title}</h3>
              </div>
              {activePhoto.date && (
                <span className="text-xs text-slate-400 shrink-0">{activePhoto.date}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
