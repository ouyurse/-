// js/pages/map-rinascita.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取元素
    const track = document.querySelector('.rn-gallery-track');
    const frames = document.querySelectorAll('.rn-frame');
    const bg = document.getElementById('rn-art-bg');
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const titleEl = document.getElementById('area-title');
    const descEl = document.getElementById('area-desc');

    let currentIndex = 0;
    const GAP = 80; // 与 CSS .rn-gallery-track 的 gap 一致

    // 初始化背景
    if (frames.length > 0) {
        updateBackground(frames[0]);
    }

    // 2. 核心：更新画廊位置
    function updateGallery() {
        if (frames.length === 0) return;

        // 计算居中位移
        const frameWidth = frames[0].offsetWidth;
        // 公式：- (卡片一半) - (前面的卡片总宽 + 间距)
        const moveDistance = - (frameWidth / 2) - (currentIndex * (frameWidth + GAP));
        
        track.style.transform = `translateX(${moveDistance}px)`;

        // 更新激活状态
        frames.forEach((frame, index) => {
            if (index === currentIndex) {
                frame.classList.add('active');
                updateBackground(frame);
            } else {
                frame.classList.remove('active');
            }
        });

        // 更新文字
        updateText(frames[currentIndex]);
    }

    // 辅助：背景平滑切换
    function updateBackground(frame) {
        const img = frame.querySelector('img');
        if (img && bg) {
            // 这里用一点小技巧防止背景闪烁
            bg.style.backgroundImage = `url('${img.src}')`;
        }
    }

    // 辅助：文字淡入淡出
    function updateText(frame) {
        const data = frame.dataset;
        
        // 先淡出
        titleEl.style.opacity = '0';
        descEl.style.opacity = '0';
        titleEl.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // 更新内容
            titleEl.innerText = data.title;
            descEl.innerText = data.desc;
            
            // 再淡入
            titleEl.style.opacity = '1';
            descEl.style.opacity = '1';
            titleEl.style.transform = 'translateY(0)';
            titleEl.style.transition = 'all 0.5s ease';
            descEl.style.transition = 'all 0.5s ease 0.1s'; // 稍微错开
        }, 300);
    }

    // 3. 按钮事件
    nextBtn.addEventListener('click', () => {
        if (currentIndex < frames.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateGallery();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = frames.length - 1;
        }
        updateGallery();
    });

    // 点击卡片直接跳转
    frames.forEach((frame, index) => {
        frame.addEventListener('click', () => {
            currentIndex = index;
            updateGallery();
        });
    });

    window.addEventListener('resize', updateGallery);
    
    // 启动
    setTimeout(updateGallery, 100); // 稍微延迟确保布局计算准确
});