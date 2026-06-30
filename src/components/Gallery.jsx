import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Gallery({ images, modName }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index + 1) % images.length);
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            onClick={() => setActiveIndex(index)}
            className="group aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 text-left transition-colors duration-200 hover:border-emerald-400/40"
          >
            <img
              src={image}
              alt={`${modName} galeria ${index + 1}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] grid place-items-center bg-zinc-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((index) => (index - 1 + images.length) % images.length);
                }}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-lg border border-white/10 p-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10 sm:grid"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((index) => (index + 1) % images.length);
                }}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-lg border border-white/10 p-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10 sm:grid"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`${modName} galeria ${activeIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="animate-scale-in max-h-[85vh] max-w-[92vw] rounded-lg border border-white/10 object-contain shadow-2xl"
          />

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-zinc-950/80 px-3 py-1 text-sm text-zinc-300">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
