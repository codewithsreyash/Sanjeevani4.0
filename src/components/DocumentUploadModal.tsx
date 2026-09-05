import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Building,
  Tag,
  RefreshCw
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { DocumentCategory } from '../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const CATEGORY_OPTIONS: { id: DocumentCategory; label: string; icon: string; desc: string }[] = [
  { id: 'lab_report', label: 'Lab & Pathology Report', icon: '🧪', desc: 'Blood test, Urine, CBC, Blood sugar' },
  { id: 'radiology_scan', label: 'Radiology / X-Ray / USG', icon: '🩻', desc: 'Chest X-Ray, Sonography, ECG, MRI' },
  { id: 'prescription', label: 'Past / External Prescription', icon: '💊', desc: 'Hospital Rx slips, Clinic slips' },
  { id: 'discharge_summary', label: 'Discharge Summary', icon: '📋', desc: 'Hospital discharge papers, IPD summary' },
  { id: 'vaccination', label: 'Vaccination Certificate', icon: '💉', desc: 'COVID, Tetanus, Child immunization' },
  { id: 'identity', label: 'ID / ABHA Document', icon: '🪪', desc: 'Aadhaar copy, Ration card, ABHA Card' }
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName
}) => {
  const { uploadPatientDocument, currentUser } = useHealth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('lab_report');
  const [issuingFacility, setIssuingFacility] = useState('District Hospital Chandrapur');
  const [notes, setNotes] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image'>('image');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Camera Mode State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);

    // Format size
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;
    setFileSize(sizeStr);

    if (file.type.includes('pdf')) {
      setFileType('pdf');
    } else {
      setFileType('image');
    }

    // Auto-suggest title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFileData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError('Unable to access device camera. Please upload an image or document from your device.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setFileData(dataUrl);
    setFileType('image');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    setFileName(`Camera-Scan-${timestamp}.jpg`);
    setFileSize('~450 KB');

    if (!title) {
      const catObj = CATEGORY_OPTIONS.find((c) => c.id === category);
      setTitle(`${catObj?.label || 'Medical'} Document Scan`);
    }

    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a descriptive title for this document.');
      return;
    }

    if (!fileData) {
      setError('Please select a file or take a camera scan photo of the document.');
      return;
    }

    setIsSubmitting(true);
    try {
      uploadPatientDocument({
        patientId,
        title: title.trim(),
        category,
        fileType,
        fileSize: fileSize || '350 KB',
        fileData,
        issuingFacility: issuingFacility.trim() || 'Rural Health Sub-centre',
        notes: notes.trim() || undefined,
        uploadedByRole: currentUser?.role || 'patient',
        uploadedByName: currentUser?.name || 'Citizen'
      });

      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Upload className="w-6 h-6 text-teal-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">ABHA Digital Health Locker</h2>
              <p className="text-xs text-teal-100/90">
                Upload Medical Record & Lab Reports for <span className="font-semibold text-white">{patientName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-teal-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Document Category / दस्तऐवज प्रकार
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title and Issuing Facility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Document Title / शीर्षक *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. CBC Blood Test Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Issuing Hospital / Lab / संस्था
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Chandrapur District Hospital Lab"
                  value={issuingFacility}
                  onChange={(e) => setIssuingFacility(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* File Upload / Camera Scanner Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Document or Snap Photo / फोटो किंवा फाइल निवडा *
            </label>

            {/* Live Camera Viewport */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-teal-500 bg-black aspect-video flex items-center justify-center shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-white/50 m-6 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-medium text-white/80 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Center the medical paper or report here
                  </span>
                </div>
                <div className="absolute bottom-4 inset-x-0 flex justify-center items-center space-x-4">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-800/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow backdrop-blur-sm transition-colors"
                  >
                    Cancel Camera
                  </button>
                  <button
                    type="button"
                    onClick={captureCameraPhoto}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center space-x-2 transition-transform active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Photo</span>
                  </button>
                </div>
              </div>
            ) : fileData ? (
              /* Uploaded Preview State */
              <div className="border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {fileType === 'pdf' ? (
                      <FileText className="w-7 h-7 text-rose-500" />
                    ) : (
                      <img src={fileData} alt="Document Preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{fileName || 'Document Loaded'}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {fileType.toUpperCase()} • {fileSize} • Ready to save
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFileData(null);
                      setFileName('');
                      setFileSize('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone / Action Selector */
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-800/30 text-center hover:border-teal-400 dark:hover:border-teal-600 transition-colors">
                <div className="flex justify-center space-x-3 mb-3">
                  <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-2xl text-teal-600 dark:text-teal-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Upload PDF, Photo or Scan with Camera
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Supports Lab Reports, Sonography photos, Hospital slips & Prescriptions up to 10MB.
                </p>

                <div className="mt-4 flex items-center justify-center space-x-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="doc-file-input"
                  />
                  <label
                    htmlFor="doc-file-input"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm flex items-center space-x-2 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File (PDF/Image)</span>
                  </label>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-2 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Scan with Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Doctor / Patient Remarks (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Given by Dr. Kulkarni during OPD visit; Hemoglobin levels checked"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <span>🔒 Encrypted under ABHA M2/M3 consent</span>
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !fileData}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center space-x-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Encrypting & Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save to ABHA Locker</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
