
import { isStudentRegistered,getStudentsRegistration } from "../repositories/registrationRepository.js";


class RegistrationService{
    async verifyStudentRegistrationStatus(studentId: string, eventId:string){
         const studentStatus = await isStudentRegistered(studentId, eventId);
         return studentStatus;
    }
    async getStudentsRegistrationStatus(){
        const students = await getStudentsRegistration();
        return students;
    }
}

export default new RegistrationService()