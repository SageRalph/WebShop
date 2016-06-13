var username = "Test User 1";
var address = "Test Address 1";
var basket = [];
var totalPrice = 0.0; // Running tally of cost in basket
var orderCost = 0.0; // Calculated cost of purchase after checking stock


window.addEventListener('load', function () {
    setMode("customer");
});

/**
 * Adds the given ammount to the total price, negative numbers are acceptable.
 * 
 * @param decimal amount
 */
function updateTotalPrice(amount) {
    totalPrice += amount;
    getElem("totalPrice").innerHTML = 'Total price £' + totalPrice.toFixed(2);
}

/**
 * Adds a quantity of a product to the basket then updates the basket display.
 * 
 * @param product product
 * @param integer quantity
 */
function addToBasket(product, quantity) {
    log("");
    log("Adding " + quantity + " of '"
            + product.productName + "' to basket");

    var cost = product.price * quantity;
    updateTotalPrice(cost);

    // Store cut down form of product data in basket
    var details = new Object();
    details.quantity = quantity;
    details.productID = product.productID;
    details.productName = product.productName;
    details.cost = cost;


    var BasketItems = getElem("BasketItems");

    // Draw
    var item = document.createElement("article");
    item.className = "BasketItem";
    item.innerHTML = '                                  \
        <h1>' + product.productName + '</h1>            \
	<ul class="BasketDetails">                      \
            <li>Quantity: ' + quantity + '</li>         \
            <li>Price: £' + cost.toFixed(2) + '</li>   \
	</ul>                                           \
    ';

//    // Define edit button
//    item.appendChild(newBtn("Edit", function () {
//        // TODO should allow editing of quantity
//    }));

    // Define remove button
    item.appendChild(newBtn("Remove", function () {
        log("");
        log("Removing '" + product.productName + "' from basket");

        BasketItems.removeChild(item);
        updateTotalPrice(0 - cost);
        basket.splice(basket.indexOf(details), 1); // Remove from basket
    }));

    //Combine elements and add to basket
    BasketItems.appendChild(item);
    basket.push(details);
    orderCost = 0.0; // Must be recalculated when making purchase
}

/**
 * Creates new purchases for each item in the basket, then resets the basket.
 */
function placeOrder() {
    log("");
    log("Placing order");

    var orderCost = 0;

    for (var i = 0; i < basket.length; i++) {

        var item = basket[i];

        log("Creating purchase for " + item.quantity +
                " items with productID: " + item.productID);

        // Get details
        var purchase = new Object();
        purchase.productID = item.productID;
        purchase.username = username;
        purchase.quantity = item.quantity;

        // Send to server
        ajax("POST", "purchases", purchase, purchaseSummary, item);
    }


    // Reset basket & display
    clearDisplay();
    getElem("BasketItems").innerHTML = "";
    basket = [];
    updateTotalPrice(0 - totalPrice); // Reset total cost to 0
}

/**
 * Displays a notification summarising a purchase.
 * Parameter r is an unused placeholder.
 * 
 * @param {Object} r
 * @param {int} status
 * @param {Object} item
 */
function purchaseSummary(r, status, item) {

    if (status === 200) { // Purchase made

        displayNotification("Successfully purchased " + item.quantity
                + " of '" + item.productName + "'.");

        orderCost += item.cost;

        displayNotification('Final cost of order: £'
                + orderCost.toFixed(2) + ". <br>Products will be delivered to '"
                + address + "'.", 'header');

    } else { // Not purchased

        displayNotification("Unable to purchase " + item.quantity
                + " of '" + item.productName
                + "', desired quantity is not available.");
    }
}