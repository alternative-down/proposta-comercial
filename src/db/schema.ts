import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  planId: text('plan_id').notNull(),
  billingType: text('billing_type').notNull(),
  amount: real('amount').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'cancelled'] }).notNull().default('pending'),
  asaasPaymentId: text('asaas_payment_id'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  asaasSubscriptionId: text('asaas_subscription_id'),
  planId: text('plan_id').notNull(),
  status: text('status', { enum: ['active', 'cancelled', 'overdue', 'paused'] }).notNull().default('active'),
  billingType: text('billing_type').notNull(),
  amount: real('amount').notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  templateId: text('template_id').notNull(),
  planType: text('plan_type').notNull(),
  status: text('status', { enum: ['draft', 'paid', 'completed'] }).notNull().default('draft'),
  data: text('data'),
  amount: real('amount').notNull(),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// propostas is an alias for invoices (proposal = invoice in this context)
export const propostas = invoices;
