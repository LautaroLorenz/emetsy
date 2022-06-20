export interface AbmColum {
  field: string;
  header: string;
}

export interface RequestTableResponse<T> {
  tableNameReply: string;
  rows: T[];
}
