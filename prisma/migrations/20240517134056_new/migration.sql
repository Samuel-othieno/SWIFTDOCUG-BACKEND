-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_doctorID_fkey";

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
