
const NEWS_API_KEY = '29114135700d415b8e75f43f8dea7a38';
const NEWS_API_BASE = 'https://newsapi.org/v2';

let allNews = [];

document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('categorySelect').addEventListener('change', loadNewsByCategory);

    loadNews();
    loadProducts();
});

async function loadNews() {
    showLoading(true);
    try {
        const response = await fetch(
            `${NEWS_API_BASE}/top-headlines?country=us&sortBy=popularity&pageSize=30&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();

        if (data.articles) {
            allNews = data.articles;
            displayNews(allNews);
        } else {
            showError('Không tải được tin tức');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Lỗi tải tin tức. Vui lòng thử lại.');
    } finally {
        showLoading(false);
    }
}

async function loadNewsByCategory() {
    const category = document.getElementById('categorySelect').value;
    showLoading(true);
    try {
        const response = await fetch(
            `${NEWS_API_BASE}/top-headlines?category=${category}&sortBy=popularity&pageSize=30&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();

        if (data.articles) {
            allNews = data.articles;
            displayNews(allNews);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Lỗi tải tin tức. Vui lòng thử lại.');
    }
}

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        showError('Vui lòng nhập từ khóa tìm kiếm');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(
            `${NEWS_API_BASE}/everything?q=${encodeURIComponent(query)}&sortBy=popularity&pageSize=30&apiKey=${NEWS_API_KEY}`
        );
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            allNews = data.articles;
            displayNews(allNews);
        } else {
            showError('Không tìm thấy bài viết. Vui lòng thử từ khóa khác.');
            document.getElementById('newsContainer').innerHTML = '';
        }
    } catch (error) {
        console.error('Error searching news:', error);
        showError('Lỗi tìm kiếm tin tức. Vui lòng thử lại.');
    } finally {
        showLoading(false);
    }
}

function displayNews(articles) {
    const container = document.getElementById('newsContainer');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Không có bài viết</p></div>';
        return;
    }

    container.innerHTML = articles.map(article => {
        const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="news-card">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=News'}" 
                     alt="${article.title}" 
                     class="news-image"
                     onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                <div class="news-card-content">
                    <div class="news-source">${article.source.name}</div>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${article.description || 'Không có mô tả'}</p>
                    <div class="news-footer">
                        <span class="news-date">${publishDate}</span>
                        <a href="${article.url}" target="_blank" class="news-link">Xem thêm</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = `<div class="empty-state"><p>${message}</p></div>`;
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất không?')) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

function loadProducts() {
    const products = [
        { id: 1, name: 'Vi En Ẹt Brét Premium', price: '22.000vnđ/tháng', desc: 'Trải nghiệm đọc báo không quảng cáo' },
        { id: 3, name: 'Kho lưu trữ', price: '15.000vnđ/tháng', desc: 'Truy cập lịch sử tin tức' },
        { id: 4, name: 'Feed Tin Tức Cá Nhân', price: '25.000vnđ/tháng', desc: 'Feed tin tức được cá nhân hóa' },
    ];

    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price}</div>
            <div class="product-desc">${product.desc}</div>
            <button class="btn btn-primary" style="width: 100%; font-size: 12px; padding: 8px;">Đăng ký</button>
        </div>
    `).join('');
}
