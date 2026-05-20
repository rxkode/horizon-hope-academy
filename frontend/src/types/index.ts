export interface AdmissionFormData {
  guardian_name:  string;
  guardian_email: string;
  guardian_phone: string;
  child_name:     string;
  child_dob:      string;   // ISO date string e.g. "2018-04-12"
  grade_applying: string;
  message?:       string;
}

export interface ContactFormData {
  name:     string;
  email:    string;
  phone:    string;
  subject:  string;
  message:  string;
}

export interface ApiResponse<T> {
  data?:  T;
  error?: string;
}
