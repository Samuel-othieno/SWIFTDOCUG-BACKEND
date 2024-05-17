-- DropForeignKey
ALTER TABLE "Medical_records" DROP CONSTRAINT "Medical_records_userId_fkey";

-- AddForeignKey
ALTER TABLE "Medical_records" ADD CONSTRAINT "Medical_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
