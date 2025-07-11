import headphone2 from '../../assets/images/headphone2.png';

const CustomFeaturedSection = () => {
  return (
    <section className="my-12 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 w-full box-border overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-0 items-stretch bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.15)] overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)]">
        {/* Product Image */}
        <div className="flex-1.2 min-w-0 h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50/40 to-blue-100/10 dark:from-slate-900 dark:to-slate-800 cursor-pointer">
          <img 
            src={headphone2} 
            alt="Immerse Yourself in Your Music" 
            className="w-full h-full max-w-[700px] max-h-[700px] object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none transition-transform duration-300 group-hover:scale-105" 
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-400/0 pointer-events-none z-10" />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-transparent text-center relative">
          {/* Decorative circle */}
          <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-radial from-emerald-400/10 to-transparent rounded-full z-0" />
          <div className="flex flex-col items-center gap-8 w-full max-w-xl relative z-10">
            <span className="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 font-semibold text-base mb-0 px-4 py-2 rounded-full uppercase tracking-wider">IN STOCK NOW</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">Immerse Yourself in Your Music</h2>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-4">Elevate your audio experience with rich and powerful sound, seamlessly blending style and substance.</p>
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mt-4 max-w-xs mx-auto cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
              <img src={headphone2} alt="Harmony Bookshelf Speaker" className="w-10 h-10 rounded-md mr-4" />
              <div className="flex flex-col items-start flex-1">
                <span className="text-xs text-slate-500 dark:text-slate-300 font-semibold">STOCKMART</span>
                <span className="font-semibold text-slate-900 dark:text-white">Harmony Bookshelf Speaker</span>
              </div>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">$215.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomFeaturedSection; 