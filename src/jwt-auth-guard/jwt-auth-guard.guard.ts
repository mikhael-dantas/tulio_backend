import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // heres the logic
    const request = context.switchToHttp().getRequest();

    // Add a custom property to the request object
    request.teste = 'informação inserida na request pelo guard';

    return super.canActivate(context);
  }
}
