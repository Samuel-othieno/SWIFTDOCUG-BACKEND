-- DropForeignKey
ALTER TABLE "Prescriptions" DROP CONSTRAINT "Prescriptions_appointmentsId_fkey";

-- AddForeignKey
ALTER TABLE "Prescriptions" ADD CONSTRAINT "Prescriptions_appointmentsId_fkey" FOREIGN KEY ("appointmentsId") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
