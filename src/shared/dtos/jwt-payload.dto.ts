import { RoleUser, UserStatus } from '@constants/user.constant';

export class JwtPayloadDto {
  id: number;
  email: string;
  status?: UserStatus;
  role?: RoleUser;
}
