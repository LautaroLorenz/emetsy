import { Injectable } from "@angular/core";
import { Command } from "../models";

@Injectable({
  providedIn: "root"
})
export class CommunicationService {

  constructor() { }

  send(command: Command): void {
    // TODO:
  }
}