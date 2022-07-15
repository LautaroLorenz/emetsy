import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActionComponent, CompileParams } from 'src/app/models';

@Component({
  selector: 'app-stand-identification-action',
  templateUrl: './stand-identification-action.component.html',
  styleUrls: ['./stand-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandIdentificationActionComponent implements ActionComponent, OnInit {

  readonly name = 'Identificación de puestos';
  readonly form: FormGroup;

  constructor() { 
    this.form = new FormGroup({
      stands: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.buildStands();
  }

  getStandControls(): FormArray<FormGroup> {
    return (this.form.get('stands') as FormArray);
  }

  private addStandInput(): void {
    this.getStandControls().push(new FormGroup({
      isActive: new FormControl(),
      meter: new FormControl()
    }));
  }

  private buildStands(): void {
    for(let i = 0; i < CompileParams.STANDS_LENGTH; i++) {
      this.addStandInput();
    }
  }

}
