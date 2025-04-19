-- CreateTable
CREATE TABLE "_NotificationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotificationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NotificationToUser_B_index" ON "_NotificationToUser"("B");

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
