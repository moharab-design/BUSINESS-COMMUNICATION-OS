/**
 * Business Communication OS - Unified Mail View
 * Feature IDs: SYS-003, SYS-019, SYS-022, UI-001, UI-016, MAIL-001 - MAIL-030, COMP-001 - COMP-026, INT-002, OFF-001, OFF-002, OFF-009, OFF-010
 * 
 * Production 3-pane Mailbox interface:
 * 1. Folders Pane (Inbox, Starred, Sent, Drafts, Archive, Trash, Spam) with Live Connection Health Badge
 * 2. Message List with Search, Filter, Bulk Select / Actions, and Unread indicators
 * 3. Reading Pane with full RFC header details, attachment downloads, reply/forward triggers, and AI response drafting
 * 
 * Supports both Live Google Workspace data and offline repository fallback.
 */

import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Star, 
  Archive, 
  Trash2, 
  AlertOctagon, 
  RefreshCw, 
  Search, 
  Plus, 
  CheckSquare, 
  Square, 
  Mail as MailIcon, 
  Paperclip, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Share2, 
  Reply, 
  ReplyAll, 
  Forward,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ProviderBadge } from '../components/common/StatusBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../services/auth/AuthContext';
import { aiService } from '../services/ai/aiService';
import { mailService, MailFilterOptions } from '../services/mail/mailService';
import { Message } from '../types/domain';
import { EmailComposer } from '../components/mail/EmailComposer';

