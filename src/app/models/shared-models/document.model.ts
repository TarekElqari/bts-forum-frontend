export interface DocumentDto {
    id: number;
    filename: string;
    fileType: string;
    tags: string[];
    uploadDateTime: string;
    description: string;
    matiere: string;
    niveau: string;
    type: string; 
    uploadedBy: UploadedByDto;
  }
  
  export interface UploadedByDto {
    id: number;
    firstName: string;
    lastName: string;
  }
  
  export interface DocumentUploadRequest {
    file: File;
    tags: string[];
    description: string;
    userId: number;
    matiere: string;
    type: string; //controle, examen, examen nationale, correction examen....
  }