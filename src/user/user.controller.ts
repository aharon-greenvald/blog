import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { User } from './models/user.class';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators';

@Controller('users')
export class UserController {
    constructor(private userService:UserService){}
    @Post()
    create(@Body() user: User): Observable <User | Object> {
        return this.userService.create(user).pipe(
            map((user:User)=>user),
            catchError(err => of({error:err.massage})
        )
        )
    }
    @Post('login')
    login(@Body() user: User): Observable <Object> {
        return this.userService.login(user).pipe(
            map((jwt:string)=>{
                return {access_token: jwt}
            }),
        )        
    }
    @Get(':id')
    findOne(@Param() params): Observable<User[]> { 
        return this.userService.findOne(params.id)
    }
    @Get()
    findAll(): Observable<User[]>{
        return this.userService.findAll()
    }
    @Delete(':id')
    deleteOne(@Param('id') id): Observable<User[]> { 
        return this.userService.deleteOne((id))
    }
    @Put(':id')
    updateOne(@Param('id') id,@Body() user: User){
        return this.userService.updateOne((id),user)

    }
    
}
