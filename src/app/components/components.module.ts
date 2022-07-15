import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ConfirmationService,
  MessageService
} from 'primeng/api';

import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './menu/menu.component';
import { AbmComponent } from './abm/abm.component';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PipesModule } from '../pipes/pipes.module';
import { DropdownModule } from 'primeng/dropdown';
import { PageTitleComponent } from './page-title/page-title.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { TabMenuTestComponent } from './tab-menu-test/tab-menu-test.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ReactiveFormsModule } from '@angular/forms';
import { SplitterModule } from 'primeng/splitter';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { DragDropModule } from 'primeng/dragdrop';
import { OrderListModule } from 'primeng/orderlist';
import { DirectivesModule } from '../directives/directives.module';
import { FillAvailableSpaceComponent } from './fill-available-space/fill-available-space.component';
import { StepSelectorComponent } from './step-selector/step-selector.component';
import { FormArrayControlsOrderListComponent } from './form-array-controls-order-list/form-array-controls-order-list.component';
import { StepSwitchComponent } from './steps/step-switch/step-switch.component';
import { PreparationStepComponent } from './steps/preparation-step/preparation-step.component';
import { ActionSwitchComponent } from './actions/action-switch/action-switch.component';
import { StandIdentificationActionComponent } from './actions/stand-identification-action/stand-identification-action.component';
import { MeterIdentificationActionComponent } from './actions/meter-identification-action/meter-identification-action.component';
import { InputSwitchModule } from 'primeng/inputswitch';

const PrimeNgModules = [
  MenubarModule,
  CardModule,
  FieldsetModule,
  PanelModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule,
  TableModule,
  DividerModule,
  ConfirmDialogModule,
  ToastModule,
  DialogModule,
  DropdownModule,
  InputNumberModule,
  TooltipModule,
  RippleModule,
  CheckboxModule,
  MenuModule,
  TabMenuModule,
  SplitterModule,
  SplitButtonModule,
  SpeedDialModule,
  DragDropModule,
  OrderListModule,
  InputSwitchModule,
];

const PrimeNgServices = [
  MessageService,
  ConfirmationService,
]

const EmetsyComponents = [
  MenuComponent,
  AbmComponent,
  ConfirmDialogComponent,
  PageTitleComponent,
  TabMenuTestComponent,
  FillAvailableSpaceComponent,
  StepSelectorComponent,
  FormArrayControlsOrderListComponent,
  PreparationStepComponent,
  StandIdentificationActionComponent,
  StepSwitchComponent,
  ActionSwitchComponent,
]

@NgModule({
  declarations: [EmetsyComponents, MeterIdentificationActionComponent],
  imports: [
    CommonModule,
    PrimeNgModules,
    PipesModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: [EmetsyComponents, PrimeNgModules],
  providers: [PrimeNgServices]
})
export class ComponentsModule { }
