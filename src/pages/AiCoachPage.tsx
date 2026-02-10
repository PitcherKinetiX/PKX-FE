import Header from '../components/layout/Header';

export default function AiCoachPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">AI 코칭</h1>
        <p className="text-sm text-slate-300 mb-4">
          AI가 피칭 폼과 위험 지표를 분석해 코칭 포인트를 제안하는 페이지입니다.
          (현재는 기본 레이아웃만 구성되어 있으며, 추후 AI API 연동 및 상세 피드백 UI를 추가할 예정입니다.)
        </p>
      </main>
    </div>
  );
}

