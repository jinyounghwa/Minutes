'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';
import { 
  User, 
  Bell, 
  Shield, 
  Keyboard,
  Palette,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from 'next-themes';
import api from '@/lib/api';
import { Switch } from "@/components/ui/switch" 
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const res = await api.put('/users/me', { name, email });
      setUser(res.data);
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      console.error(err);
      alert('프로필 업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
    }
    setLoading(true);
    setSuccessMessage(null);
    try {
      await api.put('/users/me', { password });
      setSuccessMessage('비밀번호가 변경되었습니다.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      alert('비밀번호 변경 실패');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role?: string) => {
    switch (role) {
      case 'super_admin': return '최고 관리자';
      case 'admin': return '관리자';
      case 'team_leader': return '팀 리더';
      case 'member': return '멤버';
      case 'viewer': return '뷰어';
      default: return '멤버';
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: string, icon: React.ElementType, label: string }) => (
    <Button 
        variant={activeTab === tab ? "secondary" : "ghost"} 
        className="w-full justify-start gap-2"
        onClick={() => {
            setActiveTab(tab);
            setSuccessMessage(null);
        }}
    >
      <Icon className="w-4 h-4" /> {label}
    </Button>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Breadcrumbs />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">설정</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">계정 및 환경설정을 관리하세요</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <NavButton tab="profile" icon={User} label="프로필" />
          <NavButton tab="notifications" icon={Bell} label="알림" />
          <NavButton tab="security" icon={Shield} label="보안" />
          <NavButton tab="appearance" icon={Palette} label="외관" />
          <NavButton tab="shortcuts" icon={Keyboard} label="단축키" />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {successMessage && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  {successMessage}
              </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>프로필 정보</CardTitle>
                    <CardDescription>개인 정보를 수정하세요</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {name?.charAt(0) || user?.email?.charAt(0)}
                        </div>
                        <div>
                        <Button variant="outline" size="sm">이미지 업로드</Button>
                        <p className="text-xs text-slate-500 mt-2">JPG, PNG. 최대 2MB.</p>
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        <div className="space-y-2">
                        <Label>이름</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label>이메일</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleUpdateProfile} disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            변경사항 저장
                        </Button>
                    </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle>역할 정보</CardTitle>
                    <CardDescription>현재 접근 권한 레벨</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                             <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-medium">{getRoleName(user?.role)}</p>
                            <p className="text-sm text-slate-500">워크스페이스 역할</p>
                        </div>
                        </div>
                        <Badge variant="secondary">{user?.role?.toUpperCase()}</Badge>
                    </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                    <CardTitle className="text-red-600">계정 관리</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                        <p className="font-medium text-slate-900 dark:text-white">로그아웃</p>
                        <p className="text-sm text-slate-500">현재 세션을 안전하게 종료합니다</p>
                        </div>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20" onClick={logout}>
                        로그아웃
                        </Button>
                    </div>
                    </CardContent>
                </Card>
            </div>
          )}

          {activeTab === 'appearance' && (
            <Card>
                <CardHeader>
                <CardTitle>외관 설정</CardTitle>
                <CardDescription>애플리케이션의 테마를 선택하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <button 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                        onClick={() => setTheme('light')}
                    >
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <Sun className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="font-medium">라이트</span>
                    </button>
                    <button 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                        onClick={() => setTheme('dark')}
                    >
                        <div className="p-3 bg-slate-950 rounded-full shadow-sm">
                            <Moon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="font-medium">다크</span>
                    </button>
                    <button 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-indigo-600 bg-slate-100 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                        onClick={() => setTheme('system')}
                    >
                        <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-full shadow-sm">
                            <Monitor className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="font-medium">시스템</span>
                    </button>
                </div>
                </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
             <Card>
                <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>비밀번호를 변경하여 계정을 보호하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>새 비밀번호</Label>
                        <Input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="6자 이상 입력"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>비밀번호 확인</Label>
                        <Input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="비밀번호 재입력"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleChangePassword} disabled={loading || !password}>
                             {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                             비밀번호 변경
                        </Button>
                    </div>
                </CardContent>
             </Card>
          )}

          {activeTab === 'notifications' && (
              <Card>
                  <CardHeader>
                      <CardTitle>알림 설정</CardTitle>
                      <CardDescription>어떤 알림을 받을지 선택하세요 (현재는 데모 기능입니다)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                              <Label className="text-base">이메일 알림</Label>
                              <p className="text-sm text-slate-500">새로운 회의록이 공유될 때 이메일 받기</p>
                          </div>
                          <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                              <Label className="text-base">마케팅 이메일</Label>
                              <p className="text-sm text-slate-500">새로운 기능 및 뉴스레터 구독</p>
                          </div>
                          <Switch />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                              <Label className="text-base">브라우저 알림</Label>
                              <p className="text-sm text-slate-500">데스크탑 푸시 알림 허용</p>
                          </div>
                          <Switch defaultChecked />
                      </div>
                  </CardContent>
              </Card>
          )}

          {activeTab === 'shortcuts' && (
              <Card>
                  <CardHeader>
                      <CardTitle>키보드 단축키</CardTitle>
                      <CardDescription>작업 속도를 높여주는 단축키 모음</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                              { key: '⌘ + S', desc: '저장' },
                              { key: '⌘ + /', desc: '명령어 메뉴' },
                              { key: '⌘ + B', desc: '볼드체' },
                              { key: '⌘ + I', desc: '이탤릭체' },
                              { key: '⌘ + K', desc: '링크 삽입' },
                              { key: 'Esc', desc: '편집 모드 종료' },
                          ].map((shortcut) => (
                              <div key={shortcut.key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                  <span className="text-sm text-slate-500">{shortcut.desc}</span>
                                  <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono font-medium shadow-sm">
                                      {shortcut.key}
                                  </kbd>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}

        </div>
      </div>
    </div>
  );
}