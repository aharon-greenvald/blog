import { Injectable } from '@nestjs/common';
import { UserEntity } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.class';
import { Observable, from, throwError } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { match } from 'assert';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService) { }


        create(user: User): Observable<User> {
            return this.authService.hashPassword(user.password).pipe(
                switchMap((passwordHash: string) => {
                    const newUser = new UserEntity();
                    newUser.name = user.name;
                    newUser.username = user.username;
                    newUser.email = user.email;
                    newUser.password = passwordHash;
    
                    return from(this.userRepository.save(newUser)).pipe(
                        map((user: User) => {
                            const {password, ...result} = user;
                            return result;
                        }),
                        catchError(err => throwError(err))
                    )
                })
            )
        }
    
    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach((u) => { delete u.password })
                return users;
            })
        );
    }
    findOne(id: number): Observable<any> {
        return from(this.userRepository.findOne({ id })).pipe(
            map((user: User) => {
                const { password, ...result } = user;
                return result;
            })
        )

    }
    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }
    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        return from(this.userRepository.update(id, user));
    }
    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }


    validateUser(email: string, password: string):Observable<User>{
        return this.findByMail(email).pipe(
            switchMap((user:User) =>this.authService.comparePassword(password,user.password).pipe(
                map((match:boolean)=>{
                    if(match){
                        const {password, ...result} =user;
                        return result;
                    }else{
                        throw Error;
                    }
                })
            ))
        )

    }

    
    findByMail(email: string):Observable<User>{
        // return null
      return from(this.userRepository.findOne({ email }))
}

   
}