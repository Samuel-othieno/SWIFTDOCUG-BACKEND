-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_patientID_fkey";

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
