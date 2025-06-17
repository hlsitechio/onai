
export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormFieldsProps {
  onSuccess: () => void;
}

export interface ContactTabsProps {
  onFormSuccess: () => void;
}
