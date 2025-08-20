-- CreateTable
CREATE TABLE "Stocks" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Stocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stocks" ADD CONSTRAINT "Stocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
