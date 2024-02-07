// Log a message indicating successful connection
console.log("====================================");
console.log("Connected");
console.log("====================================");

// Select all tab buttons and the product cards container
const tabs = document.querySelectorAll(".tab-btn");
const productCardsContainer = document.querySelector(".product-cards");

// Add click event listeners to each tab button
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove 'active' class from all tabs and hide their images
    tabs.forEach((t) => {
      t.classList.remove("active");
      const img = t.querySelector("img");
      img.style.display = "none";
    });
    
    // Add 'active' class to the clicked tab and show its image
    tab.classList.add("active");
    const img = tab.querySelector("img");
    img.style.display = "flex";
    
    // Fetch products based on the selected category
    fetchProducts(tab.dataset.category);
  });
});

// Function to fetch products from the API
function fetchProducts(category) {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  )
    .then((response) => response.json())
    .then((data) => {
      // Find the category data corresponding to the selected category
      const categoryData = data.categories.find(
        (cat) => cat.category_name === category
      );
      
      // Render the products for the selected category
      renderProducts(categoryData.category_products);
    })
    .catch((error) => console.error("Error fetching products:", error));
}

// Function to render the products on the page
function renderProducts(products) {
  // Clear the product cards container before rendering new products
  productCardsContainer.innerHTML = "";
  
  // Loop through each product and create a product card
  products.forEach((product) => {
    // Calculate the discount percentage for the product
    const discountPercentage = calculateDiscountPercentage(
      product.price,
      product.compare_at_price
    );
    
    // Create the product card HTML
    const card = `
      <div class="product-card">
        ${
          // Add badge if available
          product.badge_text
            ? `<div class="badge">${product.badge_text}</div>`
            : ""
        }
        <img src="${product.image}" alt="${product.title}">
        <div class="product-details">
          <div class="formetter">
            <h3 class="product-title">${truncateTitle(product.title)}</h3>
            <p>&#8226; ${product.vendor}</p>
          </div>
          <div class="formetter">
            <p class="price">Rs ${product.price}.00</p>
            <p class="compare-at-price">${product.compare_at_price}.00</p>
            <p class="discount-off">${discountPercentage}% off</p>
          </div>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    `;
    
    // Append the card to the product cards container
    productCardsContainer.innerHTML += card;
  });
}

// Function to calculate the discount percentage for a product
function calculateDiscountPercentage(price, comparePrice) {
  const discount = ((comparePrice - price) / comparePrice) * 100;
  return Math.round(discount);
}

// Initial fetch and render for the "Men" category
fetchProducts("Men");

// Set the "Men" tab as active by default and show its image
const menTab = document.querySelector(".tab-btn[data-category='Men']");
menTab.classList.add("active");
const menImg = menTab.querySelector("img");
menImg.style.display = "flex";

// Function to truncate the product title if it's too long
function truncateTitle(title) {
  const maxLength = 15; // Set the maximum length of the title
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "..."; // Truncate title if it's longer than maxLength
  } else {
    return title;
  }
}
