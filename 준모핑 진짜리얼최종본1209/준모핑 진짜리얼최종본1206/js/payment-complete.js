document.addEventListener('DOMContentLoaded', function() {
    // URL에서 주문 정보 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const orderData = {
        orderNumber: urlParams.get('orderNumber') || '2024020100001',
        receiverName: urlParams.get('receiverName') || '홍길동',
        receiverPhone: urlParams.get('receiverPhone') || '010-1234-5678',
        deliveryAddress: urlParams.get('deliveryAddress') || '서울특별시 강남구 테헤란로 123 우리빌딩 4층',
        deliveryRequest: urlParams.get('deliveryRequest') || '부재시 경비실에 맡겨주세요'
    };

    // 주문 정보 표시
    document.getElementById('orderNumber').textContent = orderData.orderNumber;
    document.getElementById('receiverName').textContent = orderData.receiverName;
    document.getElementById('receiverPhone').textContent = orderData.receiverPhone;
    document.getElementById('deliveryAddress').textContent = orderData.deliveryAddress;
    document.getElementById('deliveryRequest').textContent = orderData.deliveryRequest;

    // 결제 완료 아이콘 애니메이션
    const completeIcon = document.querySelector('.complete-icon');
    if (completeIcon) {
        completeIcon.style.opacity = '0';
        completeIcon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            completeIcon.style.transition = 'all 0.5s ease-out';
            completeIcon.style.opacity = '1';
            completeIcon.style.transform = 'scale(1)';
        }, 100);
    }

    // 주문 상세보기 버튼 클릭 이벤트
    const orderDetailBtn = document.querySelector('.btn-order-detail');
    if (orderDetailBtn) {
        orderDetailBtn.addEventListener('click', function() {
            // 마이페이지의 주문 내역 탭으로 이동
            window.location.href = `mypage.html?tab=orders&orderNumber=${orderData.orderNumber}`;
        });
    }

    // 쇼핑 계속하기 버튼 클릭 이벤트
    const continueShoppingBtn = document.querySelector('.btn-continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // 결제 방법이 무통장입금일 경우 팝업 표시
    window.onload = function() {
        const paymentMethod = document.querySelector('.payment-method').textContent;
        if (paymentMethod === '무통장입금') {
            document.getElementById('bankTransferPopup').style.display = 'flex';
        }
    }

    // 입금 완료 버튼 처리
    function confirmTransfer() {
        // 여기에 필요한 서버 통신 로직 추가
        document.getElementById('bankTransferPopup').style.display = 'none';
        // 필요한 경우 결제 상태 업데이트
    }
});
