# Block Search

[English](#english) | [Tiếng Việt](#tiếng-việt)

<div align="center">
  <img src="https://img.shields.io/badge/author-NguyenSon-blue.svg?style=for-the-badge" alt="Author: NguyenSon">
  <img src="https://img.shields.io/badge/jquery-3.7.1-orange.svg?style=for-the-badge" alt="jQuery 3.7.1">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License: MIT">
</div>

<a name="english"></a>
## English

### Overview
Block Search is a jQuery plugin that provides advanced search functionality for HTML blocks with real-time highlighting and filtering capabilities. It's perfect for creating interactive search interfaces with visual feedback.

### Features
- Real-time search highlighting
- Support for both exact and tokenized search
- Case-sensitive/insensitive search options
- Data attribute search support
- Customizable animations
- Search callback hooks

### Installation
1. Include jQuery in your project:
```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

2. Include the block-search.js file:
```html
<script src="block-search.js"></script>
```

### Usage
```javascript
$('#search').searchHighlight({
    listSelector: '.card-item',
    searchFields: ['text', 'data-keywords'],
    caseSensitive: false,
    delay: 300,
    highlightClass: 'search-highlight',
    tokenized: true,
    animation: {
        show: 'fadeIn',
        hide: 'fadeOut',
        duration: 300
    }
});
```

### Configuration Options
- `listSelector`: Selector for items to search within
- `searchFields`: Array of fields to search ('text' or data attributes)
- `caseSensitive`: Enable/disable case-sensitive search
- `delay`: Debounce delay in milliseconds
- `highlightClass`: CSS class for highlighted text
- `tokenized`: Enable word-by-word search
- `animation`: Configure show/hide animations


---

<a name="tiếng-việt"></a>
## Tiếng Việt

### Tổng quan
Block Search là một plugin jQuery cung cấp chức năng tìm kiếm nâng cao cho các block HTML với khả năng đánh dấu và lọc theo thời gian thực.

### Tính năng
- Đánh dấu tìm kiếm theo thời gian thực `delay:0`
- Hỗ trợ tìm kiếm chính xác `tokenized:false` và theo từ khóa `tokenized:true`
- Tùy chọn tìm kiếm phân biệt/không phân biệt chữ hoa-thường `caseSensitive
- Hỗ trợ tìm kiếm thuộc tính data `<div class="card" data-keywords="searching text"></div>`
- Animation
- Các hook callback tìm kiếm

### Cài đặt
1. Thêm jQuery vào dự án:
```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

2. Thêm file block-search.js:
```html
<script src="block-search.js"></script>
```

### Sử dụng
```javascript
$('#search').searchHighlight({
    listSelector: '.card-item',
    searchFields: ['text', 'data-keywords'],
    caseSensitive: false,
    delay: 300,
    highlightClass: 'search-highlight',
    tokenized: true,
    animation: {
        show: 'fadeIn',
        hide: 'fadeOut',
        duration: 300
    }
});
```

### Tùy chọn cấu hình
- `listSelector`: Selector các phần tử cần tìm kiếm
- `searchFields`: Mảng phạm vi các vị trí tìm kiếm ("text" hoặc thuộc tính data vd: `data-keywords` )
- `caseSensitive`: Bật/tắt tìm kiếm phân biệt chữ hoa-thường
- `delay`: Độ trễ debounce tính bằng ms
- `highlightClass`: Class CSS cho văn bản được đánh dấu
- `tokenized`: Bật tìm kiếm theo từng từ
- `animation`: Cấu hình hoạt ảnh hiện/ẩn
