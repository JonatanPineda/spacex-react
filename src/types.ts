export interface Launch {
  id: string;
  name: string;
  year: number;
  rocket: string;
  nationality: string;
  img: string;
  payloadType: string[];
  success: boolean;
}

export interface Filters {
  years: number[];
  rockets: string[];
  payloadTypes: string[];
  payloadNationalities: string[];
}