export const MailView: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, hasWorkspaceToken, signInWithGoogle } = useAuth();

  // State
  const [activeFolder, setActiveFolder] = useState<MailFilterOptions['folder']>('INBOX');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [fromProvider, setFromProvider] = useState(false);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Composer Modal
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState<'NEW' | 'REPLY' | 'REPLY_ALL' | 'FORWARD'>('NEW');

  // Inline Quick Reply
  const [quickReplyText, setQuickReplyText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  // Connection Health
  const [connectionHealth, setConnectionHealth] = useState(mailService.getConnectionHealth());

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  // Load messages
  const loadMessages = async (folder: MailFilterOptions['folder'], query: string = '') => {
    setIsLoading(true);
    try {
      const res = await mailService.listMessages({
        folder,
        query: query.trim() || undefined,
        limit: 30,
      });
      setMessages(res.messages);
      setFromProvider(res.fromProvider);
      setConnectionHealth(mailService.getConnectionHealth());

      if (res.messages.length > 0 && !selectedMessageId) {
        setSelectedMessageId(res.messages[0].id);
      } else if (res.messages.length > 0 && !res.messages.some(m => m.id === selectedMessageId)) {
        setSelectedMessageId(res.messages[0].id);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(activeFolder, searchQuery);
  }, [activeFolder, hasWorkspaceToken]);

  // Sync action (OFF-001, OFF-010)
  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Synchronizing with Google Workspace...');
    try {
      if (!hasWorkspaceToken) {
        // Trigger interactive auth if not yet connected
        await signInWithGoogle();
      }
      await mailService.syncMailbox();
      await loadMessages(activeFolder, searchQuery);
      setSyncStatus('Mailbox synchronized successfully');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus(err instanceof Error ? err.message : 'Sync failed');
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
      setConnectionHealth(mailService.getConnectionHealth());
    }
  };

  // Search debounce / execution
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMessages(activeFolder, searchQuery);
  };

  const handleSelectMessage = async (id: string) => {
    setSelectedMessageId(id);
    setReplySuccess(false);
    setQuickReplyText('');

    const target = messages.find(m => m.id === id);
    if (target && !target.isRead) {
      try {
        await mailService.markAsRead(id, true);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
      } catch {
        // optimistic
      }
    }
  };

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map(m => m.id)));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBulkAction = async (action: 'MARK_READ' | 'MARK_UNREAD' | 'STAR' | 'UNSTAR' | 'ARCHIVE' | 'DELETE') => {
    const ids: string[] = Array.from(selectedIds);
    if (ids.length === 0) return;

    try {
      await mailService.executeBulkAction(action, ids);
      setSelectedIds(new Set());
      await loadMessages(activeFolder, searchQuery);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bulk action failed');
    }
  };

  // Toggle single star / flag
  const handleToggleFlag = async (id: string, currentFlagged: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await mailService.flagMessage(id, !currentFlagged);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isFlagged: !currentFlagged } : m));
    } catch (err) {
      console.error('Failed to toggle flag', err);
    }
  };

  // Inline AI drafting
  const handleGenerateAiDraft = async () => {
    if (!selectedMessage) return;
    setIsGeneratingAi(true);
    try {
      const draft = await aiService.draftReply({
        conversationContext: `Subject: ${selectedMessage.subject}\nFrom: ${selectedMessage.from.name} <${selectedMessage.from.email}>\n\n${selectedMessage.bodyText}`,
        tone: 'professional',
        language: language,
      });
      setQuickReplyText(draft);
    } catch {
      // Handled in aiService fallback
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Quick Reply Send
  const handleSendQuickReply = async () => {
    if (!quickReplyText.trim() || !selectedMessage) return;

    try {
      await mailService.sendMessage({
        conversationId: selectedMessage.conversationId,
        to: [selectedMessage.from],
        subject: selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`,
        bodyText: quickReplyText,
      });

      setReplySuccess(true);
      setTimeout(() => {
        setQuickReplyText('');
        setReplySuccess(false);
        loadMessages(activeFolder, searchQuery);
      }, 1800);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Send failed');
    }
  };

  return (
    <div id="view-mail" className="space-y-4">
      {/* Top Page Header with New Message & Sync Actions */}
      <PageHeader
        id="mail-header"
        title={t.navMail}
        description="Unified enterprise communication hub orchestrating Google Workspace Gmail accounts with provider-agnostic domain isolation."
        action={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              title="Sync mailbox with Google Workspace"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Mailbox'}</span>
            </button>

            <button
              onClick={() => {
                setComposerMode('NEW');
                setIsComposerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.compose}</span>
            </button>
          </div>
        }
      />

      {/* Sync / Health Notification Banner */}
      {syncStatus && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>{syncStatus}</span>
          </div>
        </div>
      )}

      {/* Main 3-Pane Mailbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        
        {/* PANE 1: Folders & Provider Connection Bar (Cols 1-3) */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-e border-neutral-200 dark:border-neutral-800 p-4 flex flex-col justify-between bg-neutral-50/40 dark:bg-neutral-900/50">
          <div className="space-y-1">
            <button
              onClick={() => setActiveFolder('INBOX')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'INBOX' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>{t.mailInbox}</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                activeFolder === 'INBOX' 
                  ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900' 
                  : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
              }`}>
                {messages.filter(m => !m.isRead).length}
              </span>
            </button>

            <button
              onClick={() => setActiveFolder('STARRED')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'STARRED' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>{t.mailFlagged}</span>
            </button>

            <button
              onClick={() => setActiveFolder('SENT')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'SENT' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{t.mailSent}</span>
            </button>

            <button
              onClick={() => setActiveFolder('DRAFTS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'DRAFTS' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.mailDrafts}</span>
            </button>

            <button
              onClick={() => setActiveFolder('ARCHIVE')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'ARCHIVE' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </button>

            <button
              onClick={() => setActiveFolder('TRASH')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeFolder === 'TRASH' 
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-xs' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Trash</span>
            </button>
          </div>

          {/* Connection Health & Status Card (ACC-020, INT-002) */}
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">
                  Gmail Integration
                </span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  hasWorkspaceToken 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasWorkspaceToken ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  {hasWorkspaceToken ? 'Live Sync' : 'Offline / Cache'}
                </span>
              </div>

              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal">
                {hasWorkspaceToken 
                  ? `Authenticated as ${user?.email || 'Google Workspace User'}. Live sync active.` 
                  : 'Connect with Google Workspace to read and send real Gmail messages.'}
              </p>

              {!hasWorkspaceToken && (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MailIcon className="w-3.5 h-3.5" />
                  <span>Connect Workspace</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PANE 2: Message List & Bulk Actions (Cols 4-7) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-e border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[700px]">
          
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 space-y-2 bg-neutral-50/50 dark:bg-neutral-900">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 absolute inset-y-0 start-2.5 my-auto text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages, senders, subjects..."
                className="w-full h-8 ps-8 pe-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 outline-hidden"
              />
            </form>

            {/* Bulk Actions Header */}
            <div className="flex items-center justify-between text-xs px-1 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                  title="Select All"
                >
                  {selectedIds.size > 0 && selectedIds.size === messages.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                <span className="text-[11px] font-mono">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${messages.length} messages`}
                </span>
              </div>

              {selectedIds.size > 0 && (
                <div className="flex items-center gap-1 animate-in fade-in">
                  <button
                    onClick={() => handleBulkAction('MARK_READ')}
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    title="Mark Read"
                  >
                    <MailIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('STAR')}
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-amber-500 cursor-pointer"
                    title="Star Selected"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('ARCHIVE')}
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    title="Archive Selected"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleBulkAction('DELETE')}
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-red-500 cursor-pointer"
                    title="Delete Selected"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {isLoading ? (
              <div className="p-8 text-center space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-neutral-400" />
                <p className="text-xs text-neutral-500">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Inbox}
                  title={t.mailNoMessages}
                  description={searchQuery ? 'No correspondence matches your search query.' : t.mailNoMessagesDesc}
                />
              </div>
            ) : (
              messages.map(msg => {
                const isSelected = msg.id === selectedMessageId;
                const isChecked = selectedIds.has(msg.id);

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3.5 transition-colors cursor-pointer relative ${
                      isSelected 
                        ? 'bg-neutral-100/90 dark:bg-neutral-800/80 border-s-3 border-neutral-900 dark:border-neutral-100' 
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={(e) => toggleSelectOne(msg.id, e)}
                          className="p-0.5 rounded text-neutral-400 hover:text-neutral-900 cursor-pointer shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Square className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className={`text-xs truncate ${!msg.isRead ? 'font-bold text-neutral-900 dark:text-neutral-50' : 'font-medium text-neutral-600 dark:text-neutral-400'}`}>
                          {msg.from.name || msg.from.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleToggleFlag(msg.id, msg.isFlagged, e)}
                          className="p-0.5 rounded text-neutral-300 hover:text-amber-500 cursor-pointer"
                        >
                          <Star className={`w-3.5 h-3.5 ${msg.isFlagged ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <p className={`text-xs line-clamp-1 mb-1 ${!msg.isRead ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                      {msg.subject}
                    </p>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {msg.snippet || msg.bodyText}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1">
                        <ProviderBadge provider={msg.provider} />
                        {msg.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                            <Paperclip className="w-3 h-3" />
                            <span>{msg.attachments.length}</span>
                          </span>
                        )}
                      </div>

                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANE 3: Reading Pane & Response Actions (Cols 8-12) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between overflow-y-auto max-h-[700px] bg-white dark:bg-neutral-900">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* RFC Header Card */}
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setComposerMode('REPLY');
                        setIsComposerOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Reply"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setComposerMode('REPLY_ALL');
                        setIsComposerOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Reply All"
                    >
                      <ReplyAll className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setComposerMode('FORWARD');
                        setIsComposerOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Forward"
                    >
                      <Forward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {selectedMessage.from.name}
                    </span>{' '}
                    <span className="font-mono text-[11px]">&lt;{selectedMessage.from.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(selectedMessage.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-500">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">To:</span>{' '}
                  {selectedMessage.to.map(t => `${t.name} <${t.email}>`).join(', ')}
                </div>

                {selectedMessage.cc && selectedMessage.cc.length > 0 && (
                  <div className="text-xs text-neutral-500">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Cc:</span>{' '}
                    {selectedMessage.cc.map(t => `${t.name} <${t.email}>`).join(', ')}
                  </div>
                )}
              </div>

              {/* Message Body Render */}
              <div className="text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed min-h-[160px] font-sans">
                {selectedMessage.bodyText}
              </div>

              {/* Attachments Section (SYS-019) */}
              {selectedMessage.attachments.length > 0 && (
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2.5">
                    Attached Files ({selectedMessage.attachments.length})
                  </span>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map(att => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="font-medium truncate text-neutral-900 dark:text-neutral-100">
                            {att.filename}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                          {(att.sizeBytes / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick AI & Direct Reply Box */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Quick Response
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiDraft}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingAi ? 'Drafting...' : t.mailGenerateAiDraft}</span>
                  </button>
                </div>

                <textarea
                  value={quickReplyText}
                  onChange={e => setQuickReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedMessage.from.name}...`}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 outline-hidden resize-none"
                />

                {replySuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Message transmitted successfully through Gmail provider.</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setComposerMode('REPLY');
                      setIsComposerOpen(true);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  >
                    Open full rich composer...
                  </button>

                  <button
                    type="button"
                    onClick={handleSendQuickReply}
                    disabled={!quickReplyText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.mailReply}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center p-8">
              <EmptyState
                icon={Inbox}
                title={t.mailSelectMessage}
                description="Choose an email or message thread from the center column to preview content."
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Rich Email Composer (COMP-001 - COMP-026) */}
      <EmailComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        mode={composerMode}
        replyToMessage={selectedMessage}
        onSent={() => loadMessages(activeFolder, searchQuery)}
      />
    </div>
  );
};
