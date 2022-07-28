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
import { StandIdentificationActionComponent } from './actions/stand-identification-action/stand-identification-action.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ActionSwitchListComponent } from './action-switch-list/action-switch-list.component';
import { PhotocellAdjustmentValuesActionComponent } from './actions/photocell-adjustment-values-action/photocell-adjustment-values-action.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PhaseFormGroupComponent } from './phase-form-group/phase-form-group.component';
import { EnterTestValuesActionComponent } from './actions/enter-test-values-action/enter-test-values-action.component';
import { ContrastTestParametersActionComponent } from './actions/contrast-test-parameters-action/contrast-test-parameters-action.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { UserIdentificationActionComponent } from './actions/user-identification-action/user-identification-action.component';
import { StepExecutionStatusListComponent } from './step-execution-status-list/step-execution-status-list.component';
import { StepBuildFormComponent } from './step-build-form/step-build-form.component';
import { PhotocellAdjustmentExecutionActionComponent } from './actions/photocell-adjustment-execution-action/photocell-adjustment-execution-action.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GeneratorComponent } from './generator/generator.component';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { LoadingDotsComponent } from './loading-dots/loading-dots.component';
import { PatternComponent } from './pattern/pattern.component';
import { PhasesComponent } from './phases/phases.component';

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
  SelectButtonModule,
  OverlayPanelModule,
  MessagesModule,
  MessageModule,
  ProgressSpinnerModule,
];

const PrimeNgServices = [
  MessageService,
  ConfirmationService,
];

const EmetsyComponents = [
  MenuComponent,
  AbmComponent,
  ConfirmDialogComponent,
  PageTitleComponent,
  TabMenuTestComponent,
  FillAvailableSpaceComponent,
  StepSelectorComponent,
  FormArrayControlsOrderListComponent,
  StandIdentificationActionComponent,
  ActionSwitchListComponent,
  PhotocellAdjustmentValuesActionComponent,
  PhaseFormGroupComponent,
  EnterTestValuesActionComponent,
  ContrastTestParametersActionComponent,
  UserIdentificationActionComponent,
  StepExecutionStatusListComponent,
  StepBuildFormComponent,
  PhotocellAdjustmentExecutionActionComponent,
  GeneratorComponent,
  ConnectionStatusComponent,
  LoadingDotsComponent,
  PatternComponent,
  PhasesComponent,
];

@NgModule({
  declarations: [EmetsyComponents],
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
