import { TestBed, async, inject } from '@angular/core/testing';

import { StepGuard } from './step.guard';
import { TestImports } from '../testing/imports';
import { TestDeclarations } from '../testing/declarations';
import { TestProviders } from '../testing/providers';


describe('StepGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    });
  });

  it('should ...', inject([StepGuard], (guard: StepGuard) => {
    expect(guard).toBeTruthy();
  }));
});
