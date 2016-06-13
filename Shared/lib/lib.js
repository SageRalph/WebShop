
var debug = false; // Whether debug information should be output to the console

/**
 * Outputs text to the console only if in debug mode.
 * @param {type} text
 * @returns {undefined}
 */
function log(text) {
    if (debug) {
        console.log(text);
    }
}

/**
 * Alius for docuemnt.getElementByID
 * 
 * @param {String} id
 * @returns {Element}
 */
function getElem(id) {
    return document.getElementById(id);
}

/**
 * Removes element with {id} from the DOM.
 * 
 * @param {String} id
 */
function removeElem(id) {
    var elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
}

/**
 * Creates a new DOM element with the given properties.
 * 
 * @param {String} type
 * @param {String} className
 * @param {String} placeholder
 * @param value
 * @returns {Element}
 */
function newElem(type, className, placeholder, value) {
    var elem = document.createElement(type);

    if (isSet(className)) {
        elem.className = className;
    }

    if (isSet(placeholder)) {
        elem.placeholder = placeholder;
    }

    if (isSet(value)) {
        elem.value = value;
    }

    return elem;
}

/**
 * Creates a new input[type=submit] with the given display text and action.
 * 
 * @param {String} name
 * @param {function} action
 * @returns {input}
 */
function newBtn(name, action) {
    var button = document.createElement("input");
    button.type = "submit";
    button.value = name;
    button.onclick = action;
    return button;
}

/**
 * Determins whether a variable is both defined and not null.
 * 
 * @param {Object} variable
 * @returns {Boolean}
 */
function isSet(variable) {
    return 'undefined' !== typeof variable && variable !== null;
}

/**
 * Sends an ajax request of type {mode} to {uri} with payload {data}, 
 * then calls {callback} with the response, request status and {parameters}.
 * If {data} is null or undefined, the request will be sent with no payload.
 * 
 * @param {String} mode
 * @param {String} uri
 * @param {Object} data
 * @param {Function} callback
 * @param {Object} parameters
 */
function ajax(mode, uri, data, callback, parameters) {
    log(mode + " " + uri);

    var request = new XMLHttpRequest();
    request.onload = function () {
        log("Status: " + request.status);

        if (isSet(callback)) {
            try {
                var response = JSON.parse(request.responseText);
                callback(response, request.status, parameters);
            } catch (e) {
                log("Couldn't parse response!");
                log("Recieved: " + request.responseText);
            }
        }
    };
    request.open(mode, uri, true);
    request.setRequestHeader('Content-Type', 'application/json');

    if (isSet(data)) {
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
}