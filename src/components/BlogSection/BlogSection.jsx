const blogs = [
  {
    img: 'https://dummyimage.com/120x80/eee/333&text=Blog+1',
    date: '2024-06-01',
    title: 'How to Choose the Right Headphones for Your Needs: A Comprehensive Guide',
  },
  {
    img: 'https://dummyimage.com/120x80/ddd/333&text=Blog+2',
    date: '2024-05-28',
    title: 'Revolutionary Tech: The Rise of Smart Devices in 2024',
  },
  {
    img: 'https://dummyimage.com/120x80/ccc/333&text=Blog+3',
    date: '2024-05-20',
    title: 'How to Choose the Right Laptop for Your Needs',
  },
];

const BlogSection = () => (
  <section className="my-8 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Latest News & Blog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-start gap-4 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <img 
              src={blog.img} 
              alt={blog.title} 
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-2 block">
                {blog.date}
              </span>
              <h4 className="text-base font-medium text-slate-900 dark:text-white leading-relaxed line-clamp-3">
                {blog.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection; 