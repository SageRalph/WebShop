<!doctype html>
<html>
    <head>
        <title>WebShop - API</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="../Shared/CSS/Global.css">
        <link rel="stylesheet" href="../Shared/CSS/Infrastructure.css">
    </head>

    <body>
        
        <p class='Notification'>
            Below is the full RESTful server API.<br>
            Cells highlighted in yellow are incomplete and will return 501 not 
            implemented, these are intended as points for further expansion.
        </p>

        <table>

            <tr>
                <th>Path</th>
                <th>GET</th>
                <th>POST</th>
                <th>PUT</th>
                <th>DELETE</th>
            </tr>

            <tr>
                <td>/categories</td>
                <td>List all categories</td> 
                <td>Add new category</td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/categories/{name}</td>
                <td></td> 
                <td></td>
                <td></td>
                <td>Removes all items from and deletes category of {name}</td>
            </tr>

            <tr>
                <td>/products/category/{term}/{offset}/{number}</td>
                <td>Returns next {number} products in {category} after {offset}</td> 
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/products /search/{term}/{offset}/{number}</td>
                <td>Returns next {number} products matching {term} after {offset}</td> 
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/products</td>
                <td></td> 
                <td>Creates a new product and returns the productID</td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/products/{id} </td>
                <td>Gets full data for product with {id}</td> 
                <td></td>
                <td>Updates data for product with {id}</td> <!--should archive previous version-->
                <td>Deletes product with {id} and all associated references</td>
            </tr>

            <tr>
                <td>/products/{id}/stock</td>
                <td>Gets the current stock of product with {id}</td> 
                <td></td>
                <td>Changes the current stock of product with {id} by the given amount (can be positive or negative)</td>
                <td></td>
            </tr>
            
            <tr>
                <td>/products/{id}/images</td>
                <td>Gets all images of product with {id}</td> 
                <td>Uploads a new image of product with {id}</td>
                <td></td>
                <td></td>
            </tr>
            
            <tr>
                <td>/products/{id}/images/{fileName}</td>
                <td></td> 
                <td></td>
                <td></td>
                <td>Deletes image with {fileName} of product with {id}</td>
            </tr>

            <tr>
                <td>/products/{id}/reviews</td>
                <td></td> 
                <td class='ToDo'>Adds a review for product with {id}</td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/products/{id}/reviews/{username}</td>
                <td></td> 
                <td></td>
                <td class='ToDo'>Edits review for product with {id} by user with {username}</td>
                <td class='ToDo'>Deletes review for product with {id} by user with {username}</td>
            </tr>

            <tr>
                <td>/products/{id}/categories</td>
                <td>Gets all categories product with {id} is a member of</td> 
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/products/{id}/categories/{name}</td>
                <td></td> 
                <td>Adds product with {id} to category of {name}</td>
                <td></td>
                <td>Removes product with {id} from category of {name}</td>
            </tr>

            <tr>
                <td>/purchases</td>
                <td></td> 
                <td>Adds a new purchase and updates stock for product</td>
                <td></td>
                <td></td>
            </tr>

            <tr>
                <td>/purchases/{id}</td>
                <td></td> 
                <td></td>
                <td>Edits properties of  purchase with {id}</td>
                <td></td>
            </tr>
            
            <tr>
                <td>/purchases/pending</td>
                <td>Gets a list of the product names, quantity and delivery address for all pending purchases</td> 
                <td></td>
                <td></td>
                <td></td>
            </tr>
            
            <tr>
                <td>/stock</td>
                <td>Gets a list of the names and stock of all listed products</td> 
                <td></td>
                <td></td>
                <td></td>
            </tr>

        </table>

    </body>
</html>