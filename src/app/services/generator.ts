import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, from, map, of, scan } from 'rxjs';

export interface GenerateRequest {
  files: File[];
  docs?: File[];
  templateId: string;
}

export interface GenerateProgress {
  phase: 'upload'|'analyze'|'compose'|'done';
  percent: number;
  message: string;
}

@Injectable({providedIn: 'root'})
export class GeneratorService {
 private readonly apiUrl = ''

  constructor(private http:HttpClient) { }

  generateDocumentation(payload: GenerateRequest) {
    return this.http.post('/api/generate-docs', payload).toPromise();
  }

  // TODO: replace with real HTTP calls. This simulates a streaming progress UX.
  generate(req: GenerateRequest): Observable<GenerateProgress> {
    const steps: GenerateProgress[] = [
      {phase:'upload', percent:15, message:`Uploading ${req.files.length} file(s)…`},
      {phase:'analyze', percent:40, message:'Analyzing code & extracting symbols…'},
      {phase:'compose', percent:80, message:'Composing documentation…'},
      {phase:'done', percent:100, message:'Ready to download'}
    ];
    return from(steps).pipe(delay(600));
  }

  upload(files: File[]): Observable<number> {
    // return progress [0..100]
    return of(0, 20, 55, 78, 100).pipe(
      delay(150),
      scan((_, v) => v),
      map(v => v)
    );
  }

  uploadFiles(files: File[]): Observable<HttpEvent<any>> {
    const formData = new FormData();
     files.forEach(file => {
      //keep relative path to preserve folder structure
      const relativePath = (file as any).webkitRelativePath || file.name;
      formData.append("files", file, relativePath);
     });

     const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
      headers: new HttpHeaders({})
     });

     return this.http.request(req)
  }
}
