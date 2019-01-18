/* tslint:disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v12.0.11.0 (NJsonSchema v9.13.13.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

export const API_BASE_URL_DASHBOARD = new InjectionToken<string>('API_BASE_URL_DASHBOARD');

export interface IDefinitionsProxy {
    getAllDefinitions(): Observable<DashboardDefinition[] | null>;
    createDefinition(definition: DashboardDefinition): Observable<DashboardDefinition | null>;
    getDefinition(id: number): Observable<DashboardDefinition | null>;
    updateDefinition(id: number, definition: DashboardDefinition): Observable<DashboardDefinition | null>;
    deleteDefinition(id: number): Observable<number>;
}

@Injectable({
    providedIn: 'root'
})
export class DefinitionsProxy implements IDefinitionsProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL_DASHBOARD) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getAllDefinitions(): Observable<DashboardDefinition[] | null> {
        let url_ = this.baseUrl + "/api/Definitions";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllDefinitions(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllDefinitions(<any>response_);
                } catch (e) {
                    return <Observable<DashboardDefinition[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardDefinition[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetAllDefinitions(response: HttpResponseBase): Observable<DashboardDefinition[] | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200 && resultData200.constructor === Array) {
                result200 = [];
                for (let item of resultData200)
                    result200.push(DashboardDefinition.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardDefinition[] | null>(<any>null);
    }

    createDefinition(definition: DashboardDefinition): Observable<DashboardDefinition | null> {
        let url_ = this.baseUrl + "/api/Definitions";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(definition);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processCreateDefinition(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreateDefinition(<any>response_);
                } catch (e) {
                    return <Observable<DashboardDefinition | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardDefinition | null>><any>_observableThrow(response_);
        }));
    }

    protected processCreateDefinition(response: HttpResponseBase): Observable<DashboardDefinition | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 201) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result201: any = null;
            let resultData201 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result201 = resultData201 ? DashboardDefinition.fromJS(resultData201) : <any>null;
            return _observableOf(result201);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardDefinition | null>(<any>null);
    }

    getDefinition(id: number): Observable<DashboardDefinition | null> {
        let url_ = this.baseUrl + "/api/Definitions/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetDefinition(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetDefinition(<any>response_);
                } catch (e) {
                    return <Observable<DashboardDefinition | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardDefinition | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetDefinition(response: HttpResponseBase): Observable<DashboardDefinition | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DashboardDefinition.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 ? ProblemDetails.fromJS(resultData404) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardDefinition | null>(<any>null);
    }

    updateDefinition(id: number, definition: DashboardDefinition): Observable<DashboardDefinition | null> {
        let url_ = this.baseUrl + "/api/Definitions/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(definition);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdateDefinition(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateDefinition(<any>response_);
                } catch (e) {
                    return <Observable<DashboardDefinition | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardDefinition | null>><any>_observableThrow(response_);
        }));
    }

    protected processUpdateDefinition(response: HttpResponseBase): Observable<DashboardDefinition | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DashboardDefinition.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 ? ProblemDetails.fromJS(resultData404) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardDefinition | null>(<any>null);
    }

    deleteDefinition(id: number): Observable<number> {
        let url_ = this.baseUrl + "/api/Definitions/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processDeleteDefinition(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDeleteDefinition(<any>response_);
                } catch (e) {
                    return <Observable<number>><any>_observableThrow(e);
                }
            } else
                return <Observable<number>><any>_observableThrow(response_);
        }));
    }

    protected processDeleteDefinition(response: HttpResponseBase): Observable<number> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 ? ProblemDetails.fromJS(resultData404) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result400: any = null;
            let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result400 = resultData400 ? ProblemDetails.fromJS(resultData400) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<number>(<any>null);
    }
}

export interface IElementsProxy {
    getAllElements(): Observable<DashboardElement[] | null>;
    getElement(id: number): Observable<DashboardElement | null>;
    updateElement(id: number, element: DashboardElement): Observable<DashboardElement | null>;
}

@Injectable({
    providedIn: 'root'
})
export class ElementsProxy implements IElementsProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL_DASHBOARD) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getAllElements(): Observable<DashboardElement[] | null> {
        let url_ = this.baseUrl + "/api/Elements";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllElements(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllElements(<any>response_);
                } catch (e) {
                    return <Observable<DashboardElement[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardElement[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetAllElements(response: HttpResponseBase): Observable<DashboardElement[] | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200 && resultData200.constructor === Array) {
                result200 = [];
                for (let item of resultData200)
                    result200.push(DashboardElement.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardElement[] | null>(<any>null);
    }

    getElement(id: number): Observable<DashboardElement | null> {
        let url_ = this.baseUrl + "/api/Elements/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetElement(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetElement(<any>response_);
                } catch (e) {
                    return <Observable<DashboardElement | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardElement | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetElement(response: HttpResponseBase): Observable<DashboardElement | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DashboardElement.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 ? ProblemDetails.fromJS(resultData404) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardElement | null>(<any>null);
    }

    updateElement(id: number, element: DashboardElement): Observable<DashboardElement | null> {
        let url_ = this.baseUrl + "/api/Elements/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(element);

        let options_ : any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processUpdateElement(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdateElement(<any>response_);
                } catch (e) {
                    return <Observable<DashboardElement | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<DashboardElement | null>><any>_observableThrow(response_);
        }));
    }

    protected processUpdateElement(response: HttpResponseBase): Observable<DashboardElement | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? DashboardElement.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status === 404) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result404: any = null;
            let resultData404 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result404 = resultData404 ? ProblemDetails.fromJS(resultData404) : <any>null;
            return throwException("A server error occurred.", status, _responseText, _headers, result404);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<DashboardElement | null>(<any>null);
    }
}

export abstract class EntityBase implements IEntityBase {
    id!: number;

    constructor(data?: IEntityBase) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
        }
    }

    static fromJS(data: any): EntityBase {
        data = typeof data === 'object' ? data : {};
        throw new Error("The abstract class 'EntityBase' cannot be instantiated.");
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        return data; 
    }

    clone(): EntityBase {
        throw new Error("The abstract class 'EntityBase' cannot be instantiated.");
    }
}

export interface IEntityBase {
    id: number;
}

export class DashboardElement extends EntityBase implements IDashboardElement {
    name?: string | undefined;
    position!: number;

    constructor(data?: IDashboardElement) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.name = data["name"];
            this.position = data["position"];
        }
    }

    static fromJS(data: any): DashboardElement {
        data = typeof data === 'object' ? data : {};
        let result = new DashboardElement();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["position"] = this.position;
        super.toJSON(data);
        return data; 
    }

    clone(): DashboardElement {
        const json = this.toJSON();
        let result = new DashboardElement();
        result.init(json);
        return result;
    }
}

export interface IDashboardElement extends IEntityBase {
    name?: string | undefined;
    position: number;
}

export class DashboardDefinition extends DashboardElement implements IDashboardDefinition {
    columns!: number;
    requestType!: RequestType;
    valueAtTimeTarget?: Date | undefined;
    historyTimePeriod?: TimePeriod | undefined;
    tiles?: DashboardTile[] | undefined;
    settings?: DashboardSetting[] | undefined;

    constructor(data?: IDashboardDefinition) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.columns = data["columns"];
            this.requestType = data["requestType"];
            this.valueAtTimeTarget = data["valueAtTimeTarget"] ? new Date(data["valueAtTimeTarget"].toString()) : <any>undefined;
            this.historyTimePeriod = data["historyTimePeriod"] ? TimePeriod.fromJS(data["historyTimePeriod"]) : <any>undefined;
            if (data["tiles"] && data["tiles"].constructor === Array) {
                this.tiles = [];
                for (let item of data["tiles"])
                    this.tiles.push(DashboardTile.fromJS(item));
            }
            if (data["settings"] && data["settings"].constructor === Array) {
                this.settings = [];
                for (let item of data["settings"])
                    this.settings.push(DashboardSetting.fromJS(item));
            }
        }
    }

    static fromJS(data: any): DashboardDefinition {
        data = typeof data === 'object' ? data : {};
        let result = new DashboardDefinition();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["columns"] = this.columns;
        data["requestType"] = this.requestType;
        data["valueAtTimeTarget"] = this.valueAtTimeTarget ? this.valueAtTimeTarget.toISOString() : <any>undefined;
        data["historyTimePeriod"] = this.historyTimePeriod ? this.historyTimePeriod.toJSON() : <any>undefined;
        if (this.tiles && this.tiles.constructor === Array) {
            data["tiles"] = [];
            for (let item of this.tiles)
                data["tiles"].push(item.toJSON());
        }
        if (this.settings && this.settings.constructor === Array) {
            data["settings"] = [];
            for (let item of this.settings)
                data["settings"].push(item.toJSON());
        }
        super.toJSON(data);
        return data; 
    }

    clone(): DashboardDefinition {
        const json = this.toJSON();
        let result = new DashboardDefinition();
        result.init(json);
        return result;
    }
}

export interface IDashboardDefinition extends IDashboardElement {
    columns: number;
    requestType: RequestType;
    valueAtTimeTarget?: Date | undefined;
    historyTimePeriod?: TimePeriod | undefined;
    tiles?: DashboardTile[] | undefined;
    settings?: DashboardSetting[] | undefined;
}

export enum RequestType {
    Live = 0, 
    ValueAtTime = 1, 
    History = 2, 
}

export class TimePeriod extends EntityBase implements ITimePeriod {
    type!: TimePeriodType;
    timeScale!: RelativeTimeScale;
    offsetFromNow!: number;
    startTime?: Date | undefined;
    endTime?: Date | undefined;
    dashboardDefinitionId!: number;

    constructor(data?: ITimePeriod) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.type = data["type"];
            this.timeScale = data["timeScale"];
            this.offsetFromNow = data["offsetFromNow"];
            this.startTime = data["startTime"] ? new Date(data["startTime"].toString()) : <any>undefined;
            this.endTime = data["endTime"] ? new Date(data["endTime"].toString()) : <any>undefined;
            this.dashboardDefinitionId = data["dashboardDefinitionId"];
        }
    }

    static fromJS(data: any): TimePeriod {
        data = typeof data === 'object' ? data : {};
        let result = new TimePeriod();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["type"] = this.type;
        data["timeScale"] = this.timeScale;
        data["offsetFromNow"] = this.offsetFromNow;
        data["startTime"] = this.startTime ? this.startTime.toISOString() : <any>undefined;
        data["endTime"] = this.endTime ? this.endTime.toISOString() : <any>undefined;
        data["dashboardDefinitionId"] = this.dashboardDefinitionId;
        super.toJSON(data);
        return data; 
    }

    clone(): TimePeriod {
        const json = this.toJSON();
        let result = new TimePeriod();
        result.init(json);
        return result;
    }
}

export interface ITimePeriod extends IEntityBase {
    type: TimePeriodType;
    timeScale: RelativeTimeScale;
    offsetFromNow: number;
    startTime?: Date | undefined;
    endTime?: Date | undefined;
    dashboardDefinitionId: number;
}

export enum TimePeriodType {
    Relative = 0, 
    Absolute = 1, 
}

export enum RelativeTimeScale {
    Seconds = 0, 
    Minutes = 1, 
    Hours = 2, 
    Days = 3, 
}

export class DashboardTile extends EntityBase implements IDashboardTile {
    sourceId!: number;
    important!: boolean;
    columnSpan!: number;
    rowSpan!: number;
    position!: number;
    dashboardDefinitionId!: number;

    constructor(data?: IDashboardTile) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.sourceId = data["sourceId"];
            this.important = data["important"];
            this.columnSpan = data["columnSpan"];
            this.rowSpan = data["rowSpan"];
            this.position = data["position"];
            this.dashboardDefinitionId = data["dashboardDefinitionId"];
        }
    }

    static fromJS(data: any): DashboardTile {
        data = typeof data === 'object' ? data : {};
        let result = new DashboardTile();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["sourceId"] = this.sourceId;
        data["important"] = this.important;
        data["columnSpan"] = this.columnSpan;
        data["rowSpan"] = this.rowSpan;
        data["position"] = this.position;
        data["dashboardDefinitionId"] = this.dashboardDefinitionId;
        super.toJSON(data);
        return data; 
    }

    clone(): DashboardTile {
        const json = this.toJSON();
        let result = new DashboardTile();
        result.init(json);
        return result;
    }
}

export interface IDashboardTile extends IEntityBase {
    sourceId: number;
    important: boolean;
    columnSpan: number;
    rowSpan: number;
    position: number;
    dashboardDefinitionId: number;
}

export class DashboardSetting extends EntityBase implements IDashboardSetting {
    settingId!: number;
    numberValue?: number | undefined;
    booleanValue?: boolean | undefined;
    stringValue?: string | undefined;
    dateValue?: Date | undefined;
    dashboardDefinitionId!: number;

    constructor(data?: IDashboardSetting) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.settingId = data["settingId"];
            this.numberValue = data["numberValue"];
            this.booleanValue = data["booleanValue"];
            this.stringValue = data["stringValue"];
            this.dateValue = data["dateValue"] ? new Date(data["dateValue"].toString()) : <any>undefined;
            this.dashboardDefinitionId = data["dashboardDefinitionId"];
        }
    }

    static fromJS(data: any): DashboardSetting {
        data = typeof data === 'object' ? data : {};
        let result = new DashboardSetting();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["settingId"] = this.settingId;
        data["numberValue"] = this.numberValue;
        data["booleanValue"] = this.booleanValue;
        data["stringValue"] = this.stringValue;
        data["dateValue"] = this.dateValue ? this.dateValue.toISOString() : <any>undefined;
        data["dashboardDefinitionId"] = this.dashboardDefinitionId;
        super.toJSON(data);
        return data; 
    }

    clone(): DashboardSetting {
        const json = this.toJSON();
        let result = new DashboardSetting();
        result.init(json);
        return result;
    }
}

export interface IDashboardSetting extends IEntityBase {
    settingId: number;
    numberValue?: number | undefined;
    booleanValue?: boolean | undefined;
    stringValue?: string | undefined;
    dateValue?: Date | undefined;
    dashboardDefinitionId: number;
}

export class ProblemDetails implements IProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;

    constructor(data?: IProblemDetails) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.type = data["type"];
            this.title = data["title"];
            this.status = data["status"];
            this.detail = data["detail"];
            this.instance = data["instance"];
        }
    }

    static fromJS(data: any): ProblemDetails {
        data = typeof data === 'object' ? data : {};
        let result = new ProblemDetails();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["type"] = this.type;
        data["title"] = this.title;
        data["status"] = this.status;
        data["detail"] = this.detail;
        data["instance"] = this.instance;
        return data; 
    }

    clone(): ProblemDetails {
        const json = this.toJSON();
        let result = new ProblemDetails();
        result.init(json);
        return result;
    }
}

export interface IProblemDetails {
    type?: string | undefined;
    title?: string | undefined;
    status?: number | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
}

export class SwaggerException extends Error {
    message: string;
    status: number; 
    response: string; 
    headers: { [key: string]: any; };
    result: any; 

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    return _observableThrow(new SwaggerException(message, status, response, headers, result));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader(); 
            reader.onload = event => { 
                observer.next((<any>event.target).result);
                observer.complete();
            };
            reader.readAsText(blob); 
        }
    });
}