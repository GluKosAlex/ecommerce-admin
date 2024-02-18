/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider-account-id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session-token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider-account-id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user-id` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session-token` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user-id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password-hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropIndex
DROP INDEX `Account_provider_providerAccountId_key` ON `Account`;

-- DropIndex
DROP INDEX `Session_sessionToken_key` ON `Session`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `providerAccountId`,
    DROP COLUMN `userId`,
    ADD COLUMN `provider-account-id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user-id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Session` DROP COLUMN `sessionToken`,
    DROP COLUMN `userId`,
    ADD COLUMN `session-token` VARCHAR(191) NOT NULL,
    ADD COLUMN `user-id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`,
    DROP COLUMN `username`,
    ADD COLUMN `email-verified` DATETIME(3) NULL,
    ADD COLUMN `password-hash` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Account_provider_provider-account-id_key` ON `Account`(`provider`, `provider-account-id`);

-- CreateIndex
CREATE UNIQUE INDEX `Session_session-token_key` ON `Session`(`session-token`);

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_user-id_fkey` FOREIGN KEY (`user-id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_user-id_fkey` FOREIGN KEY (`user-id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
