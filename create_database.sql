-- MySQL schema for Airline Booking System
-- Database: airline_booking

CREATE DATABASE IF NOT EXISTS `airline_booking` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `airline_booking`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table
CREATE TABLE IF NOT EXISTS `flights` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `flight_number` VARCHAR(50) NOT NULL,
  `airline` VARCHAR(100),
  `origin` VARCHAR(100),
  `destination` VARCHAR(100),
  `departure` DATETIME,
  `arrival` DATETIME,
  `seats` INT DEFAULT 0,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `flight_id` INT,
  `seats_booked` INT DEFAULT 1,
  `total_price` DECIMAL(10,2) DEFAULT 0.00,
  `booked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`flight_id`) REFERENCES `flights`(`id`) ON DELETE CASCADE
);

-- Example seed (optional)
INSERT INTO `flights` (`flight_number`,`airline`,`origin`,`destination`,`departure`,`arrival`,`seats`,`price`)
VALUES ('SW101','SkyWings Airlines','NYC','LAX','2026-04-01 08:00:00','2026-04-01 11:30:00',180,299.00);
