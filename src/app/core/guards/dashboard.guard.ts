import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EnrollmentService } from '../../services/enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private enrollmentService: EnrollmentService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.enrollmentService.applicantLoaded || this.enrollmentService.applicantEnrollmentComplete) {
        return true;
      } else{
        this.router.navigate(['/']);
        return false;
      }
  }
}
