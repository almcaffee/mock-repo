import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Inject } from '@angular/core';

import { DialogueComponent } from './dialogue.component';
import { TestImports } from '../../core/testing/imports';
import { TestDeclarations, EntryComponents } from '../../core/testing/declarations';
import { TestProviders } from '../../core/testing/providers';
import { DataService } from '../../services/data.service';
import { EnrollmentService } from '../../services/enrollment.service';

/* Modules */
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule, MatIconModule, MatStepperModule, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';

describe('DialogueComponent', async() => {
  let component: DialogueComponent;
  let fixture: ComponentFixture<DialogueComponent>;
  let enrollmentService: EnrollmentService;
  let dataService: DataService;
  let dialogRef: MatDialogRef<DialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TestImports ],
      declarations: [ TestDeclarations ],
      providers: [ TestProviders ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(DialogueComponent);
    component = fixture.componentInstance;
    enrollmentService = fixture.debugElement.injector.get(EnrollmentService);
    dataService = fixture.debugElement.injector.get(DataService);
    component['dialogRef'] = dialogRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
