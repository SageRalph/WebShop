/*
 * Notes on implementation:
 * A 'browserItem' is the graphical HTML representation of a product visible to
 * the user. BrowserItems can be minimised, displaying only essential 
 * information, or expanded, showing the full product information, images and 
 * reviews. Batches of products are always loaded in minimised form to save 
 * bandwidth; the more expensive full information calls are reserved for 
 * products selected by the user.
 */

var mode; // Required for product interaction

var productsPerQuery = 10; // The number of products to request per search.

/**
 * Sets the opperation mode required for product interaction
 * Accepted modes: Customer - adds 'Add to basket' functionailty to items
 *                 CMS      - adds 'Edit' functionality to items
 *                 
 * @param {String} value
 */
function setMode(value) {
    mode = value;
}


/* Navigation *****************************************************************/

window.addEventListener('load', function () {
    clearDisplay(); // Remove 'Enable javascript' placholder
    displayNotification("Select a category to get started.", 'header');
    getCategories();
});


/* Listings *******************************************************************/

/**
 * Asynchronusly gets and displays products matching a term.
 * Modes are search methods supported by the server API; 
 * These currently include 'category' and 'search'.
 * The existing display can optionally be cleared by setting clearCurrent.
 * The offset is the position into the query results from after which new items 
 * will be returned.
 * 
 * @param {String} mode
 * @param {String} term
 * @param {integer} offset
 * @param {boolean} clearCurrent
 */
function getProductsByTerm(mode, term, offset, clearCurrent) {
    var uri = "products/" + mode + "/" + term + "/" + offset + "/" + productsPerQuery;

    // Display loading notification
    if (clearCurrent) {
        clearDisplay();
    } else {
        // Display after current listings
        displayNotification("Loading...", 'loading');
    }

    var query = {mode: mode, term: term, offset: offset, clearCurrent: clearCurrent};
    ajax("GET", uri, null, displayProducts, query);

}
function displayProducts(products, status, query) {

    if (!query.clearCurrent) {
        removeElem('loading'); // Remove 'loading...' notification
    }

    if (mode === 'CMS') {
        displayNotification("Click on a product for more information and editing options.", 'header');
    } else {
        displayNotification("Click on products for more information.", 'header');
    }

    if (status === 404) {
        log("No products found");

        if (query.clearCurrent) {
            displayNotification("No products found", 'header');
        } else {
            displayNotification("No more products found", 'noProducts');
        }
        return;
    }

    // Display products
    for (var i = 0; i < products.length; i++) {
        var container = createBrowserItem(products[i].productID);
        drawBrowserItem(products[i], status, container);
    }

    // Add 'Go to top' to footer
    var footer = getElem("footer");
    footer.innerHTML = '<a href="#Top">Go to top</a>';


    // Only if not end of results
    if (products.length === productsPerQuery) {
        // Add 'Load more products' to footer
        var offset = query.offset + productsPerQuery;
        footer.appendChild(newBtn("Load next " + productsPerQuery + " products",
                function () {
                    getProductsByTerm(query.mode, query.term, offset, false);
                }));
    }
}

/**
 * Creates a browserItem with no product details and adds it to the document.
 * A handle to the object is returned as a DOM article.
 *  
 * @param {integer} productID
 * @returns 'article'
 */
function createBrowserItem(productID) {
    var container = document.createElement('article');
    container.className = "ListedProduct Minimised";
    container.expanded = false;
    container.productID = productID;

    //add click listener for expand/minimise
    container.onclick = function () {
        toggleBrowserItem(container);
    };

    //Add listing - must be done here to prevent DOM restructure on toggle
    getElem('Display').appendChild(container);

    return container;
}

/**
 * Creates a HTML representation of the product details inside the container.
 * 
 * @param {Product} product
 * @param {article} container
 */
function drawBrowserItem(product, status, container) {

    // Basic product info
    container.innerHTML = "                                            \
        <img class='ProductThumbnail' src=" + product.thumbnail + ">   \
        <h1>" + product.productName + "</h1>                           \
        <ul class='ProductDetailsList'>                                \
            <li>Stock: " + product.stock + "</li>                      \
            <li>Price: £" + product.price + "</li>                    \
            <li>Delivery: " + product.deliveryType + "</li>            \
        </ul>                                                          \
        <p>" + product.description + "</p>";


    // Full info if required
    if (container.expanded) {

        // Display additional images
        if (product.images.length !== 0) {

            var imageContainer = newElem("section", "Images");

            for (var i = 0; i < product.images.length; i++) {
                imageContainer.innerHTML += "<img src=" + product.images[i] + ">";
            }
            container.appendChild(imageContainer);
        }


        // List reviews
        if (product.reviews.length !== 0) {
            var reviewsContainer = document.createElement("section");
            reviewsContainer.className = "Reviews";
            reviewsContainer.innerHTML = "<h1>Reviews</h1>";

            for (var i = 0; i < product.reviews.length; i++) {
                var review = product.reviews[i];

                reviewsContainer.innerHTML += "         \
                <article>                               \
                    <h2>" + review.username + "</h2>    \
                    <p>" + review.review + "</p>        \
                </article>";
            }
            container.appendChild(reviewsContainer);
        }


        // Add interaction button
        if (mode === "customer") {

            var quantity = null;
            var quantityIn = newElem('input', 'TwoButton', "Quantity");
            container.appendChild(quantityIn);

            // Validate input (must be natural number)
            quantityIn.onchange = function () {
                var valid = true;

                try { // Test if numeric
                    quantity = parseInt(quantityIn.value);
                } catch (e) {
                    valid = false;
                }

                valid = valid && quantity > 0;

                if (!valid) {
                    quantityIn.className = 'TwoButton InvalidInput';
                    quantity = null;
                } else {
                    quantityIn.className = 'TwoButton';
                }
            };

            // Prevent item toggling
            quantityIn.onclick = function (e) {
                e.stopPropagation();
            };

            // "Add to Basket" button
            var addToBasketButton = newBtn("Add to Basket", function (e) {

                // Prevent item toggling
                e.stopPropagation();

                if (quantity !== null) {

                    addToBasket(product, quantity);

                    // Reset input
                    quantity = null;
                    quantityIn.value = "";
                }
            });
            addToBasketButton.className = 'TwoButton';
            container.appendChild(addToBasketButton);


        } else if (mode === "CMS") {
            // "Edit" button
            container.appendChild(newBtn("Edit", function () {
                editItem(product);
            }));
        }
    }
}

/**
 * Toggles a browserItem between being minimised and expanded.
 * 
 * @param {article} container
 */
function toggleBrowserItem(container) {
    log("");
    log("Toggling browser item " + container.productID);

    container.expanded = !container.expanded;

    if (container.expanded) {
        container.className = "ListedProduct Expanded";

        // Get expanded product data
        var uri = "products/" + container.productID;
        ajax("GET", uri, null, drawBrowserItem, container);

    } else {
        container.className = "ListedProduct Minimised";
    }
}