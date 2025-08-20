-- CreateTable
CREATE TABLE "public"."Trades" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "orderType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Trades_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Trades" ADD CONSTRAINT "Trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
