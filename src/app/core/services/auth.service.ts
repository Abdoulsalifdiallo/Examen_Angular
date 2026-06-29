import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../../models/auth.model';

const STORAGE_KEY = 'badwallet-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<Session | null>(this.readStoredSession());
  readonly session$: Observable<Session | null> = this.sessionSubject.asObservable();

  get session(): Session | null {
    return this.sessionSubject.value;
  }

  login(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSubject.next(null);
  }

  private readStoredSession(): Session | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
