import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { analysisApi } from '../api/analysis.api';
import { useModelStatus } from '../hooks/useAiModel';

export default function UploadPage() {
  const navigate = useNavigate();
  const { data: modelStatus, isLoading: statusLoading } = useModelStatus();

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const modelReady = modelStatus?.trainingStatus === 'READY';
  const isTraining = modelStatus?.trainingStatus === 'TRAINING';

  const pickFile = useCallback((incoming: FileList | File[]) => {
    const video = Array.from(incoming).find((f) => f.type.startsWith('video/'));
    if (!video) {
      alert('영상 파일만 업로드할 수 있습니다.');
      return;
    }
    setFile(video);
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
      if (e.dataTransfer.files?.length) pickFile(e.dataTransfer.files);
    },
    [pickFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) pickFile(e.target.files);
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const result = await analysisApi.upload(file);
      navigate(`/analysis/${result.analysisId}/processing`);
    } catch {
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
      setUploading(false);
    }
  };

  // 모델 상태 로딩 중
  if (statusLoading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  // 개인화 모델이 준비되지 않으면 업로드 차단 + 학습 유도
  if (!modelReady) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-navy-800 border border-slate-700 rounded-xl p-10 text-center">
            <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-3">개인화 AI 모델이 필요합니다</h1>
            <p className="text-slate-400 mb-6">
              {isTraining
                ? '모델 학습/업데이트가 진행 중입니다. 완료 후 영상을 분석할 수 있습니다.'
                : '영상을 분석하려면 먼저 본인의 투구 영상으로 개인화 모델을 학습해야 합니다.'}
            </p>
            <button
              onClick={() => navigate('/ai-model')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
            >
              {isTraining ? '학습 상태 보기' : '모델 학습하러 가기'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">투구 영상 업로드</h1>
          <p className="mt-2 text-gray-400">영상 1개를 업로드하면 개인화 모델로 분석합니다.</p>
        </div>

        <div className="bg-navy-50/30 border border-gray-700/50 rounded-xl p-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-navy-50/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">클라우드 영상 업로드</h3>
            <p className="text-sm text-gray-400 mb-1">드래그해서 영상을 올리거나</p>
            <label className="mt-4 inline-block">
              <span className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors font-medium">
                파일 선택
              </span>
              <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
            </label>
            <p className="mt-4 text-xs text-gray-500">(MP4, MOV 등 영상 파일 · 최대 500MB · 1개)</p>
          </div>

          {/* Selected file */}
          {file && (
            <div className="mt-6">
              <div className="flex items-center justify-between bg-navy-800 border border-slate-700 rounded-lg px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-3"
                    title="제거"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  disabled={uploading}
                  className="px-6 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-navy-50/50 disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {uploading ? '업로드 중...' : '업로드 & 분석'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">최상의 결과를 위한 팁:</h3>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>전신이 프레임 안에 보이도록 촬영하세요</li>
            <li>카메라를 고정하여 촬영하세요 (삼각대 권장)</li>
            <li>조명이 충분한 환경에서 촬영하세요</li>
            <li>와인드업부터 팔로우스루까지 전체 동작을 촬영하세요</li>
            <li>권장 카메라 각도: 90도 측면 뷰</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
