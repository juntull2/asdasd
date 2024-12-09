// 이벤트 배너 Swiper 초기화
document.addEventListener('DOMContentLoaded', function() {
    const eventSwiper = new Swiper('.eventSwiper', {
        effect: 'fade',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}); 