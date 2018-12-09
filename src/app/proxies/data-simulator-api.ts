/* tslint:disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v12.0.0.0 (NJsonSchema v9.12.2.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

export const API_BASE_URL_SIMULATOR = new InjectionToken<string>('API_BASE_URL_SIMULATOR');

export interface IDataProxy {
    getHistoryAbsolute(options: AbsoluteHistoryRequest): Observable<HistoryResponse | null>;
    getHistoryRelative(request: RelativeHistoryRequest): Observable<HistoryResponse | null>;
    getValueAtTime(request: ValueAtTimeRequest): Observable<TagValue[] | null>;
    getLiveValue(tags: TagId[]): Observable<TagValue[] | null>;
}

@Injectable({
    providedIn: 'root'
})
export class DataProxy implements IDataProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL_SIMULATOR) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getHistoryAbsolute(options: AbsoluteHistoryRequest): Observable<HistoryResponse | null> {
        let url_ = this.baseUrl + "/api/Data/history/absolute";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(options);

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
            return this.processGetHistoryAbsolute(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetHistoryAbsolute(<any>response_);
                } catch (e) {
                    return <Observable<HistoryResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<HistoryResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetHistoryAbsolute(response: HttpResponseBase): Observable<HistoryResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? HistoryResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<HistoryResponse | null>(<any>null);
    }

    getHistoryRelative(request: RelativeHistoryRequest): Observable<HistoryResponse | null> {
        let url_ = this.baseUrl + "/api/Data/history/relative";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(request);

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
            return this.processGetHistoryRelative(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetHistoryRelative(<any>response_);
                } catch (e) {
                    return <Observable<HistoryResponse | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<HistoryResponse | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetHistoryRelative(response: HttpResponseBase): Observable<HistoryResponse | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? HistoryResponse.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<HistoryResponse | null>(<any>null);
    }

    getValueAtTime(request: ValueAtTimeRequest): Observable<TagValue[] | null> {
        let url_ = this.baseUrl + "/api/Data/valueattime";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(request);

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
            return this.processGetValueAtTime(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetValueAtTime(<any>response_);
                } catch (e) {
                    return <Observable<TagValue[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<TagValue[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetValueAtTime(response: HttpResponseBase): Observable<TagValue[] | null> {
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
                    result200.push(TagValue.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<TagValue[] | null>(<any>null);
    }

    getLiveValue(tags: TagId[]): Observable<TagValue[] | null> {
        let url_ = this.baseUrl + "/api/Data/livevalue";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(tags);

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
            return this.processGetLiveValue(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetLiveValue(<any>response_);
                } catch (e) {
                    return <Observable<TagValue[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<TagValue[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetLiveValue(response: HttpResponseBase): Observable<TagValue[] | null> {
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
                    result200.push(TagValue.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<TagValue[] | null>(<any>null);
    }
}

export interface ITagsProxy {
    getAllTags(): Observable<SimulatorTag[] | null>;
    get(id: TagId): Observable<SimulatorTag | null>;
}

@Injectable({
    providedIn: 'root'
})
export class TagsProxy implements ITagsProxy {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL_SIMULATOR) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    getAllTags(): Observable<SimulatorTag[] | null> {
        let url_ = this.baseUrl + "/api/Tags";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAllTags(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAllTags(<any>response_);
                } catch (e) {
                    return <Observable<SimulatorTag[] | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<SimulatorTag[] | null>><any>_observableThrow(response_);
        }));
    }

    protected processGetAllTags(response: HttpResponseBase): Observable<SimulatorTag[] | null> {
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
                    result200.push(SimulatorTag.fromJS(item));
            }
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SimulatorTag[] | null>(<any>null);
    }

    get(id: TagId): Observable<SimulatorTag | null> {
        let url_ = this.baseUrl + "/api/Tags/{id}";
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
            return this.processGet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGet(<any>response_);
                } catch (e) {
                    return <Observable<SimulatorTag | null>><any>_observableThrow(e);
                }
            } else
                return <Observable<SimulatorTag | null>><any>_observableThrow(response_);
        }));
    }

    protected processGet(response: HttpResponseBase): Observable<SimulatorTag | null> {
        const status = response.status;
        const responseBlob = 
            response instanceof HttpResponse ? response.body : 
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 ? SimulatorTag.fromJS(resultData200) : <any>null;
            return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<SimulatorTag | null>(<any>null);
    }
}

export class HistoryResponse implements IHistoryResponse {
    startTime!: Date;
    endTime!: Date;
    values?: TagValues[] | undefined;

    constructor(data?: IHistoryResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.startTime = data["startTime"] ? new Date(data["startTime"].toString()) : <any>undefined;
            this.endTime = data["endTime"] ? new Date(data["endTime"].toString()) : <any>undefined;
            if (data["values"] && data["values"].constructor === Array) {
                this.values = [];
                for (let item of data["values"])
                    this.values.push(TagValues.fromJS(item));
            }
        }
    }

    static fromJS(data: any): HistoryResponse {
        data = typeof data === 'object' ? data : {};
        let result = new HistoryResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["startTime"] = this.startTime ? this.startTime.toISOString() : <any>undefined;
        data["endTime"] = this.endTime ? this.endTime.toISOString() : <any>undefined;
        if (this.values && this.values.constructor === Array) {
            data["values"] = [];
            for (let item of this.values)
                data["values"].push(item.toJSON());
        }
        return data; 
    }

    clone(): HistoryResponse {
        const json = this.toJSON();
        let result = new HistoryResponse();
        result.init(json);
        return result;
    }
}

export interface IHistoryResponse {
    startTime: Date;
    endTime: Date;
    values?: TagValues[] | undefined;
}

export class TagValues implements ITagValues {
    tag!: TagId;
    values?: VQT[] | undefined;

    constructor(data?: ITagValues) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.tag = data["tag"];
            if (data["values"] && data["values"].constructor === Array) {
                this.values = [];
                for (let item of data["values"])
                    this.values.push(VQT.fromJS(item));
            }
        }
    }

    static fromJS(data: any): TagValues {
        data = typeof data === 'object' ? data : {};
        let result = new TagValues();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["tag"] = this.tag;
        if (this.values && this.values.constructor === Array) {
            data["values"] = [];
            for (let item of this.values)
                data["values"].push(item.toJSON());
        }
        return data; 
    }

    clone(): TagValues {
        const json = this.toJSON();
        let result = new TagValues();
        result.init(json);
        return result;
    }
}

export interface ITagValues {
    tag: TagId;
    values?: VQT[] | undefined;
}

export enum TagId {
    SineWave = 0, 
    TriangleWave = 1, 
    SquareWave = 2, 
    SawtoothWave = 3, 
    WhiteNoise = 4, 
    IncrementalCount = 5, 
    PeriodicPulse = 6, 
    ModulatedPulse = 7, 
    TimeText = 8, 
}

export class VQT implements IVQT {
    value?: any | undefined;
    time!: Date;
    quality?: Quality | undefined;

    constructor(data?: IVQT) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.value = data["value"];
            this.time = data["time"] ? new Date(data["time"].toString()) : <any>undefined;
            this.quality = data["quality"] ? Quality.fromJS(data["quality"]) : <any>undefined;
        }
    }

    static fromJS(data: any): VQT {
        data = typeof data === 'object' ? data : {};
        let result = new VQT();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["value"] = this.value;
        data["time"] = this.time ? this.time.toISOString() : <any>undefined;
        data["quality"] = this.quality ? this.quality.toJSON() : <any>undefined;
        return data; 
    }

    clone(): VQT {
        const json = this.toJSON();
        let result = new VQT();
        result.init(json);
        return result;
    }
}

export interface IVQT {
    value?: any | undefined;
    time: Date;
    quality?: Quality | undefined;
}

export class Quality implements IQuality {
    major!: MajorQuality;
    hdaQuality!: HDAQuality;

    constructor(data?: IQuality) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.major = data["major"];
            this.hdaQuality = data["hdaQuality"];
        }
    }

    static fromJS(data: any): Quality {
        data = typeof data === 'object' ? data : {};
        let result = new Quality();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["major"] = this.major;
        data["hdaQuality"] = this.hdaQuality;
        return data; 
    }

    clone(): Quality {
        const json = this.toJSON();
        let result = new Quality();
        result.init(json);
        return result;
    }
}

export interface IQuality {
    major: MajorQuality;
    hdaQuality: HDAQuality;
}

export enum MajorQuality {
    Good = 0, 
    Bad = 1, 
    Uncertain = 2, 
}

export enum HDAQuality {
    None = 0, 
    ExtraData = 1, 
    Interpolated = 2, 
    Raw = 3, 
    Calculated = 4, 
    NoBound = 5, 
    NoData = 6, 
    DataLost = 7, 
    Conversion = 8, 
    Partial = 9, 
}

export abstract class HistoryRequestBase implements IHistoryRequestBase {
    tags?: TagId[] | undefined;
    initialValue!: InitialValue;
    maxCount!: number;

    constructor(data?: IHistoryRequestBase) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (data["tags"] && data["tags"].constructor === Array) {
                this.tags = [];
                for (let item of data["tags"])
                    this.tags.push(item);
            }
            this.initialValue = data["initialValue"];
            this.maxCount = data["maxCount"];
        }
    }

    static fromJS(data: any): HistoryRequestBase {
        data = typeof data === 'object' ? data : {};
        throw new Error("The abstract class 'HistoryRequestBase' cannot be instantiated.");
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (this.tags && this.tags.constructor === Array) {
            data["tags"] = [];
            for (let item of this.tags)
                data["tags"].push(item);
        }
        data["initialValue"] = this.initialValue;
        data["maxCount"] = this.maxCount;
        return data; 
    }

    clone(): HistoryRequestBase {
        throw new Error("The abstract class 'HistoryRequestBase' cannot be instantiated.");
    }
}

export interface IHistoryRequestBase {
    tags?: TagId[] | undefined;
    initialValue: InitialValue;
    maxCount: number;
}

export class AbsoluteHistoryRequest extends HistoryRequestBase implements IAbsoluteHistoryRequest {
    startTime!: Date;
    endTime!: Date;

    constructor(data?: IAbsoluteHistoryRequest) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.startTime = data["startTime"] ? new Date(data["startTime"].toString()) : <any>undefined;
            this.endTime = data["endTime"] ? new Date(data["endTime"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): AbsoluteHistoryRequest {
        data = typeof data === 'object' ? data : {};
        let result = new AbsoluteHistoryRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["startTime"] = this.startTime ? this.startTime.toISOString() : <any>undefined;
        data["endTime"] = this.endTime ? this.endTime.toISOString() : <any>undefined;
        super.toJSON(data);
        return data; 
    }

    clone(): AbsoluteHistoryRequest {
        const json = this.toJSON();
        let result = new AbsoluteHistoryRequest();
        result.init(json);
        return result;
    }
}

export interface IAbsoluteHistoryRequest extends IHistoryRequestBase {
    startTime: Date;
    endTime: Date;
}

export enum InitialValue {
    None = 0, 
    Linear = 1, 
    SampleAndHold = 2, 
}

export class RelativeHistoryRequest extends HistoryRequestBase implements IRelativeHistoryRequest {
    anchorTime?: Date | undefined;
    timeScale!: TimeScale;
    offsetFromNow!: number;

    constructor(data?: IRelativeHistoryRequest) {
        super(data);
    }

    init(data?: any) {
        super.init(data);
        if (data) {
            this.anchorTime = data["anchorTime"] ? new Date(data["anchorTime"].toString()) : <any>undefined;
            this.timeScale = data["timeScale"];
            this.offsetFromNow = data["offsetFromNow"];
        }
    }

    static fromJS(data: any): RelativeHistoryRequest {
        data = typeof data === 'object' ? data : {};
        let result = new RelativeHistoryRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["anchorTime"] = this.anchorTime ? this.anchorTime.toISOString() : <any>undefined;
        data["timeScale"] = this.timeScale;
        data["offsetFromNow"] = this.offsetFromNow;
        super.toJSON(data);
        return data; 
    }

    clone(): RelativeHistoryRequest {
        const json = this.toJSON();
        let result = new RelativeHistoryRequest();
        result.init(json);
        return result;
    }
}

export interface IRelativeHistoryRequest extends IHistoryRequestBase {
    anchorTime?: Date | undefined;
    timeScale: TimeScale;
    offsetFromNow: number;
}

export enum TimeScale {
    Seconds = 0, 
    Minutes = 1, 
    Hours = 2, 
    Days = 3, 
}

export class TagValue implements ITagValue {
    tag!: TagId;
    value?: VQT | undefined;

    constructor(data?: ITagValue) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.tag = data["tag"];
            this.value = data["value"] ? VQT.fromJS(data["value"]) : <any>undefined;
        }
    }

    static fromJS(data: any): TagValue {
        data = typeof data === 'object' ? data : {};
        let result = new TagValue();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["tag"] = this.tag;
        data["value"] = this.value ? this.value.toJSON() : <any>undefined;
        return data; 
    }

    clone(): TagValue {
        const json = this.toJSON();
        let result = new TagValue();
        result.init(json);
        return result;
    }
}

export interface ITagValue {
    tag: TagId;
    value?: VQT | undefined;
}

export class ValueAtTimeRequest implements IValueAtTimeRequest {
    tags?: TagId[] | undefined;
    targetTime!: Date;

    constructor(data?: IValueAtTimeRequest) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            if (data["tags"] && data["tags"].constructor === Array) {
                this.tags = [];
                for (let item of data["tags"])
                    this.tags.push(item);
            }
            this.targetTime = data["targetTime"] ? new Date(data["targetTime"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): ValueAtTimeRequest {
        data = typeof data === 'object' ? data : {};
        let result = new ValueAtTimeRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (this.tags && this.tags.constructor === Array) {
            data["tags"] = [];
            for (let item of this.tags)
                data["tags"].push(item);
        }
        data["targetTime"] = this.targetTime ? this.targetTime.toISOString() : <any>undefined;
        return data; 
    }

    clone(): ValueAtTimeRequest {
        const json = this.toJSON();
        let result = new ValueAtTimeRequest();
        result.init(json);
        return result;
    }
}

export interface IValueAtTimeRequest {
    tags?: TagId[] | undefined;
    targetTime: Date;
}

export class SimulatorTag implements ISimulatorTag {
    id!: TagId;
    name?: string | undefined;
    type!: TagType;
    scale?: NumericScale | undefined;
    engineeringUnits?: string | undefined;
    trueLabel?: string | undefined;
    falseLabel?: string | undefined;

    constructor(data?: ISimulatorTag) {
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
            this.name = data["name"];
            this.type = data["type"];
            this.scale = data["scale"] ? NumericScale.fromJS(data["scale"]) : <any>undefined;
            this.engineeringUnits = data["engineeringUnits"];
            this.trueLabel = data["trueLabel"];
            this.falseLabel = data["falseLabel"];
        }
    }

    static fromJS(data: any): SimulatorTag {
        data = typeof data === 'object' ? data : {};
        let result = new SimulatorTag();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["type"] = this.type;
        data["scale"] = this.scale ? this.scale.toJSON() : <any>undefined;
        data["engineeringUnits"] = this.engineeringUnits;
        data["trueLabel"] = this.trueLabel;
        data["falseLabel"] = this.falseLabel;
        return data; 
    }

    clone(): SimulatorTag {
        const json = this.toJSON();
        let result = new SimulatorTag();
        result.init(json);
        return result;
    }
}

export interface ISimulatorTag {
    id: TagId;
    name?: string | undefined;
    type: TagType;
    scale?: NumericScale | undefined;
    engineeringUnits?: string | undefined;
    trueLabel?: string | undefined;
    falseLabel?: string | undefined;
}

export enum TagType {
    Float = 0, 
    Integer = 1, 
    Boolean = 2, 
    String = 3, 
}

export class NumericScale implements INumericScale {
    min!: number;
    max!: number;

    constructor(data?: INumericScale) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.min = data["min"];
            this.max = data["max"];
        }
    }

    static fromJS(data: any): NumericScale {
        data = typeof data === 'object' ? data : {};
        let result = new NumericScale();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["min"] = this.min;
        data["max"] = this.max;
        return data; 
    }

    clone(): NumericScale {
        const json = this.toJSON();
        let result = new NumericScale();
        result.init(json);
        return result;
    }
}

export interface INumericScale {
    min: number;
    max: number;
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