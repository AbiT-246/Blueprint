export interface IkeaCategory {
  id: string;
  name: string;
  url: string;
  im?: string;
  subs?: IkeaCategory[];
}
