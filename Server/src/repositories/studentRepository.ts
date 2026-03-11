import studentModel from "../models/studentModel.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js";



export const createStudent = (studentData: authUserRegisterType )=>{
     return studentModel.create(studentData)
}