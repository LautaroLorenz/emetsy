import { ReportBuilder } from "./report.model";

export class ReportContrastTest {
  private builder!: ReportBuilder;

  public setBuilder(builder: ReportBuilder): void {
    this.builder = builder;
  }

  public buildContrastTestReport(): void {
    this.builder.produceHeader();
    this.builder.produceBody();
    this.builder.produceFooter();
  }

}