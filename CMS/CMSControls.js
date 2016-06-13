

window.addEventListener('load', function () {
    setMode("CMS");
});

/**
 * Displays an editing form for {product}.
 * 
 * @param {Object} product
 */
function editItem(product) {

    // Setup editor
    var container = document.createElement('article');
    container.className = "ListedProduct EditingProduct";

    // Create fields
    var nameIn = newEditField("Product name", product.productName);
    var stockIn = newEditField("Stock", product.stock);
    stockIn.id = "stockDisplay"; // To show updates made via stock manager
    var priceIn = newEditField("Price", product.price);
    var deliveryIn = newEditField("Delivery type", product.deliveryType);
    var descIn = newElem('textarea', null, "Product description", product.description);

    // Thumbnail
    container.innerHTML = "<img id='thumb' class='ProductThumbnail' src='" + product.thumbnail + "'>";

    // Product name
    var name = newElem('h1');
    name.appendChild(nameIn);
    container.appendChild(name);

    // Product details
    var details = newElem('ul', 'ProductDetailsList');
    appendDetailInput(details, 'Stock ', stockIn);
    appendDetailInput(details, 'Price £', priceIn);
    appendDetailInput(details, 'Delivery: ', deliveryIn);
    container.appendChild(details);

    // Description
    var description = newElem('p');
    description.appendChild(descIn);
    container.appendChild(description);


    // Save button
    var save = newBtn("Save", function () {
        // Save only changed values
        var changes = new Object();
        if (nameIn.value !== product.productName) {
            changes.productName = nameIn.value;
        }
        if (stockIn.value !== product.stock) {
            changes.stock = stockIn.value;
        }
        if (deliveryIn.value !== product.deliveryType) {
            changes.deliveryType = deliveryIn.value;
        }
        if (priceIn.value !== product.price) {
            changes.price = priceIn.value;
        }
        if (descIn.value !== product.description) {
            changes.description = descIn.value;
        }
        saveChanges(product.productID, changes);
    });
    save.className = "ThreeButton";


    // Cancel button
    var cancel = newBtn("Cancel", function () {
        // Reset display then show unmodified product
        clearDisplay();
        displayNotification('\
            Changes not saved.<br>\
            Current state of the product is shown below.', 'header');
        toggleBrowserItem(createBrowserItem(product.productID));
    });
    cancel.className = "ThreeButton";


    // Unlist button
    var unlist = newBtn("Remove listing for this product", function () {
        log("");
        log("Unlisting " + product.productName);

        // Send unlist request
        var uri = "products/" + product.productID;
        ajax("PUT", uri, {listed: false}, unlistResponse, product.productName);
    });
    unlist.className = "ThreeButton";


    // Combine
    container.appendChild(save);
    container.appendChild(cancel);
    container.appendChild(unlist);
    attatchImageManager(container, product);
    attatchCategoryManager(container, product.productID);
    attachStockManager(container, product.productID);


    // Display
    clearDisplay();
    displayNotification("\
    All purple text is editable. <br>\
    No changes will be made until the save button is pressed. <br>\
    Press cancel at any time to discard your changes.", 'header');
    getElem('Display').appendChild(container);
}

/**
 * Creates a new editing field with {placeholder} text and intial {value}.
 * 
 * @param {String} placeholder
 * @param {String} value
 * @returns {input}
 */
function newEditField(placeholder, value) {
    return newElem("input", "EditField", placeholder, value);
}

/**
 * Appends an li containing both the {text} and {input} field provided to
 * the {parent} container.
 * 
 * @param {element} parent
 * @param {String} text
 * @param {input} input
 */
function appendDetailInput(parent, text, input) {
    var detail = newElem('li');
    detail.appendChild(document.createTextNode(text));
    detail.appendChild(input);
    parent.appendChild(detail);
}

/**
 * Displays a notification regarding the success or failure of unlisting 
 * a product.
 * 
 * @param {String} response
 * @param {int} status
 * @param {String} productName
 */
function unlistResponse(response, status, productName) {
    clearDisplay();
    if (status === 200) {
        // Reset display then show notification
        displayNotification("Unlist sucessful, '" + productName +
                "' will no longer be listed for purchase or editing.", "header");
    } else {
        displayNotification(response, "header");
    }
}

