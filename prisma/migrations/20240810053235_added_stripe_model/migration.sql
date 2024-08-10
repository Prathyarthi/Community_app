-- CreateTable
CREATE TABLE "StripeSubscriber" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscriber_userId_key" ON "StripeSubscriber"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscriber_stripeCustomerId_key" ON "StripeSubscriber"("stripeCustomerId");
