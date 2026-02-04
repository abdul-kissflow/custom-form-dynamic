declare module "core/constants" {
    export const LISTENER_CMDS: {
        API: string;
        GET_CONTEXT: string;
        RETURN: string;
        GET_FORM_FIELD: string;
        UPDATE_FORM: string;
        GET_TABLE: string;
        GET_TABLE_ROW: string;
        ADD_TABLE_ROW: string;
        ADD_TABLE_ROWS: string;
        DELETE_TABLE_ROW: string;
        TO_JSON: string;
        GET_TABLE_ROWS: string;
        GET_SELECTED_TABLE_ROWS: string;
        GET_FORM_VALIDATION_ERRORS: string;
        MESSAGE: string;
        CONFIRM: string;
        ALERT: string;
        REDIRECT: string;
        OPEN_PAGE: string;
        FORMAT_DATE: string;
        FORMAT_DATE_TIME: string;
        FORMAT_NUMBER: string;
        FORMAT_CURRENCY: string;
        FORMAT_BOOLEAN: string;
        GET_APP_VARIABLE: string;
        SET_APP_VARIABLE: string;
        GET_PAGE_VARIABLE: string;
        SET_PAGE_VARIABLE: string;
        GET_PAGE_PARAMS: string;
        GET_ALL_PAGE_PARAMS: string;
        PAGE_ON_CLOSE: string;
        OPEN_POPUP: string;
        GET_POPUP_PARAMS: string;
        GET_ALL_POPUP_PARAMS: string;
        CLOSE_POPUP: string;
        COMPONENT_GET: string;
        COMPONENT_REFRESH: string;
        COMPONENT_SHOW: string;
        COMPONENT_HIDE: string;
        COMPONENT_ADD_EVENT_LISTENER: string;
        CC_INITIALIZE: string;
        CC_WATCH_PARAMS: string;
        WINDOW_NDEF_READER_NEW: string;
        WINDOW_NDEF_READER_SCAN: string;
        WINDOW_NDEF_READER_WRITE: string;
        WINDOW_NDEF_READER_ADD_EVENT_LISTENER: string;
        WINDOW_NDEF_READER_MAKE_READONLY: string;
        WINDOW_NDEF_READER_ABORT_SCAN: string;
        DECISION_TABLE_EXECUTE: string;
        DATAFORM_IMPORT_CSV: string;
        DATAFORM_OPEN_FORM: string;
        DATAFORM_GET_ITEMS: string;
        DATAFORM_CREATE_ITEM: string;
        DATAFORM_UPDATE_ITEM: string;
        DATAFORM_INIT_FORM: string;
        PROCESS_OPEN_FORM: string;
        BOARD_IMPORT_CSV: string;
        BOARD_OPEN_FORM: string;
    };
    export const EVENT_TYPES: {
        COMPONENT_ON_MOUNT: string;
        CC_ON_PARAMS_CHANGE: string;
    };
    export const DEFAULTS: {
        POPUP_ID: string;
    };
}
declare module "core/index" {
    export function generateId(prefix?: string): string;
    export const globalInstances: {};
    export class EventBase {
        #private;
        constructor();
        _addEventListener(eventName: string, callBack: Function): void;
        _removeEventListener(eventName: string, callBack?: any): void;
        _dispatchEvent(eventName: string, eventParams: object): boolean;
        _dispatchMessageEvents(req: any, resp: any): void;
    }
    export class BaseSDK extends EventBase {
        _postMessageAsync(command: string, args: any, hasCallBack?: boolean, callBack?: (data: any) => {}): object | string | any;
        _postMessage(command: string, args: any, callBack?: any): void;
        _postMessageSync(command: string, args: any): any;
    }
    export * from "core/constants";
}
declare module "form/index" {
    import { BaseSDK } from "core/index";
    export class Form extends BaseSDK {
        private instanceId;
        private flowId;
        type: string;
        constructor(instanceId: string, flowId?: string);
        toJSON(): any;
        getField(fieldId: string): any;
        updateField(args: object): any;
        getValidationErrors(): any;
        getTable(tableId: string): Table;
    }
    class Table extends BaseSDK {
        private tableId;
        private instanceId;
        constructor(instanceId: string, tableId: string);
        toJSON(): any;
        getSelectedRows(): any;
        getRows(): TableForm[];
        getRow(rowId: string): TableForm;
        addRow(rowObject: object): any;
        addRows(rows: object[]): any;
        deleteRow(rowId: string): any;
        deleteRows(rows: string[]): any;
    }
    export class TableForm extends BaseSDK {
        private instanceId;
        private tableId;
        private rowId;
        type: string;
        constructor(instanceId: string, tableId: string, rowId: string);
        getParent(): Form;
        toJSON(): any;
        getField(fieldId: string): any;
        updateField(args: object): any;
    }
}
declare module "utils/client" {
    import { BaseSDK } from "core/index";
    export class Client extends BaseSDK {
        showInfo(message: string | object): any;
        showConfirm(args: {
            title: string;
            content: string;
            okText: string;
            cancelText: string;
        }): any;
        redirect(url: string): any;
    }
}
declare module "utils/formatter" {
    import { BaseSDK } from "core/index";
    export class Formatter extends BaseSDK {
        toDate(date: string): any;
        toDateTime(date: string): any;
        toNumber(value: string): any;
        toCurrency(value: string, currencyCode: string): any;
        toBoolean(value: string): any;
    }
}
declare module "utils/index" {
    export * from "utils/client";
    export * from "utils/formatter";
    export const isObject: (value: any) => boolean;
}
declare module "window/NDEFReader" {
    import { BaseSDK } from "core/index";
    export class NDEFReader extends BaseSDK {
        id: string;
        constructor();
        scan(): Promise<unknown>;
        write(data: any): Promise<unknown>;
        addEventListener(eventName: string, cb: Function): void;
        makeReadOnly(): Promise<unknown>;
        abortScan(): Promise<unknown>;
    }
}
declare module "window/index" {
    import { NDEFReader } from "window/NDEFReader";
    export const window: {
        NDEFReader: typeof NDEFReader;
    };
}
declare module "types/external" {
    export type userObject = {
        _id: string;
        Name: string;
        Email: string;
        /** @deprecated Use AppRoles instead. */
        Role: string;
        AppRoles: rolesObject[];
    };
    export type rolesObject = {
        _id: string;
        Name: string;
    };
    export type accountObject = {
        _id: string;
    };
    export type environmentObject = {
        isMobile: boolean;
    };
    export type BoardItem = {
        _id: string;
        _view_id: string;
    };
    export type DataformItem = {
        _id: string;
    };
    export type ProcessItem = {
        _id: string;
        _activity_instance_id: string;
    };
    export type FetchOptions = {
        method?: string;
        body?: string | object;
        headers?: object;
    };
    export type DataformQueryOptions = {
        searchValue?: string;
        pageNumber?: number;
        pageSize?: number;
        filters?: object;
        sortBy?: Array<{
            field: string;
            isDescending: boolean;
        }>;
    };
    export type DataformQueryResponse = {
        items: any[];
        total: number;
        page?: number;
        pageSize?: number;
    };
    export type DataformCreateItemOptions = {
        data?: object;
        viewId?: string;
    };
    export type DataformUpdateItemOptions = {
        itemId: string;
        data: object;
        viewId?: string;
    };
}
declare module "types/internal" {
    import { userObject, accountObject, environmentObject } from "types/external";
    export interface SDKContext {
        formInstanceId: string;
        tableId: string;
        tableRowId: string;
        componentId: string;
        componentMethods?: componentMethodsType[];
        appId: string;
        pageId: string;
        popupId: string;
        user: userObject;
        account: accountObject;
        csrfToken: string;
        envDetails: environmentObject;
    }
    export interface componentMethodsType {
        name: string;
        returnType?: string;
        parameters?: string[];
    }
    export interface ComponentProps {
        componentId: string;
        componentMethods?: componentMethodsType[];
    }
    export interface AppContext {
        appId: string;
        pageId: string;
    }
    export interface PageContext {
        pageId: string;
    }
    export interface PopupContext {
        popupId?: string;
    }
}
declare module "nocode" {
    import { BaseSDK } from "core/index";
    import { Form, TableForm } from "form/index";
    import { Client, Formatter } from "utils/index";
    import { window } from "window/index";
    import { SDKContext } from "types/internal";
    import { userObject, accountObject, FetchOptions } from "types/external";
    class NocodeSDK extends BaseSDK {
        #private;
        context: Form | TableForm;
        client: Client;
        formatter: Formatter;
        user: userObject;
        account: accountObject;
        eventParameters: any;
        constructor(props: SDKContext);
        api(url: string, args?: FetchOptions): Promise<any>;
    }
    function initSDK(config: SDKContext): NocodeSDK;
    export { window, initSDK as default };
}
declare module "app/component" {
    import { BaseSDK } from "core/index";
    import { ComponentProps } from "types/internal";
    export class Component extends BaseSDK {
        #private;
        _id: string;
        type: string;
        constructor(props: ComponentProps);
        onMount(callback: Function): void;
        refresh(): any;
        /** @deprecated Use condition visibility instead. */
        show(): any;
        /** @deprecated Use condition visibility instead. */
        hide(): any;
    }
    export class CustomComponent extends BaseSDK {
        type: string;
        _id: string;
        constructor(id: any);
        watchParams(callBack: (data: any) => any): void;
    }
}
declare module "app/dataform" {
    import { BaseSDK } from "core/index";
    import { Form } from "form/index";
    import { DataformItem, DataformQueryOptions, DataformQueryResponse, DataformCreateItemOptions, DataformUpdateItemOptions } from "types/external";
    export class Dataform extends BaseSDK {
        private _id;
        constructor(flowId: string);
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
}
declare module "app/decisiontable" {
    import { BaseSDK } from "core/index";
    export class DecisionTable extends BaseSDK {
        private flowId;
        constructor(flowId: string);
        evaluate(payload?: object): any;
    }
}
declare module "core/proxy" {
    export class CreateProxy {
        path: string[];
        parent: object;
        constructor(parent: object, target?: {}, path?: any[]);
        get(target: object, property: string): any;
        set(target: object, property: string, value: any, reciever: any): any;
    }
}
declare module "app/popup" {
    import { BaseSDK } from "core/index";
    import { Component } from "app/component";
    import { PopupContext } from "types/internal";
    export class Popup extends BaseSDK {
        _id: string;
        type: string;
        constructor(props: PopupContext);
        getParameter(key: string): any;
        getAllParameters(): any;
        close(): any;
        getComponent(componentId: string): Component;
    }
}
declare module "app/page" {
    import { BaseSDK } from "core/index";
    import { Component } from "app/component";
    import { Popup } from "app/popup";
    import { PageContext } from "types/internal";
    export class Page extends BaseSDK {
        _id: string;
        popup: Popup;
        type: string;
        constructor(props: PageContext, isCustomComponent?: boolean);
        getParameter(key: string): any;
        getAllParameters(): any;
        getVariable(key: string): any;
        setVariable(key: string | object, value?: any): any;
        openPopup(popupId: string, popupParams?: object): any;
        getComponent(componentId: string): Component;
    }
}
declare module "board/index" {
    import { BaseSDK } from "core/index";
    import { BoardItem } from "types/external";
    export class Board extends BaseSDK {
        private _id;
        constructor(flowId: string);
        importCSV(defaultValues?: object): any;
        openForm(item: BoardItem): any;
    }
}
declare module "process/index" {
    import { BaseSDK } from "core/index";
    import { ProcessItem } from "types/external";
    export class Process extends BaseSDK {
        private _id;
        constructor(flowId: string);
        openForm(item: ProcessItem): any;
    }
}
declare module "app/index" {
    import { BaseSDK } from "core/index";
    import { Page } from "app/page";
    import { AppContext } from "types/internal";
    import { DecisionTable } from "app/decisiontable";
    import { Dataform } from "app/dataform";
    import { Board } from "board/index";
    import { Process } from "process/index";
    export class Application extends BaseSDK {
        page: Page;
        _id: string;
        constructor(props: AppContext, isCustomComponent?: boolean);
        getVariable(key: string): any;
        setVariable(key: string | object, value?: any): any;
        openPage(pageId: string, pageParams?: object): any;
        getDecisionTable(flowId: string): DecisionTable;
        getDataform(flowId: string): Dataform;
        getBoard(flowId: string): Board;
        getProcess(flowId: string): Process;
    }
    export * from "app/component";
    export { Page };
    export * from "app/popup";
}
