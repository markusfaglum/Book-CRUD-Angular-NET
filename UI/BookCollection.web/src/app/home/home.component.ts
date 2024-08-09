import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Book } from '../../Entities/book.entity';
import { AsyncPipe } from '@angular/common';
import { Quote } from '../../Entities/quote.entity';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../Service/AuthService';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  http = inject(HttpClient);

   authService = inject(AuthService);

  errorMessage: string = '';

  //Books

  booksForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1)]),
    author: new FormControl('', [Validators.required, Validators.minLength(1)]),
    publishingDate: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })

  books$ = this.getBooks();

  

  onFormSubmit() {
    if (this.booksForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.books$ = this.getBooks();
      this.booksForm.reset();
      return;
    }
    const addBookRequest = {
      title: this.booksForm.value.title,
      description: this.booksForm.value.description,
      author: this.booksForm.value.author,
      publishingDate: this.booksForm.value.publishingDate
    }
    this.http.post("https://localhost:7078/api/Book", addBookRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.books$ = this.getBooks();
          this.booksForm.reset();
        }
      })
  }

  selectedBookForDeletion: Book | null = null;

  openDeleteModal(item: Book) {
    this.selectedBookForDeletion = item;
  }

  onDelete() {
    if (this.selectedBookForDeletion) {
      const id = this.selectedBookForDeletion.id;
      this.http.delete(`https://localhost:7078/api/Book/${id}`)
        .subscribe({
          next: (value) => {
            alert("Item deleted");
            this.books$ = this.getBooks();
            this.selectedBookForDeletion = null; 
          },
          error: (err) => {
            console.error("Delete error:", err);
          }
        });
    }
  }

  private getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>("https://localhost:7078/api/Book").pipe(
      tap(books => console.log("Books received:", books))
    );
  }

  onEditFormSubmit() {

    if (this.booksForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.books$ = this.getBooks();
      this.booksForm.reset();
      return;
    }

    if (this.selectedBook) {
      const editBookRequest = {
        id: this.selectedBook.id,  
        title: this.booksForm.value.title,
        description: this.booksForm.value.description,
        author: this.booksForm.value.author,
        publishingDate: this.booksForm.value.publishingDate
      };

      console.log("Submitting update for book:", editBookRequest);

      this.http.put(`https://localhost:7078/api/Book`, editBookRequest)
        .subscribe({
          next: (value) => {
            console.log("Update successful:", value);
            this.books$ = this.getBooks();
            this.booksForm.reset();
            this.selectedBook = null;
            
          },
          error: (err) => {
            console.error("Update error:", err);
          }
        });
    } else {
      console.error("No book selected for editing.");
    }

  }

  
  selectedBook: Book | null = null;

  openEditModal(item: Book) {
    this.selectedBook = item;

    
    this.booksForm.patchValue({
      title: item.title,
      description: item.description,
      author: item.author,
      publishingDate: item.publishingDate,
    });
  }

  logout() {
    this.authService.logout();
  }

}
