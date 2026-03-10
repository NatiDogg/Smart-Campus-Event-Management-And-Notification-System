import { createStudent } from "../repositories/studentRepository.js"
import { authUserRegisterType } from "../utils/zodAuthValidator.js"
class StudentService{
     async createNewStudent(studentData: authUserRegisterType){
          const newlyCreatedStudent = await createStudent(studentData);
          return newlyCreatedStudent;
     }
}

export default new StudentService()