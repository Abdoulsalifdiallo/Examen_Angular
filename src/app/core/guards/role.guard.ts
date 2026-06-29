import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../../models/auth.model';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as Role | undefined;

  return auth.session$.pipe(
    take(1),
    map((session) => {
      if (!session) {
        return router.createUrlTree(['/login']);
      }
      if (requiredRole && session.role !== requiredRole) {
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
  );
};
