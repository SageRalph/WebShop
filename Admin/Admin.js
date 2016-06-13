

var lowStockThreashold = 30;

/* Navigation *****************************************************************/

window.addEventListener('load', function () {
    clearDisplay(); // Remove 'Enable javascript' placholder
    displayNotification("Select a tab to get started.", 'header');
    displayAdminTabs();
});


function displayAdminTabs() {
    // Clear existing
    getElem('tabs').innerHTML = "";


    // Add new

    addNavTab("Stock overview", function () {
        // Show stock manager
        ajax("GET", "stock", null, manageStock);
    });

    addNavTab("Deliveries overview", function () {
        // Show delivery manager
        ajax("GET", "purchases/pending", null, manageDeliveries);
    });

//    addNavTab("Site options", manageSite);
}


function manageStock(results) {
    // Display all products ordered by stock low to high, highlight 
    // products with stock be low optional threashold in red.


    // Display instruction text
    displayNotification("\
        The current stock for all products is listed below. <br>\
        Products highlighted in red are out of stock,\
        products in orange may soon be out of stock.\
        ", "header");


    // Create table and column headers
    var table = newElem('table');
    table.innerHTML = "\
        <tr>                        \
            <th>Product name</th>   \
            <th>Current stock</th>  \
        </tr>";

    for (var i = 0; i < results.length; i++) {

        // Get properties of product
        var name = results[i].productName;
        var stock = results[i].stock;

        // Highlight row based on stock level
        var className = 'InStock';
        if (stock === 0) {
            className = 'OutOfStock';
        } else if (stock <= lowStockThreashold) {
            className = 'LowStock';
        }

        // Add to table
        table.appendChild(tableRow([name, stock], className));
    }

    // Display
    clearDisplay();
    getElem('Display').appendChild(table);
}

/**
 * Returns a table row element of {className} containing {values}.
 * 
 * @param {array} values
 * @param {String} className
 * @returns {tr}
 */
function tableRow(values, className) {
    log("");
    log("Adding table row:");
    log(values + " class: " + className);

    // Create row
    var row = newElem('tr', className);

    // Insert values
    for (var i = 0; i < values.length; i++) {

        var value = values[i];
        var col = newElem('td');

        // Check if value is simple or object
        if (typeof value === "object") {
            // Supports DOM elements in table
            col.className = 'ObjectCell';
            col.appendChild(value);
        } else {
            col.innerHTML = value;
        }

        row.appendChild(col);
    }
    return row;
}


function manageDeliveries(results) {
    // List all pending purchases



    // Display instruction text
    displayNotification("\
        All pending orders awaiting dispatch are listed below.", "header");


    // Create table and column headers
    var table = newElem('table', 'Striped');
    table.innerHTML = "\
        <tr>                            \
            <th>Product name</th>       \
            <th>Quantity ordered</th>   \
            <th>Delivery address</th>   \
            <th class='ObjectCell'></th>\
        </tr>";

    for (var i = 0; i < results.length; i++) {

        // Get properties of product
        var name = results[i].productName;
        var quantity = results[i].quantity;
        var address = results[i].address;

        var resolveButton = newBtn("Mark as dispatched",
                markDispatched.bind(null, results[i].purchaseID));

        // Add to table
        table.appendChild(tableRow([name, quantity, address, resolveButton]));
    }

    // Display
    clearDisplay();
    getElem('Display').appendChild(table);
}

/**
 * Marks a purchase as dispatched then reloads the delivery manager.
 * 
 * @param {int} purchaseID
 */
function markDispatched(purchaseID) {
    var uri = "purchases/" + purchaseID;
    ajax("PUT", uri, {processed: true}, function () {
        // Refresh delivery manager
        ajax("GET", "purchases/pending", null, manageDeliveries);
    });
}



function manageSite() {
    // List options for changing colours and site name
}