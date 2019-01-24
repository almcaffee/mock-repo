import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StepperService } from '../../components/stepper/stepper.service';

@Injectable({
  providedIn: 'root'
})
export class StepGuard implements CanActivate {

  constructor(private stepperService: StepperService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.stepperService.canActivateStep(state.url)) {
      return true;
    } else{
      this.router.navigate(['/']);
      return false;
    }
  }
}
