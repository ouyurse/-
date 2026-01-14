// js/components/navbar.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. 滚动监听逻辑 (你原有的代码)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. 新增：手机端菜单切换逻辑
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navMenu');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // 切换菜单的显示/隐藏
            navLinks.classList.toggle('active');
            
            // 可选：给按钮也加动画效果（比如变成X）
            menuToggle.classList.toggle('is-active');
        });
        
        // 点击链接后自动关闭菜单（优化体验）
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('is-active');
            });
        });
    }

    console.log("导航栏组件加载完毕");
});