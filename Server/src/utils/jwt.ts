import jwt from 'jsonwebtoken'
import { env } from './zodEnvFilesValidator.js'

interface UserTokenInfo{
     id: string,
     email: string,
     role: 'student'|"admin"|"organizer"
}

export const createAccessToken = (payload: UserTokenInfo)=>{
     return jwt.sign(payload,env.JWT_ACCESS_SECRET_KEY,{expiresIn: "15m"})
}

export const verifyAccessToken = (token: string)=>{
     return jwt.verify(token,env.JWT_ACCESS_SECRET_KEY ) as UserTokenInfo;
}

export const createRefreshToken = (payload: UserTokenInfo)=>{
    return jwt.sign(payload,env.JWT_REFRESH_SECRET_KEY,{expiresIn: "7d"})
}
export const verifyRefreshToken = (token:string)=>{
  return jwt.verify(token,env.JWT_REFRESH_SECRET_KEY ) as UserTokenInfo;
}