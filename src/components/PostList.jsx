// src/components/PostList.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PostList({ posts }) {
  // --- 1. 分页配置 ---
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // 每页显示几篇？你可以自己改，比如 6, 8, 10

  // --- 2. 计算当前要显示的数据 ---
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // currentPosts 就是当前页面要渲染的那几篇文章
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 计算总页数
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // --- 3. 翻页函数 ---
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 翻页后自动回到顶部，提升体验
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 当文章列表总数发生变化时（比如搜索过滤），重置回第一页 (预留逻辑)
  useEffect(() => {
    setCurrentPage(1);
  }, [posts.length]);

  return (
    <div className="content-container">
      <h1
        style={{
          marginBottom: '40px',
          borderBottom: '2px solid #f5f5f5',
          paddingBottom: '20px',
          fontSize: '24px',
        }}
      >
        All Posts
      </h1>

      {/* 渲染文章列表 (只渲染当前页的 currentPosts) */}
      <ul style={{ listStyle: 'none', padding: 0, minHeight: '400px' }}>
        {currentPosts.map((post) => (
          <li key={post.id} style={{ marginBottom: '40px' }}>
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '8px',
                }}
              >
                <h2 style={{ fontSize: '22px', margin: 0, color: '#111', fontWeight: 600 }}>
                  {post.title}
                </h2>
                <span style={{ color: '#999', fontSize: '14px', fontFamily: 'monospace' }}>
                  {post.date}
                </span>
              </div>

              <p style={{ color: '#666', fontSize: '15px', margin: '0 0 10px 0', lineHeight: 1.6 }}>
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* --- 4. 分页控制器 --- */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* 上一页按钮 */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn nav-btn"
          >
            &lt; Prev
          </button>

          {/* 数字按钮循环 */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 下一页按钮 */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn nav-btn"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
