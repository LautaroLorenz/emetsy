import { Result } from "../components/stand-result.model";

export interface ReportStand {
  standIndex: number;
  brandModel: string | null;
  value: number | null;
  result: Result | null;
  serialNumber: string;
  yearOfProduction: number;
}
