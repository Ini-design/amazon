import {cart,removeFromCart,updateDeliveryOption} from "../data/cart.js";
import {products,getProduct} from '../data/products.js';
import {formatCurrency} from'./utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import {deliveryOptions,getdeliveryOption} from '../data/deliveryOptions.js'; 
//import {renderPaymentSummary} from './checkout/paymentSummary.js';

 const today= dayjs();
 const deliveryDate = today.add(7,'days');
 console.log(deliveryDate.format('dddd,MMMM D'));
 
 function renderOrderSummary() {
   
let cartSummaryHTML= '';

cart.forEach((cartItems) => {
const productId = cartItems.productId;

const matchingProduct = getProduct(productId);
/*products.forEach((product) => {
    if (product.id === productId) {
        matchingProduct = product;
    }
});*/
//make sure what your are importing is thesame case with the other file that you export from

const deliveryOptionId = cartItems.deliveryOptionId;

const deliveryOption = getdeliveryOption(deliveryOptionId);
/*deliveryOptions.forEach((option) => {
  if(option.id === deliveryOptionId) {
    deliveryOption = option;
  }
});*/

const today = dayjs(); 
 const deliveryDate = today.add
 (deliveryOption.deliveryDays,'days'
   
    );
    const dateString = deliveryDate.format(
      `dddd,MMMM D`
    );
 cartSummaryHTML+= `
 
<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date:  ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
           src= "${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
            ${ matchingProduct.name} 
                </div>
                <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItems.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
             ${deliveryOptionsHTML(matchingProduct,cartItems)}
                
             
                
              </div>
            </div>
          </div>
    `;
    
});

function deliveryOptionsHTML(matchingProduct,cartItems) {

let html ='';
  deliveryOptions.forEach((deliveryOption) =>{ 
 const today = dayjs(); 
 const deliveryDate = today.add
 (deliveryOption.deliveryDays,'days'
   
    );
    const dateString = deliveryDate.format(
      `dddd,MMMM D`
    );
    const priceString = deliveryOption.priceCents === 0
    ?'FREE'
    :`$${formatCurrency(deliveryOption.priceCents)}-`;
    
    const isChecked = deliveryOption.id === cartItems.deliveryOptionId;
    
  html += `
      <div class="delivery-option js-delivery-option"data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio"
           ${isChecked  ?'checked' : ''}         class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      $${priceString} Shipping
                    </div>
                  </div>
                </div>
    `
    
  });
  return html;
}
document.querySelector('.js-order-summary')
.innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link)=> {
  link.addEventListener('click', () =>{
  const  productId = link.dataset.productId;
  removeFromCart(productId);
  
   const container = document.querySelector(
 `.js-cart-item-container-${productId}`);
  container.remove();
  renderPaymentSummary();
 });
 }); document.querySelectorAll('.js-delivery-option').forEach((element) => {
   element.addEventListener('click',() => {
const  {productId,deliveryOptionId}  = element.dataset;  updateDeliveryOption(productId,deliveryOptionId);
  renderOrderSummary();
  renderPaymentSummary();
  });
}); 
}
renderOrderSummary();
//renderPaymentSummary();




 function renderPaymentSummary() {
 let productPriceCents = 0;
let shippingPriceCents = 0;

cart.forEach((cartItems) => {
 const product =  getProduct(cartItems.productId);
productPriceCents  +=  product.priceCents * cartItems.quantity;

const deliveryOption =  getdeliveryOption(cartItems.deliveryOptionId);
 shippingPriceCents += deliveryOption.priceCents
}); 
const totalBeforeTaxes = productPriceCents + shippingPriceCents;
const taxesCents = totalBeforeTaxes * 0.1;
const totalCents = totalBeforeTaxes + taxesCents;


const paymentSummaryHTML = `
 <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxes)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
 <div            class="payment-summary-money">
   $${formatCurrency(taxesCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
`;
document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}
renderPaymentSummary();