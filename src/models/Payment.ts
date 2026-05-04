import mongoose, { Schema, model, models } from 'mongoose';

export interface PaymentDocument {
  _id: mongoose.Types.ObjectId;
  // User info
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  // Payment info
  paymentId: string;        // Razorpay payment ID or pay_TEST_xxx
  orderId: string;          // Razorpay order ID
  // Course / plan info
  courseSlug: string;
  courseName: string;
  planLabel: string;
  // Amounts
  baseAmount: number;       // before GST
  gstAmount: number;        // 18% GST
  totalAmount: number;      // grand total paid
  currency: string;
  // Status
  status: 'success' | 'failed' | 'pending';
  paymentMethod: string;    // upi / card / netbanking / emi / wallet
  isTestMode: boolean;
  // Timestamps
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    // User
    userId:      { type: String, required: true, index: true },
    userName:    { type: String, required: true, trim: true },
    userEmail:   { type: String, required: true, lowercase: true, trim: true, index: true },
    userPhone:   { type: String, default: '', trim: true },
    // Payment IDs
    paymentId:   { type: String, required: true, unique: true, trim: true },
    orderId:     { type: String, required: true, trim: true, index: true },
    // Course
    courseSlug:  { type: String, required: true },
    courseName:  { type: String, required: true },
    planLabel:   { type: String, default: '' },
    // Amounts
    baseAmount:  { type: Number, default: 0 },
    gstAmount:   { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency:    { type: String, default: 'INR' },
    // Status
    status:        { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
    paymentMethod: { type: String, default: 'upi' },
    isTestMode:    { type: Boolean, default: false },
    // Time
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = models.Payment || model<PaymentDocument>('Payment', paymentSchema);
export default Payment;
