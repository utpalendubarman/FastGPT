export type PayModelSchema = {
  _id: string;
  userId: string;
  sessionId: string;
  createTime: Date;
  price: number;
  product: string;
  status: 'SUCCESS' | 'REFUND' | 'INITIATED' | 'CLOSED' | 'FAILED';
};
