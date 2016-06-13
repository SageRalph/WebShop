CREATE TABLE Customer (
username	VARCHAR(30)     PRIMARY KEY ,
address		VARCHAR(200) 	NOT NULL
);
CREATE TABLE Category (
categoryID	INTEGER		AUTO_INCREMENT	PRIMARY KEY,
categoryName	VARCHAR(30)	NOT NULL
);
CREATE TABLE Product (
productID	INTEGER	 	AUTO_INCREMENT	PRIMARY KEY,
listed		BOOLEAN		NOT NULL,
productName	VARCHAR(30)	NOT NULL,
price		DECIMAL(12,2)	NOT NULL, 
deliveryType	VARCHAR(30)	NOT NULL,
stock		INTEGER		NOT NULL,
description	TEXT            NOT NULL,
thumbnail	VARCHAR(30)
);
CREATE TABLE ProductCategory (
productID	INTEGER,
categoryID	INTEGER,
INDEX		(categoryID),
INDEX		(productID),
CONSTRAINT  PK_ProductCategory  PRIMARY KEY(productID, categoryID),
CONSTRAINT  FK_categoryID       FOREIGN KEY(categoryID) REFERENCES Category(categoryID),
CONSTRAINT  FK_productID        FOREIGN KEY(productID)  REFERENCES Product(productID)
);
CREATE TABLE Purchase (
purchaseID	INTEGER		AUTO_INCREMENT	PRIMARY KEY,
productID	INTEGER		NOT NULL,
username	VARCHAR(30) 	NOT NULL,
quantity	INTEGER		NOT NULL,
processed	BOOLEAN		NOT NULL,
rating		INTEGER,
review		TEXT,
INDEX	(username),
INDEX	(productID),
CONSTRAINT  FK_purchaseUsername	 FOREIGN KEY(username)	REFERENCES Customer(username),
CONSTRAINT  FK_purchaseproductID FOREIGN KEY(productID)	REFERENCES Product(productID)
);