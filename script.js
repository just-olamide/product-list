let product = document.getElementById("Product");

async function fetchProduct() {
  try {
    const response = await fetch("data.json");
    data = await response.json(); // Store fetched data in the 'data' variable
    console.log(data);
    let counter = 0;

    data.forEach((element) => {
   

      console.log(counter);

      let cart = document.createElement("div");
      cart.classList.add("cart");
      let cartProduct = document.createElement("div");
      cartProduct.innerHTML = `<div id="images">
                <img id="img" src="${element.image.desktop}" >
      <button id="btncart"><img id="decrease" src="./assets/images/icon-decrement-quantity.svg"><span id="counter">${counter}</span><img id="increase" src="./assets/images/icon-increment-quantity.svg"></button>

                <button id="btn" (${
                  element.id
                })">Add to Cart <img src ="/assets/images/icon-add-to-cart.svg"></button></div>
                <p id = "name">${element.category}</p>
                <h6 id = "productName">${element.name}</h6>
                <p id= "price">$${element.price.toFixed(2)}</p>
            `;

      cartProduct.querySelector("#btn").addEventListener("click", function () {
        cartProduct.querySelector("#btn").style.display = "none";

        cartProduct.querySelector("#btncart").style.display = "block";
        cartProduct.querySelector("#btncart").style.display = "flex";
      });

      cartProduct.querySelector("#decrease").addEventListener("click", () => {
        if(counter === 1){
cartProduct.querySelector("#btn").style.display = "block";
cartProduct.querySelector("#btncart").style.display = "none";
return
        } 
        
        counter--;
        cartProduct.querySelector("#counter").innerHTML = counter;

        console.log(counter);
      });

      cartProduct.querySelector("#increase").addEventListener("click", () => {
        counter++;
        cartProduct.querySelector("#counter").innerHTML = counter;
        console.log(counter);
      });
      console.log(counter);
      
      cart.appendChild(cartProduct);
      product.appendChild(cart);
      // const
    });
  } catch (error) {
    console.log(error);
  }
}
fetchProduct();
