import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/layout/Header';
import StatusBadge from '../components/ui/StatusBadge';
import { useModelStatus, useTrainModel } from '../hooks/useAiModel';
import { analysisApi } from '../api/analysis.api';

export default function AiModelPage() {
  const [selectedData, setSelectedData] = useState<number[]>([]);

  // Fetch AI model status
  const { data: modelStatus, isLoading: isLoadingStatus } = useModelStatus();

  // Fetch completed analyses for training data selection
  const { data: analysesData, isLoading: isLoadingAnalyses } = useQuery({
    queryKey: ['analyses', 'completed'],
    queryFn: () => analysisApi.getList(0, 100), // Get up to 100 completed analyses
  });

  // Train model mutation
  const trainMutation = useTrainModel();

  const isLoading = isLoadingStatus || isLoadingAnalyses;
  const isTraining = modelStatus?.trainingStatus === 'TRAINING';
  const canTrain = modelStatus?.canTrain ?? false;

  // Filter only completed analyses with results
  const completedAnalyses = analysesData?.items.filter(
    (analysis) => analysis.status === 'COMPLETED' && analysis.overallRiskScore !== undefined
  ) ?? [];

  const toggleAll = () => {
    setSelectedData(
      selectedData.length === completedAnalyses.length ? [] : completedAnalyses.map((d) => d.analysisId)
    );
  };

  const toggleItem = (id: number) => {
    setSelectedData((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartTraining = () => {
    if (selectedData.length === 0 || !canTrain) return;
    trainMutation.mutate(selectedData);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-slate-400">AI 모델 정보를 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!modelStatus) {
    return (
      <div className="min-h-screen bg-navy-900 text-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 mb-4">AI 모델 정보를 불러오는데 실패했습니다.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">AI 모델 상태</h2>
                <p className="text-sm text-slate-400">
                  {modelStatus.currentModelType === 'USER_SPECIFIC' ? '개인화 모델 사용 중' : '일반 모델 사용 중'}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                modelStatus.trainingStatus === 'TRAINING'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : modelStatus.trainingStatus === 'READY'
                  ? 'bg-status-good/20 text-status-good'
                  : modelStatus.trainingStatus === 'FAILED'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {modelStatus.trainingStatus}
            </span>
          </div>

          {isTraining && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">학습 진행률</span>
                <span className="text-lg font-bold text-cyan-400">
                  {Math.round(modelStatus.trainingProgress)}%
                </span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${modelStatus.trainingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!canTrain && modelStatus.cannotTrainReason && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-500">{modelStatus.cannotTrainReason}</p>
            </div>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <span className="text-sm text-slate-300">학습 데이터</span>
            </div>
            <div className="text-3xl font-bold mb-1">{modelStatus.trainingSampleCount}</div>
            <div className="text-xs text-slate-400">개의 분석 데이터</div>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm text-slate-300">모델 정확도</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {modelStatus.modelAccuracy !== null ? (
                <>
                  {modelStatus.modelAccuracy.toFixed(1)}
                  <span className="text-xl">%</span>
                </>
              ) : (
                <span className="text-xl text-slate-500">-</span>
              )}
            </div>
            <div className="text-xs text-slate-400">정확도</div>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-sm text-slate-300">마지막 학습</span>
            </div>
            <div className="text-lg font-bold mb-1">
              {modelStatus.lastTrainedAt ? (
                new Date(modelStatus.lastTrainedAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })
              ) : (
                <span className="text-slate-500">미학습</span>
              )}
            </div>
            <div className="text-xs text-slate-400">학습 일자</div>
          </div>
        </div>

        {/* Training Data Selection */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">학습 데이터 선택</h2>
          <p className="text-sm text-slate-400 mb-6">
            모델 학습에 사용할 투구 영상 데이터를 선택하세요 ({selectedData.length}/{completedAnalyses.length}개 선택)
          </p>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedData.length === completedAnalyses.length && completedAnalyses.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-slate-600 bg-navy-700"
              />
              <span className="text-sm text-slate-300">
                {selectedData.length === completedAnalyses.length ? '전체 해제' : '전체 선택'}
              </span>
            </label>
            <button
              onClick={handleStartTraining}
              disabled={isTraining || selectedData.length === 0 || !canTrain || trainMutation.isPending}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isTraining || selectedData.length === 0 || !canTrain || trainMutation.isPending
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {trainMutation.isPending ? '학습 시작 중...' : isTraining ? '학습 진행 중...' : '모델 학습 시작'}
            </button>
          </div>

          {completedAnalyses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>완료된 분석 데이터가 없습니다.</p>
              <p className="text-sm mt-2">먼저 영상을 업로드하고 분석을 완료해주세요.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {completedAnalyses.map((data) => (
                <label
                  key={data.analysisId}
                  className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedData.includes(data.analysisId)
                      ? 'border-cyan-500 bg-cyan-500/5'
                      : 'border-slate-700 bg-navy-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedData.includes(data.analysisId)}
                        onChange={() => toggleItem(data.analysisId)}
                        className="mt-1 w-4 h-4 rounded border-slate-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium">{data.videoFilename}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                          {new Date(data.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-slate-400">위험도: </span>
                            <span className="font-semibold">{data.overallRiskScore?.toFixed(1) ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {data.riskGrade && <StatusBadge status={data.riskGrade as 'GOOD' | 'NORMAL' | 'CAUTION' | 'DANGER'} />}
                  </div>
                </label>
              ))}
            </div>
          )}
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
              <h3 className="font-medium mb-3">측정 지표</h3>
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
                <li>• 맞춤형 개선 권장사항</li>
                <li>• 지속적 정확도 향상</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">업데이트 정보</h3>
              <p className="text-sm text-slate-400">
                새로운 분석 데이터를 선택하여 모델을 재학습하면 더욱 정확한 분석 결과를 제공합니다. 다양한 투구
                타입(패스트볼, 커브볼, 슬라이더)의 영상을 선택하여 모델 정확도를 향상시킬 수 있습니다.
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
                <li>• 다양한 투구 타입(패스트볼, 커브볼, 슬라이더)의 영상을 선택하여 모델 정확도를 향상시킬 수 있습니다</li>
                <li>• 최소 10개 이상의 분석 데이터를 학습하는 것을 권장합니다</li>
                <li>• 정확한 품질 개선이 필요한 영상을 선택하면 더 정확한 분석이 가능합니다</li>
                <li>• 신규 분석 데이터를 추가하면 모델이 자동으로 재학습됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
