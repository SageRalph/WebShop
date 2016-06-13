<!doctype html>
<html>
    <head>
        <title>WebShop</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="../Shared/CSS/Global.css">
        <link rel="stylesheet" href="../Shared/CSS/ItemBrowser.css">
        <link rel="stylesheet" href="../Shared/CSS/Navigation.css">
        <link rel="stylesheet" href="BrowserBasket.css">
        <script src='../Shared/lib/lib.js'></script>
        <script src='../Shared/lib/ItemBrowser.js'></script>
    </head>
    <body>
        <?php include '../Shared/Include/Navigation.html'; ?>
        <a class="anchor" id="Top"></a>

        <section id="RightSection">
            <?php include 'BrowserBasket.php'; ?>
        </section>

        <section id="LeftSection">
            <?php include '../Shared/Include/Display.html'; ?>
        </section>

    </body>
</html>