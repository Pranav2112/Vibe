-- CreateTable
CREATE TABLE "public"."UserStats" (
    "id" SERIAL NOT NULL,
    "userAddress" TEXT NOT NULL,
    "dailySwipeCount" INTEGER NOT NULL DEFAULT 0,
    "lastSwipeTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" SERIAL NOT NULL,
    "likerAddress" TEXT NOT NULL,
    "likedAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "actorAddress" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connection" (
    "id" SERIAL NOT NULL,
    "userA_address" TEXT NOT NULL,
    "userB_address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userAddress_key" ON "public"."UserStats"("userAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Like_likerAddress_likedAddress_key" ON "public"."Like"("likerAddress", "likedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userA_address_userB_address_key" ON "public"."Connection"("userA_address", "userB_address");
