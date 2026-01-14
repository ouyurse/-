// js/pages/map-blackshores.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取元素
    const track = document.querySelector('.bs-carousel-track');
    const cards = document.querySelectorAll('.bs-card');
    const dynamicBg = document.getElementById('bs-dynamic-bg');
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 文字元素
    const titleEl = document.getElementById('area-title');
    const enEl = document.getElementById('area-en');
    const descEl = document.getElementById('area-desc');

    let currentIndex = 0;
    const GAP = 60; // ⚠️ 必须与 CSS 中的 gap: 60px 保持一致

    // 2. 初始化背景 (默认显示第一张图)
    if (cards.length > 0) {
        const firstImg = cards[0].querySelector('img');
        if (firstImg && dynamicBg) {
            dynamicBg.style.backgroundImage = `url('${firstImg.src}')`;
        }
    }

    // 3. 核心函数：更新轮播位置 & 内容
    function updateCarousel() {
        if (cards.length === 0) return;

        // --- A. 位置计算 (完美居中公式) ---
        // 逻辑：轨道起点在中心(50%) -> 减去半个卡片宽 -> 减去 (当前索引 * (卡片宽+间隙))
        const cardWidth = cards[0].offsetWidth;
        const moveDistance = - (cardWidth / 2) - (currentIndex * (cardWidth + GAP));
        
        track.style.transform = `translateX(${moveDistance}px)`;

        // --- B. 激活状态与背景同步 ---
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
                
                // 切换大背景
                const img = card.querySelector('img');
                if (img && dynamicBg) {
                    dynamicBg.style.backgroundImage = `url('${img.src}')`;
                }
            } else {
                card.classList.remove('active');
            }
        });

        // --- C. 文字信息更新 (带简单动画) ---
        const data = cards[currentIndex].dataset;
        
        // 1. 先隐身
        [titleEl, enEl, descEl].forEach(el => el.style.opacity = '0');

        // 2. 改字并淡入
        setTimeout(() => {
            if(data.title) titleEl.innerText = data.title;
            if(data.en) enEl.innerText = data.en;
            if(data.desc) descEl.innerText = data.desc;

            [titleEl, enEl, descEl].forEach(el => el.style.opacity = '1');
        }, 300);
    }

    // 4. 事件监听
    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // 循环回第一张
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1; // 循环回最后一张
        }
        updateCarousel();
    });

    // 点击卡片也可切换
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // 5. 窗口大小改变时重新计算 (保证始终居中)
    window.addEventListener('resize', updateCarousel);

    // 启动！
    updateCarousel();
});