export type ParseMode = 'url' | 'text';

export interface ParseRequest {
  content: string;
  mode: ParseMode;
}

export interface ParseResult {
  text: string;
  groundingMetadata?: any;
}
