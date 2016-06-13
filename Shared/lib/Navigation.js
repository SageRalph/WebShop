
/**
 * Displays a notification with the given text and ID in the item browser.
 * If the ID is 'header' it will instead replace the current header.
 * 
 * @param {String} text
 * @param {String} id
 */
function displayNotification(text, id) {
    var note = document.createElement('section');
    note.className = 'Notification';
    note.innerHTML = text;
    if (id === 'header') {
        // Replace header
        var header = getElem('header');
        header.innerHTML = "";
        header.appendChild(note);
    }
    else {
        // Insert into Display
        note.id = id;
        getElem('Display').appendChild(note);
    }
}

/**
 * Gets a list of categories from the server and then displayes them in the 
 * navigation menu.
 */
function getCategories() {
    // Get categories from server
    ajax("GET", "categories", null, displayCategories);
}
function displayCategories(categoryNames) {

    // Clear existing
    getElem('tabs').innerHTML = "";

    // Add new
    categoryNames.forEach(function (element) {
        var name = element.categoryName;
        addNavTab(name, function () {
            // On click, search by category
            getProductsByTerm("category", name, 0, true);
        });
    });
    addSearchTab();
}

/**
 * Adds a search tab to the navigation bar.
 */
function addSearchTab() {
    addNavTab("Search");
    var searchTab = getElem('Search');
    var searchBox = newElem('input', null, "Search", null);

    searchBox.onchange = function () {
        getProductsByTerm("search", searchBox.value, 0, true);
    };
    var searchBtn = newBtn("Search", function () {
        getProductsByTerm("search", searchBox.value, 0, true);
    });

    searchTab.appendChild(searchBox);
    searchTab.appendChild(searchBtn);
}


/**
 * Creates a new tab and adds it to the navigation bar.
 * 
 * @param {String} name
 */
function addNavTab(name, action) {

    if (debug) {
        console.log('Adding navigation tab ' + name);
    }

    var container = newElem('li');
    var tab = newElem('a');
    tab.id = name;

    // Display name (search tab should have no text)
    if (name !== "Search") {
        tab.textContent = name;
    }

    // Action on click
    tab.onclick = function () {
        selectTab(tab);

        if (isSet(action)) {
            displayNotification("Loading...","header");
            action();
        }
    };

    container.appendChild(tab);
    getElem('tabs').appendChild(container);
}

/**
 * Makes the given tab the selected tab. The previous tab will no longer be 
 * selected.
 * 
 * @param {a} tab
 */
function selectTab(tab) {

    if (debug) {
        console.log("");
        console.log('Clicked on tab ' + tab.id);
    }
    //deselect previous tab
    var currentTab = getElem('currentTab');
    if (currentTab !== null) {
        currentTab.id = null;
    }
    //set current tab to list item containing this
    tab.parentNode.id = "currentTab";
}

/**
 * Resets the display by removing all items from the Display and removing 
 * the footer.
 */
function clearDisplay() {
    getElem("footer").innerHTML = "";
    getElem('Display').innerHTML = "";
}