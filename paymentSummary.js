import {cart} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';

export function renderPaymentSummary() {
cart.forEach((cartItems) => {
let productPriceCents = 0;

 const product =  getProduct(cartItems.productId);
productPriceCents =  product.priceCents * cartItems.quantity
}); 
console.log(productPriceCent);
}