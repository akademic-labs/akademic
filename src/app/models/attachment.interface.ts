export interface Attachment {
  name: string;
  type: string;
  path: string;
  createdAt?: string;
}

export interface AttachmentView {
  name: string;
  type: string;
  path: any;
  createdAt?: string;
  size: number;
  src: any;
  class: string;
}
