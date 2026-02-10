import { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import { useTrainingStore } from '../store/trainingStore';

export default function AiModelPage() {
  const [selectedData, setSelectedData] = useState<number[]>([1, 2, 3]);
  const { isTraining, progress, startTraining, updateProgress, completeTraining } = useTrainingStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const trainingData = [
    { id: 1, filename: 'fastball_session_01.mp4', date: '2025년 12월 19일', riskScore: 28, consistency: 87, medicalRisk: 22, status: 'GOOD' as const },
    { id: 2, filename: 'curveball_practice.mp4', date: '2025년 12월 15일', riskScore: 45, consistency: 72, medicalRisk: 48, status: 'NORMAL' as const },
    { id: 3, filename: 'slider_analysis.mp4', date: '2025년 12월 10일', riskScore: 68, consistency: 58, medicalRisk: 72, status: 'CAUTION' as const },
  ];

  const toggleAll = () => {
    setSelectedData(selectedData.length === trainingData.length ? [] : trainingData.map(d => d.id));
  };

  const toggleItem = (id: number) => {
    setSelectedData(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStartTraining = () => {
    if (selectedData.length === 0) return;
    startTraining();
  };

  useEffect(() => {
    if (isTraining && progress < 100) {
      intervalRef.current = setInterval(() => {
        updateProgress(Math.min(progress + Math.random() * 5, 100));
      }, 500);
    } else if (progress >= 100 && isTraining) {
      completeTraining();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTraining, progress, updateProgress, completeTraining]);

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">개인화 AI 모델</h1>
        <p className="text-slate-400 text-sm mb-8">
          당신만의 투구 데이터로 학습한 맞춤형 AI 모델입니다
        </p>

        {/* AI Model Status Card */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">AI 모델 상태</h2>
                <p className="text-sm text-slate-400">
                  {isTraining ? '모델 학습 중...' : '실시간 분석 준비 완료'}
                </p>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              isTraining
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-status-good/20 text-status-good'
            }`}>
              {isTraining ? 'TRAINING' : 'READY'}
            </span>
          </div>

          {isTraining && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">학습 진행률</span>
                <span className="text-lg font-bold text-cyan-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span className="text-sm text-slate-300">학습 데이터</span>
            </div>
            <div className="text-3xl font-bold mb-1">3</div>
            <div className="text-xs text-slate-400">개의 분석 데이터</div>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-slate-300">모델 정확도</span>
            </div>
            <div className="text-3xl font-bold mb-1">94.2<span className="text-xl">%</span></div>
            <div className="text-xs text-slate-400">정확도</div>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-slate-300">학습 진행도</span>
            </div>
            <div className="text-3xl font-bold mb-1">100<span className="text-xl">%</span></div>
            <div className="text-xs text-slate-400">완료</div>
          </div>
        </div>

        {/* Training Data Selection */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">학습 데이터 선택</h2>
          <p className="text-sm text-slate-400 mb-6">
            모델 학습에 사용할 투구 영상 데이터를 선택하세요 (3/3개 선택)
          </p>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedData.length === 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-slate-600 bg-navy-700"
              />
              <span className="text-sm text-slate-300">전체 해제</span>
            </label>
            <button
              onClick={handleStartTraining}
              disabled={isTraining || selectedData.length === 0}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isTraining || selectedData.length === 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isTraining ? '학습 진행 중...' : '모델 학습 시작'}
            </button>
          </div>

          <div className="space-y-3">
            {trainingData.map((data) => (
              <label
                key={data.id}
                className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedData.includes(data.id)
                    ? 'border-cyan-500 bg-cyan-500/5'
                    : 'border-slate-700 bg-navy-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedData.includes(data.id)}
                      onChange={() => toggleItem(data.id)}
                      className="mt-1 w-4 h-4 rounded border-slate-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{data.filename}</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-3">{data.date}</div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-slate-400">위험도: </span>
                          <span className="font-semibold">{data.riskScore}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">일관성: </span>
                          <span className="font-semibold">{data.consistency}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">의학적 위험: </span>
                          <span className="font-semibold">{data.medicalRisk}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={data.status} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Model Information */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6">모델 정보</h2>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-medium mb-3">분석 항목</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 어깨 스트레스 분석</li>
                <li>• 손목 부하 평가</li>
                <li>• 무릎 안정성 검사</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">모델 특징</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 팔꿈치 부담 측정</li>
                <li>• 척추 각도 검사</li>
                <li>• 고관절 회전 분석</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-3">모델 특징</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 개인 투구 패턴 학습</li>
                <li>• 실시간 위험도 평가</li>
                <li>• 맞춤형 개선 검토 사항</li>
                <li>• 지속적 정확도 향상</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">업데이트 정보</h3>
              <p className="text-sm text-slate-400">
                새로운 분석 데이터를 선택하여 모델을 재학습하면 더욱 정확한 분석 결과를 제공합니다.
                다양한 투구 타입(패스트볼, 커브볼, 슬라이더)의 영상을 선택하여 모델 정확도가 향상됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-cyan-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold mb-3 text-cyan-500">팁</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 다양한 투구 타입(패스트볼, 커브볼, 슬라이더)의 영상을 선택하여 모델 정확도가 향상됩니다</li>
                <li>• 최소 3개 이상의 분석 데이터를 학습하는 것을 권장합니다</li>
                <li>• 정확한 품질 개선이 필요한 영상을 골라보면 더 정확한 분석이 가능합니다</li>
                <li>• 신규정보로 재분석된 데이터를 추가하면 모델이 재학습됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