/**
 * Saves a collection of {changes} to product with {productID}. Then reloads 
 * the editor with the new representation of the product.
 * {changes} should be an object with keys relating to the products field names.
 * Only the specified fields will be changed.
 * 
 * @param {int} productID
 * @param {Object} changes
 */
function saveChanges(productID, changes) {
    if (changes === null) { // Don't send empty requests
        return;
    }

    // Products should always be listed after editing
    changes.listed = true;

    log("");
    log("Sending edit request");

    // Save changes
    ajax("PUT", "products/" + productID, changes);

    // Show in product editor
    ajax("GET", "products/" + productID, null, editItem);
}

/**
 * Posts a new default product to the server.
 */
function createProduct() {
    log("");
    log("Creating product");

    // Create new
    ajax("POST", "products", null, function (productID) {
        // Get for editing
        ajax("GET", "products/" + productID, null, function (product) {
            editItem(product);
        });
    });
}

/**
 * Appends an image manager for {product} to {parent}.
 * 
 * @param {section} parent
 * @param {Object} product
 */
function attatchImageManager(parent, product) {

    // Current images
    var imageContainer = newElem("section", "Images");
    imageContainer.id = 'imageList';

    // Display
    var container = newElem("section", "ManagerPanel ImageManager");
    container.innerHTML = "\
        <h1>Images</h1>                                                     \
        <p>Select an image for additional options or click 'Upload Image'   \
        to upload more images for this product.</p>";

    container.appendChild(imageContainer);
    appendImageUploadControls(container, product.productID);
    appendSingleImageControls(container, product.productID);

    parent.appendChild(container);
    displayImages(product.images, 200, imageContainer);
}

/**
 * Displays a response to uploading an image to the server and refreshes the 
 * displayed images on the image editor.
 * 
 * @param {String} response
 * @param {int} status
 * @param {int} productID
 */
function imageUploadResponse(response, status, productID) {
    // Display server response in image preview container
    getElem("imageUploadPreview").innerHTML = "<p>" + response + "</p>";

    // Reload image display
    var uri = "products/" + productID + "/images";
    ajax('GET', uri, null, displayImages, getElem('imageList'));
}

/**
 * Sets the thumbnail for product with {productID} to {src}, then 
 * refreshes the displayed thumbnail on the editor.
 * 
 * @param {int} productID
 * @param {String} src
 */
function changeThumbnail(productID, src) {
    var data = {thumbnail: src};
    ajax("PUT", "products/" + productID, data, getThumbnail, productID);
}

/**
 * Refreshed the thumbnail displayed in the editor to that stored for product 
 * with {productID} on the server.
 * Parameters {r} and {s} are unused placeholders.
 * 
 * @param {String} r
 * @param {int} s
 * @param {int} productID
 */
function getThumbnail(r, s, productID) {
    log("");
    log("Refreshing displayed thumbnail");

    // Get from server
    ajax("GET", "products/" + productID, null, function (product) {
        // Display
        getElem('thumb').src = product.thumbnail;
    });
}

/**
 * Returns the file name (and extension) of the currently selected image in 
 * the image selector on the image manager.
 * 
 * @returns {String}
 */
function selectedFileName() {
    var filePath = getElem('selectedImage').src;
    return filePath.split('/').pop();
}

/**
 * Appends editing controls for a single image of product with {productID} 
 * to the {parent} container. Including 'Delete image' and 'Make thumbnail' buttons.
 * 
 * @param {section} parent
 * @param {int} productID
 */
function appendSingleImageControls(parent, productID) {
    var container = newElem('section', 'hidden');
    container.id = 'singleImageControls';

    // Make thumbnail button
    container.appendChild(newBtn("Use this image\nas product thumbnail", function () {
        // Send update request
        changeThumbnail(productID, selectedFileName());
    }));


    // Delete image button
    container.appendChild(newBtn("Remove\nthis image", function () {

        // Send delete request
        var deluri = "products/" + productID + "/images/" + selectedFileName();
        ajax("DELETE", deluri, null, function () {

            // Reload image display
            var geturi = "products/" + productID + "/images";
            ajax('GET', geturi, null, displayImages, getElem('imageList'));
        });

        // Check if deleted image is thumbnail
        if (getElem('selectedImage').src === getElem('thumb').src) {

            // Remove thumbnail pointer to deleted image
            changeThumbnail(productID, null);
        }
    }));

    parent.appendChild(container);
}


