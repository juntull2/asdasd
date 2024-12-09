// 더미 상품 데이터
const products = [
    {
        id: 1,
        name: '핑크 테디베어 인형',
        price: 25000,
        image: '../images/product1.jpg',
        category: 'doll',
        sales: 1234,
        rating: 4.9,
        reviews: 123,
        description: '부드러운 촉감의 귀여운 테디베어 인형입니다.'
    },
    {
        id: 2,
        name: '토끼 봉제인형',
        price: 18000,
        image: '../images/product2.jpg',
        category: 'doll',
        sales: 987,
        rating: 4.8,
        reviews: 89,
        description: '포근한 느낌의 토끼 인형입니다.'
    },
    // 더 많은 더미 데이터...
];

// 카테고리 탭 처리
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // 활성 탭 변경
        document.querySelector('.category-tab.active').classList.remove('active');
        tab.classList.add('active');

        // 선택된 카테고리의 상품 표시
        const category = tab.dataset.category;
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
        
        displayProducts(filteredProducts);
    });
});

// 상품 표시 함수
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'rank-item';
        productElement.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}">
                <div class="hover-info">
                    <button class="quick-view" data-product-id="${product.id}">Quick View</button>
                    <button class="add-to-cart" data-product-id="${product.id}">장바구니 담기</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString()}원</p>
                <div class="stats">
                    <span class="sales">월 ${product.sales}개 구매</span>
                    <span class="rating">⭐ ${product.rating} (${product.reviews})</span>
                </div>
            </div>
        `;
        productGrid.appendChild(productElement);
    });

    // Quick View 버튼 이벤트 추가
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            showQuickView(productId);
        });
    });

    // 장바구니 담기 버튼 이벤트 추가
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        });
    });
}

// Quick View 모달 표시
function showQuickView(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    const modal = document.querySelector('.quick-view-modal');
    const modalContent = modal.querySelector('.product-details');

    modalContent.innerHTML = `
        <div class="modal-product">
            <img src="${product.image}" alt="${product.name}">
            <div class="modal-product-info">
                <h2>${product.name}</h2>
                <p class="price">${product.price.toLocaleString()}원</p>
                <p class="description">${product.description}</p>
                <div class="stats">
                    <span class="sales">월 ${product.sales}개 구매</span>
                    <span class="rating">⭐ ${product.rating} (${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">장바구니 담기</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// 모달 닫기
document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('.quick-view-modal').style.display = 'none';
});

// 장바구니 담기 함수
function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    alert(`${product.name}이(가) 장바구니에 담겼습니다.`);
}

// 슬라이더 기능
let currentSlide = 0;
const slidesToShow = 4;

function updateSlider() {
    const slider = document.querySelector('.product-slider');
    const slideWidth = slider.offsetWidth / slidesToShow;
    slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

document.querySelector('.slider-prev').addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
});

document.querySelector('.slider-next').addEventListener('click', () => {
    const maxSlides = products.length - slidesToShow;
    if (currentSlide < maxSlides) {
        currentSlide++;
        updateSlider();
    }
});

// 초기 상품 표시
displayProducts(products);
