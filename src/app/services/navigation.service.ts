import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PageUrlName } from "../models";


@Injectable({
  providedIn: "root"
})
export class NavigationService {

  constructor(
    private readonly router: Router,
  ) { }

  public go(page: PageUrlName, options: {
    forceReload?: boolean,
    queryParams?: { [key: string]: any },
  } = {
      forceReload: false,
      queryParams: {}
    }) {
    if (options.forceReload) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/'.concat(page)], { queryParams: options.queryParams })
      );
    } else {
      this.router.navigate(['/'.concat(page)], { queryParams: options.queryParams });
    }
  }

  public back(options: { targetPage: PageUrlName }): void {
    this.router.navigate(['/'.concat(options.targetPage)]);
  }
}
