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
  selector: 'app-quotes',
  standalone: true,
   imports: [AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})
export class QuotesComponent {

  http = inject(HttpClient);

  authService = inject(AuthService);

  errorMessage: string = '';

 

  quotesForm = new FormGroup({
    quotation: new FormControl('', [Validators.required, Validators.minLength(1)]),
    attributed: new FormControl('', [Validators.required, Validators.minLength(1)]),
    dateOfQuote: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })

  quotes$ = this.getQuotes();



  onFormSubmit() {
    if (this.quotesForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.quotes$ = this.getQuotes();
      this.quotesForm.reset();
      return;
    }
    const addQuoteRequest = {
      quotation: this.quotesForm.value.quotation,
      attributed: this.quotesForm.value.attributed,
      dateOfQuote: this.quotesForm.value.dateOfQuote
    }
    this.http.post("https://localhost:7078/api/Quote", addQuoteRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.quotes$ = this.getQuotes();
          this.quotesForm.reset();
        }
      })
  }

  selectedQuoteForDeletion: Quote | null = null;

  openDeleteModal(item: Quote) {
    this.selectedQuoteForDeletion = item;
  }

  onDelete() {
    if (this.selectedQuoteForDeletion) {
      const id = this.selectedQuoteForDeletion.id;
      this.http.delete(`https://localhost:7078/api/Quote/${id}`)
        .subscribe({
          next: (value) => {
            alert("Item deleted");
            this.quotes$ = this.getQuotes();
            this.selectedQuoteForDeletion = null; 
          },
          error: (err) => {
            console.error("Delete error:", err);
          }
        });
    }
  }

  private getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>("https://localhost:7078/api/Quote").pipe(
      tap(quotes => console.log("Quotes received:", quotes))
    );
  }

  onEditFormSubmit() {

    if (this.quotesForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.quotes$ = this.getQuotes();
      this.quotesForm.reset();
      return;
    }

    if (this.selectedQuote) {
      const editQuoteRequest = {
        id: this.selectedQuote.id,  
        quotation: this.quotesForm.value.quotation,
        attributed: this.quotesForm.value.attributed,
        dateOfQuote: this.quotesForm.value.dateOfQuote
      };

      console.log("Submitting update for quote:", editQuoteRequest);

      this.http.put(`https://localhost:7078/api/Quote`, editQuoteRequest)
        .subscribe({
          next: (value) => {
            console.log("Update successful:", value);
            this.quotes$ = this.getQuotes();
            this.quotesForm.reset();
            this.selectedQuote = null;

          },
          error: (err) => {
            console.error("Update error:", err);
          }
        });
    } else {
      console.error("No quote selected for editing.");
    }

  }

  
  selectedQuote: Quote | null = null;

  openEditModal(item: Quote) {
    this.selectedQuote = item;

    
    this.quotesForm.patchValue({
      quotation: item.quotation,
      attributed: item.attributed,
      dateOfQuote: item.dateOfQuote,
    });
  }

  logout() {
    this.authService.logout();
  }
}
