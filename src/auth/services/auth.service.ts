import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.class';
import { Observable,from, of } from 'rxjs';
import { strict } from 'assert';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService){}
    generateJWT(user:User): Observable<string>{
        return from(this.jwtService.signAsync({user}))

    }
    hashPassword(password:string):Observable<string>{
        return from<string>(bcrypt.hash(password,12))

    }
    comparePassword(newPassword:string,passwordHash:string): Observable <any|boolean> { 
        return from<any | boolean>(bcrypt.compare(newPassword,passwordHash))

    }


}
