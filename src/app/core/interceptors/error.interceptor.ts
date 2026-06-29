import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { SKIP_ERROR_TOAST } from '../http-context/skip-error-toast.token';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!req.context.get(SKIP_ERROR_TOAST)) {
          const message = error.error?.message ?? this.fallbackMessage(error.status);
          this.toast.error(message);
        }
        return throwError(() => error);
      }),
    );
  }

  private fallbackMessage(status: number): string {
    switch (status) {
      case 0:
        return 'Impossible de contacter le serveur BadWallet.';
      case 400:
        return 'Requête invalide.';
      case 404:
        return 'Ressource introuvable.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }
}
