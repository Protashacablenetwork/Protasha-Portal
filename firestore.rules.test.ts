/**
 * Firestore Security Invariants & "Dirty Dozen" Payload Verification Suite
 * Validates all 12 adversarial payloads against the schema and rule constraints.
 */

export interface DirtyDozenTestCase {
  name: string;
  collection: string;
  docId: string;
  payload: Record<string, unknown>;
  expectedAllowed: boolean;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]{1,128}$/;

export function simulateRuleCheck(collection: string, docId: string, data: Record<string, unknown>): boolean {
  if (!VALID_ID_REGEX.test(docId)) return false;

  switch (collection) {
    case 'transactions':
    case 'ay_byay_transactions': {
      const allowed = [
        'id', 'trxId', 'type', 'method', 'person', 'description', 'category',
        'amount', 'date', 'time', 'paymentMethod', 'purpose', 'note',
        'recordedBy', 'recordedByGmail', 'source', 'isDeleted', 'created', 'createdAt'
      ];
      const keys = Object.keys(data);
      if (!keys.includes('id') || !keys.includes('type') || !keys.includes('amount')) return false;
      if (!keys.every(k => allowed.includes(k))) return false;
      if (typeof data.id !== 'string' || data.id.length > 128) return false;
      if (data.type !== 'income' && data.type !== 'expense') return false;
      if (typeof data.amount !== 'number') return false;
      return true;
    }
    case 'banners': {
      const allowed = [
        'id', 'badgeBn', 'badgeEn', 'titleBn', 'titleEn',
        'subtitleBn', 'subtitleEn', 'imageUrl', 'linkUrl',
        'isActive', 'priority', 'updatedAt', 'createdAt'
      ];
      const keys = Object.keys(data);
      if (!keys.includes('id') || !keys.includes('imageUrl') || !keys.includes('isActive')) return false;
      if (!keys.every(k => allowed.includes(k))) return false;
      if (typeof data.imageUrl !== 'string' || data.imageUrl.length > 900000) return false;
      if (typeof data.isActive !== 'boolean') return false;
      return true;
    }
    case 'ay_byay_salaries':
    case 'staff_salaries': {
      const allowed = [
        'id', 'staffId', 'staffName', 'staffDesignation', 'month',
        'baseSalary', 'bonusOrAllowance', 'deductionOrAdvance', 'netSalary',
        'paymentStatus', 'paymentDate', 'paymentMethod', 'voucherNumber',
        'note', 'transactionId', 'recordedBy', 'recordedByGmail', 'createdAt', 'updatedAt'
      ];
      const keys = Object.keys(data);
      if (!keys.every(k => allowed.includes(k))) return false;
      if (data.paymentStatus !== 'paid' && data.paymentStatus !== 'pending') return false;
      return typeof data.baseSalary === 'number' && typeof data.netSalary === 'number';
    }
    case 'staff': {
      const allowed = [
        'id', 'name', 'phone', 'role', 'designation', 'baseSalary',
        'avatarUrl', 'address', 'reference', 'totalDue', 'totalCollected',
        'remainingDue', 'notes', 'isActive', 'recordedBy', 'createdAt', 'updatedAt', 'transactions'
      ];
      const keys = Object.keys(data);
      if (!keys.every(k => allowed.includes(k))) return false;
      if (Array.isArray(data.transactions) && data.transactions.length > 500) return false;
      return typeof data.id === 'string' && typeof data.name === 'string' && typeof data.phone === 'string';
    }
    case 'users': {
      const allowed = [
        'id', 'name', 'phone', 'pin', 'avatarUrl', 'gmail',
        'boundMethods', 'readNotifications', 'role', 'status',
        'virtualCardNumber', 'createdAt', 'updatedAt'
      ];
      const keys = Object.keys(data);
      if (!keys.every(k => allowed.includes(k))) return false;
      if (!['admin', 'sub-admin', 'user', 'visitor'].includes(String(data.role))) return false;
      if (!['active', 'suspended'].includes(String(data.status))) return false;
      return true;
    }
    case 'quick_hisab_owners': {
      const allowed = [
        'id', 'name', 'phone', 'address', 'notes',
        'shareUnits', 'avatarUrl', 'isHalf', 'createdAt', 'updatedAt'
      ];
      const keys = Object.keys(data);
      if (!keys.every(k => allowed.includes(k))) return false;
      return typeof data.id === 'string' && typeof data.name === 'string' && typeof data.shareUnits === 'number';
    }
    case 'ay_byay_inventory_logs': {
      const allowed = [
        'id', 'itemId', 'itemName', 'type', 'quantity', 'date',
        'recipientOrSource', 'costPerUnit', 'totalCost', 'addToExpense',
        'addedToExpense', 'expenseCategory', 'paymentMethod', 'transactionId',
        'note', 'recordedBy', 'createdAt'
      ];
      const keys = Object.keys(data);
      if (!keys.every(k => allowed.includes(k))) return false;
      return ['in', 'out', 'return', 'damaged'].includes(String(data.type));
    }
    default:
      return false;
  }
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    name: '1. Unknown collection write rejected',
    collection: 'rogue_collection',
    docId: 'doc-1',
    payload: { foo: 'bar' },
    expectedAllowed: false
  },
  {
    name: '2. Oversized ID rejected',
    collection: 'banners',
    docId: 'x'.repeat(150),
    payload: { id: 'x'.repeat(150), imageUrl: 'https://example.com/a.webp', isActive: true },
    expectedAllowed: false
  },
  {
    name: '3. Invalid transaction type rejected',
    collection: 'transactions',
    docId: 'trx-1',
    payload: { id: 'trx-1', type: 'hacked', amount: 500 },
    expectedAllowed: false
  },
  {
    name: '4. String amount rejected',
    collection: 'ay_byay_transactions',
    docId: 'TXN-1',
    payload: { id: 'TXN-1', type: 'income', amount: '500' },
    expectedAllowed: false
  },
  {
    name: '5. Shadow field on banner rejected',
    collection: 'banners',
    docId: 'b-1',
    payload: { id: 'b-1', imageUrl: 'https://example.com/a.webp', isActive: true, evilAdminFlag: true },
    expectedAllowed: false
  },
  {
    name: '6. String isActive on banner rejected',
    collection: 'banners',
    docId: 'b-1',
    payload: { id: 'b-1', imageUrl: 'https://example.com/a.webp', isActive: 'true' },
    expectedAllowed: false
  },
  {
    name: '7. Invalid salary status rejected',
    collection: 'ay_byay_salaries',
    docId: 'sal-1',
    payload: { id: 'sal-1', staffId: 's1', month: '2026-11', baseSalary: 1000, netSalary: 1000, paymentStatus: 'cancelled' },
    expectedAllowed: false
  },
  {
    name: '8. Invalid user role rejected',
    collection: 'users',
    docId: 'u-1',
    payload: { id: 'u-1', name: 'Test', phone: '01700000000', role: 'superroot', status: 'active' },
    expectedAllowed: false
  },
  {
    name: '9. Oversized imageUrl > 900KB rejected',
    collection: 'banners',
    docId: 'b-2',
    payload: { id: 'b-2', imageUrl: 'a'.repeat(900001), isActive: true },
    expectedAllowed: false
  },
  {
    name: '10. Unbounded staff transactions > 500 rejected',
    collection: 'staff',
    docId: 'stf-1',
    payload: { id: 'stf-1', name: 'Staff', phone: '01700000000', transactions: new Array(501).fill({}) },
    expectedAllowed: false
  },
  {
    name: '11. Invalid inventory movement type rejected',
    collection: 'ay_byay_inventory_logs',
    docId: 'LOG-1',
    payload: { id: 'LOG-1', itemId: 'INV-1', type: 'steal', quantity: 5, date: '2026-11-12' },
    expectedAllowed: false
  },
  {
    name: '12. Shadow field on Quick Hisab owner rejected',
    collection: 'quick_hisab_owners',
    docId: 'o-1',
    payload: { id: 'o-1', name: 'Owner', shareUnits: 1, secret: 123 },
    expectedAllowed: false
  }
];
