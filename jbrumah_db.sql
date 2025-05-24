-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 03:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jbrumah_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `rumah`
--

CREATE TABLE `rumah` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `gambar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rumah`
--

INSERT INTO `rumah` (`id`, `nama`, `lokasi`, `harga`, `deskripsi`, `userId`, `created_at`, `updated_at`, `gambar`) VALUES
(2, 'Rumah Spek Konoha', 'Solo', 54001000, 'Rumah 1 lantai tapi full basement', 2, '2025-05-24 04:05:32', '2025-05-24 04:05:32', 'sugab.JPG'),
(3, 'Rumah 999', 'Jakpus', 19882000, 'Rumah bekas proplayer', 2, '2025-05-24 04:06:23', '2025-05-24 04:06:23', NULL),
(6, 'Rumah Rentol', 'Jogja', 990002000, 'Rumah beban emel cupu', 3, '2025-05-24 04:12:19', '2025-05-24 04:12:19', NULL),
(7, 'Rumah bagos', 'Sleman', 10002000, 'Rumah beban emel', 3, '2025-05-24 05:18:05', '2025-05-24 13:00:31', '1748091631050.png'),
(11, 'Rumah ASoloLE', 'Karanganyar', 3010020, 'ISTIMEWAH', 2, '2025-05-24 05:56:27', '2025-05-24 05:56:27', '1748066187304.jpg'),
(12, 'Rumah Alucard', 'Kledokan, Babarsari', 2147483647, 'Ciamik pol wes, ora angker', 2, '2025-05-24 12:14:53', '2025-05-24 12:14:53', '1748088893124.jpg'),
(13, 'Rumah TYPE-R 16000cc', 'Pacitan, Jawa TIMOER', 12003000, 'Kondisi agak mencurigakan, insyaAllah tapi yo aman', 2, '2025-05-24 12:18:52', '2025-05-24 12:18:52', '1748089132983.jpg'),
(14, 'Rumah SUKTI', 'Boyomlamli', 20003302, 'ndak recomend blas', 2, '2025-05-24 13:04:10', '2025-05-24 13:04:10', '1748091850364.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `rumahId` int(11) NOT NULL,
  `tanggal` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT 'menunggu konfirmasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `userId`, `rumahId`, `tanggal`, `status`) VALUES
(14, 4, 3, '2025-05-24 07:42:53', 'selesai'),
(15, 4, 6, '2025-05-24 07:54:46', 'selesai');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Budi', 'budi@gmail.com', '$2b$10$ehmKqmmfjjTq6PqDGcOZCuW9zjB.nJS1KAPjvQENC6/me2x.sd5hW', 'user', '2025-05-24 03:09:09', '2025-05-24 03:09:09'),
(2, 'Jagad Damai', 'jagad.damai0303@gmail.com', '$2b$10$2pcYd9tqZbWhJxp0bYJ65eMJTyDJyUCImT6akxsnM1slFVtfEO/J2', 'admin', '2025-05-24 03:57:02', '2025-05-24 03:57:02'),
(3, 'tes', 'tes@gmail.com', '$2b$10$DPC2AuVqYaE8BFCDb4CH/.XJo7pUekpgq48mKy6Ya8RbHjPUJIfCq', 'admin', '2025-05-24 03:59:17', '2025-05-24 03:59:17'),
(4, 'hai', 'hai@gmail.com', '$2b$10$1JBXY7ukpcrF2JxtMp0.ZOYTFaQhXWgKGwr/bqgqikrwnM7l0HEeu', 'user', '2025-05-24 04:08:05', '2025-05-24 04:08:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rumah`
--
ALTER TABLE `rumah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `rumahId` (`rumahId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rumah`
--
ALTER TABLE `rumah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaksi_ibfk_14` FOREIGN KEY (`rumahId`) REFERENCES `rumah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
