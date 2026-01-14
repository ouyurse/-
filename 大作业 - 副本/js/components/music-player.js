document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 音乐库配置 (在这里配置你的卡片名称对应的音乐文件) ---
    // key: 必须与 HTML 中卡片的 data-title, data-code 或 alt 内容一致
    // file: 音乐文件名 (放在 music/ 目录下)
    const musicMap = {
        // --- 瑝珑页 (Map Huanglong) ---
        "今州城": "Lifted Clouds of Eons_L.ogg",
        "乘霄山": "往岁乘霄 (伴奏)_L.ogg",
        "云凌谷": "月华如愿_L.ogg",

        // --- 黑海岸页 (Map Blackshores) ---
        "黑海岸群岛": "De Caelo_L.ogg",
        "泰缇斯之底": "Astrum Unicum_L.ogg", 
        "时隙废都":"不散的夏之灯 (Instrumental)_L.ogg",

        // --- 黎那汐塔 (Map Rinascita) ---
        "拉古那": "待梦醒启程_L.ogg",
        "阿维纽林神学院": "悠忽舞于梦中_L.ogg", 
        "巡游天国":"愿戴荣光坠入天渊_L.ogg",


        // --- 拉海洛页 (Map Lahai) ---
        "LH-01": "此刻寻光星间 (Instrumental)_L.ogg",
        "LH-02": "未竟之旅 (Instrumental)_L.ogg",
        "LH-03": "远航星_L.ogg",

        // --- 默认兜底 (如果找不到对应卡片音乐，回退到页面默认) ---
        "DEFAULT_HUANGLONG": "Lifted Clouds of Eons_L.ogg",
        "DEFAULT_BLACKSHORES": "Astrum Unicum_L.ogg",
        "DEFAULT_RINASCITA": "悠忽舞于梦中_L.ogg",
        "DEFAULT_LAHAIROI": "此刻寻光星间 (Instrumental)_L.ogg",
        "DEFAULT_GLOBAL": "Waking of a World.ogg"
    };

    // --- 2. 页面识别与初始化 ---
    const path = window.location.pathname;
    let pageDefaultMusic = 'DEFAULT_GLOBAL';
    let cardSelector = '';

    // 根据页面类型设定“卡片选择器”
    if (path.includes('huanglong')) {
        pageDefaultMusic = 'DEFAULT_HUANGLONG';
        cardSelector = '.hl-card-item'; // 瑝珑卡片类名
    } else if (path.includes('blackshores')) {
        pageDefaultMusic = 'DEFAULT_BLACKSHORES';
        cardSelector = '.bs-card';      // 黑海岸卡片类名
    } else if (path.includes('lahai')) {
        pageDefaultMusic = 'DEFAULT_GLOBAL'; // 假设拉海洛用通用
        cardSelector = '.lh-poster';    // 拉海洛卡片类名
    }else if (path.includes('rinascita')) {
        pageDefaultMusic = 'DEFAULT_GLOBAL'; // 假设拉海洛用通用
        cardSelector = '.rn-frame';    // 拉海洛卡片类名
    }

    // --- 3. 插入播放器 HTML ---
    // 初始音乐先设为空，等待检测
    const playerHTML = `
        <div class="music-widget" id="musicWidget">
            <audio id="bgmAudio" loop preload="auto"></audio>
            
            <div class="music-disc" id="musicDisc"></div>
            
            <div class="music-info">
                <span class="music-title" id="displayTitle">Connecting...</span>
                <span class="music-status" id="musicStatus">READY</span>
            </div>

            <div class="music-controls">
                <button class="control-btn" id="playPauseBtn">
                    <svg id="iconPlay" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <svg id="iconPause" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                </button>
                <button class="control-btn" id="minimizeBtn">
                   <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);

    // --- 4. 获取元素 ---
    const audio = document.getElementById('bgmAudio');
    const displayTitle = document.getElementById('displayTitle');
    const statusText = document.getElementById('musicStatus');
    const disc = document.getElementById('musicDisc');
    const playBtn = document.getElementById('playPauseBtn');
    const iconPlay = document.getElementById('iconPlay');
    const iconPause = document.getElementById('iconPause');
    const widget = document.getElementById('musicWidget');

    let currentFile = '';
    let isPlaying = false;
    let debounceTimer = null; // 防抖定时器

    // --- 5. 核心功能：切换音轨 ---
    function switchTrack(key, titleDisplay) {
        // 1. 查找文件名
        let fileName = musicMap[key];
        
        // 如果找不到特定卡片的音乐，使用页面默认
        if (!fileName) {
            fileName = musicMap[pageDefaultMusic];
            // 如果页面默认也没配，用全局默认
            if(!fileName) fileName = musicMap["DEFAULT_GLOBAL"];
        }

        // 2. 如果文件没变，就不打断播放
        if (currentFile === fileName) return;

        console.log(`[MusicPlayer] Switching to: ${fileName} (Key: ${key})`);
        currentFile = fileName;

        // 3. 切换逻辑 (淡出 -> 换源 -> 淡入)
        const newSrc = `../music/${fileName}`;
        
        // 简单的软切换
        const wasPlaying = !audio.paused;
        
        audio.src = newSrc;
        displayTitle.innerText = titleDisplay || "Unknown Signal";
        
        // 只有当之前是播放状态，或者这是第一次加载时，才自动尝试播放
        if (wasPlaying || isPlaying) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(e => {
                console.warn("Autoplay blocked:", e);
                updateUIState(false);
            });
        }
    }

    // --- 6. 核心功能：检测 Active 卡片 ---
    function checkActiveCard() {
        if (!cardSelector) return;

        const cards = document.querySelectorAll(cardSelector);
        let activeCard = null;

        // 找到有 active 类的卡片
        cards.forEach(card => {
            if (card.classList.contains('active')) {
                activeCard = card;
            }
        });

        // 如果没有 active 类 (可能刚加载)，默认取第一个
        if (!activeCard && cards.length > 0) {
            activeCard = cards[0];
        }

        if (activeCard) {
            // 优先读取顺序：data-code -> data-title -> img alt -> 默认
            const key = activeCard.dataset.code || 
                        activeCard.dataset.title || 
                        activeCard.dataset.en ||
                        activeCard.querySelector('img')?.alt || 
                        'DEFAULT';
            
            // 标题显示逻辑
            const display = activeCard.dataset.title || activeCard.querySelector('h3')?.innerText || key;

            // 防抖：延迟 500ms 切换，防止快速轮播时声音鬼畜
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                switchTrack(key, display);
            }, 500);
        }
    }

    // --- 7. 监听器：MutationObserver 监听 DOM 变化 ---
    // 这是无需修改轮播代码就能监听 active 变化的关键
    if (cardSelector) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 如果是 class 属性变化，并且包含 active 相关的变动
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    checkActiveCard();
                }
            });
        });

        // 监听整个文档或者是特定的父容器会更好，这里简单起见监听 body 里的特定元素变化
        // 为了性能，我们最好找到轮播的父容器。但为了通用性，我们直接监听所有卡片元素
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            observer.observe(card, { attributes: true });
        });
        
        // 初始运行一次
        checkActiveCard();
    } else {
        // 如果不是卡片页，直接播默认
        switchTrack(pageDefaultMusic, "Wuthering Waves");
    }

    // --- 8. UI 控制逻辑 (播放/暂停/收起) ---
    function updateUIState(playing) {
        isPlaying = playing;
        if (playing) {
            statusText.innerText = 'PLAYING';
            statusText.style.opacity = '1';
            disc.classList.add('playing');
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            statusText.innerText = 'PAUSED';
            statusText.style.opacity = '0.5';
            disc.classList.remove('playing');
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    }

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play().then(() => updateUIState(true));
        } else {
            audio.pause();
            updateUIState(false);
        }
    });

    document.getElementById('minimizeBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        widget.classList.add('minimized');
    });

    disc.addEventListener('click', () => {
        if (widget.classList.contains('minimized')) {
            widget.classList.remove('minimized');
        } else {
            playBtn.click(); // 代理点击播放键
        }
    });
});