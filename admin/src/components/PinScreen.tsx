import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function PinScreen() {
  const { hasPin, verifyPin, setPin } = useAuth();
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSettingPin, setIsSettingPin] = useState(!hasPin);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isSettingPin) {
        if (enteredPin.length < 4) {
          setError('PIN must be at least 4 digits');
          return;
        }
        await setPin(enteredPin);
      } else {
        const ok = await verifyPin(enteredPin);
        if (!ok) {
          setError('Invalid PIN');
          setEnteredPin('');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-surface-900">
            {isSettingPin ? 'Set PIN' : 'Enter PIN'}
          </h1>
          <p className="text-surface-500 mt-1">
            {isSettingPin
              ? 'Create a PIN to secure your admin session'
              : 'Enter your PIN to access the admin panel'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              {isSettingPin ? 'New PIN' : 'PIN'}
            </label>
            <input
              type="password"
              value={enteredPin}
              onChange={e => setEnteredPin(e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-2xl tracking-widest"
              placeholder={isSettingPin ? '••••' : '••••'}
              required
              minLength={4}
              autoComplete="off"
              autoFocus
            />
            {isSettingPin && (
              <p className="mt-1 text-xs text-surface-500">Minimum 4 characters</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Checking…' : isSettingPin ? 'Set PIN & Enter' : 'Unlock'}
          </button>
        </form>

        {hasPin && !isSettingPin && (
          <button
            onClick={() => setIsSettingPin(true)}
            className="mt-4 w-full text-sm text-primary-600 hover:underline"
          >
            Change PIN
          </button>
        )}
      </div>
    </div>
  );
}