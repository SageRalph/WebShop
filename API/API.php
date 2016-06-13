<?php

require_once 'DBInterface.php';

include_once 'GETResponders.php';
include_once 'POSTResponders.php';
include_once 'PUTResponders.php';
include_once 'DELETEResponders.php';


// Root image directory relative to JS
define('ImgRoot', '../API/Images/');


// Removes URL encoding from string (eg. %20 for spaces)
$fullURI = urldecode(getenv('REQUEST_URI'));


//URI starts with /API/ so uri[0] = "" and uri[1] = "API"
$uri = array_slice(explode("/", $fullURI), 3); //array representing URI

$method = getenv('REQUEST_METHOD');
$response = null;
$requestBody;

if ($method === "POST" || $method === "PUT") {
    $requestBody = json_decode(file_get_contents('php://input'));
}


if ($uri[0] === "categories") {

    if (count($uri) === 1) {
        //URI format /categories/
        if ($method === "GET") {
            $response = getCategories();
        } elseif ($method === "POST") {
            $response = addCategory($requestBody);
        }
    }

    //URI format /categories/$name
    elseif (count($uri) === 2 && $method === "DELETE") {
        $response = deleteCategory($uri[1]);
    }
} elseif ($uri[0] === "products") {
    switch (count($uri)) {
        case 1:

            //URI format /products
            if ($method === "POST") {
                $response = addProduct($requestBody);
            }

            break;
        case 2:

            //URI format /products/$id
            if ($method === "GET") {
                $response = getItem($uri[1], true);
            } elseif ($method === "PUT") {
                $response = editProduct($uri[1], $requestBody);
            } elseif ($method === "DELETE") {
                $response = deleteProduct($uri[1]);
            }

            break;
        case 3:

            //URI format /products/$id/reviews
            if ($uri[2] === "reviews" && $method === "POST") {
                $response = addReview($uri[1], $requestBody);
            }

            //URI format /products/$id/images
            elseif ($uri[2] === "images") {
                if ($method === "GET") {
                    $response = getImages($uri[1]);
                } elseif ($method === "POST") {
                    $response = addImage($uri[1], $requestBody);
                }
            }

            //URI format /products/$id/stock
            elseif ($uri[2] === "stock") {
                if ($method === "GET") {
                    $response = getStock($uri[1]);
                } elseif ($method === "PUT") {
                    $response = addStock($uri[1], $requestBody);
                }
            }

            //URI  format /products/$id/categories
            elseif ($uri[2] === "categories") {
                if ($method === "GET") {
                    $response = getProductCategories($uri[1]);
                } elseif ($method === "POST") {
                    $response = addToCategory($uri[1], $requestBody);
                }
            }

            break;
        case 4:

            //URI format /products/$id/reviews/$username  
            if ($uri[2] === "reviews") {
                if ($method === "PUT") {
                    $response = editReview($uri[1], $uri[3], $requestBody);
                } elseif ($method === "DELETE") {
                    $response = deleteReview($uri[1], $uri[3]);
                }
            }

            //URI format /products/$id/categories/$name
            elseif ($uri[2] === "categories" && $method === "DELETE") {
                $response = removeFromCategory($uri[1], $uri[3]);
            }

            //URI format /products/$id/images/$fileName
            elseif ($uri[2] === "images" && $method === "DELETE") {
                $response = deleteImage($uri[1], $uri[3]);
            }
            break;

        case 5:

            //URI format /products/category/$term/$offset/$number
            if ($uri[1] === "category") {
                if ($method === "GET") {
                    $response = getProductsByCategory($uri[2], $uri[3], $uri[4]);
                }
            }

            //URI format /products/search/$term/$offset/$number
            elseif ($uri[1] === "search") {
                if ($method === "GET") {
                    $response = getProductsBySearch($uri[2], $uri[3], $uri[4]);
                }
            }

            break;
    }
} elseif ($uri[0] === "purchases") {

    //URI format /purchases
    if (count($uri) === 1) {
        if ($method === "POST") {
            $response = addPurchase($requestBody);
        }
    } elseif (count($uri) === 2) {

        //URI format /purchases/pending
        if ($uri[1] === "pending") {
            if ($method === "GET") {
                $response = getPendingPurchases();
            }
        }
        //URI format /purchases/$id
        else if ($method === "PUT") {
            $response = editPurchase($uri[1], $requestBody);
        }
    }
} elseif ($uri[0] === "stock") {

    //URI format /stock
    if (count($uri) === 1) {
        if ($method === "GET") {
            $response = getAllStock();
        }
    }
}

if ($response === null) {
    header("Content-Type:text/plain; charset=UTF-8");
    echo "Invalid request!";
} else {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($response);
}    