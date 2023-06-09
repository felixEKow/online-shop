// shop variables
const productArea = document.getElementById("mainProArea");
const cartButton = document.querySelector(".cartTransBtn");
const closeCartBtn = document.querySelector(".closeCart");
const ClearCartBtn = document.querySelector(".cartFooterButton");
const cartArea =  document.querySelector(".cart");
const cartOverlay = document.querySelector(".cartOverlay");
const cartItemsQuantity = document.getElementById("itemsUpdate");
// const mobileItemsQuantity = document.getElementById("mobileItemsUpdate");
const cartTotal = document.querySelector(".ItemsTotal");
const overlayCartContent = document.querySelector(".overlayCartContent");

//cart
let cartBasket = [];

//add Buttons
let addButtons = [];

function displayCartOverlay(){
  cartOverlay.classList.toggle("transparentBack");
  cartArea.classList.toggle("showCart");
}

// getting products implementation below
class Products {
  async getProducts(){
    try {
      let result = await fetch("mainProducts.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const {title, price, description, category, briefing} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, description, id, image};
      })
      return products;
    } catch (error) {
      console.log(error);      
    }
  }
}

// display products implementation
class UI {
  loadAllproducts(products){
    let itemResult = "";
    products.forEach(product => {
      itemResult += `
      <!-- single Product -->

      <a class="itemCard">
      <img src=${product.image} alt="">
      <h5 class="cardTitle" title="African Print Dress">${product.title}</h5>
      <p>${product.description}</p>
      <div class="itemPrice">
          <h5>$${product.price}</h5>
      </div>
      <div class="colorTag">
      <div class="stars">
      <ion-icon name="star"></ion-icon>
      <ion-icon name="star"></ion-icon>
      <ion-icon name="star"></ion-icon>
      <ion-icon name="star"></ion-icon>
      <ion-icon name="star"></ion-icon>
    </div>
          <button class="proCart" data-id = ${product.id}>Buy</button>
      </div>
      </a>

      <!-- single product ends here -->
      `   
      productArea.innerHTML = itemResult;   
    });
    
    const modalContainer = document.getElementById("modal");
    const closeModalBtn = document.querySelector("#close-modal-btn");
    itemResult = document.querySelector(".itemCard")


      itemResult.addEventListener("click", () => {
        modalContainer.classList.add('show-modal');

closeModalBtn.addEventListener('click', ()=>{
  modalContainer.classList.remove('show-modal');
  itemPage.remove()
})
        // create a new page to display the product details
        let itemPage = document.createElement("div");
        itemPage.classList.add("productInfo");
        
        itemPage.innerHTML = `
        
          <div class="imageSlider">
            <div class="productImages">
                <img src="" alt="">
                <img src="" alt="">
                <img src="" alt="">
                <img src="" alt="">
            </div>
        </div>
        <div class="ItemDetails">
            <h2 class="productBrand">you</h2>
            <h4 class="itemDescription"><b>you</b></h4>
            <p class="itemDescription">you</p>
            <span class="itemPrice">$67</span>
           
            <span class="itemDiscount">( 50% Off )</span>

           
              <div class="rating">
                <img src="./public/img/star-filled.png" class="star" alt="">
                <img src="./public/img/star-filled.png" class="star" alt="">
                <img src="./public/img/star-filled.png" class="star" alt="">
                <img src="./public/img/star-filled.png" class="star" alt="">
                <img src="./public/img/star.png" class="star" alt="">
             </div>

            <p class="subHeading">Select Size</p>
            <input type="radio" name="size" value="xs" checked hidden id="sSize">
            <label for="sSize" class="sizeRadioBtn check">xs</label>
            <input type="radio" name="size" value="s" checked hidden id="sSize">
            <label for="sSize" class="sizeRadioBtn check">s</label>
            <input type="radio" name="size" value="m" hidden id="mSize">
            <label for="mSize" class="sizeRadioBtn">m</label>
            <input type="radio" name="size" value="l" hidden id="lSize">
            <label for="lSize" class="sizeRadioBtn">l</label>
            <input type="radio" name="size" value="xl" hidden id="xlSize">
            <label for="xlSize" class="sizeRadioBtn">xl</label>
            <input type="radio" name="size" value="xxl" hidden id="xxlSize">
            <label for="xxlSize" class="sizeRadioBtn">xxl</label>
            <button class="btn cartButton proCart" data-id=${id}>Add to Cart</button>
        </div>
    
        `;
// Append the itemPage element to the container element
            modalContainer.appendChild(itemPage);

           // Append the product page to the new window
           const imagesOfItems = document.querySelectorAll(".productImages img");
const itemsSlider = document.querySelector(".imageSlider");

let activeSliderImage = 0;

imagesOfItems.forEach((item, i) => {
    item.addEventListener("click", () => {
        imagesOfItems[activeSliderImage].classList.remove("active")
        item.classList.add("active");
        itemsSlider.style.backgroundImage = `url("${item.src}")`
        activeSliderImage = i
    })
})

// Selecting sizes

const sizeButtons = document.querySelectorAll(".sizeRadioBtn");
let checkedButton = 0;

sizeButtons.forEach((item, i) => {
    item.addEventListener("click", ()=>{
        sizeButtons[checkedButton].classList.remove("check");
        item.classList.add("check");
        checkedButton = i
    })
})

let ratingsInput = [...document.querySelectorAll(".star")];

ratingsInput.map((star, index) => {
    star.addEventListener("click", () => {
        for(let i = 0; i < 5; i++){
            if(i <= index){
                ratingsInput[i].src = `/public/img/star-filled.png`
            }else{
                ratingsInput[i].src = `/public/img/star.png`
            }
        }
    })
})



      });

  }
  getAddToCartBtns(){
    const addToCartButtons = [...document.querySelectorAll(".proCart")];
    addButtons = addToCartButtons;
    addToCartButtons.forEach(button => {
      let id = button.dataset.id;
      let alreadySelectedItem = cartBasket.find(item => item.id === id);
      if (alreadySelectedItem) {
        button.innerText = "In Cart";
        button.disabled = true;
        // button.parentElement.parentElement.firstElementChild.innerText = "In Cart";       
      } 
        button.addEventListener("click", (event) => {
          event.target.innerText = "In Cart"
          event.target.disabled = true;
          // event.target.parentElement.parentElement.firstElementChild.innerText = "In Cart"
          //get item from products
          let selectedItem = {...Storage.getProduct(id), amount: 1};
         
          //add item to cart
          cartBasket = [...cartBasket, selectedItem];
          
          //save in local storage
          Storage.saveCart(cartBasket);

          //set cart values
          this.setCartItemValues(cartBasket);

          //display cart item 
           this.addCartItemToCart(selectedItem);
           
          //show the cart overlay
          // this.displayCartOverlay();
        })
       
    });
  }
  setCartItemValues(cartBasket){
    let itemTotal = 0;
    let itemsTotal = 0;
    cartBasket.map(item => {
      itemTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })
    cartTotal.innerText = parseFloat(itemTotal.toFixed(2));
    cartItemsQuantity.innerText = itemsTotal; 
    // mobileItemsQuantity.innerText = itemsTotal;  
  }
  addCartItemToCart(item){
     const itemDiv = document.createElement("div");
     itemDiv.classList.add("cartItem");
     itemDiv.innerHTML = `
     <img src=${item.image} alt="">          
     <div>
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
        <ion-icon class="removeItem" data-id = ${item.id} name="trash-outline"></ion-icon>
        <div class="stars">
              <ion-icon name="star"></ion-icon>
              <ion-icon name="star"></ion-icon>
              <ion-icon name="star"></ion-icon>
              <ion-icon name="star"></ion-icon>
              <ion-icon name="star"></ion-icon>
            </div>
     </div>
     <div>
      <ion-icon class="upBtn" name="caret-up-outline" data-id = ${item.id}></ion-icon>
      <p class="itemAmount">${item.amount}</p>
      <ion-icon class="downBtn" name="caret-down-outline" data-id = ${item.id}></ion-icon>
     </div>
     `;
     overlayCartContent.appendChild(itemDiv);
  }

