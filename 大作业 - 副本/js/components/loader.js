const startTime = Date.now();
const minLoadingTime = 2000; 

function hideLoader() {
    const loader = document.getElementById('loader-wrapper');
    if (!loader) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    setTimeout(() => {
        // 添加类名触发过渡动画
        loader.classList.add('loader-hidden');
        
        // 强制隐藏保险，防止 transitionend 事件未触发
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800); 

    }, remainingTime);
}

// 适配不同的页面加载状态
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
} else {
    hideLoader();
}

// 5秒强制退出机制，防止循环死锁
setTimeout(hideLoader, 5000);