import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { useUploadAnalysis } from '../hooks/useAnalysis';

export default function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const uploadMutation = useUploadAnalysis();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Please upload a video file');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        navigate('/history');
      },
      onError: () => {
        alert('Failed to upload video. Please try again.');
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">투구 영상 업로드</h1>
          <p className="mt-2 text-gray-400">투구 자세 분석을 위한 영상을 업로드하세요</p>
        </div>

        <div className="bg-navy-50/30 border border-gray-700/50 rounded-xl p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <div className="mx-auto w-16 h-16 bg-navy-50/50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">클라우드 영상 업로드</h3>
                <p className="text-sm text-gray-400 mb-1">드래그해서 영상 파일을 올리거나</p>
                <label className="mt-4 inline-block">
                  <span className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors font-medium">
                    분석 시작
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="mt-4 text-xs text-gray-500">
                  (MP4, MOV 등 일반 영상 파일 500MB)
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  파일 제거
                </button>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-navy-50/50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {uploadMutation.isPending ? '업로드 중...' : '업로드 & 분석'}
              </button>
            </div>
          )}

          {uploadMutation.isError && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              영상 업로드에 실패했습니다. 다시 시도해주세요.
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
