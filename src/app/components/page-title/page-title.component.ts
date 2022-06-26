import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { PageUrlName } from 'src/app/models';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent implements OnInit {

  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons | null = null;
  @Input() showBack: boolean = false;
  @Input() confirmBeforeBack: boolean = false;
  @Input() backPage: PageUrlName = PageUrlName.root;
  @Input() confirmBeforeBackHeader: string;
  @Input() confirmBeforeBackText: string;

  readonly back = () => this.navigationService.back({
    targetPage: this.backPage,
    withConfirmation: this.confirmBeforeBack,
    confirmBeforeBackText: this.confirmBeforeBackText,
    confirmBeforeBackHeader: this.confirmBeforeBackHeader
  });

  constructor(
    private readonly navigationService: NavigationService,
  ) {
    this.confirmBeforeBackHeader = 'Confirmar salir de esta página';
    this.confirmBeforeBackText = '¿Confirma qué quiere volver a la página anterior?';
  }

  ngOnInit(): void { }
}
