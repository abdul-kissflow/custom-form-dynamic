
declare class Form { 
	type: string 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
	getValidationErrors(): any; 
	getTable(tableId: string): Table; 
}
declare class Table { 
	toJSON(): any; 
	getSelectedRows(): any; 
	getRows(): TableForm[]; 
	getRow(rowId: string): TableForm; 
	addRow(rowObject: object): any; 
	addRows(rows: object[]): any; 
	deleteRow(rowId: string): any; 
	deleteRows(rows: string[]): any; 
}
declare class TableForm { 
	type: string 
	getParent(): Form; 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
}
declare class Client { 
	showInfo(message: string | object): any; 
	showConfirm(args: {
            title: string;
            content: string;
            okText: string;
            cancelText: string;
        }): any; 
	redirect(url: string): any; 
}
declare class Formatter { 
	toDate(date: string): any; 
	toDateTime(date: string): any; 
	toNumber(value: string): any; 
	toCurrency(value: string, currencyCode: string): any; 
	toBoolean(value: string): any; 
}
declare class kf { 
	static context: Form 
	static client: Client 
	static formatter: Formatter 
	static user: userObject 
	static account: accountObject 
	static eventParameters: any 
	static api(url: string, args?: FetchOptions): Promise<any>; 
}
declare type userObject = {
  _id: string;
  Name: string;
  Email: string;
  /** @deprecated Use AppRoles instead. */
  Role: string;
  AppRoles: rolesObject[];
};

declare type rolesObject = {
  _id: string;
  Name: string;
};

declare type accountObject = {
  _id: string;
};

declare type environmentObject = {
  isMobile: boolean;
};

declare type BoardItem = {
  _id: string;
  _view_id: string;
};

declare type DataformItem = {
  _id: string;
};

declare type ProcessItem = {
  _id: string;
  _activity_instance_id: string;
};

declare type FetchOptions = {
  method?: string;
  body?: string | object;
  headers?: object;
};

declare type DataformQueryOptions = {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: object;
  sortBy?: Array<{ field: string; isDescending: boolean }>;
};

declare type DataformQueryResponse = {
  items: any[];
  total: number;
  page?: number;
  pageSize?: number;
};

declare type DataformCreateItemOptions = {
  data?: object;
  viewId?: string;
};

declare type DataformUpdateItemOptions = {
  itemId: string;  // Required: the _id of the item to update
  data: object;    // Required: the updated field values
  viewId?: string; // Optional: view ID for view-specific update
};
