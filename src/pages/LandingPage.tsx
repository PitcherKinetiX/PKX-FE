import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Top bar */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-100">Pitcher KinetiX</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            로그인
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        {/* Hero */}
        <section className="text-center space-y-6">
          <p className="text-cyan-400 text-sm font-semibold tracking-[0.2em]">AI PITCHING ANALYSIS</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-cyan-300">
            AI가 분석하는 당신의 투구 폼,<br />
            부상 위험을 미리 예방하세요.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            개인화된 인공지능 모델이 투구 영상을 분석하고
            <br />
            부상 위험도를 시각적으로 제공하는 스포츠 테크 서비스입니다.
          </p>
          <button
            onClick={handleStart}
            className="mt-4 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/30 transition-colors"
          >
            무료로 시작하기
          </button>
        </section>

        {/* Usage flow */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-center">사용 흐름</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                title: '영상 업로드',
                desc: '투구 영상을 간편하게 드래그 앤 드롭',
                icon: (
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                ),
              },
              {
                title: 'AI 분석',
                desc: '개인화된 AI 모델이 자동으로 분석',
                icon: (
                  // 상단 로고와 동일한 번개(볼트) 아이콘
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                title: '대시보드 확인',
                desc: '위험도와 핵심 지표를 시각적으로 확인',
                icon: (
                  // 위험도 시각화와 동일한 L자 축 + 막대 아이콘
                  <svg className="h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* 축 */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 4v13a2 2 0 002 2h12"
                    />
                    {/* 막대 */}
                    <path strokeLinecap="round" strokeWidth={2} d="M10 17V11" />
                    <path strokeLinecap="round" strokeWidth={2} d="M14 17V7" />
                    <path strokeLinecap="round" strokeWidth={2} d="M18 17V13" />
                  </svg>
                ),
              },
              {
                title: 'PDF 리포트',
                desc: '상세 분석 결과를 PDF로 저장',
                icon: (
                  // 세로로 긴 문서 아이콘 (비율 유지)
                  <svg className="h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 20 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3h7.5L17 7.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.5 3V8H17"
                    />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-6 flex flex-col items-start space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key benefits */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-center">주요 강점</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: '개인화 AI 모델',
                desc: '당신의 투구 데이터로 학습된 맞춤형 AI 모델이 더욱 정확한 분석을 제공합니다.',
                icon: (
                  // 방패(실드) 아이콘
                  <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3l7 3v6c0 4.5-3.2 8.1-7 9-3.8-.9-7-4.5-7-9V6l7-3z"
                    />
                  </svg>
                ),
              },
              {
                title: '위험도 시각화',
                desc: '4단계 위험도 등급과 3대 핵심 지표로 부상 위험을 한눈에 파악합니다.',
                icon: (
                  // L자 축 + 세 개의 막대 아이콘 (고정 비율)
                  <svg className="h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* 축 */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 4v13a2 2 0 002 2h12"
                    />
                    {/* 막대 */}
                    <path strokeLinecap="round" strokeWidth={2} d="M10 17V11" />
                    <path strokeLinecap="round" strokeWidth={2} d="M14 17V7" />
                    <path strokeLinecap="round" strokeWidth={2} d="M18 17V13" />
                  </svg>
                ),
              },
              {
                title: '리포트 비교',
                desc: '과거와 현재 리포트를 비교하여 개선율과 폼 변화를 데이터로 확인할 수 있습니다.',
                icon: (
                  // 우상향 지그재그 화살표 아이콘
                  <svg className="h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* 지그재그 라인 */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 16l4-4 3 3 4-5"
                    />
                    {/* 오른쪽 화살표 */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h6"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 10l-2-2M20 10l-2 2"
                    />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl px-6 py-10 text-center space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">지금 바로 시작하세요</h2>
            <p className="text-sm text-slate-400">
              첫 분석은 무료입니다. 부상 없는 투구 라이프를 위한 첫 걸음을 지금 내딛어 보세요.
            </p>
            <button
              onClick={handleStart}
              className="mt-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/30 transition-colors"
            >
              무료로 시작하기
            </button>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800/60 mt-8">
        © 2025 Pitcher KinetiX. All rights reserved.
      </footer>
    </div>
  );
}

