import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaunchdarklyService {

  private baseUrl = environment.baseUrl;
  private projectKey = environment.projectKey;
  private headers = new HttpHeaders({
    'Authorization': environment.authorizationHeader,
    'Content-Type': 'application/json'
  });

  private semanticHeaders = new HttpHeaders({
    'Authorization': environment.authorizationSemanticHeader,
    'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch'
  });

  constructor(private http: HttpClient) {}

  private flagSubject = new BehaviorSubject<string | null>(null);
  flag$ = this.flagSubject.asObservable();

  setFlag(flag: string) {
    console.log(flag);
    this.flagSubject.next(flag);
    console.log(this.flagSubject);
  }

  getFlagStatus(featureFlagKey: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, { headers: this.headers });
  }

  updateFlag(featureFlagKey: string, isFlagEnabled: boolean): Observable<any> {
    const patch = [ {op: 'replace', path: '/environments/test/on', value: isFlagEnabled }]
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, { patch }, { headers: this.headers });
  }

  addTrueTargetToFlag(featureFlagKey: string, target: string, trueVariationId: string, falseVariationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, {
      environmentKey: 'test',
      instructions: [{ kind: 'addTargets', contextKind:'user', values: [target], variationId: trueVariationId },
        { kind: 'updateFallthroughVariationOrRollout',variationId: falseVariationId}
      ]
    }, 
      { headers: this.semanticHeaders });
  }

  addFalseTargetToFlag(featureFlagKey: string, target: string, trueVariationId: string, falseVariationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, {
      environmentKey: 'test',
      instructions: [{ kind: 'addTargets', contextKind:'user', values: [target], variationId: falseVariationId },
      ]
    }, 
      { headers: this.semanticHeaders });
  }

  createFeatureFlag(flagData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.projectKey}`, flagData, { headers: this.headers });
  }

  removeTarget(featureFlagKey: string, targetValues: string, variationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, {
      environmentKey: 'test',
      instructions: [{ kind: 'removeTargets', contextKind:'user',values: [targetValues], variationId: variationId }]
    }, { headers: this.semanticHeaders });
  }

  clearAllTargets(featureFlagKey: string, variationId: string, disabledVariationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, {
      environmentKey: 'test',
      instructions: [{ kind: 'clearUserTargets',contextKind:'user', variationId: variationId},
        { kind: 'clearUserTargets',contextKind:'user', variationId: disabledVariationId},
        { kind: 'updateFallthroughVariationOrRollout',variationId: variationId}],
    }, { headers: this.semanticHeaders });
  }

  deleteFeatureFlag(featureFlagKey: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, { headers: this.headers });
  }

  toggleDefaultRule(featureFlagKey: string, variationId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${this.projectKey}/${featureFlagKey}`, {
      environmentKey: 'test',
      instructions: [{ kind: 'updateFallthroughVariationOrRollout',variationId: variationId}],
    }, { headers: this.semanticHeaders });
  }

  listFeatureFlags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.projectKey}?env=test&env=production&limit=15&summary=true&sort=-creationDate`, { headers: this.headers });
  }
} 
