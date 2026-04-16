import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Search } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatDateTime, timeAgo, cn } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';

export default function Messagerie() {
  const user = useAuthStore((s) => s.user);
  const { userId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef(null);

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => (await api.get('/communication/messages/conversations')).data.data,
    refetchInterval: 30_000,
  });

  const { data: usersList } = useQuery({
    queryKey: ['users-list', search],
    queryFn: async () => (await api.get('/users', { params: { search, pageSize: 30 } })).data.data,
    enabled: !!search,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => (await api.get(`/communication/messages/${userId}`)).data.data,
    enabled: !!userId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = useMutation({
    mutationFn: (contenu) => api.post('/communication/messages', { destinataireId: userId, contenu }),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['messages', userId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return (
    <div>
      <PageHeader title="Messagerie" subtitle="Messages instantanés avec vos collègues" />

      <div className="card p-0 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Liste conversations */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  className="input pl-9 text-sm"
                  placeholder="Rechercher un collègue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {search && usersList?.length ? (
                usersList.filter((u) => u.id !== user?.id).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => { navigate(`/messages/${u.id}`); setSearch(''); }}
                    className="p-3 border-b flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  >
                    <Avatar user={u} size={36} />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{u.prenom} {u.nom}</div>
                      <div className="text-xs text-gray-500 truncate">{u.poste}</div>
                    </div>
                  </div>
                ))
              ) : (
                conversations?.map(({ contact, lastMessage, nonLus }) => (
                  <div
                    key={contact.id}
                    onClick={() => navigate(`/messages/${contact.id}`)}
                    className={cn(
                      'p-3 border-b flex items-center gap-3 cursor-pointer hover:bg-gray-50',
                      userId === contact.id && 'bg-sht-primary/5'
                    )}
                  >
                    <div className="relative">
                      <Avatar user={contact} size={36} />
                      {nonLus > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-sht-accent text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                          {nonLus}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">{contact.prenom} {contact.nom}</div>
                      <div className="text-xs text-gray-500 truncate">{lastMessage?.contenu}</div>
                    </div>
                    <div className="text-[10px] text-gray-400">{timeAgo(lastMessage?.createdAt)}</div>
                  </div>
                )) || <div className="p-6 text-center text-sm text-gray-500">Aucune conversation</div>
              )}
            </div>
          </div>

          {/* Zone messages */}
          <div className="flex-1 flex flex-col">
            {!userId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Sélectionnez une conversation
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                  {messages?.map((m) => {
                    const mine = m.expediteurId === user?.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-3 py-2 rounded-2xl text-sm ${mine ? 'bg-sht-primary text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>
                          <div className="whitespace-pre-wrap">{m.contenu}</div>
                          <div className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                            {formatDateTime(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); if (text.trim()) send.mutate(text); }}
                  className="p-3 border-t flex gap-2"
                >
                  <input
                    className="input flex-1"
                    placeholder="Écrire un message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" disabled={!text.trim()}>
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
