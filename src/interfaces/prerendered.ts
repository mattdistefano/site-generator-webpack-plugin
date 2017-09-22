export interface Prerendered {
  [path: string]: {
    title: string;
    description: string;
    content: string;
    state?: string;
  };
}
