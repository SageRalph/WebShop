<?php

/**
 * Creates a new category with the name provided.
 * 
 * @param {String} $data
 * @return {boolean}
 */
function addCategory($data) {

    // Check if already exists
    if (sizeOf(getCategoryID($data)) !== 0) {
        http_response_code(500); // Internal Server Error
        return "Category already exists";
    } else {
        http_response_code(200); // OK
    }

    $query = "INSERT INTO Category (categoryName) VALUES (?)";
    $db = new DBConnection;
    $result = $db->run($query, array($data));
    $db->close();

    return $result;
}

/**
 * Creates a new product listing. 
 * The $data parameter is optional, if not set, default properties will be used.
 * Otherwise, $data should be an object including the properties:
 * {listed, productName, price, deliveryType, stock, description, thumbnail}
 * 
 * @param {Object} $data
 * @return {String}
 */
function addProduct($data) {

    if (!isSet($data)) {
        $data = defaultProduct();
    }

    $details = [];
    foreach (get_object_vars($data) as $value) {
        $details[] = $value;
    }

    $query = "INSERT INTO 
        Product (listed, productName, price, deliveryType, stock, description, thumbnail)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
    $db = new DBConnection;
    $result = $db->run($query, $details);

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
        $db->close();
        return $result;
    }

    // Get productID of new product
    $result = $db->lastID();
    $db->close();

    return $result;
}

/**
 * Creates a product object with default values.
 * 
 * @returns {Object}
 */
function defaultProduct() {
    $product = new stdClass();
    $product->listed = false;
    $product->productName = "Enter product name";
    $product->price = 0;
    $product->deliveryType = "Choose pricing";
    $product->stock = 0;
    $product->description = "Enter a description for this product.";
    $product->thumbnail = null;
    return $product;
}

/**
 * Records a new purchase. 
 * $data should be an object including the properties {productID, username, quantity}
 * 
 * @param {Object} $data
 * @return {String}
 */
function addPurchase($data) {
    // TODO needs to validate
    $productID = $data->productID;
    $quantity = $data->quantity;


    // Ensure quantity can be supplied and update database
    $result = addStock($productID, (0 - $quantity));

    if ($result === "Success") {

        // Create purchase
        $query = "
        INSERT INTO Purchase (productID, username, quantity, processed)
        VALUES (?, ?, ?, false)";

        $db = new DBConnection;
        $result = $db->run($query, array($data->productID, $data->username, $data->quantity));
        $db->close();
    }

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }
    return $result;
}

/**
 * Adds product with $productID to category of name $categoryName
 * 
 * @param {int} $productID
 * @param {String} $categoryName
 * @return {String}
 */
function addToCategory($productID, $categoryName) {

    $categoryID = getCategoryID($categoryName);

    if (!is_numeric($categoryID)) {
        return $categoryID;
    }


    $db = new DBConnection;
    $query = "INSERT INTO ProductCategory VALUES (?, ?)";
    $result = $db->run($query, array($productID, $categoryID));
    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }
    return $result;
}

/**
 * Creates file with $image data in the folder for product with $productID.
 * $image should be an array of the form [filename, base64 encoded image data]
 * Images with duplicate names will be renamed automatically.
 * (eg. image.png, image(0).png, image(1).png, ....)
 * 
 * @param {int} $productID
 * @param {array} $image
 * @return {String}
 */
function addImage($productID, $image) {

    $fileName = $image[0];
    $imageFile = base64_decode($image[1]);

    $imageDir = ImgRoot . "$productID/";
    $filePath = $imageDir . $fileName;

    $fileType = pathinfo($filePath, PATHINFO_EXTENSION);


    // Restrict file format
    if (!in_array($fileType, ["jpg", "jpeg", "png", "gif"])) {
        http_response_code(415);
        return "Only JPG, JPEG, PNG & GIF files allowed, recieved $fileType";
    }

    // Create directory if not exists
    if (!file_exists($imageDir)) {
        mkdir($imageDir, 0777, true);
    }


    // Check if file already exists
    if (file_exists($filePath)) {

        $fileNoExtension = rtrim($filePath, ".$fileType");
        $newName = $filePath;

        $i = 0; // Find index to append to filename
        while (file_exists($newName)) {
            $newName = "$fileNoExtension($i).$fileType";
            $i++;
        }
        $filePath = $newName;
    }

    file_put_contents($filePath, $imageFile);
    return "Image uploaded successfully";
}

/**
 * Adds a review containing $data for product with $productID.
 * 
 * @param {int} $productID
 * @param {Object} $data
 * @return {String}
 */
function addReview($productID, $data) {
    //TODO
    http_response_code(501); // Not Implemented
    return "'add review' not implemented yet";
}
