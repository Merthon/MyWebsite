// src/components/PostDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { useMemo } from 'react'; // 1. 改用 useMemo，删掉 useEffect 和 useState
import Slugger from 'github-slugger';

function PostDetail({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === id);

  // 2. 使用 useMemo 计算派生状态
  // 意思就是：只有当 post 发生变化时，才重新运行这段计算代码
  const headings = useMemo(() => {
    if (!post || !post.content) return [];

    const slugger = new Slugger(); // 初始化生成器
    const lines = post.content.split('\n');

    return lines
      .filter((line) => line.match(/^#{1,3}\s/))
      .map((line) => {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s+/, '').trim();

        // 使用 slugger 生成 ID，这能保证和 rehype-slug 插件生成的 ID 一模一样
        const id = slugger.slug(text);

        return { text, level, id };
      });
  }, [post]);

  if (!post) {
    return (
      <div className="layout-container" style={{ textAlign: 'center', padding: '40px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="layout-container">
      {/* --- 左侧：文章内容 --- */}
      <article className="post-content">
        <button onClick={() => navigate(-1)} className="btn-clean" style={{ marginBottom: '20px' }}>
          ← Back
        </button>

        <h1 className="detail-title">{post.title}</h1>

        <div className="post-meta" style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <span style={{ fontFamily: 'monospace' }}>{post.date}</span>
          {post.tags?.map((tag) => (
            <span key={tag} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>

        <hr style={{ border: '0', borderBottom: '1px solid #f0f0f0', margin: '30px 0' }} />

        <div className="markdown-body">
          {/* rehypeSlug 会自动给 h1, h2 等标签加上 id，方便右侧目录跳转 */}
          <Markdown rehypePlugins={[rehypeHighlight, rehypeSlug]}>{post.content}</Markdown>
        </div>
      </article>

      {/* --- 右侧：悬浮目录 --- */}
      {/* 只有当存在目录时才显示这一栏 */}
      {headings.length > 0 && (
        <aside className="toc-sidebar">
          <div className="toc-sticky-box">
            <h3 className="toc-title">TABLE OF CONTENTS</h3>
            <ul className="toc-list">
              {headings.map((heading, index) => (
                <li key={index} className={`toc-item level-${heading.level}`}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(heading.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

export default PostDetail;
