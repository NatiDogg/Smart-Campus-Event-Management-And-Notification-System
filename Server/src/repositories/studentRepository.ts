import { Types } from "mongoose";
import studentModel from "../models/studentModel.js";
import { authUserRegisterType } from "../utils/zodAuthValidator.js";



export const createStudent = (studentData: authUserRegisterType )=>{
     return studentModel.create(studentData)
}
export const findStudentById = (studentId: string)=>{
     const id = new Types.ObjectId(studentId);
     return studentModel.findById(id);

}