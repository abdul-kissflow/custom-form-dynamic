
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
declare class Component { 
	_id: string 
	type: string 
	onMount(callback: Function): void; 
	refresh(): any; 
	/** @deprecated Use condition visibility instead. */
        show(): any; 
	/** @deprecated Use condition visibility instead. */
        hide(): any; 
}
declare class Popup { 
	_id: string 
	type: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	close(): any; 
	getComponent(componentId: string): Component; 
}
declare class Page { 
	_id: string 
	popup: Popup 
	type: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPopup(popupId: string, popupParams?: object): any; 
	getComponent(componentId: string): Component; 
}
declare class DecisionTable { 
	evaluate(payload?: object): any; 
}
declare class Dataform { 
	/**
         * Get all items from this dataform with optional filtering, sorting, and pagination
         * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
         * @returns Promise containing items and total count
         */
        getItems(options?: DataformQueryOptions): Promise<DataformQueryResponse>; 
	/**
         * Create a new item in this dataform
         * @param options - Creation options (data: initial field values, viewId: optional view ID)
         * @returns Promise containing the newly created item with _id
         */
        createItem(options?: DataformCreateItemOptions): Promise<DataformItem>; 
	/**
         * Update an existing item in this dataform
         * @param options - Update options (itemId: required, data: required updated values, viewId: optional view ID)
         * @returns Promise containing the updated item
         */
        updateItem(options: DataformUpdateItemOptions): Promise<DataformItem>; 
	importCSV(defaultValues?: object): any; 
	openForm(item: DataformItem): any; 
	/**
         * Get a form instance for a specific dataform record
         * This returns a Form instance that uses the shared form store
         * allowing you to manage dataform records with form SDK methods
         *
         * @param instanceId - The instance ID of the dataform record
         * @returns Form instance for managing the record
         *
         * @example
         * const dataform = kf.app.getDataform("EmpMaster");
         * const form = dataform.getForm("emp_123");
         * const data = await form.toJSON();
         * await form.updateField({ firstName: "John" });
         */
        getForm(instanceId: string): Form; 
	/**
         * Initialize a form with all necessary data (schema, item data, form store)
         * This is the recommended way to create a custom form for dataform records
         * It automatically handles fetching schema, item data, and initializing the form store
         *
         * @param instanceId - Optional instance ID of the dataform record. If omitted, creates a new record
         * @returns Promise with Form instance ready to use
         *
         * @example
         * // Load existing record
         * const dataform = kf.app.getDataform("EmpMaster");
         * const form = await dataform.initForm("emp_123");
         * const data = await form.toJSON();
         *
         * // Create new record
         * const form = await dataform.initForm();
         * await form.updateField({ firstName: "John" });
         */
        initForm(instanceId?: string): Promise<Form>; 
}
declare class Board { 
	importCSV(defaultValues?: object): any; 
	openForm(item: BoardItem): any; 
}
declare class Process { 
	openForm(item: ProcessItem): any; 
}
declare class Application { 
	page: Page 
	_id: string 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPage(pageId: string, pageParams?: object): any; 
	getDecisionTable(flowId: string): DecisionTable; 
	getDataform(flowId: string): Dataform; 
	getBoard(flowId: string): Board; 
	getProcess(flowId: string): Process; 
}
declare class kf { 
	static context: Component 
	static client: Client 
	static formatter: Formatter 
	static app: Application 
	static user: userObject 
	static env: environmentObject 
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
