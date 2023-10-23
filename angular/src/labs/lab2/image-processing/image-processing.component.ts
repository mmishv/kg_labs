import {Component} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-image-processing',
  templateUrl: './image-processing.component.html',
  styleUrls: ['./image-processing.component.css']
})
export class ImageProcessingComponent {
  processedImages: { [key: string]: string } = {};
  originalImage!: File;

  constructor(private http: HttpClient) {
  }
  uploadImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post(`http://127.0.0.1:8005/process_image/`, formData);
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const file = inputElement.files[0];
      this.originalImage = file;
      this.uploadImage(file).subscribe(response => {
        this.processedImages = response;
      }, error => {
        console.log(error)
      });
    }
  }

  dataURItoBlob(dataURI: string): string {
    return `data:image/jpeg;base64, ${dataURI}`;
  }

  getImageUrl(): string | ArrayBuffer | null {
    if (this.originalImage) {
      return URL.createObjectURL(this.originalImage);
    }
    return null;
  }

  protected readonly Object = Object;
}
