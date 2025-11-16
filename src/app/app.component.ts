import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { StudentService, Student } from './services/student.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 for *ngIf, *ngFor, ngModel, ngForm
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Student Management';

  students: Student[] = [];
  errorMessage = '';
  selectedStudent: Student = this.emptyStudent();
  isSaving = false;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  // -------- Helper to create an empty student --------
  emptyStudent(): Student {
    return {
      id: 0,
      name: '',
      email: '',
      mobile: '',
      city: '',
      state: '',
      address1: '',
      address2: ''
    };
  }

  // -------- LOAD (GET) from API --------
  loadStudents(): void {
    this.errorMessage = '';
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        console.error('Error loading students from API', err);
        this.errorMessage = 'Failed to load students from API.';
      }
    });
  }

  // -------- EDIT button: copy row into form --------
  onEdit(student: Student): void {
    // copy to avoid modifying the table row directly
    this.selectedStudent = { ...student };
  }

  // -------- DELETE button --------
  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.errorMessage = '';
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        // remove from local list
        this.students = this.students.filter((s) => s.id !== id);
        // clear form if we were editing this one
        if (this.selectedStudent.id === id) {
          this.selectedStudent = this.emptyStudent();
        }
      },
      error: (err) => {
        console.error('Error deleting student', err);
        this.errorMessage = 'Failed to delete student.';
      }
    });
  }

  // -------- SAVE / UPDATE (form submit) --------
  onSubmit(): void {
    this.isSaving = true;
    this.errorMessage = '';

    if (this.selectedStudent.id === 0) {
      // CREATE (POST)
      this.studentService.createStudent(this.selectedStudent).subscribe({
        next: (created) => {
          this.students.push(created);
          this.selectedStudent = this.emptyStudent();
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Error creating student', err);
          this.errorMessage = 'Failed to save student.';
          this.isSaving = false;
        }
      });
    } else {
    // UPDATE (PUT)
    const id = this.selectedStudent.id;

    this.studentService.updateStudent(id, this.selectedStudent).subscribe({
      next: (updated) => {
        const index = this.students.findIndex((s) => s.id === id);
        if (index > -1) {
          this.students[index] = updated;
        }
        this.selectedStudent = this.emptyStudent();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating student', err);
        this.errorMessage = 'Failed to update student.';
        this.isSaving = false;
      }
    });
  }
}

  // -------- RESET button --------
  onReset(form: NgForm): void {
    form.resetForm();
    this.selectedStudent = this.emptyStudent();
    this.errorMessage = '';
  }
}
