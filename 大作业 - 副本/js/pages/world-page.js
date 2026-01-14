// js/pages/world-page.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 世界观页面逻辑启动...");

    // --- 1. 获取核心元素 ---
    const track = document.querySelector('.wd-carousel-track');
    const cards = document.querySelectorAll('.wd-card-item');
    const dynamicBg = document.getElementById('wd-dynamic-bg');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 文字元素
    const titleEl = document.getElementById('world-title');
    const pinyinEl = document.getElementById('world-pinyin');
    const descEl = document.getElementById('world-desc');

    // --- 2. 安全检查 (调试用) ---
    console.log("=== 元素检查 ===");
    console.log("轨道 (track):", track);
    console.log("卡片数量 (cards):", cards.length);
    console.log("上一个按钮 (prevBtn):", prevBtn);
    console.log("下一个按钮 (nextBtn):", nextBtn);

    if (!track || cards.length === 0) {
        console.error("❌ 严重错误：找不到轮播轨道或卡片，脚本停止执行。");
        return;
    }

    // --- 3. 变量初始化 ---
    let currentIndex = 0;
    const GAP = 40; // 必须与 CSS .wd-carousel-track { gap: 40px } 保持一致

    /**
     * 核心函数：计算并移动轮播图
     */
    function updateCarousel() {
        const viewport = document.querySelector('.wd-carousel-viewport');
        if (!viewport) return;

        const viewportWidth = viewport.offsetWidth;
        
        // --- 关键修复：宽度的兜底计算 ---
        // 尝试获取第一张卡片的真实宽度
        let cardWidth = cards[0].offsetWidth;

        // 如果图片未加载，offsetWidth 可能是 0。
        // 这时我们手动计算：假设 CSS 设定的宽度是 60vw (即屏幕宽度的 60%)
        if (cardWidth === 0) {
            console.warn("⚠️ 图片未加载，使用备用宽度计算");
            cardWidth = window.innerWidth * 0.6; 
        }

        console.log(`📏 计算数据 -> 视口宽: ${viewportWidth}, 卡片宽: ${cardWidth}, 当前索引: ${currentIndex}`);

        // 居中公式：(视口一半 - 卡片一半) - (索引 * (卡片宽 + 间距))
        const centerOffset = (viewportWidth - cardWidth) / 2;
        const moveDistance = centerOffset - (currentIndex * (cardWidth + GAP));

        // 应用位移
        track.style.transform = `translateX(${moveDistance}px)`;

        // 切换 Active 样式
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        if (cards[currentIndex]) {
            // 1. 找到当前卡片里的 img 标签
            const imgObj = cards[currentIndex].querySelector('img');
            if (imgObj && dynamicBg) {
                const imgSrc = imgObj.src;
                // 2. 设置给大背景
                dynamicBg.style.backgroundImage = `url('${imgSrc}')`;
            }
        }


        // 同步文字信息
        updateTextInfo(currentIndex);
    }

    /**
     * 文字更新逻辑
     */
    function updateTextInfo(index) {
        if (!cards[index]) return;
        const data = cards[index].dataset;

        // 简单的防抖动判断：如果已经显示的是这个标题，就不刷新动画了
        if (titleEl && titleEl.innerText === data.title) return;

        // 1. 淡出
        [titleEl, pinyinEl, descEl].forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
            }
        });

        // 2. 替换并淡入
        setTimeout(() => {
            if (titleEl) titleEl.innerText = data.title || "未知区域";
            if (pinyinEl) pinyinEl.innerText = data.pinyin || "";
            if (descEl) descEl.innerText = data.desc || "暂无介绍";

            [titleEl, pinyinEl, descEl].forEach(el => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }, 300);
    }

    // --- 4. 事件绑定 ---

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log("⬅️ 点击上一张");
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cards.length - 1; // 循环到最后
            }
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log("➡️ 点击下一张");
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // 循环到第一张
            }
            updateCarousel();
        });
    }

    // 点击卡片直接切换
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // 如果点的是按钮，不切换，让它跳转
            if (e.target.classList.contains('wd-explore-btn')) return;
            
            console.log(`👆 点击了第 ${index} 张卡片`);
            if (currentIndex !== index) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // --- 5. 初始化执行 ---
    
    // 立即执行一次
    updateCarousel();

    // 窗口大小改变时重新计算
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // 关键：等待所有图片加载完毕后，再次强制计算一次！
    // 解决 offsetWidth 为 0 的问题
    window.addEventListener('load', () => {
        console.log("✅ 所有资源加载完毕，强制校准布局");
        updateCarousel();
    });
});