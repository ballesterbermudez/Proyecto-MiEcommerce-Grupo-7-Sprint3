DROP DATABASE if EXISTS `mi_ecommerce_test`;
CREATE DATABASE  IF NOT EXISTS `mi_ecommerce_test` ;
USE `mi_ecommerce_test`;
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `profilepic` varchar(255) DEFAULT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `users_fk0` (`id_role`),
  CONSTRAINT `users_fk0` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=287 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `price` int NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `mostWanted` tinyint NOT NULL DEFAULT '0',
  `id_category` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_fk0` (`id_category`),
  CONSTRAINT `products_fk0` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `pictures`;
CREATE TABLE `pictures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `id_product` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`),
  KEY `pictures_fk0` (`id_product`),
  CONSTRAINT `pictures_fk0` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id_usuario` int NOT NULL,
  `id_product` int NOT NULL,
  `quantity` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_product`),
  KEY `carts_fk1` (`id_product`),
  CONSTRAINT `carts_fk0` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`),
  CONSTRAINT `carts_fk1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`),
  CONSTRAINT `carts_fk10` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_fk11` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
LOCK TABLES `roles` WRITE;
INSERT INTO `roles` VALUES (2,'ADMIN'),(1,'GOD'),(3,'GUEST');
UNLOCK TABLES;
LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'diego@god.com','diegogod','diego1234','Diego','Perez','https://avatars.githubusercontent.com/u/95981958?v=4',1),(2,'hernan@cecosud','hernana','hernan1234','Hernan','Gutierrez','',2),(3,'Fede@cenco.com','fede','fede1234','Federico','Sierra','',2),(4,'ballester@cencosud.com','balleser','ballester1234','Ballester','Bermudez','',3),(5,'juan@cencosud.com','juven','juan1234','Juan','Ventura','',3);
UNLOCK TABLES;
LOCK TABLES `categories` WRITE;
INSERT INTO `categories` VALUES (5,'alcohol'),(4,'bebidas'),(2,'cigarros'),(6,'dulces'),(7,'electrodomesticos'),(1,'lacteos'),(3,'salados'),(8,'testCatMod');
UNLOCK TABLES;
LOCK TABLES `products` WRITE;
INSERT INTO `products` VALUES (1,'leche',42,'leche fresca conaprole',6,0,1),(2,'fireball',1274,'wisky importado de canela',3,0,5),(3,'testProductModification',120,'puchito pal fede',99,1,2),(4,'capitan del espacio',25,'alfajor argentino',10,0,6),(5,'pringles',92,'sabor queso',11,0,3),(6,'heladera',15000,'heladera con frizer',2,0,7),(7,'fagar',110,'fagar sabor cola',25,0,4),(8,'Alfajor Marley',48,'Alfajor con gran relleno de Dulce de leche',0,0,6),(10,'Alfojor Top',20,NULL,0,0,6);
UNLOCK TABLES;
LOCK TABLES `pictures` WRITE;
INSERT INTO `pictures` VALUES (2,'fireball.com','whisky de calidad',2),(3,'marlboro.com','foto marlboro 1',3),(4,'marlboro1.com','foto marlboro 2',3),(5,'capitanEspacio.com','foto capitan del espacio',4),(6,'pringles.com','foto pringles 1',5),(7,'pringles2.com','foto pringles 2',5),(8,'pringles3.com','foto pringles 3',5),(9,'helader.com','foto heladera 1 ',6),(10,'helader1.com','foto heladera 2 ',6),(11,'helader2.com','foto heladera 3 ',6),(12,'helader3.com','foto heladera 4',6),(13,'helader4.com','foto heladera 5',6),(14,'fagar.com','foto fagar 1',7),(15,'fagar2.com','foto fagar 2',7),(16,'fagar3.com','foto fagar 3',7),(17,'fagar4.com','foto fagar 4',7),(18,'fagar5.com','foto fagar 5',7);
UNLOCK TABLES;
LOCK TABLES `carts` WRITE;
INSERT INTO `carts` VALUES (3,1,1,'2022-09-22 16:36:03'),(3,4,2,'2022-09-22 16:36:03'),(3,5,1,'2022-09-22 16:36:03'),(4,2,1,'2022-09-22 16:36:03'),(4,6,1,'2022-09-22 16:36:03');
UNLOCK TABLES;