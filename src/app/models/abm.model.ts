export interface AbmColum {
  field: string;
  header: string;
  sortable: boolean;
  styleClass?: string;
  headerTooltip?: string;
  colSpan?: number;
  colSpanFields?: string[];
}
