import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { analysisApi } from '../api/analysis.api';

const MAX_FILES = 10;
const UPLOAD_CONCURRENCY = 3;

type FileStatus = 'pending' | 'uploading' | 'done' | 'error';

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const videos = Array.from(incoming).filter((f) => f.type.startsWith('video/'));
    if (videos.length === 0) {
      alert('영상 파일만 업로드할 수 있습니다.');
      return;
    }
    setFiles((prev) => {
      const merged = [...prev, ...videos];
      if (merged.length > MAX_FILES) {
        alert(`최대 ${MAX_FILES}개까지 업로드할 수 있습니다. 앞에서 ${MAX_FILES}개만 선택됩니다.`);
      }
      return merged.slice(0, MAX_FILES);
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화
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

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;
    setUploading(true);

    const result: FileStatus[] = files.map(() => 'pending');
    setStatuses([...result]);

    let next = 0;
    const worker = async () => {
      while (next < files.length) {
        const i = next++;
        result[i] = 'uploading';
        setStatuses([...result]);
        try {
          await analysisApi.upload(files[i]);
          result[i] = 'done';
        } catch {
          result[i] = 'error';
        }
        setStatuses([...result]);
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(UPLOAD_CONCURRENCY, files.length) }, worker),
    );

    setUploading(false);

    const succeeded = result.filter((s) => s === 'done').length;
    if (succeeded > 0) {
      navigate('/history');
    } else {
      alert('업로드에 모두 실패했습니다. 다시 시도해주세요.');
    }
  };

  const statusBadge = (status?: FileStatus) => {
    switch (status) {
      case 'uploading':
        return <span className="text-xs text-cyan-400">업로드 중...</span>;
      case 'done':
        return <span className="text-xs text-green-400">완료</span>;
      case 'error':
        return <span className="text-xs text-red-400">실패</span>;
      default:
        return <span className="text-xs text-gray-500">대기</span>;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">투구 영상 업로드</h1>
          <p className="mt-2 text-gray-400">최대 {MAX_FILES}개의 영상을 한 번에 업로드할 수 있습니다.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">클라우드 영상 업로드</h3>
            <p className="text-sm text-gray-400 mb-1">드래그해서 여러 영상을 한 번에 올리거나</p>
            <label className="mt-4 inline-block">
              <span className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 cursor-pointer transition-colors font-medium">
                파일 선택
              </span>
              <input type="file" className="hidden" accept="video/*" multiple onChange={handleFileChange} />
            </label>
            <p className="mt-4 text-xs text-gray-500">(MP4, MOV 등 영상 파일 · 파일당 최대 500MB · 최대 {MAX_FILES}개)</p>
          </div>

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-300">선택된 영상 {files.length}/{MAX_FILES}</span>
                {!uploading && (
                  <button onClick={() => setFiles([])} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    전체 제거
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-navy-800 border border-slate-700 rounded-lg px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {statusBadge(statuses[index])}
                      {!uploading && (
                        <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-400 transition-colors" title="제거">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

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
                  {uploading ? '업로드 중...' : `업로드 & 분석 (${files.length}개)`}
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
