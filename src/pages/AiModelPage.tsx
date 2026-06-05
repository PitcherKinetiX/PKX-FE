import { useState, useCallback } from 'react';
import Header from '../components/layout/Header';
import { useModelStatus, useTrainModel } from '../hooks/useAiModel';

const MIN_TRAIN_VIDEOS = 10;
const MAX_TRAIN_VIDEOS = 50;

export default function AiModelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const { data: modelStatus, isLoading: isLoadingStatus } = useModelStatus();
  const trainMutation = useTrainModel();

  const isTraining = modelStatus?.trainingStatus === 'TRAINING';
  const enoughVideos = files.length >= MIN_TRAIN_VIDEOS;
  const canStart = enoughVideos && !isTraining && !trainMutation.isPending;

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const videos = Array.from(incoming).filter((f) => f.type.startsWith('video/'));
    if (videos.length === 0) {
      alert('영상 파일만 업로드할 수 있습니다.');
      return;
    }
    setFiles((prev) => {
      const merged = [...prev, ...videos];
      if (merged.length > MAX_TRAIN_VIDEOS) {
        alert(`최대 ${MAX_TRAIN_VIDEOS}개까지 업로드할 수 있습니다.`);
      }
      return merged.slice(0, MAX_TRAIN_VIDEOS);
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleStartTraining = () => {
    if (!canStart) return;
    trainMutation.mutate(files, {
      onSuccess: () => setFiles([]),
      onError: () => alert('학습 시작에 실패했습니다. 잠시 후 다시 시도해주세요.'),
    });
  };

  if (isLoadingStatus) {
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
            <p className="text-red-400">AI 모델 정보를 불러오는데 실패했습니다.</p>
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
          본인의 투구 영상으로 학습한 맞춤형 AI 모델입니다. 영상을 {MIN_TRAIN_VIDEOS}개 이상 업로드해 모델을 학습하세요.
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

          {modelStatus.trainingStatus === 'FAILED' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                이전 학습이 실패했습니다. 영상을 다시 업로드해 학습을 재시도해주세요.
              </p>
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
            <div className="text-xs text-slate-400">개의 학습 영상</div>
          </div>

          <div className="bg-navy-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-slate-300">마지막 학습</span>
            </div>
            <div className="text-lg font-bold mb-1">
              {modelStatus.lastTrainedAt ? (
                new Date(modelStatus.lastTrainedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
              ) : (
                <span className="text-slate-500">미학습</span>
              )}
            </div>
            <div className="text-xs text-slate-400">학습 일자</div>
          </div>
        </div>

        {/* Training Video Upload */}
        <div className="bg-navy-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">학습 영상 업로드</h2>
          <p className="text-sm text-slate-400 mb-6">
            모델 학습에 사용할 투구 영상을 업로드하세요. 최소 {MIN_TRAIN_VIDEOS}개 이상 필요합니다. ({files.length}개 선택됨)
          </p>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-400 mb-3">드래그해서 여러 영상을 한 번에 올리거나</p>
            <label className="inline-block">
              <span className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors font-medium">
                파일 선택
              </span>
              <input type="file" className="hidden" accept="video/*" multiple onChange={handleFileChange} />
            </label>
            <p className="mt-4 text-xs text-slate-500">(MP4, MOV 등 · 파일당 최대 500MB · 최소 {MIN_TRAIN_VIDEOS}개)</p>
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-300">
                  선택된 영상 {files.length}개
                  {!enoughVideos && (
                    <span className="text-yellow-500 ml-2">
                      ({MIN_TRAIN_VIDEOS - files.length}개 더 필요)
                    </span>
                  )}
                </span>
                {!trainMutation.isPending && (
                  <button onClick={() => setFiles([])} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    전체 제거
                  </button>
                )}
              </div>
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-navy-700 border border-slate-700 rounded-lg px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    {!trainMutation.isPending && (
                      <button
                        onClick={() => removeFile(index)}
                        className="text-slate-500 hover:text-red-400 transition-colors shrink-0 ml-3"
                        title="제거"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleStartTraining}
              disabled={!canStart}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                canStart ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {trainMutation.isPending
                ? '업로드 & 학습 시작 중...'
                : isTraining
                ? '학습 진행 중...'
                : '모델 학습 시작'}
            </button>
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
                <li>• 모델 학습에는 최소 {MIN_TRAIN_VIDEOS}개의 투구 영상이 필요합니다</li>
                <li>• 전신이 프레임 안에 보이고 카메라를 고정해 촬영한 영상이 좋습니다</li>
                <li>• 학습이 완료되면 업로드 페이지에서 영상을 분석할 수 있습니다</li>
                <li>• 이후 업로드한 분석 영상으로 모델이 자동으로 추가 학습됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
