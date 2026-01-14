// js/pages/map-huanglong.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("🐲 瑝珑地图页面加载...");

    // 1. 获取元素 (使用 hl- 前缀)
    const track = document.querySelector('.hl-carousel-track');
    const cards = document.querySelectorAll('.hl-card-item');
    const dynamicBg = document.getElementById('hl-dynamic-bg');
    const prevBtn = document.getElementById('hlPrevBtn');
    const nextBtn = document.getElementById('hlNextBtn');
    
    const titleEl = document.getElementById('hl-title');
    const pinyinEl = document.getElementById('hl-pinyin');
    const descEl = document.getElementById('hl-desc');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const GAP = 30; // 对应 CSS gap

    // 2. 更新逻辑
    function updateCarousel() {
    // 1. 获取当前卡片的宽度 (假设所有卡片宽度一致，取第一张即可)
    // 如果没有卡片，直接返回防止报错
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth; 
    
    // 2. 新的居中公式
    // 公式含义：-(半个卡片宽) - (当前索引 * (卡片宽 + 间隙))
    // 负号是因为我们要把轨道往左拉
    const moveDistance = - (cardWidth / 2) - (currentIndex * (cardWidth + GAP));

    // 3. 应用位移
    track.style.transform = `translateX(${moveDistance}px)`;

    // 4. 更新激活状态 (保持不变)
    cards.forEach((card, index) => {
        if (index === currentIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    if (cards[currentIndex]) {
            // 1. 尝试找到卡片里的 img
            const imgObj = cards[currentIndex].querySelector('img');
            
            // 2. 如果找到了图片和背景层，就进行替换
            if (imgObj && dynamicBg) {
                dynamicBg.style.backgroundImage = `url('${imgObj.src}')`;
            }
        }

    // 5. 更新文字 (保持不变)
    updateText(currentIndex);
}

    function updateText(index) {
        const data = cards[index].dataset;
        if (titleEl.innerText === data.title) return;

        // 简单的淡出淡入
        [titleEl, pinyinEl, descEl].forEach(el => el.style.opacity = '0');
        
        setTimeout(() => {
            titleEl.innerText = data.title;
            pinyinEl.innerText = data.pinyin;
            descEl.innerText = data.desc;
            
            [titleEl, pinyinEl, descEl].forEach(el => el.style.opacity = '1');
        }, 300);
    }

    // 3. 事件绑定
    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
        updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // 4. 初始化
    window.addEventListener('resize', updateCarousel);
    window.addEventListener('load', updateCarousel); // 图片加载后再次计算
    updateCarousel();
});