'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  X, 
  GitBranch, 
  Loader2, 
  AlertCircle, 
  Search, 
  Star, 
  Key, 
  Lock, 
  Globe, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  stargazers_count: number;
  open_issues_count: number;
  html_url: string;
}

export const GitHubImportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { importGitHubRepo, setToastMessage } = useWorkspaceStore();
  
  // Tabs: 'search_public' | 'user_token' | 'manual'
  const [activeTab, setActiveTab] = useState<'search' | 'token' | 'manual'>('search');
  
  // Public search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GitHubRepoItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Token state
  const [token, setToken] = useState('');
  const [userRepos, setUserRepos] = useState<GitHubRepoItem[]>([]);
  const [loadingUserRepos, setLoadingUserRepos] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);

  // Manual URL/slug state
  const [manualInput, setManualInput] = useState('');

  // Import loading state
  const [importingRepoId, setImportingRepoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved token if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('notion_board_github_token');
      if (savedToken) {
        setToken(savedToken);
        setTokenSaved(true);
      }
    }
  }, []);

  // Quick search when query changes (debounced)
  useEffect(() => {
    if (activeTab !== 'search') return;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery.trim())}&sort=stars&order=desc&per_page=6`,
          { headers }
        );
        if (!res.ok) throw new Error('Search failed or API limit reached');
        const data = await res.json();
        setSearchResults(data.items || []);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, token]);

  // Fetch user repos with token
  const handleFetchUserRepos = async (tokenToUse?: string) => {
    const t = tokenToUse || token;
    if (!t.trim()) return;

    setLoadingUserRepos(true);
    setError(null);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20&affiliation=owner,collaborator', {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${t.trim()}`
        }
      });
      if (!res.ok) {
        throw new Error('Invalid token or insufficient permissions. (Ensure "repo" scope is enabled)');
      }
      const data = await res.json();
      setUserRepos(data);
      localStorage.setItem('notion_board_github_token', t.trim());
      setTokenSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingUserRepos(false);
    }
  };

  const handleImportRepo = async (fullName: string) => {
    setImportingRepoId(fullName);
    setError(null);

    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      // 1. Fetch Repo info
      const repoRes = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
      if (!repoRes.ok) throw new Error(`Could not fetch ${fullName}`);
      const repoData = await repoRes.json();

      // 2. Fetch Open Issues & PRs
      const issuesRes = await fetch(`https://api.github.com/repos/${fullName}/issues?state=open&per_page=40`, { headers });
      const issuesData = issuesRes.ok ? await issuesRes.json() : [];

      importGitHubRepo(
        repoData.name,
        repoData.description || `Synced with https://github.com/${fullName}`,
        issuesData
      );

      setToastMessage(`Created database board for ${repoData.name}`);
      setImportingRepoId(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to import repository');
      setImportingRepoId(null);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (clean && clean.includes('/')) {
      handleImportRepo(clean);
    } else {
      setError('Enter a valid owner/repo format (e.g. facebook/react)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 select-text animate-in fade-in duration-100">
      <div className="w-full max-w-lg bg-[#1e1e1e] border border-[#333333] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-[#282828] flex items-center justify-between bg-[#191919]">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#2383e2]" />
            <h2 className="text-sm font-medium text-[#ebebeb]">GitHub Database Sync</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#282828] text-[#777777] hover:text-[#cccccc] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#282828] bg-[#161616] text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-3 text-center transition border-b-2 font-medium ${
              activeTab === 'search'
                ? 'border-[#2383e2] text-[#ebebeb] bg-[#1e1e1e]'
                : 'border-transparent text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            Search Public Repos
          </button>
          <button
            onClick={() => {
              setActiveTab('token');
              if (tokenSaved && userRepos.length === 0) {
                handleFetchUserRepos();
              }
            }}
            className={`flex-1 py-2 px-3 text-center transition border-b-2 font-medium ${
              activeTab === 'token'
                ? 'border-[#2383e2] text-[#ebebeb] bg-[#1e1e1e]'
                : 'border-transparent text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            My Repos (Token)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-3 text-center transition border-b-2 font-medium ${
              activeTab === 'manual'
                ? 'border-[#2383e2] text-[#ebebeb] bg-[#1e1e1e]'
                : 'border-transparent text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            Direct URL
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-[#331c1c] border border-[#522b2b] text-[#f27474] rounded flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Search Public Repositories */}
          {activeTab === 'search' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Search repository (e.g. next.js, tailwindcss, react, rust)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#141414] border border-[#353535] rounded-lg pl-9 pr-3 py-2 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                />
                {isSearching && (
                  <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] animate-spin" />
                )}
              </div>

              {/* Popular quick picks when empty */}
              {!searchQuery && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-[#777777]">Popular starter repositories:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: 'vercel/next.js', desc: 'The React Framework for the Web' },
                      { name: 'facebook/react', desc: 'The library for web and native UIs' },
                      { name: 'tailwindlabs/tailwindcss', desc: 'A utility-first CSS framework' },
                      { name: 'supabase/supabase', desc: 'The open source Firebase alternative' }
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleImportRepo(item.name)}
                        disabled={importingRepoId === item.name}
                        className="p-2.5 bg-[#171717] hover:bg-[#242424] border border-[#2c2c2c] rounded-lg text-left transition flex flex-col justify-between"
                      >
                        <div className="font-medium text-[#e0e0e0] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#777777] truncate">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#777777]">Search results ({searchResults.length}):</span>
                  <div className="space-y-1.5">
                    {searchResults.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-2.5 bg-[#171717] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-[#ebebeb] truncate">{repo.full_name}</span>
                            <span className="text-[10px] text-[#888888] flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-amber-400" />
                              {repo.stargazers_count > 1000 ? `${(repo.stargazers_count / 1000).toFixed(1)}k` : repo.stargazers_count}
                            </span>
                          </div>
                          {repo.description && (
                            <p className="text-[11px] text-[#777777] truncate mt-0.5">{repo.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleImportRepo(repo.full_name)}
                          disabled={importingRepoId === repo.full_name}
                          className="px-2.5 py-1 bg-[#2383e2] hover:bg-[#1a73cb] disabled:opacity-50 text-white rounded text-xs shrink-0 flex items-center gap-1"
                        >
                          {importingRepoId === repo.full_name ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>Import</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Personal Token / User Repos */}
          {activeTab === 'token' && (
            <div className="space-y-3">
              <p className="text-[#888888] leading-relaxed">
                Connect with a GitHub Personal Access Token to list your private repositories, organizations, and avoid API rate limits.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="password"
                    placeholder="github_pat_xxxx or ghp_xxxx"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-[#141414] border border-[#353535] rounded pl-8 pr-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                  />
                </div>
                <button
                  onClick={() => handleFetchUserRepos()}
                  disabled={loadingUserRepos || !token.trim()}
                  className="px-3 py-1.5 bg-[#252525] hover:bg-[#2e2e2e] text-[#cccccc] border border-[#383838] rounded text-xs font-normal disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  {loadingUserRepos ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Load Repos</span>}
                </button>
              </div>

              {/* Repos list */}
              {userRepos.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] text-[#777777]">Your repositories ({userRepos.length}):</span>
                  <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                    {userRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="p-2 bg-[#171717] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {repo.private ? (
                              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                            ) : (
                              <Globe className="w-3 h-3 text-[#777777] shrink-0" />
                            )}
                            <span className="font-medium text-[#ebebeb] truncate">{repo.full_name}</span>
                          </div>
                          {repo.description && (
                            <p className="text-[11px] text-[#777777] truncate">{repo.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleImportRepo(repo.full_name)}
                          disabled={importingRepoId === repo.full_name}
                          className="px-2.5 py-1 bg-[#2383e2] hover:bg-[#1a73cb] text-white rounded text-xs shrink-0 flex items-center gap-1"
                        >
                          {importingRepoId === repo.full_name ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>Create Board</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Direct URL */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-[#888888] mb-1">Repository URL or Slug</label>
                <input
                  type="text"
                  placeholder="https://github.com/owner/repo or owner/repo"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full bg-[#141414] border border-[#353535] rounded px-3 py-2 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={importingRepoId !== null}
                  className="px-3.5 py-1.5 bg-[#2383e2] hover:bg-[#1a73cb] text-white rounded text-xs flex items-center gap-1.5"
                >
                  {importingRepoId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Create Board</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