/**
 * Displays the images provided in the container provided along with an 
 * 'Upload Image' icon which when clicked unhides editing controls. 
 * Clicking on any other image in the container will hide upload controls 
 * and instead show controls relating to that image. 
 * images should be an array of image src values.
 * 
 * @param {array(String)} images
 * @param {int} status
 * @param {section} imageContainer
 */
function displayImages(images, status, imageContainer) {
    log("");
    log("Displaying images");
    log(images);

    // Reset
    imageContainer.innerHTML = "";


    // Display 'UPLOAD IMAGE' image
    var uploadImage = clickableImage('../API/Images/res/uploadImage.png',
            function () {
                // Hide single image controls
                getElem('singleImageControls').className = 'controls hidden';

                // Unhide upload controls
                getElem('imageUploadControls').className = 'controls';
            });
    uploadImage.id = 'selectedImage';
    imageContainer.appendChild(uploadImage);


    // Display product images
    for (var i = 0; i < images.length; i++) {

        imageContainer.appendChild(clickableImage(images[i], function () {
            // Hide upload controls
            getElem('imageUploadControls').className = 'controls hidden';

            // Show single image controls
            getElem('singleImageControls').className = 'controls';
        }));
    }
}

/**
 * Returns an img DOM element that can be selected. Only one clickable image 
 * can be selected at a time. When the image is clicked, the action will be run.
 * 
 * @param {String} src
 * @param {Function} action
 * @returns {img}
 */
function clickableImage(src, action) {
    var image = newElem('img');
    image.src = src;
    image.onclick = function () {
        // Make this the selected image
        selectImage(this);
        action();
    };
    return image;
}

/**
 * Makes the given image the selected image. The previous image will no longer
 * be selected.
 * 
 * @param {img} image
 */
function selectImage(image) {
    log("");
    log('Clicked on image ' + image.src);

    // Deselect previous image
    var currentTab = getElem('selectedImage');
    if (currentTab !== null) {
        currentTab.id = null;
    }
    // Select the new image
    image.id = "selectedImage";
}

/**
 * Appends image upload controls for product with {productID} to {parent}.
 * 
 * @param {section} parent
 * @param {int} productID
 */
function appendImageUploadControls(parent, productID) {

    var previewText = "<p>Image to be uploaded:</p>";
    var encodedImage;

    // Image preview
    var preview = newElem('section', 'right');
    preview.id = "imageUploadPreview";
    preview.innerHTML = previewText;

    // File selector
    var imageInput = newElem('input');
    imageInput.type = 'file';
    imageInput.onchange = function () {

        encodedImage = null;
        var file = imageInput.files[0];

        if (file.type.match(/image.*/)) { // Check if actual image
            log("");
            log("Image selected for upload:");
            log(file.name);

            var reader = new FileReader();
            reader.onloadend = function () {

                // Get image data
                encodedImage = reader.result;

                // Show preview
                preview.innerHTML = previewText + "<img src='" + encodedImage + "'>";

            };
            reader.readAsDataURL(file);

        } else {
            preview.innerHTML = previewText + "<p>File not supported!</p>";
        }
    };

    // Upload button
    var upload = newBtn("Upload image", function () {
        if (encodedImage !== null) {

            var image = encodedImage.split(",");
            encodedImage = null;
            var fileName = imageInput.files[0].name;

            log("Uploading image: " + fileName);

            // Send to server
            var uri = "products/" + productID + "/images";
            ajax("POST", uri, [fileName, image[1]], imageUploadResponse, productID);

        } else {
            log("No image selected");
            preview.innerHTML = previewText + "<p>No image selected</p>";
        }
    });

    // Display

    var left = newElem('section', "left");
    left.innerHTML = '<p>Select an image to upload</p>';
    left.appendChild(imageInput);
    left.appendChild(upload);

    var controls = newElem('section', 'controls');
    controls.id = 'imageUploadControls';
    controls.appendChild(left);
    controls.appendChild(preview);

    parent.appendChild(controls);
}

/**
 * Attatches stock managing controls to the parent container.
 * 
 * @param {section} parentContainer
 * @param {int} productID
 */
