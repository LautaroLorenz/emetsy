import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ConfirmationService, PrimeIcons } from "primeng/api";


@Injectable({
  providedIn: "root"
})
export class NavigationService {

  constructor(
    private readonly location: Location,
    private readonly confirmationService: ConfirmationService,
  ) { }

  public back(options: {
    withConfirmation: boolean;
    confirmBeforeBackText?: string;
    confirmBeforeBackHeader?: string;
  }): void {
    if(!options.withConfirmation) {
      this.location.back();
      return;
    }

    this.confirmationService.confirm({
      message: options.confirmBeforeBackText,
      header: options.confirmBeforeBackHeader,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-outlined",
      accept: () => {
        this.location.back();
      }
    });
  }
}