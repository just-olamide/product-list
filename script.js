const productContainer = document.getElementById('products');
const basket = {};

async function loadProducts() {
  try {
    const response = await fetch('data.json');
    const products = await response.json();

    products.forEach(product => {
      let quantity = 1;
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      productCard.innerHTML = `
        <div id="image-container">
          <img src="${product.image.desktop}" alt="${product.name}">
          <button id="add-to-cart"><img src="/assets/images/icon-add-to-cart.svg" alt="Add"> Add to Cart</button>
          <div id="cart-controls">
            <img id="decrement" src="./assets/images/icon-decrement-quantity.svg" alt="Decrement">
            <span class="quantity">${quantity}</span>
            <img id="increment" src="./assets/images/icon-increment-quantity.svg" alt="Increment">
          </div>
        </div>
        <p id="category">${product.category}</p>
        <h5 id="product-name">${product.name}</h5>
        <p id="product-price" class="mt-3">$${product.price.toFixed(2)}</p>
      `;

      productContainer.appendChild(productCard);

      const addToCartBtn = productCard.querySelector('#add-to-cart');
      const cartControls = productCard.querySelector('#cart-controls');
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      const itemCount = document.getElementById('item-count');
      const incrementBtn = productCard.querySelector('#increment');
      const decrementBtn = productCard.querySelector('#decrement');
      const quantitySpan = productCard.querySelector('.quantity');

      addToCartBtn.addEventListener('click', () => {
        addToCartBtn.style.display = 'none';
        cartControls.style.display = 'flex';
        quantitySpan.textContent = quantity;

        document.getElementById('empty-cart').style.display = 'none';
        document.getElementById('order-summary').style.display = 'block';

        basket[product.name] = {
          quantity: quantity,
          price: product.price
        };

        cartItem.innerHTML = `
          <h6>${product.name}</h6>
          <p>${quantity}x $${product.price.toFixed(2)} = $${(product.price * quantity).toFixed(2)}
            <span class="remove-item" data-product="${product.name}">
              <img src="./assets/images/icon-remove-item.svg" alt="Remove">
            </span>
          </p>
        `;

        document.getElementById('cart-items').appendChild(cartItem);
        itemCount.innerText = calculateTotalItems();
        updateOrderDetails();
        updateTotalPrice();

        const removeBtn = cartItem.querySelector('.remove-item');
        removeBtn.addEventListener('click', () => {
          delete basket[product.name];
          cartItem.style.display = 'none';
          addToCartBtn.style.display = 'block';
          cartControls.style.display = 'none';

          document.getElementById('empty-cart').style.display = Object.keys(basket).length === 0 ? 'block' : 'none';
          document.getElementById('order-summary').style.display = Object.keys(basket).length === 0 ? 'none' : 'block';

          itemCount.innerText = calculateTotalItems();
          updateOrderDetails();
          updateTotalPrice();
        });
      });

      incrementBtn.addEventListener('click', () => {
        quantity++;
        quantitySpan.textContent = quantity;
        basket[product.name].quantity = quantity;

        cartItem.innerHTML = `
          <h6>${product.name}</h6>
          <p>${quantity}x $${product.price.toFixed(2)} = $${(product.price * quantity).toFixed(2)}
            <span class="remove-item" data-product="${product.name}">
              <img src="./assets/images/icon-remove-item.svg" alt="Remove">
            </span>
          </p>
        `;

        updateOrderDetails();
        itemCount.innerText = calculateTotalItems();
        updateTotalPrice();
      });

      decrementBtn.addEventListener('click', () => {
        if (quantity === 1) {
          addToCartBtn.style.display = 'block';
          cartControls.style.display = 'none';
          cartItem.style.display = 'none';
          delete basket[product.name];

          document.getElementById('empty-cart').style.display = Object.keys(basket).length === 0 ? 'block' : 'none';
          document.getElementById('order-summary').style.display = Object.keys(basket).length === 0 ? 'none' : 'block';

          itemCount.innerText = calculateTotalItems();
          updateOrderDetails();
          updateTotalPrice();
          return;
        }

        quantity--;
        quantitySpan.textContent = quantity;
        basket[product.name].quantity = quantity;

        cartItem.innerHTML = `
          <h6>${product.name}</h6>
          <p>${quantity}x $${product.price.toFixed(2)} = $${(product.price * quantity).toFixed(2)}
            <span class="remove-item" data-product="${product.name}">
              <img src="./assets/images/icon-remove-item.svg" alt="Remove">
            </span>
          </p>
        `;

        updateOrderDetails();
        itemCount.innerText = calculateTotalItems();
        updateTotalPrice();
      });

      document.getElementById('checkout-btn').addEventListener('click', () => {
        document.getElementById('main-section').style.opacity = '0.2';
        document.getElementById('modal-overlay').style.display = 'block';
      });

      document.getElementById('cancel-order').addEventListener('click', () => {
        document.getElementById('main-section').style.opacity = '1.0';
        document.getElementById('modal-overlay').style.display = 'none';
      });

      document.getElementById('confirm-order').addEventListener('click', () => {
        document.getElementById('order-completed').style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'none';
      });

      document.getElementById('new-order').addEventListener('click', () => {
        document.getElementById('order-completed').style.display = 'none';
        document.getElementById('main-section').style.opacity = '1.0';
        location.reload();
      });
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function updateTotalPrice() {
  let total = 0;
  for (let item in basket) {
    total += basket[item].quantity * basket[item].price;
  }
  document.getElementById('order-total').innerText = `$${total.toFixed(2)}`;
}

function calculateTotalItems() {
  let totalItems = 0;
  for (let item in basket) {
    totalItems += basket[item].quantity;
  }
  return totalItems;
}

function updateOrderDetails() {
  const orderDetails = document.getElementById('order-details');
  const confirmedOrderDetails = document.getElementById('confirmed-order-details');
  orderDetails.innerHTML = '';
  confirmedOrderDetails.innerHTML = '';

  for (let item in basket) {
    const product = basket[item];
    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item');
    orderItem.innerHTML = `
      <h6>${item}</h6>
      <p>${product.quantity}x $${product.price.toFixed(2)} = $${(product.quantity * product.price).toFixed(2)}</p>
    `;
    orderDetails.appendChild(orderItem);
    confirmedOrderDetails.appendChild(orderItem.cloneNode(true));
  }
}

loadProducts();