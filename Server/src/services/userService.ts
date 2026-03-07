import { getAll,findById,findByEmail } from "../repositories/userRepository.js";



class UserService{

    async getUsers(){
      const users = await getAll();
      return users;
    }
    async findUserById(id: string){
        const user = await findById(id);
        return user;
    }
    async findUserByEmail(email: string){
        const user = await findByEmail(email)
        return user;
    }
   
}  

export default new UserService();