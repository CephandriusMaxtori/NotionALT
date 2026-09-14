'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { X, GitBranch, Loader2, AlertCircle, Sparkles, FolderGit2 } from 'lucide-react';

export const GitHubImportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { importGitHubRepo, setToastMessage } = useWorkspaceStore();
  const [repoInput, setRepoInput] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanRepo = repoInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

    if (!cleanRepo || !cleanRepo.includes('/')) {
      setError('Please enter a valid repository in the format "owner/repo" (e.g. facebook/react)');
      return;
    }

    setLoading(true);

    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (token.trim()) {
        headers.Authorization = `Bearer ${token.trim()}`;
      }

      const repoRes = await fetch(`https://api.github.com/repos/${cleanRepo}`, { headers });
      if (!repoRes.ok) {
        if (repoRes.status === 404) {
          throw new Error('Repository not found. If it is private, please provide a GitHub Personal Access Token.');
        } else if (repoRes.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please provide a Personal Access Token.');
        } else {
          throw new Error(`GitHub API error: ${repoRes.statusText}`);
        }
      }
      const repoData = await repoRes.json();

      const issuesRes = await fetch(`https://api.github.com/repos/${cleanRepo}/issues?state=open&per_page=30`, { headers });
      const issuesData = issuesRes.ok ? await issuesRes.json() : [];

      importGitHubRepo(
        repoData.name,
        repoData.description || `Synced with https://github.com/${cleanRepo}`,
        issuesData
      );

      setToastMessage(`Created GitHub database board for ${repoData.name}`);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch repository from GitHub');
      setLoading(false);
    }
  };

  const handleQuickDemoRepo = (repoName: string) => {
    setRepoInput(repoName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 select-text">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#333333] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#e0e0e0]" />
            <h2 className="text-sm font-medium text-[#ebebeb]">Create GitHub Database Board</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#282828] text-[#777777] hover:text-[#cccccc] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleImport} className="p-4 space-y-4 text-xs">
          <p className="text-[#888888] leading-relaxed">
            Turn GitHub repository issues, feature requests, and PRs into an interactive Kanban and spreadsheet database.
          </p>

          {error && (
            <div className="p-2.5 bg-[#331c1c] border border-[#522b2b] text-[#f27474] rounded flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[#888888] mb-1">GitHub Repository (owner/repo)</label>
            <input
              type="text"
              placeholder="e.g. vercel/next.js or torvalds/linux"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              className="w-full bg-[#141414] border border-[#353535] rounded px-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
              required
            />
          </div>

          <div>
            <label className="block text-[#888888] mb-1">
              Personal Access Token <span className="text-[#666666]">(Optional for private repos / rate limits)</span>
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-[#141414] border border-[#353535] rounded px-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
            />
          </div>

          {/* Quick suggestions */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] text-[#666666]">Try a popular open-source repository:</span>
            <div className="flex flex-wrap gap-1.5">
              {['vercel/next.js', 'facebook/react', 'tailwindlabs/tailwindcss', 'microsoft/vscode'].map((repo) => (
                <button
                  key={repo}
                  type="button"
                  onClick={() => handleQuickDemoRepo(repo)}
                  className="px-2 py-0.5 bg-[#252525] hover:bg-[#2e2e2e] text-[#a0a0a0] hover:text-[#ebebeb] rounded text-[11px] border border-[#303030] transition"
                >
                  {repo}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#282828]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1.5 text-[#777777] hover:text-[#cccccc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73cb] disabled:opacity-50 text-white rounded text-xs font-normal flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Fetching Repository...' : 'Create Database Board'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
