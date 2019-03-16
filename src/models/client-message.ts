export interface ClientMessage {
  type: 'init' | 'close';
  id: string;
}
