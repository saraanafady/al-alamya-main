import './BlogSection.css';

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
  <section className="blog-section">
    <h2>Latest News & Blog</h2>
    <div className="blog-grid">
      {blogs.map((blog, idx) => (
        <div className="blog-card" key={idx}>
          <img src={blog.img} alt={blog.title} />
          <div className="blog-info">
            <span className="blog-date">{blog.date}</span>
            <h4>{blog.title}</h4>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BlogSection; 