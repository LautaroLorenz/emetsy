import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, PrimeIcons } from "primeng/api";
import { PageUrlName } from "../models";


@Injectable({
  providedIn: "root"
})
export class NavigationService {

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly router: Router,
  ) { }

  public go(page: PageUrlName, options: {
    forceReload: boolean
  } = {
    forceReload: false
  }) {
    if (options.forceReload) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/'.concat(page)]));
    } else {
      this.router.navigate(['/'.concat(page)]);
    }
  }

  public back(options: {
    targetPage: PageUrlName,
    withConfirmation: boolean;
    confirmBeforeBackText?: string;
    confirmBeforeBackHeader?: string;
  }): void {
    if (!options.withConfirmation) {
      this.router.navigate(['/'.concat(options.targetPage)]);
      return;
    }

    this.confirmationService.confirm({
      message: options.confirmBeforeBackText,
      header: options.confirmBeforeBackHeader,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-outlined",
      accept: () => {
        this.router.navigate(['/'.concat(options.targetPage)]);
      }
    });
  }
}