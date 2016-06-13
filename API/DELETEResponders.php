<?php

/**
 * Removes all products from, then deletes category of $categoryName.
 * 
 * @param {String} $categoryName
 * @return {String}
 */
function deleteCategory($categoryName) {
    $categoryID = getCategoryID($categoryName);

    if (!is_numeric($categoryID)) {
        return $categoryID;
    }


    $db = new DBConnection;

    $query = "
        DELETE FROM ProductCategory
        WHERE categoryID = ?";
    $result = $db->run($query, array($categoryID));

    $query = "
        DELETE FROM Category
        WHERE categoryID = ?";
    $result = $db->run($query, array($categoryID));

    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }

    return $result;
}

/**
 * Removes product with $productID from category of $categoryName.
 * 
 * @param {int} $productID
 * @param {String} $categoryName
 * @return {String}
 */
function removeFromCategory($productID, $categoryName) {

    $categoryID = getCategoryID($categoryName);

    if (!is_numeric($categoryID)) {
        return $categoryID;
    }


    $db = new DBConnection;
    $query = "DELETE FROM ProductCategory WHERE productID = ? AND categoryID = ?";
    $result = $db->run($query, array($productID, $categoryID));
    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }
    return $result;
}

/**
 * Deletes image of product with $productID of name $fileName.
 * 
 * @param {int} $productID
 * @param {String} $fileName
 * @return {String}
 */
function deleteImage($productID, $fileName) {

    if (unlink(ImgRoot . "$productID/$fileName")) {

        return "Successfully deleted $fileName";
    } else {

        http_response_code(500); // Internal Server Error
        return "Failed to delete $fileName";
    }
}

/**
 * Deletes all images of product with $productID and it's image directory.
 * 
 * @param {int} $productID
 * @return {String}
 */
function deleteAllImages($productID) {

    $imgDir = ImgRoot . $productID;

    if (file_exists($imgDir)) {

        // Delete all images of product
        $images = getImages($productID);
        foreach ($images as $filePath) {
            unlink($filePath);
        }
        // Delete products image directory
        unlink($imgDir);
    }
}

/**
 * Deletes product with $productID and all associated images, 
 * reviews and purchases.
 * 
 * @param {int} $productID
 * @return {String}
 */
function deleteProduct($productID) {

    deleteAllImages($productID);

    $db = new DBConnection;

    $query = "
        DELETE FROM Purchase
        WHERE Product.productID = ?";
    $result = $db->run($query, array($productID));

    $query = "
        DELETE FROM ProductCategory
        WHERE Product.productID = ?";
    $result = $db->run($query, array($productID));

    $query = "
        DELETE FROM Product
        WHERE Product.productID = ?";
    $result = $db->run($query, array($productID));

    $db->close();

    if ($result !== "Success") {
        http_response_code(500); // Internal Server Error
    }

    return $result;
}

/**
 * Deletes review of product with $productID by user with $username.
 * 
 * @param {int} $productID
 * @param {String} $username
 * @return {String}
 */
function deleteReview($productID, $username) {
    //TODO
    http_response_code(501); // Not Implemented
    return "'delete review' not implemented yet";
}
