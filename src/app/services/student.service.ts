import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  name: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  address1: string;
  address2: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  // 👇 Your backend API URL
  private readonly baseUrl = 'https://localhost:7233/api/Student';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    // matches PUT api/Student/{id}
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
    
  }


  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