  displayCartOverlay(){
     cartOverlay.classList.add("transparentBack");
     cartArea.classList.add("showCart");
  }
  setApplication(){
      cartBasket = Storage.getItemsFromCart(); 
      this.setCartItemValues(cartBasket);
      this.populateCart(cartBasket);
      closeCartBtn.addEventListener("click", this.hideCart)
  }
  populateCart(cartBasket){
    cartBasket.forEach(item => this.addCartItemToCart(item));

  }
  hideCart(){
    cartOverlay.classList.remove("transparentBack");
     cartArea.classList.remove("showCart");
  }
  cartLogic(){
    ClearCartBtn.addEventListener("click", () => {
      this.clearCartBasket();
    })
    // cart functionality
    overlayCartContent.addEventListener("click", event => {
      if (event.target.classList.contains("removeItem")) {        
        let removeFromBasket = event.target;
        let id = removeFromBasket.dataset.id;
        overlayCartContent.removeChild(removeFromBasket.parentElement.parentElement);
        this.removeItem(id);        
      } else if (event.target.classList.contains("upBtn")){
         let addUpToBasket = event.target;
         let id = addUpToBasket.dataset.id;
         let itemTotal = cartBasket.find(item => item.id === id);
         itemTotal.amount = itemTotal.amount + 1;
         Storage.saveCart(cartBasket);
         this.setCartItemValues(cartBasket);
         addUpToBasket.nextElementSibling.innerText = itemTotal.amount;
      } else if (event.target.classList.contains("downBtn")) {
         let takeOutOfBasket = event.target;
         let id = takeOutOfBasket.dataset.id; 
         let itemTotal = cartBasket.find(item => item.id === id); 
         itemTotal.amount = itemTotal.amount - 1; 
         if (itemTotal.amount > 0) {
           Storage.saveCart(cartBasket);
           this.setCartItemValues(cartBasket);
           takeOutOfBasket.previousElementSibling.innerText = itemTotal.amount;
         }else{
          overlayCartContent.removeChild(takeOutOfBasket.parentElement.parentElement)
          this.removeItem(id); 
         }    
      }
    });
  }
 
