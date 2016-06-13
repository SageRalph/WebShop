<?php

/**
 * Updates data for product with $productID to match changes specified by $data.
 * $data should be an object with key-value pairs for each field to be modified.
 * 
 * @param {int} $productID
 * @param {Object} $data
 * @return {String}
 */
function editProduct($productID, $data) {

    $keys = [];
    $values = [];

    // Get values from request
    $properties = get_object_vars($data);
    foreach ($properties as $key => $value) {

        // If unlisting a product with no purchases, delete instead
        if ($key === 'listed' && $value === false) {
            if (quantitySold($productID) === 0) {
                return deleteproduct($productID);
            }
        }

        // catch negative price/stock
        if (!(($key === 'price' || $key === 'stock') && $value < 0)) {
            $keys[] = $key;
            $values[] = $value;
        }
    }

    // Combine query variables
    $values[] = $productID;
    $names = join(" = ?, ", $keys) . " = ?";

    $query = "UPDATE Product SET $names WHERE productID = ?";

    // Run query
    $db = new DBConnection;
    $result = $db->run($query, $values);
    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }
    return $result;
}

/**
 * Adds an amount to the stock for a product, negative amounts are permitted.
 * If stock would become negative or product cannot be found, a failure messege 
 * is returned and changes are not made.
 * 
 * @param integer $productID
 * @param integer $amount
 * @return string
 */
function addStock($productID, $amount) {

    $currentStock = getStock($productID);


    if (!is_numeric($currentStock)) {
        http_response_code(404); // Not Found
        return "Failed: Cannot find product";
    }

    $quantity = $currentStock + $amount;

    if ($quantity < 0) {
        return "Failed: Insufficient stock";
    }

    $db = new DBConnection;
    $result = $db->run("
        UPDATE Product SET  stock = ?
        WHERE productID = ?", array($quantity, $productID));
    $db->close();

    return $result;
}

/**
 * Updates data for purchase with $purchaseID to match changes specified 
 * by $data. $data should be an object with key-value pairs for each field 
 * to be modified.
 * 
 * @param {int} $purchaseID
 * @param {Object} $data
 * @return {String}
 */
function editPurchase($purchaseID, $data) {

    $keys = [];
    $values = [];

    // Get values from request
    $properties = get_object_vars($data);
    foreach ($properties as $key => $value) {

        // catch negative quantity
        if (!($key === 'quantity' && $value < 0)) {
            $keys[] = $key;
            $values[] = $value;
        }
    }

    // Combine query variables
    $values[] = $purchaseID;
    $names = join(" = ?, ", $keys) . " = ?";

    $query = "UPDATE Purchase SET $names WHERE purchaseID = ?";

    // Run query
    $db = new DBConnection;
    $result = $db->run($query, $values);
    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }
    return $result;
}

function editReview($productID, $username) {
    //TODO
    http_response_code(501); // Not Implemented
    return "'edit review' not implemented yet";
}
