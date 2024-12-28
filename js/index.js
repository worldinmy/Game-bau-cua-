// Lấy các phần tử cần thiết
const listItems = document.querySelectorAll('.ms-list-item');

const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const resultItems = document.querySelectorAll('.ms-result-item');
const resultMessage = document.getElementById('result-message');
let betCount = 0; // Biến theo dõi điểm đặt cược tối đa 3
let isSpinning = false; // Biến kiểm tra trạng thái quay
let userBets = []; // Lưu các hình ảnh mà người dùng đã chọn

// Mảng chứa các hình ảnh có thể lựa chọn
const images = [
    './images/bau.png',
    './images/cua.png',
    './images/tom.png',
    './images/ca.png',
    './images/huou.png',
    './images/ga.png'
];

// Hàm để cập nhật trạng thái của nút "Quay"
function updateSpinButton() {
    if (betCount === 0) {
        spinButton.disabled = true; // Tắt nút nếu điểm đặt cược là 0
    } else {
        spinButton.disabled = false; // Bật nút nếu có điểm đặt cược
    }
}

// Hàm để trích xuất tên hình ảnh (ví dụ: 'bau' từ './images/bau.png')
function extractImageName(imageUrl) {
    const imageName = imageUrl.split('/').pop().split('.')[0];  // Lấy phần tên trước dấu chấm (ví dụ: 'bau' từ 'bau.png')
    return imageName;
}

// Hàm để đếm số lần xuất hiện của mỗi hình ảnh trong kết quả
function countImageOccurrences(imagesArray) {
    const imageCounts = {};

    // Lặp qua tất cả các hình ảnh trong mảng và đếm số lần xuất hiện
    imagesArray.forEach(imageUrl => {
        const imageName = extractImageName(imageUrl);
        imageCounts[imageName] = imageCounts[imageName] ? imageCounts[imageName] + 1 : 1;
    });

    return imageCounts;
}


// Bắt sự kiện click cho các phần tử .ms-list-item
listItems.forEach(item => {
    item.addEventListener('click', function () {
        if (isSpinning) return; // Nếu đang quay, không cho phép click
        const countElement = this.querySelector('.ms-list-item-count');
        let count = parseInt(countElement.textContent);

        // Tăng điểm cược nếu chưa đạt tối đa 3 điểm
        if (count < 3 && betCount < 3) {
            count += 1;
            betCount += 1;
            countElement.textContent = count;

            // Lưu hình ảnh người dùng chọn vào mảng userBets
            const imgElement = this.querySelector('img');
            userBets.push(imgElement.src);
        }
        else {
            alert("Đặt cược tối đa là 3");
        }

        updateSpinButton();
    });
});

// Bắt sự kiện click cho nút "Đặt lại"
resetButton.addEventListener('click', function () {
    if (isSpinning) return; // Nếu đang quay, không cho phép click vào "Đặt lại"
    betCount = 0; // Đặt lại số điểm cược
    userBets = []; // Đặt lại mảng cược của người dùng
    listItems.forEach(item => {
        item.querySelector('.ms-list-item-count').textContent = '0'; // Đặt lại tất cả số đếm
    });
    updateSpinButton();

    resultMessage.textContent = ''; // Đặt lại thông báo kết quả
});

// Bắt sự kiện click cho nút "Quay"
spinButton.addEventListener('click', function () {
    if (isSpinning) return; // Nếu đang quay, không cho phép click vào "Quay"

    isSpinning = true; // Đặt trạng thái quay là true
    resultMessage.textContent = ''; // Đặt lại thông báo kết quả
    // Random hình ảnh trong các phần tử ms-result-item
    let intervalId = setInterval(() => {
        resultItems.forEach(item => {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            const imgElement = item.querySelector('img');
            imgElement.src = randomImage; // Cập nhật hình ảnh
        });
    }, 100); // Cập nhật hình ảnh mỗi 100ms

    // Tạo hiệu ứng quay và chạy lên
    resultItems.forEach(item => {
        item.classList.add('spin');  // Thêm lớp spin để thực hiện quay và di chuyển lên
    });

    // Tắt nút "Quay" sau khi quay
    spinButton.disabled = true;
    resetButton.disabled = true;

    // Sau 1 giây, dừng việc random hình ảnh và loại bỏ hiệu ứng
    setTimeout(() => {
        clearInterval(intervalId); // Dừng việc random hình ảnh
        resultItems.forEach(item => {
            item.classList.remove('spin');  // Loại bỏ lớp spin sau khi hiệu ứng kết thúc
        });

        // Kiểm tra kết quả nếu người dùng đoán đúng
        let resultImages = [];
        resultItems.forEach(item => {
            resultImages.push(item.querySelector('img').src);
        });

        // Kiểm tra nếu kết quả quay khớp với hình ảnh người dùng đã chọn
        const correctBets = userBets.filter(bet => resultImages.includes(bet)).length;
        // Đếm số lần xuất hiện của từng hình ảnh trong kết quả
        const imageOccurrences = countImageOccurrences(resultImages);

        let message = '';
        if (correctBets === userBets.length && userBets.length > 0) {
            message = `Bạn đã đoán đúng với kết quả:`;
        } else {
            message = `Bạn đã đoán sai với kết quả là: `;
        }

        // Duyệt qua các tên hình ảnh và số lần xuất hiện
        for (const [imageName, count] of Object.entries(imageOccurrences)) {
            message += `${imageName}: ${count}, `;
        }

        console.log( message.slice(0, -2));
        

        // Kích hoạt lại nút "Quay" nếu có thể
        spinButton.disabled = false;
        resetButton.disabled = false;
        // Đặt lại trạng thái quay
        isSpinning = false;
    }, 1000); // 1000ms = 1s (Thời gian kéo dài cho hiệu ứng quay)
});

// Thêm hiệu ứng quay cho hình ảnh
resultItems.forEach(item => {
    item.classList.remove('spin');
});

