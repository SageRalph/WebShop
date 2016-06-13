<?php

// Details to retrive when selecting products from the database
define('ProductDetails', 'Product.productID, productName, price, deliveryType, stock, description, thumbnail');

/**
 * Generates a hard-coded test product with either minimal or expanded data.
 * 
 * @param {boolean} $expanded
 * @return {product}
 */
function getTestItem($expanded) {
    $imgDir = ImgRoot . 'TestProduct/';
    $product = new stdClass();
    $product->productName = 'Test product';
    $product->price = 99.99;
    $product->deliveryType = 'Free UK';
    $product->stock = 9;
    $product->description = 'A hard coded test product loaded through JSON.';
    $product->thumbnail = $imgDir . 'teapot1.jpg';
    if ($expanded) {
        $product->images = array(
            $imgDir . 'teapot2.jpg',
            $imgDir . 'teapot3.jpg',
            $imgDir . 'teapot4.jpg'
        );
        $product->reviews = array(
            array("User1", 'Review 1 text'),
            array("User2", 'Review 2 text'),
            array("User3", 'Review 3 text, this is a moderate length review')
        );
    }
    header("Content-Type: application/json; charset=UTF-8");
    return(json_encode($product));
}

/**
 * Gets either the minimal or expanded data for a product.
 * Expanded includes reviews and additional images (besides the thumbnail).
 * 
 * @param {int} $productID
 * @param {boolean} $expanded
 * @return {product}
 */
