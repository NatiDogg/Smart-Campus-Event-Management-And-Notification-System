import studentModel from "../models/studentModel.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js";



export const createNewStudent = (studentData: authUserRegisterType )=>{
     return studentModel.create(studentData)
}