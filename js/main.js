/**
 * 摄影师个人网站 - JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGalleryFilter();
    initLightbox();
    initStatsCounter();
    initTestimonialSlider();
    initContactForm();
    initScrollReveal();
    initSmoothScroll();
});

/* ========================================
   导航栏
   ======================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时导航栏样式变化
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);
    }, { passive: true });

    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 点击链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   作品集筛选
   ======================================== */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新过滤按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // 筛选作品
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // 添加淡入动画
                    item.style.animation = 'none';
                    item.offsetHeight; // 触发回流
                    item.style.animation = '';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/* ========================================
   图片灯箱
   ======================================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-item-overlay h3');

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption.textContent;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ========================================
   数字动画
   ======================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateNumbers() {
        if (counted) return;

        const statsSection = document.querySelector('.stats-section');
        const rect = statsSection.getBoundingClientRect();

        if (rect.top < window.innerHeight - 100) {
            counted = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 动画持续2秒
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // easeOutExpo 缓动
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                    const current = Math.round(eased * target);
                    stat.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateNumbers, { passive: true });
    // 初始检查
    animateNumbers();
}

/* ========================================
   客户评价轮播
   ======================================== */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let interval;

    function showSlide(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // 点击切换
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetInterval();
        });
    });

    // 自动轮播
    function startInterval() {
        interval = setInterval(() => {
            const next = (currentIndex + 1) % cards.length;
            showSlide(next);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }

    startInterval();

    // 触摸滑动
    const slider = document.querySelector('.testimonials-slider');
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // 左滑 - 下一个
                const next = (currentIndex + 1) % cards.length;
                showSlide(next);
            } else {
                // 右滑 - 上一个
                const prev = (currentIndex - 1 + cards.length) % cards.length;
                showSlide(prev);
            }
            resetInterval();
        }
    });
}

/* ========================================
   联系表单
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // 设置提交状态
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        // 模拟发送（实际项目中替换为真实API请求）
        setTimeout(() => {
            // 显示成功提示
            showToast('消息已发送成功！我会尽快与您联系。', 'success');

            // 重置表单
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // 表单输入动画
    const formInputs = form.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

/* ========================================
   Toast 提示
   ======================================== */
function showToast(message, type = 'success') {
    // 移除已有的 toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // 触发动画
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 3秒后移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ========================================
   滚动显示动画
   ======================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.service-card, .about-image, .about-content, .gallery-item, .contact-form-wrapper'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    revealElements.forEach(el => observer.observe(el));
}

/* ========================================
   平滑滚动
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}
