function Header() {
  return (
    <header style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
      <h1>我的 React 个人博客</h1>
      <nav>
        <a href="#" style={{ margin: '0 10px' }}>
          首页
        </a>
        <a href="#" style={{ margin: '0 10px' }}>
          关于我
        </a>
      </nav>
    </header>
  );
}

// 导出 Header 组件
export default Header;
