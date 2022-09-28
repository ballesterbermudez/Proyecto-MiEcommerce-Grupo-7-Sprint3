-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 28-09-2022 a las 03:02:27
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mi_ecommerce`
--
CREATE DATABASE IF NOT EXISTS `mi_ecommerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mi_ecommerce`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id_usuario` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `carts`
--

INSERT INTO `carts` (`id_usuario`, `id_product`, `quantity`, `date`) VALUES
(3, 1, 1, '2022-09-22 16:36:03'),
(3, 4, 2, '2022-09-22 16:36:03'),
(3, 5, 1, '2022-09-22 16:36:03'),
(4, 2, 1, '2022-09-22 16:36:03'),
(4, 6, 1, '2022-09-22 16:36:03'),
(57, 1, 1, '2022-09-28 00:51:52'),
(57, 2, 9, '2022-09-28 00:51:52'),
(57, 3, 4, '2022-09-28 00:51:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `title`) VALUES
(5, 'alcohol'),
(4, 'bebidas'),
(2, 'cigarros'),
(6, 'dulces'),
(7, 'electrodomesticos'),
(1, 'lacteos'),
(3, 'salados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pictures`
--

DROP TABLE IF EXISTS `pictures`;
CREATE TABLE `pictures` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `id_product` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pictures`
--

INSERT INTO `pictures` (`id`, `url`, `description`, `id_product`) VALUES
(1, 'leche.com', 'foto leche', 1),
(2, 'fireball.com', 'foto fireball', 2),
(3, 'marlboro.com', 'foto marlboro 1', 3),
(4, 'marlboro1.com', 'foto marlboro 2', 3),
(5, 'capitanEspacio.com', 'foto capitan del espacio', 4),
(6, 'pringles.com', 'foto pringles 1', 5),
(7, 'pringles2.com', 'foto pringles 2', 5),
(8, 'pringles3.com', 'foto pringles 3', 5),
(9, 'helader.com', 'foto heladera 1 ', 6),
(10, 'helader1.com', 'foto heladera 2 ', 6),
(11, 'helader2.com', 'foto heladera 3 ', 6),
(12, 'helader3.com', 'foto heladera 4', 6),
(13, 'helader4.com', 'foto heladera 5', 6),
(14, 'fagar.com', 'foto fagar 1', 7),
(15, 'fagar2.com', 'foto fagar 2', 7),
(16, 'fagar3.com', 'foto fagar 3', 7),
(17, 'fagar4.com', 'foto fagar 4', 7),
(18, 'fagar5.com', 'foto fagar 5', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `mostwanted` tinyint(4) DEFAULT 0,
  `id_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `title`, `price`, `description`, `stock`, `mostwanted`, `id_category`) VALUES
(1, 'leche', 42, 'leche fresca conaprole', 0, 0, 1),
(2, 'fireball', 1274, 'wisky importado de canela', 6, 0, 5),
(3, 'marlboro', 120, 'puchito pal fede', 94, 0, 2),
(4, 'capitan del espacio', 25, 'alfajor argentino', 10, 0, 6),
(5, 'pringles', 92, 'sabor queso', 11, 0, 3),
(6, 'heladera', 15000, 'heladera con frizer', 2, 0, 7),
(7, 'fagar', 110, 'fagar sabor cola', 25, 0, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `role`) VALUES
(2, 'ADMIN'),
(1, 'GOD'),
(3, 'GUEST');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `profilepic` varchar(255) DEFAULT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `first_name`, `last_name`, `profilepic`, `id_role`) VALUES
(1, 'diego@god.com', 'diegogod', 'diego1234', 'Diego', 'Perez', 'https://avatars.githubusercontent.com/u/95981958?v=4', 1),
(2, 'hernan@cecosud', 'hernan', 'hernan1234', 'Hernan', 'Gutierrez', '', 2),
(3, 'Fede@cenco.com', 'fede', 'fede1234', 'Federico', 'Sierra', '', 2),
(4, 'ballester@cencosud.com', 'ballester', 'ballester1234', 'Ballester', 'Bermudez', '', 3),
(5, 'juan@cencosud.com', 'juven', 'juan1234', 'Juan', 'Ventura', '', 3),
(57, 'juandito@gmail.com', 'juanito', 'juanito1234', 'abc', 'abc', 'url.myprofilepic', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id_usuario`,`id_product`),
  ADD KEY `carts_fk1` (`id_product`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`);

--
-- Indices de la tabla `pictures`
--
ALTER TABLE `pictures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `url` (`url`),
  ADD KEY `pictures_fk0` (`id_product`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_fk0` (`id_category`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role` (`role`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `users_fk0` (`id_role`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `pictures`
--
ALTER TABLE `pictures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_fk0` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `carts_fk1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pictures`
--
ALTER TABLE `pictures`
  ADD CONSTRAINT `pictures_fk0` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_fk0` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_fk0` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