function attachStockManager(parentContainer, productID) {

    var container = newElem("section", "ManagerPanel stockManager");
    container.innerHTML = "<h1>Stock</h1>";

    // Current stock display
    var stockContainer = newElem('p');
    stockContainer.id = "currentStock";
    updateStockDisplay(productID);

    // Value input
    var change = newElem("input", null, "Amount");
    change.id = "alterStock";

    // Add/subtract buttons
    var add = newBtn("Add amount to stock", function () {
        updateStock(productID, change.value);
    });
    var subtract = newBtn("Subtract amount from stock", function () {
        updateStock(productID, 0 - parseInt(change.value));
    });

    change.className = "ThreeButton";
    add.className = "ThreeButton";
    subtract.className = "ThreeButton";

    // Combine
    container.appendChild(stockContainer);
    container.appendChild(subtract);
    container.appendChild(change);
    container.appendChild(add);
    parentContainer.appendChild(container);
}

/**
 * Updates stock for product with {productID} by {amount}.
 * {amount} can be either positive or negative.
 * 
 * @param {int} productID
 * @param {int} amount
 */
function updateStock(productID, amount) {
    log("");
    log("Sending stock update");

    var uri = "products/" + productID + "/stock";
    ajax("PUT", uri, amount, function () {
        updateStockDisplay(productID);
        getElem('alterStock').value = "";
    });
}

/**
 * Gets the current stock value for product with {productID} and displays it in
 * the 'current stock' display.
 * 
 * @param {int} productID
 */
function updateStockDisplay(productID) {
    var uri = "products/" + productID + "/stock";
    ajax("GET", uri, null, function (stock) {
        getElem('currentStock').innerHTML = "Current Stock for this product: " + stock;
        getElem("stockDisplay").value = stock;
    });
}

/**
 * Attaches category managing controls for product with {productID} 
 * to {parent} container.
 * 
 * @param {section} parent
 * @param {int} productID
 */
function attatchCategoryManager(parent, productID) {
    var manager = newElem("section", "CategoryManager");
    manager.innerHTML = "<h1>Categories</h1>";

    // Selected categories
    var left = newElem('section', 'left');
    left.innerHTML = "<h2>Selected categories</h2>";
    left.appendChild(swappingSelect('selectedCats', 'availableCats', productID, removeFromCategory));

    // Available categories
    var right = newElem('section', 'right');
    right.innerHTML = "<h2>Available categories</h2>";
    right.appendChild(swappingSelect('availableCats', 'selectedCats', productID, addToCategory));

    // Transfer buttons
    var mid = newElem('section', 'mid');
    mid.appendChild(newBtn('<<', function () {
        moveSelected('availableCats', 'selectedCats', addToCategory, productID);
    }));
    mid.appendChild(newBtn('>>', function () {
        moveSelected('selectedCats', 'availableCats', removeFromCategory, productID);
    }));

    // Combine
    manager.appendChild(left);
    manager.appendChild(mid);
    manager.appendChild(right);
    parent.appendChild(manager);

    // Get data
    getProductCategories(productID);
}

/**
 * Creates an HTML select element with {id} for which when an option is double 
 * clicked, it is transfered to another select with {partnerID} and the 
 * {action} function is run with {productID} as a parameter.
 * 
 * @param {String} id
 * @param {String} partnerID
 * @param {int} productID
 * @param {function} action
 * @returns {select}
 */
function swappingSelect(id, partnerID, productID, action) {
    var select = newElem('select');
    select.id = id;
    select.multiple = true;
    select.ondblclick = function () { // Double click transfers selected
        moveSelected(id, partnerID, action, productID);
    };
    return select;
}

/**
 * Moves the selected option from select with {sourceID} to select with 
 * {destinationID}, then runs the {action} function with {parmas} as 
 * a parameter.
 * 
 * @param {String} sourceID
 * @param {String} destinationID
 * @param {function} action
 * @param {Object} params
 */
function moveSelected(sourceID, destinationID, action, params) {
    var source = getElem(sourceID);
    var destination = getElem(destinationID);
    var selected = source.value;
    source.remove(source.selectedIndex);
    destination.innerHTML += "<option>" + selected + "</option>";
    action(params, selected);
}

/**
 * Asynchronosly gets all categories product with {productID} is in.
 * 
 * @param {int} productID
 */
