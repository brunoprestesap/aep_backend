import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const AUDITED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (!AUDITED_METHODS.includes(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        // AuditService.log() will be injected in modules that require it
        // This interceptor marks the request for audit logging
        request.__audit = {
          userId: request.user?.id,
          tenantId: request.user?.tenantId,
          method: request.method,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
