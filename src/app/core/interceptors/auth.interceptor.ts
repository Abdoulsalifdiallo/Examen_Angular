import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const session = this.auth.session;
    if (!session) {
      return next.handle(req);
    }
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${session.role}:${session.phone}` },
    });
    return next.handle(cloned);
  }
}
