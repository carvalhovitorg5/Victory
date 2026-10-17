import React, { useState } from 'react';
import { X, User, Check, ShieldCheck, Edit3 } from 'lucide-react';
import { UserProfile } from '../types/game';
import { saveUserProfile } from '../utils/user';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [nicknameInput, setNicknameInput] = useState<string>(user.nickname);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [googleNameInput, setGoogleNameInput] = useState<string>(user.name || '');
  const [googleEmailInput, setGoogleEmailInput] = useState<string>(user.email || '');
  const [showGoogleFlow, setShowGoogleFlow] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nicknameInput.trim() || user.nickname;
    const updated: UserProfile = {
      ...user,
      nickname: cleanNick,
    };
    saveUserProfile(updated);
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSimulateGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = googleNameInput.trim() || 'Jogador Google';
    const email = googleEmailInput.trim() || 'jogador@gmail.com';
    const autoNick = user.nickname.startsWith('Mister#')
      ? name.split(' ')[0] + '#' + Math.floor(10 + Math.random() * 90)
      : user.nickname;

    const updated: UserProfile = {
      ...user,
      id: `google_${Date.now()}`,
      name,
      email,
      nickname: autoNick,
      isGoogleLinked: true,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    };

    saveUserProfile(updated);
    onUpdateUser(updated);
    setShowGoogleFlow(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDisconnectGoogle = () => {
    const updated: UserProfile = {
      ...user,
      isGoogleLinked: false,
      email: undefined,
    };
    saveUserProfile(updated);
    onUpdateUser(updated);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#faf9f6] dark:bg-[#121f18] border border-[#d8d5cb] dark:border-[#263c30] p-6 shadow-2xl text-[#1f2b24] dark:text-[#e4ede7] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#eeece4] dark:bg-[#1c2e24] hover:bg-[#e4e1d7] dark:hover:bg-[#253d30] text-[#55665c] dark:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#385345] text-white flex items-center justify-center shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#24332b] dark:text-white">
              Perfil do Jogador
            </h2>
            <p className="text-xs text-[#6a7c72] dark:text-[#8ea598] font-medium">
              Identificação nos Rankings Diários
            </p>
          </div>
        </div>

        {/* Google Status Section */}
        <div className="p-4 rounded-xl border border-[#d8d5cb] dark:border-[#253b2e] bg-white dark:bg-[#16271e] mb-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-[#385345] dark:text-[#97c4a8]">
                Conta Google
              </span>
            </div>

            {user.isGoogleLinked ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Conectado
              </span>
            ) : (
              <span className="text-[11px] text-[#86968d] dark:text-[#7f978a]">
                Não vinculado
              </span>
            )}
          </div>

          {user.isGoogleLinked ? (
            <div className="space-y-2 mt-2">
              <div className="text-xs text-[#44544b] dark:text-[#a0b8aa]">
                Conectado como <strong className="text-[#202c25] dark:text-white">{user.name}</strong> ({user.email})
              </div>
              <button
                onClick={handleDisconnectGoogle}
                className="text-xs text-[#cb6d53] hover:underline cursor-pointer"
              >
                Desconectar Conta Google
              </button>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-xs text-[#63746a] dark:text-[#8ea598] mb-3">
                Faça login para sincronizar suas pontuações e garantir seu lugar no topo do ranking.
              </p>
              {!showGoogleFlow ? (
                <button
                  onClick={() => setShowGoogleFlow(true)}
                  className="w-full py-2 px-3 rounded-lg border border-[#d8d5cb] dark:border-[#2e4738] bg-[#f8f7f3] dark:bg-[#1a2e22] hover:bg-white dark:hover:bg-[#203629] text-xs font-bold text-[#202c25] dark:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <span>Conectar com Google</span>
                </button>
              ) : (
                <form onSubmit={handleSimulateGoogleLogin} className="space-y-2.5 pt-2 border-t border-[#eeece4] dark:border-[#22362a]">
                  <div>
                    <label className="text-[11px] font-bold text-[#5c6e64] dark:text-[#8ea598] block mb-1">
                      Nome / Google Account:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Vitor Carvalho"
                      value={googleNameInput}
                      onChange={e => setGoogleNameInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#14241b] text-xs text-[#202c25] dark:text-white focus:outline-hidden focus:border-[#385345]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5c6e64] dark:text-[#8ea598] block mb-1">
                      Email Google:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@gmail.com"
                      value={googleEmailInput}
                      onChange={e => setGoogleEmailInput(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#14241b] text-xs text-[#202c25] dark:text-white focus:outline-hidden focus:border-[#385345]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-1.5 rounded-lg bg-[#385345] hover:bg-[#2a4135] text-white text-xs font-bold cursor-pointer"
                    >
                      Confirmar Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGoogleFlow(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#cbc7bc] dark:border-[#2c4436] text-xs text-[#63746a] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Nickname Form */}
        <form onSubmit={handleSaveNickname} className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#4d5e54] dark:text-[#8fa699] flex items-center gap-1.5 mb-1.5">
              <Edit3 className="w-3.5 h-3.5 text-[#cb6d53]" />
              <span>Seu Nickname no Ranking:</span>
            </label>
            <input
              type="text"
              maxLength={20}
              required
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              placeholder="Digite seu nickname esportivo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbc7bc] dark:border-[#2d4637] bg-white dark:bg-[#16271e] font-display text-lg font-bold text-[#202c25] dark:text-white focus:outline-hidden focus:border-[#385345] dark:focus:border-[#4d705d] shadow-2xs"
            />
            <p className="text-[11px] text-[#7d8f84] dark:text-[#7f978a] mt-1">
              Este nome aparecerá ao lado das suas pontuações na tabela diária.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#385345] hover:bg-[#293e33] text-white font-display text-base font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <span>Salvar Nickname</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