function getProductCategories(productID) {
    log("");
    log("Getting data for product category manager");

    // Get product categories
    var uri = "products/" + productID + "/categories";
    ajax("GET", uri, null, function (productCategories) {

        // Get all categories
        var uri = "categories";
        ajax("GET", uri, null, displayProductCategories, productCategories);
    });
}
/**
 * Displays all categories a product is currently in and all the avalible 
 * categories it can be put in on the category manager.
 * 
 * @param {array(String)} allCategories
 * @param {int} status
 * @param {array(String)} productCategories
 */
function displayProductCategories(allCategories, status, productCategories) {

    // List current categories
    var current = "";
    productCategories.forEach(function (elem) {
        current += "<option>" + elem.categoryName + "</option>";
    });
    getElem('selectedCats').innerHTML = current;

    // Filter to get only categories product is not in
    var availableCategories = filterCategories(allCategories, productCategories);

    // List available categories
    var availible = "";
    availableCategories.forEach(function (elem) {
        availible += "<option>" + elem.categoryName + "</option>";
    });
    getElem('availableCats').innerHTML = availible;
}
/**
 * Returns a filtered list of categories which were in {source} but not {toRemove}.
 *  
 * @param {array(Object)} source
 * @param {array(Object)} toRemove
 * @returns {array(Object)}
 */
function filterCategories(source, toRemove) {
    var results = [];
    source.forEach(function (elem) {
        var keep = true;
        toRemove.forEach(function (elem2) {
            if (elem.categoryName === elem2.categoryName) {
                keep = false;
            }
        });
        if (keep) {
            results.push(elem);
        }
    });
    return results;
}

/**
 * Adds product with {productID} to category with {categoryName}.
 * 
 * @param {int} productID
 * @param {String} categoryName
 */
function addToCategory(productID, categoryName) {
    log("");
    log("Adding product to category");

    ajax("POST", "products/" + productID + "/categories", categoryName);
}

/**
 * Removes product with {productID} from category with {categoryName}.
 * 
 * @param {int} productID
 * @param {String} categoryName
 */
function removeFromCategory(productID, categoryName) {
    log("");
    log("Removing product from category");

    ajax("DELETE", "products/" + productID + "/categories/" + categoryName);
}

/**
 * Refreshes the displayed list of all categories on the allCategories manager.
 */
function updateCatList() {
    log("updating category list");

    ajax("GET", "categories", null, function (catNames) {

        getElem('alterCat').value = "";
        var list = getElem('catList');

        list.innerHTML = "";

        catNames.forEach(function (element) {
            var elem = newElem('li');
            elem.innerHTML = element.categoryName;
            elem.onclick = function () {
                getElem('alterCat').value = element.categoryName;
            };
            list.appendChild(elem);
        });

        //reload nav bar
        getCategories();
    });
}

/**
 * Displays the allCategories manager which allows creation and deletion 
 * of categories.
 */
function manageAllCategories() {

    clearDisplay();

    displayNotification("\
        All categories are listed below.<br>\
        To delete a category, enter it's name and click delete.<br>\
        To create a new category, enter it's name an click create.", 'header');

    var container = newElem('article', "ListedProduct Manager");
    container.innerHTML = "<h1>Manage Categories</h1>";


    var catList = newElem('ul');
    catList.id = "catList";
    updateCatList();

    var change = newElem("input", "ThreeButton", "Category name");
    change.id = "alterCat";

    container.appendChild(catList);
    container.appendChild(change);


    var add = newBtn("Create category", function () {
        createCategory(change.value);
    });
    add.className = 'ThreeButton';
    container.appendChild(add);

    var remove = newBtn("Delete category", function () {
        deleteCategory(change.value);
    });
    remove.className = 'ThreeButton';
    container.appendChild(remove);

    getElem('Display').appendChild(container);
}

/**
 * Creates a new category with {categoryName}.
 * 
 * @param {String} categoryName
 */
function createCategory(categoryName) {
    ajax("POST", "categories", categoryName, updateCatList);
}

/**
 * Deletes category of {categoryName}.
 * 
 * @param {String} categoryName
 */
function deleteCategory(categoryName) {
    ajax("DELETE", "categories/" + categoryName, null, updateCatList);
}