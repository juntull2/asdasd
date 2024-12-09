// 더미 이벤트 데이터
const events = [
    {
        id: 1,
        title: '신년맞이 토이 페스티벌',
        description: '2024년 새해를 맞아 다양한 인형과 장난감을 특별한 가격으로 만나보세요!',
        image: '../images/events/main-event.jpg',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'ongoing',
        featured: true,
        products: [
            {
                id: 1,
                name: '핑크 테디베어 인형',
                price: 25000,
                discountPrice: 20000,
                image: '../images/product1.jpg'
            },
            // 더 많은 상품...
        ],
        detailImages: [
            '../images/events/event1-detail1.jpg',
            '../images/events/event1-detail2.jpg'
        ]
    },
    {
        id: 2,
        title: '발렌타인데이 특별전',
        description: '사랑하는 사람에게 특별한 선물을 준비해보세요.',
        image: '../images/events/event2.jpg',
        startDate: '2024-02-01',
        endDate: '2024-02-14',
        status: 'ongoing',
        featured: false
    },
    // 더 많은 이벤트...
];

// 이벤트 탭 처리
document.querySelectorAll('.event-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // 활성 탭 변경
        document.querySelector('.event-tab.active').classList.remove('active');
        tab.classList.add('active');

        // 선택된 상태의 이벤트 표시
        const status = tab.dataset.status;
        displayEvents(status);
    });
});

// 이벤트 표시 함수
function displayEvents(status) {
    const eventGrid = document.querySelector('.event-grid');
    const filteredEvents = events.filter(event => event.status === status && !event.featured);
    
    eventGrid.innerHTML = '';

    filteredEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <div class="event-item-image">
                <img src="${event.image}" alt="${event.title}">
                <div class="event-period">${formatDate(event.startDate)} ~ ${formatDate(event.endDate)}</div>
            </div>
            <div class="event-item-info">
                <h3>${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <button class="view-details" data-event-id="${event.id}">자세히 보기</button>
            </div>
        `;
        eventGrid.appendChild(eventElement);
    });

    // 이벤트 상세 보기 버튼 이벤트 추가
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const eventId = parseInt(e.target.dataset.eventId);
            showEventDetails(eventId);
        });
    });
}

// 날짜 포맷 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 이벤트 상세 정보 표시
function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    const modal = document.querySelector('.event-modal');
    const modalContent = modal.querySelector('.event-details');

    modalContent.innerHTML = `
        <h2>${event.title}</h2>
        <p class="event-period">${formatDate(event.startDate)} ~ ${formatDate(event.endDate)}</p>
        ${event.detailImages ? event.detailImages.map(img => `
            <img src="${img}" alt="이벤트 상세 이미지">
        `).join('') : ''}
        <p class="event-description">${event.description}</p>
    `;

    // 이벤트 상품이 있는 경우 표시
    if (event.products && event.products.length > 0) {
        const productGrid = modal.querySelector('.product-grid');
        productGrid.innerHTML = event.products.map(product => `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p class="original-price">${product.price.toLocaleString()}원</p>
                <p class="discount-price">${product.discountPrice.toLocaleString()}원</p>
            </div>
        `).join('');
    }

    modal.style.display = 'flex';
}

// 모달 닫기
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('.event-modal').style.display = 'none';
});

// 모달 외부 클릭 시 닫기
document.querySelector('.event-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('event-modal')) {
        e.target.style.display = 'none';
    }
});

// 페이지네이션 처리
document.querySelectorAll('.page-numbers button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.page-numbers button.active').classList.remove('active');
        button.classList.add('active');
        // 실제로는 여기서 해당 페이지의 이벤트를 로드
    });
});

// 초기 이벤트 표시
displayEvents('ongoing');
