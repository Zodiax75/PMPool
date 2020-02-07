/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AboutPM3Component } from './aboutPM3.component';

describe('AboutPM3Component', () => {
  let component: AboutPM3Component;
  let fixture: ComponentFixture<AboutPM3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutPM3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPM3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
