---
date: 2025-08-25T13:40:07+08:00
description: ""
image: ""
showTableOfContents: true
tags: ["服务器","Nginx"]
title: "Nginx使用及注意事项"
type: "post"
---
Nginx是一款高性能的 Web 服务器和反向代理服务器，常用于静态资源服务、负载均衡、反向代理、HTTPS 部署等场景。相比 Apache，Nginx 更轻量、更高效，并且在大规模并发场景下表现优秀。
## 一、Nginx 的常见使用场景

### 1. 静态资源服务器
将 HTML、CSS、JS、图片等静态文件直接交给 Nginx 处理，效率极高。  
```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/html;
    index index.html index.htm;
}
```
### 2. 反向代理
通过 Nginx 将请求转发给后端应用（如 Python Flask、Node.js、Java 服务）。
```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
### 3. 负载均衡
多个后端实例时，可以利用 Nginx 实现轮询或加权分配。
```nginx
upstream backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081 weight=2;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```
### 4. HTTPS 支持
结合 **Let's Encrypt** 或商业 SSL 证书，配置 HTTPS 访问。
```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/nginx/ssl/example.crt;
    ssl_certificate_key /etc/nginx/ssl/example.key;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```
## 二、Nginx 配置文件结构

Nginx 配置文件一般位于 `/etc/nginx/nginx.conf`，主要包含以下几个部分：
1. **全局块**（用户、进程数、日志等）
2. **events 块**（处理连接的并发数等参数）
3. **http 块**（代理、缓存、gzip、server 配置等）
4. **server 块**（虚拟主机配置，如域名、端口）
5. **location 块**（请求路径的匹配规则）
## 三、Nginx 使用中的注意事项
### 1. 配置管理
```bash
# 检查配置语法
nginx -t

# 平滑重载配置
systemctl reload nginx
```
每次修改配置后都要执行 `nginx -t`，避免因语法错误导致服务崩溃。
### 2. 日志管理
- **access.log**：记录请求、状态码、IP。
- **error.log**：记录错误信息。
💡 日志可能会无限增长，应配合 **logrotate** 或定期清理。
### 3. 性能优化
- 根据 CPU 核心数自动分配进程：`worker_processes auto;`
- 设置单进程最大并发连接数：`worker_connections 10240;`
- 开启 **Gzip 压缩**：
   `gzip on; gzip_types text/plain text/css application/json application/javascript;`
### 4. 安全性
- 隐藏 Nginx 版本号：`server_tokens off;`
- 配置防盗链、防刷接口。
- 使用 **HTTPS + HSTS**，提高安全性。
### 5. 常见问题排查
- **80/443 端口被占用** → 检查是否有其他服务（如 Apache）。
- **502 Bad Gateway** → 后端服务未启动或代理配置错误。
- **缓存问题** → 通过 `add_header Cache-Control` 控制缓存策略。
## 四、总结
Nginx 是一款高性能的 Web 服务工具，配置灵活、功能强大。在实际使用中，我们需要注意：
- 配置文件结构清晰，善用 `server` 和 `location`。
- 日志需要定期维护，避免磁盘爆满。
- 性能优化和安全配置不可忽视。
- 修改配置后务必测试并平滑重启。