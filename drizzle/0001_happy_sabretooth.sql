CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`price` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` text,
	`parentId` int,
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`type` enum('percentage','fixed_amount') NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`maxDiscount` decimal(10,2),
	`minOrderAmount` decimal(10,2) DEFAULT '0',
	`usageLimit` int,
	`usageCount` int DEFAULT 0,
	`perUserLimit` int DEFAULT 1,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `inventory_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`orderId` int,
	`changeType` enum('purchase','return','restock','adjustment') NOT NULL,
	`quantity` int NOT NULL,
	`previousStock` int NOT NULL,
	`newStock` int NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productSku` varchar(100) NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(50) NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) NOT NULL DEFAULT '0',
	`taxCost` decimal(10,2) DEFAULT '0',
	`discountAmount` decimal(10,2) DEFAULT '0',
	`totalAmount` decimal(10,2) NOT NULL,
	`shippingAddressId` int,
	`billingAddressId` int,
	`notes` text,
	`trackingNumber` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deliveredAt` timestamp,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`paymentMethod` enum('credit_card','debit_card','paypal','stripe','bank_transfer') NOT NULL,
	`stripePaymentIntentId` varchar(100),
	`status` enum('pending','processing','succeeded','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(100),
	`failureReason` text,
	`refundAmount` decimal(10,2) DEFAULT '0',
	`refundedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_orderId_unique` UNIQUE(`orderId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`categoryId` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`cost` decimal(10,2),
	`stock` int NOT NULL DEFAULT 0,
	`images` json,
	`specifications` json,
	`rating` decimal(3,2) DEFAULT '0',
	`reviewCount` int DEFAULT 0,
	`weight` decimal(8,2),
	`dimensions` json,
	`isActive` boolean DEFAULT true,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`title` varchar(200),
	`content` text,
	`images` json,
	`isVerified` boolean DEFAULT false,
	`helpful` int DEFAULT 0,
	`unhelpful` int DEFAULT 0,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('shipping','billing','both') NOT NULL DEFAULT 'both',
	`recipientName` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`street` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`zipCode` varchar(20) NOT NULL,
	`country` varchar(100) NOT NULL,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('active','inactive','banned') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `cart_items` (`userId`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `cart_items` (`productId`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `parent_id_idx` ON `categories` (`parentId`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `coupons` (`code`);--> statement-breakpoint
CREATE INDEX `start_date_idx` ON `coupons` (`startDate`);--> statement-breakpoint
CREATE INDEX `end_date_idx` ON `coupons` (`endDate`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `inventory_logs` (`productId`);--> statement-breakpoint
CREATE INDEX `order_id_idx` ON `inventory_logs` (`orderId`);--> statement-breakpoint
CREATE INDEX `order_id_idx` ON `order_items` (`orderId`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `order_items` (`productId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `orders` (`userId`);--> statement-breakpoint
CREATE INDEX `order_number_idx` ON `orders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `orders` (`createdAt`);--> statement-breakpoint
CREATE INDEX `order_id_idx` ON `payments` (`orderId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `payments` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `products` (`categoryId`);--> statement-breakpoint
CREATE INDEX `sku_idx` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `reviews` (`productId`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `reviews` (`userId`);--> statement-breakpoint
CREATE INDEX `rating_idx` ON `reviews` (`rating`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_addresses` (`userId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);