export interface CandidateOption {
  name: string;
  value: string | number;
  checked?: boolean;
}

export interface CandidateSettings {
  type?: number | string;
  api?: string;
  keyField?: string;
  valueField?: string;
  candidateData?: CandidateOption[];
}
