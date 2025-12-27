import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';
import Typewriter from './Typewriter';

function Home({ posts }) {
  const recentPosts = posts.slice(0, 5);

  return (
    // 使用 content-container 限制内容宽度，保证阅读体验
    <div className="content-container">
      <section className="hero-section">
        <img
          src="/public/mer.jpg"
          alt="Avatar"
          className="hero-avatar"
        />
        <h1 className="hero-name">Merthon</h1>

        {/* 2. 替换原来的 <p> 标签 */}
        <p className="hero-bio" style={{ minHeight: '28px' }}>
          {/* minHeight 是为了防止字还没打出来时，下面内容跳动 */}
          <Typewriter
            text="Exploring the world of coding, sharing tech and creativity.❤️"
            speed={80}
          />
        </p>

        <div className="hero-socials">
          <a href="https://github.com/Merthon">
            <FaGithub />
          </a>
          <a href="https://instagram.com/leomerthon">
            <FaInstagram />
          </a>
          <a href="mailto:imchenxing42@gmail.com">
            <FaEnvelope />
          </a>
        </div>
      </section>
      <section className="recent-posts-section">
        <h2 className="section-title">Recent Posts</h2>
        <ul className="recent-list">
          {recentPosts.map((post) => (
            <li key={post.id} className="recent-item">
              <Link to={`/post/${post.id}`} className="recent-link">
                <span className="recent-title">{post.title}</span>
                <span className="recent-date">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
