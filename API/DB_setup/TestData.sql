-- username, address	
INSERT INTO Customer VALUES ('Test User 1', 'Test Address 1');
INSERT INTO Customer VALUES ('Test User 2', 'Test Address 2');
INSERT INTO Customer VALUES ('Test User 3', 'Test Address 3');
INSERT INTO Customer VALUES ('Test User 4', 'Test Address 4');
-- categoryName
INSERT INTO Category (categoryName)	VALUES ('Test category 1');
INSERT INTO Category (categoryName)	VALUES ('Test category 2');
INSERT INTO Category (categoryName)	VALUES ('Test category 3');
INSERT INTO Category (categoryName)	VALUES ('Test category 4');
-- listed, productName, price, deliveryType, stock, description, thumbnail
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail)	VALUES (true, 'Test product 1', 20.30,		'Free global', 				10, 	'This is the first test product, it costs £20.30 and has free global delivery. There are initially 10 in stock. It belongs in Test category 1.',						'teapot1.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 2', 12.99,		'Free UK',					32,	'This is the second test product, it costs £12.99 and has free UK delivery. There are initially 32 in stock. It belongs in Test categories 1 and 3.',				'teapot2.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 3', 1.20,			'Location dependent', 1256,'This is the third test product, it costs £1.20 and has location dependent delivery. There are initially 1256 in stock. It belongs in Test category 1.',			'teapot3.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 4', 0.01,			'Location dependent', 124, 	'This is the fourth test product, it costs £0.01 and has location dependent delivery. There are initially 124 in stock. It belongs in Test category 2.',			'teapot4.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 5', 6.72,			'Location dependent', 56, 	'This is the fith test product, it costs £6.72 and has location dependent delivery. There are initially 56 in stock. It belongs in Test category 2.',				'teapot4.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 6', 120.78,		'Free UK',					12,	'This is the sixth test product, it costs £120.78 and has free UK delivery. There are initially 12 in stock. It belongs in no categories',								'teapot3.jpg');
INSERT INTO Product (listed, productName, price, deliveryType, stock, description, thumbnail) VALUES (true, 'Test product 7', 1265.02,	'Free global', 				2,		'This is the seventh test product, it costs £1265.02 and has free global delivery. There are initially 2 in stock. It belongs in Test category 3. It has no thumbnail', null);
-- productID, categoryID
INSERT INTO ProductCategory VALUES (1, 1);
INSERT INTO ProductCategory VALUES (2, 1);
INSERT INTO ProductCategory VALUES (2, 3);
INSERT INTO ProductCategory VALUES (3, 2);
INSERT INTO ProductCategory VALUES (4, 2);
INSERT INTO ProductCategory VALUES (5, 2);
INSERT INTO ProductCategory VALUES (7, 3);
-- productID, username, quantity, processed, rating, review
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (1, 'Test user 1', 2, true,	5,		'Bought 2, perfect 5/5, will buy more'		);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (1, 'Test user 2', 1, true,	3,		'Bought 1, was alright 3/5'						);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (2, 'Test user 2', 3, true,	4,		'Pretty good, bought 3, 4/5'					);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (3, 'Test user 3', 5, true,	1,		'Terrible, should not have bought 5, 1/5'	);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (1, 'Test user 4', 2, true,	3,		null);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (4, 'Test user 4', 7, true,	null,	null);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (1, 'Test user 1', 3, false,	null,	null);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (5, 'Test user 2', 2, false,	null,	null);
INSERT INTO Purchase (productID, username, quantity, processed, rating, review)	VALUES (7, 'Test user 3', 1, false,	null,	null);
COMMIT;