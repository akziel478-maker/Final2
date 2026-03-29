
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
            showError('Failed to load news');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Error loading news. Please try again.');
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
        showError('Error loading news. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        showError('Please enter a search term');
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
            showError('No articles found. Try a different search term.');
            document.getElementById('newsContainer').innerHTML = '';
        }
    } catch (error) {
        console.error('Error searching news:', error);
        showError('Error searching news. Please try again.');
    } finally {
        showLoading(false);
    }
}

function displayNews(articles) {
    const container = document.getElementById('newsContainer');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No articles found</p></div>';
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
                    <p class="news-description">${article.description || 'No description available'}</p>
                    <div class="news-footer">
                        <span class="news-date">${publishDate}</span>
                        <a href="${article.url}" target="_blank" class="news-link">Read More</a>
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
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

function loadProducts() {
    const products = [
        { id: 1, name: 'News Premium', price: '$9.99/mo', desc: 'Ad-free reading' },
        { id: 2, name: 'Breaking Alerts', price: '$4.99/mo', desc: 'Real-time notifications' },
        { id: 3, name: 'Archive Access', price: '$2.99/mo', desc: 'Full article history' },
        { id: 4, name: 'Custom Topics', price: '$6.99/mo', desc: 'Personalized feeds' },
    ];

    const container = document.getElementById('productsContainer');
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price}</div>
            <div class="product-desc">${product.desc}</div>
            <button class="btn btn-primary" style="width: 100%; font-size: 12px; padding: 8px;">Subscribe</button>
        </div>
    `).join('');
}
