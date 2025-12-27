// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home'; // 新增
import PostList from './components/PostList'; // 复用
import PostDetail from './components/PostDetail';
import Projects from './components/Projects'; // 新增
import fm from 'front-matter';
import { FaGithub } from 'react-icons/fa'; // 导航栏的小 GitHub 图标
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const modules = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });

    const loadPosts = async () => {
      const postsArray = [];
      for (const path in modules) {
        const content = await modules[path]();
        const parsed = fm(content);
        const fileName = path.split('/').pop().replace('.md', '');

        // --- 核心修改区 ---
        // 1. 处理日期：将 ISO 时间 (2025-01-03T...) 格式化得好看一点
        const dateObj = new Date(parsed.attributes.date);
        const dateStr = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        postsArray.push({
          id: fileName,
          title: parsed.attributes.title,
          // 如果 frontmatter 里没有 date，就用当前时间兜底
          date: parsed.attributes.date ? dateStr : 'Unknown Date',
          // 保留原始日期对象用于排序 (因为 dateStr 变成了字符串，不好排序)
          rawDate: dateObj,
          content: parsed.body,
          // 2. 读取 tags，如果没有就给个空数组
          tags: parsed.attributes.tags || [],
          // 3. 读取 description，如果没有就截取正文前100字
          description:
            parsed.attributes.description ||
            parsed.body.substring(0, 100).replace(/[#*`]/g, '') + '...',
        });
      }

      // 使用 rawDate 进行精确排序
      postsArray.sort((a, b) => b.rawDate - a.rawDate);
      setPosts(postsArray);
    };
    loadPosts();
  }, []);

  return (
    <div className="app-wrapper">
      {/* --- 顶部导航栏 --- */}
      <header className="site-header">
        {/* 左上角小 Logo */}
        <Link to="/" className="branding-small">
          <img src="/logo.png" alt="logo" />
          <span>Merthon</span>
        </Link>

        {/* 右上角导航链接 */}
        <nav className="site-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/posts" className={location.pathname === '/posts' ? 'active' : ''}>
            Posts
          </Link>
          <Link to="/projects">Projects</Link>
          <span className="nav-separator">|</span>
          <a href="https://github.com/Merthon" target="_blank" rel="noreferrer" className="nav-icon">
            <FaGithub />
          </a>
        </nav>
      </header>

      <main>
        <Routes>
          {/* 首页：传所有文章进去，它自己会截取前5篇 */}
          <Route path="/" element={<Home posts={posts} />} />

          {/* 文章列表页：展示所有文章 */}
          <Route path="/posts" element={<PostList posts={posts} />} />

          {/* 项目页 */}
          <Route path="/projects" element={<Projects />} />

          {/* 详情页 */}
          <Route path="/post/:id" element={<PostDetail posts={posts} />} />
        </Routes>
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} Merthon · Made with ❤️ using React
      </footer>
    </div>
  );
}

export default App;
