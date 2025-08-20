/*
  Warnings:

  - Added the required column `price` to the `Trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Trades" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