  clearCartBasket(){
    let selectedItems = cartBasket.map(item => item.id);
    selectedItems.forEach(id => this.removeItem(id));

    while (overlayCartContent.children.length > 0) {
      overlayCartContent.removeChild(overlayCartContent.children[0])      
    }
    this.hideCart();
  } 
  removeItem(id){
    cartBasket = cartBasket.filter(item => item.id !== id);
    this.setCartItemValues(cartBasket);
    Storage.saveCart(cartBasket)
    let button = this.getOneButton(id);
    button.disabled = false;
    button.innerHTML = `Buy`;
  }
  getOneButton(id){
    return addButtons.find(button => button.dataset.id === id);
  }

  
  
}


//saving cart items to local storage
class Storage{
   static saveCartItems (products){
    localStorage.setItem("products", JSON.stringify(products));
   }

   static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
   }

   static saveCart(cartBasket){
    localStorage.setItem("cartBasket", JSON.stringify(cartBasket))
   }

   static getItemsFromCart (){
    return localStorage.getItem("cartBasket") ? JSON.parse(localStorage.getItem("cartBasket")) : [];
   }
}


// DOM load event 
document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  const products = new Products();
  // application setup
  ui.setApplication();
  //get product items
  products.getProducts().then(products => {
    ui.loadAllproducts(products);
    Storage.saveCartItems(products);
  }).then( () => {
    ui.getAddToCartBtns();
    ui.cartLogic();
  });
})


