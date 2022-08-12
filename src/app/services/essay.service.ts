import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { EssayTemplate, EssayTemplateStep } from "../models";
import { IpcService } from "./ipc.service";

@Injectable({
  providedIn: "root"
})
export class EssayService {

  constructor(
    private readonly ipcService: IpcService,
  ) { }

  saveEssayTemplate$(
    essayTemplate: EssayTemplate,
    essayTemplateSteps: EssayTemplateStep[],
  ): Observable<{ essayTemplate: EssayTemplate, essayTemplateSteps: EssayTemplateStep[] }> {
    return from(this.ipcService.invoke(
      'save-essay-template',
      {
        essayTemplate,
        essayTemplateSteps
      }
    ));
  }
}