export interface Tag {
  type: string;
  tagName: string;
  properties: Record<string, string | number>;
  children: Array<Tag>;
}
