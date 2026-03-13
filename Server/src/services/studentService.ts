import { createStudent, findStudentById } from "../repositories/studentRepository.js"
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
class StudentService{
     async createNewStudent(studentData: authUserRegisterType){
          const newlyCreatedStudent = await createStudent(studentData);
          return newlyCreatedStudent;
     }
     async getStudentById(studentId: string){
         const student = await findStudentById(studentId);
         return student;
     }
     
}

export default new StudentService()