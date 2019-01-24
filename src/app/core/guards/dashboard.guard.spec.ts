import { TestBed, async, inject } from '@angular/core/testing';

import { DashboardGuard } from './dashboard.guard';
import { TestImports } from '../testing/imports';
import { TestDeclarations } from '../testing/declarations';
import { TestProviders } from '../testing/providers';

describe('DashboardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    });
  });

  it('should ...', inject([DashboardGuard], (guard: DashboardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
