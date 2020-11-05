import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';


@Module({
   
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule], // Missing this
            useFactory: async (configService: ConfigService) => ({
                secret:""+process.env.JWT_SECRET,
              signOptions: {expiresIn:'45s'},
              
            }),
            inject: [ConfigService], 
          }),
    ],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
