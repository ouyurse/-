// js/pages/map-lahai.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 获取元素
    const track = document.querySelector('.lh-carousel-track');
    const cards = document.querySelectorAll('.lh-poster'); // 确认你的HTML里卡片类名是 .lh-poster
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 文字信息元素
    const codeEl = document.getElementById('info-code');
    const titleEl = document.getElementById('info-title');
    const descEl = document.getElementById('info-desc');

    let currentIndex = 0;
    const GAP = 50; 

    // 2. 核心函数
    function updateCarousel() {
        if (cards.length === 0) return;

        // 获取单张卡片宽度
        const cardWidth = cards[0].offsetWidth;
        
        // 逻辑：
        // 1. 起点在屏幕中心 (CSS left: 50%)
        // 2. 往左移半张卡片宽 -> 让第0张居中 (-cardWidth / 2)
        // 3. 往左移 (当前索引 * (卡片宽 + 间距)) -> 让第N张居中
        const moveDistance = - (cardWidth / 2) - (currentIndex * (cardWidth + GAP));
        
        // 应用位移
        track.style.transform = `translateX(${moveDistance}px)`;

        // --- 激活状态 ---
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // --- 更新底部终端文字 ---
        updateTerminal(cards[currentIndex]);
    }

    // 文字更新逻辑 (模拟打字机/信号传输效果)
    function updateTerminal(card) {
        if(!card) return;
        const data = card.dataset;
        const terminalBody = document.querySelector('.terminal-body'); // 如果你有这个容器类名
        
        // 简单的闪烁效果
        if(terminalBody) terminalBody.style.opacity = '0.2';
        
        setTimeout(() => {
            if(codeEl) codeEl.innerText = `> TARGET: ${data.code || 'UNKNOWN'}`;
            if(titleEl) titleEl.innerText = data.title || 'NO DATA';
            if(descEl) descEl.innerText = data.desc || 'System Error...';
            
            if(terminalBody) terminalBody.style.opacity = '1';
        }, 100);
    }

    // 3. 事件绑定
    nextBtn?.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // 循环
        }
        updateCarousel();
    });

    prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1; // 循环
        }
        updateCarousel();
    });

    // 点击卡片切换
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // 窗口大小改变时重新计算
    window.addEventListener('resize', updateCarousel);
    
    // 图片加载完成后强制刷新一次 (防止图片没加载完导致宽度计算错误)
    window.addEventListener('load', updateCarousel);

    // 启动
    updateCarousel();
});