function getItem($productID, $expanded) {

    if ($productID === "TestProduct") {
        return(getTestItem($expanded));
    }

    $db = new DBConnection;

    // Get basic product info (required for both minimised and expanded)
    $products = $db->select("
        SELECT " . ProductDetails . "
	FROM Product
	WHERE productID = ? 
        ", array($productID));

    if ($products == null) {
        $db->close();
        http_response_code(404); // Not found
        return("Product not found");
    }

    $products = updateThumbnailPaths($products);

    $product = $products[0];

    if ($expanded) {

        // Get images
        $product->images = getImages($productID);

        // Get reviews
        $product->reviews = $db->select("
            SELECT username, review 
            FROM Purchase 
            WHERE productID = ?
            AND review IS NOT NULL
            ", array($productID));
    }

    $db->close();
    return($product);
}

/**
 * Gets an array of all categories in the database.
 * 
 * @return {array(String)}
 */
function getCategories() {
    $query = "SELECT categoryName FROM Category";
    $db = new DBConnection;
    $categories = $db->select($query, null);
    return($categories);
}

/**
 * Gets up to $number products from a category starting from $offset.
 * 
 * @param {String} $categoryName
 * @param {integer} $offset
 * @param {integer} $number
 * @return {array(product)}
 */
function getProductsByCategory($categoryName, $offset, $number) {

    $query = "
	SELECT " . ProductDetails . "
	FROM Product, ProductCategory, Category
	WHERE Category.categoryName = ?
        AND Category.categoryID = ProductCategory.categoryID
        AND Product.productID = ProductCategory.productID
        AND Product.listed = true
	LIMIT ?, ?";
    $db = new DBConnection;
    $results = $db->select($query, array($categoryName, $offset, $number));
    $db->close();

    if ($results == null) {
        http_response_code(404); // Not found
        return("No products found");
    }

    $products = updateThumbnailPaths($results);

    return $products;
}

/**
 * Gets up to $number products matching $searchTerm starting from $offset.
 * Matches are by (in order) : product name, category, description
 * 
 * @param {String} $searchTerm
 * @param {integer} $offset
 * @param {integer} $number
 * @return {array(product)}
 */
function getProductsBySearch($searchTerm, $offset, $number) {

    // Add % for matching using SQL LIKE
    $term = "%$searchTerm%";

    $query = "
	SELECT " . ProductDetails . "
	FROM Product
        LEFT JOIN ProductCategory ON ProductCategory.productID = Product.productID
        LEFT JOIN Category ON Category.categoryID = ProductCategory.categoryID
	WHERE (productName LIKE ? 
        OR Category.categoryName LIKE ? 
        OR description LIKE ?)
        AND Product.listed = true
	LIMIT ?, ?";
    $db = new DBConnection;
    $results = $db->select($query, array($term, $term, $term, $offset, $number));
    $db->close();

    if ($results == null) {
        http_response_code(404); // Not found
        return("No products found");
    }

    $products = updateThumbnailPaths($results);

    return $products;
}

/**
 * Prepends the corisponding image directory to the thumbnail path for each
 * product or sets the thumbnail to the default image if none is set.
 * 
 * @param {array(product)} $products
 * @return {array(product)}
 */
function updateThumbnailPaths($products) {
    foreach ($products as $product) {

        $thumbnail = $product->thumbnail;

        if ($thumbnail != null) {
            $product->thumbnail = ImgRoot . $product->productID . '/' . $thumbnail;
        } else {
            $product->thumbnail = ImgRoot . "res/noImage.png";
        }
    }
    return $products;
}

/**
 * Returns the current stock for product with $productID.
 * 
 * @param {int} $productID
 * @return {int}
 */
function getStock($productID) {
    $query = "SELECT stock FROM Product WHERE productID = ?";

    $db = new DBConnection;
    $results = $db->select($query, array($productID));
    $db->close();

    $result = $results[0]->stock;

    return $result;
}

/**
 * Returns an array of all categories product with $productID is in.
 * 
 * @param {int} $productID
 * @return {array(String)}
 */
function getProductCategories($productID) {
    $query = "
        SELECT categoryName FROM Category, ProductCategory 
        WHERE productID = ? 
        AND Category.categoryID = ProductCategory.categoryID";
    $db = new DBConnection;
    $results = $db->select($query, array($productID));
    $db->close();
    return $results;
}

/**
 * Returns the ID of category with $categoryName.
 * 
 * @param {String} $categoryName
 * @return {int}
 */
function getCategoryID($categoryName) {

    $db = new DBConnection;

    $query = "SELECT categoryID FROM Category WHERE categoryName = ?";
    $results = $db->select($query, array($categoryName));

    if (sizeOf($results) === 0) {
        http_response_code(404); // Not Found
        return $results;
    }
    $result = $results[0]->categoryID;

    $db->close();
    return $result;
}

/**
 * Returns an array of the paths to all images of product with $productID.
 * 
 * @param {int} $productID
 * @return {array(String)}
 */
function getImages($productID) {
    return glob(ImgRoot . "$productID/*.*");
}

/**
 * Returns an array of objects with the properties productName and stock,
 * describing the current stock level for all products.
 * 
 * @return {array(Object)}
 */
function getAllStock() {
    $query = "
        SELECT productName, stock 
        FROM Product 
        WHERE listed = true 
        ORDER BY stock";

    $db = new DBConnection;
    $results = $db->select($query, null);
    $db->close();

    return $results;
}

/**
 * Returns an array of objects with the properties purchaseID, productName, 
 * quantity and address, describing all currently pending purchases.
 * 
 * @return {array(Object)}
 */
function getPendingPurchases() {
    $query = "
        SELECT purchaseID, productName, quantity, address 
        FROM Product, Purchase, Customer
        WHERE processed = false 
        AND Product.productID = Purchase.productID
        AND Customer.username = Purchase.username";

    $db = new DBConnection;
    $results = $db->select($query, null);
    $db->close();

    return $results;
}

/**
 * Returns the total quantity sold of product with $productID.
 * 
 * @param {int} $productID
 * @return {int}
 */
function quantitySold($productID) {
    $query = "
        SELECT SUM(quantity) AS value
        FROM Purchase
        WHERE productID = ?";

    $db = new DBConnection;
    $results = $db->select($query, array($productID));
    $db->close();

    // Return 0 if no results
    if (!isset($results[0]->value)) {
        return 0;
    } else {
        return $results[0]->value;
    }
}
