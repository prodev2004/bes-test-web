const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('search');
const currentPage = urlParams.get('page');
const baseURL = 'https://best-test-web-back.onrender.com';

if (!queryParam) {
    document.querySelector('.no-search').classList.remove('hide-section')
    document.querySelector('.products-listing-section').classList.add('hide-section')
    document.querySelector('.no-items-to-show').classList.add('hide-section')
    document.querySelector('.loading-products').classList.add('hide-section')
} else {
    document.querySelector('.filtering-section .search-wrapper input').value = queryParam;
    document.querySelector('.no-search').classList.add('hide-section')
    document.querySelector('.no-items-to-show').classList.add('hide-section')
    document.querySelector('.products-listing-section').classList.add('hide-section')
    document.querySelector('.loading-products').classList.remove('hide-section')

    fetchProducts(queryParam)
}

async function fetchProducts(query) {
    const response = await fetch('data/merged_data.json');
    const products = await response.json();

    const filteredProducts = products.filter(product =>
        product["product_model"]?.toLowerCase().includes(query.toLowerCase()) ||
        product["short_desc"]?.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredProducts.length === 0) {
        document.querySelector('.no-items-to-show').classList.remove('hide-section')
        document.querySelector('.products-listing-section').classList.add('hide-section')
        document.querySelector('.loading-products').classList.add('hide-section')

        return
    }

    document.querySelector('.products-listing-section').classList.remove('hide-section')
    document.querySelector('.loading-products').classList.add('hide-section')

    const productsToShow = getPaginatedProducts(filteredProducts, Number(currentPage))
    addPagination(filteredProducts.length)
    showProducts(productsToShow)
}

function getPaginatedProducts(products, page = 1, itemsPerPage = 15) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
}

function addPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / 15);
    const nextPageBtn = document.querySelector('.pagination-section .page-link.next');
    const prevPageBtn = document.querySelector('.pagination-section .page-link.prev');

    if (currentPage === '1') {
        prevPageBtn.classList.add('disabled');
    }
    if (currentPage === totalPages.toString()) {
        nextPageBtn.classList.add('disabled');
    }

    nextPageBtn.href = `?search=${queryParam}&page=${Number(currentPage) + 1}`;
    prevPageBtn.href = `?search=${queryParam}&page=${Number(currentPage) - 1}`;

    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement('a');
        page.href = `?search=${queryParam}&page=${i}`;
        page.textContent = i;
        page.classList.add('page-link');

        if (i === Number(currentPage)) {
            page.classList.add('active');
        }

        nextPageBtn.before(page);
    }
}

function showProducts(products) {
    console.log(products);
    
    const productsContainer = document.querySelector('.products-listing-section .products-listing');
    productsContainer.innerHTML = '';

    productsContainer.innerHTML = products.map(product => {
        return `
            <a href="item.html?id=${product['id']}" class="product-card">
                <p class="availability">${product['availability'] || 'In Stock'}</p>
                <div class="product-card-image-wrapper">
                    <img src="${baseURL}/proxy-image?url=${replaceImg(product['product-image'])}" alt="${product['product_model']}">
                </div>
                <div class="product-info">
                    <h3>${product['product_model']}</h3>
                    <p>${product['product_id'] || ''}</p>
                </div>
            </a>
        `;
    }).join(' ');
}

function replaceImg(src) {
    if (src.includes('placeholder/default/default_base_3.jpg')) {
        return `https://bes-test-web.onrender.com/images/no-image-available.jpg`
    } else {
        return src
    }
}
