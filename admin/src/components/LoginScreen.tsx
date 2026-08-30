import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginScreen() {
  const { login } = useAuth();
  const [owner, setOwner] = useState('Taha-Esmaeili');
  const [repo, setRepo] = useState('portfolio');
  const [branch, setBranch] = useState('dev');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Test the token by making a simple API call
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (!response.ok) {
        throw new Error('Invalid token or repository access denied');
      }
      login(token, { owner, repo, branch });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-surface-900">Portfolio Admin</h1>
          <p className="text-surface-500 mt-1">Enter your GitHub credentials to manage content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">GitHub Owner</label>
            <input
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Taha-Esmaeili"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Repository</label>
            <input
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="portfolio"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="dev"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">GitHub Personal Access Token</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="ghp_..."
              required
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-surface-500">
              Create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">GitHub Settings → Developer settings → Personal access tokens</a>
              <br />Scope: <code className="text-surface-600">repo</code> (full control of private repositories)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-surface-500">
          Your token is stored only in memory for this session and never persisted.
        </p>
      </div>
    </div>
  );
}