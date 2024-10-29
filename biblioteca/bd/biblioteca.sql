-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 29, 2024 at 11:36 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `biblioteca`
--

-- --------------------------------------------------------

--
-- Table structure for table `alugueis`
--

CREATE TABLE `alugueis` (
  `id` int NOT NULL,
  `livro_id` int NOT NULL,
  `leitor` varchar(255) NOT NULL,
  `data_aluguel` date NOT NULL,
  `data_devolucao` date NOT NULL,
  `devolvido` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alugueis`
--

INSERT INTO `alugueis` (`id`, `livro_id`, `leitor`, `data_aluguel`, `data_devolucao`, `devolvido`) VALUES
(34, 1, 'a', '2024-10-29', '2024-11-12', 0);

-- --------------------------------------------------------

--
-- Table structure for table `livros`
--

CREATE TABLE `livros` (
  `id` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(255) NOT NULL,
  `genero` varchar(100) NOT NULL,
  `disponivel` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `livros`
--

INSERT INTO `livros` (`id`, `titulo`, `autor`, `genero`, `disponivel`) VALUES
(1, '1984', 'George Orwell', 'Ficção Científica', 0),
(2, 'O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', 0),
(3, 'Orgulho e Preconceito', 'Jane Austen', 'Romance', 0),
(4, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Literatura Infantil', 0),
(5, 'Cem Anos de Solidão', 'Gabriel García Márquez', 'Realismo Mágico', 0),
(6, 'Dom Quixote', 'Miguel de Cervantes', 'Romance', 0),
(7, 'A Metamorfose', 'Franz Kafka', 'Ficção', 0),
(8, 'O Alquimista', 'Paulo Coelho', 'Ficção', 1),
(9, 'A Revolução dos Bichos', 'George Orwell', 'Ficção', 0),
(10, 'O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 1),
(14, 'aa', 'a', 'a', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alugueis`
--
ALTER TABLE `alugueis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `livro_id` (`livro_id`);

--
-- Indexes for table `livros`
--
ALTER TABLE `livros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alugueis`
--
ALTER TABLE `alugueis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `livros`
--
ALTER TABLE `livros`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alugueis`
--
ALTER TABLE `alugueis`
  ADD CONSTRAINT `alugueis_ibfk_1` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
