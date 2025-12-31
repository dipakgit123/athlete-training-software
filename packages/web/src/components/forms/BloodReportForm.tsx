'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Droplet,
  Beaker,
  Activity,
  Zap,
  TestTube,
  Bone,
  Heart,
  Flame,
  Pill,
  Shield,
  FlaskConical,
  Gauge,
  Scan,
  Upload,
  Image,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import {
  bloodReportExtractor,
  ExtractionProgress,
  ExtractionResult,
} from '../../utils/BloodReportExtractor';

// ==================== BLOOD REPORT TYPES ====================

export interface BloodReportData {
  // 1. Iron & RBC Profile
  hemoglobin: string;
  serumIron: string;
  ferritin: string;
  tibc: string;
  uibc: string;
  transferrinSaturation: string;
  solubleTransferrinReceptor: string;
  reticulocyteCount: string;
  reticulocyteHemoglobinContent: string;
  hepcidin: string;
  zincProtoporphyrin: string;
  crpAdjustedFerritin: string;

  // 2. Kidney (Renal) Function
  urea: string;
  creatinine: string;
  uricAcid: string;
  bun: string;
  bunCreatinineRatio: string;
  egfr: string;
  cystatinC: string;

  // 3. Lipid Profile
  totalCholesterol: string;
  hdl: string;
  ldl: string;
  vldl: string;
  triglycerides: string;
  cholesterolHdlRatio: string;
  nonHdlCholesterol: string;
  apoB: string;
  ldlParticleSize: string;

  // 4. Muscle Damage / Recovery Markers
  creatineKinase: string;
  ldh: string;
  myoglobin: string;
  crp: string;
  esr: string;
  aldolase: string;
  astAltRatio: string;

  // 5. Hormonal Profile
  cortisol: string;
  testosterone: string;
  freeTestosterone: string;
  freeTCRatio: string;
  tsh: string;
  freeT3: string;
  freeT4: string;
  reverseT3: string;
  dheaS: string;
  igf1: string;
  prolactin: string;
  lh: string;
  fsh: string;
  shbg: string;

  // 6. Vitamins
  vitaminD: string;
  vitaminB12: string;
  folate: string;
  vitaminB6: string;
  vitaminC: string;
  vitaminE: string;
  vitaminK2: string;

  // 7. Minerals
  calcium: string;
  phosphite: string;
  magnesium: string;
  zinc: string;
  copper: string;
  selenium: string;
  chromium: string;

  // 8. Electrolytes
  sodium: string;
  potassium: string;
  chloride: string;
  bicarbonate: string;
  anionGap: string;
  serumOsmolality: string;
  ionizedCalcium: string;

  // 9. Liver Function Test (LFT)
  bilirubinTotal: string;
  bilirubinDirect: string;
  bilirubinIndirect: string;
  totalProtein: string;
  albumin: string;
  globulin: string;
  agRatio: string;
  ast: string;
  alt: string;
  alp: string;
  ggt: string;
  gammaGlobulinFraction: string;

  // 10. Hematology / CBC
  wbcCount: string;
  neutrophils: string;
  lymphocytes: string;
  monocytes: string;
  eosinophils: string;
  basophils: string;
  absoluteNeutrophilCount: string;
  absoluteLymphocyteCount: string;
  absoluteEosinophilCount: string;
  absoluteMonocyteCount: string;
  rbcCount: string;
  hematocrit: string;
  mcv: string;
  mch: string;
  mchc: string;
  rdwCv: string;
  rdwSd: string;
  plateletCount: string;
  mpv: string;
  pdw: string;
  pct: string;
  pLcr: string;
  pLcc: string;
  nlr: string;
  mentzerIndex: string;
  immaturePlateletFraction: string;
  immatureReticFraction: string;

  // 11. Inflammation & Immunity
  hsCrp: string;
  esrInflammation: string;
  il6: string;
  tnfAlpha: string;
  igA: string;
  igG: string;
  igM: string;
  cortisolRatio: string;

  // 12. Urine Analysis
  urineColour: string;
  urineClarity: string;
  urinePh: string;
  urineSpecificGravity: string;
  urineBlood: string;
  urineLeukocytes: string;
  urineBilirubin: string;
  urineUrobilinogen: string;
  urineKetones: string;
  urineGlucose: string;
  urineProtein: string;
  urineNitrites: string;
  microalbuminuria: string;
  urineCreatinine: string;
  urineSodiumPotassium: string;
  urineOsmolality: string;

  // 13. Endurance / Performance Biomarkers
  restingLactate: string;
  exerciseLactate: string;
  lactateCurvePoints: string;
  anaerobicThreshold: string;
  vo2Max: string;
  cPeptide: string;
  rbc23Dpg: string;

  // 14. Bone Health Panel
  boneIonizedCalcium: string;
  boneVitaminD: string;
  pth: string;
  boneSpecificAlp: string;
  boneMagnesium: string;
  bonePhosphate: string;
  boneDensity: string;
}

// Initial empty state
export const initialBloodReportData: BloodReportData = {
  // 1. Iron & RBC
  hemoglobin: '', serumIron: '', ferritin: '', tibc: '', uibc: '',
  transferrinSaturation: '', solubleTransferrinReceptor: '', reticulocyteCount: '',
  reticulocyteHemoglobinContent: '', hepcidin: '', zincProtoporphyrin: '', crpAdjustedFerritin: '',

  // 2. Kidney
  urea: '', creatinine: '', uricAcid: '', bun: '', bunCreatinineRatio: '', egfr: '', cystatinC: '',

  // 3. Lipid
  totalCholesterol: '', hdl: '', ldl: '', vldl: '', triglycerides: '',
  cholesterolHdlRatio: '', nonHdlCholesterol: '', apoB: '', ldlParticleSize: '',

  // 4. Muscle Damage
  creatineKinase: '', ldh: '', myoglobin: '', crp: '', esr: '', aldolase: '', astAltRatio: '',

  // 5. Hormonal
  cortisol: '', testosterone: '', freeTestosterone: '', freeTCRatio: '', tsh: '',
  freeT3: '', freeT4: '', reverseT3: '', dheaS: '', igf1: '', prolactin: '', lh: '', fsh: '', shbg: '',

  // 6. Vitamins
  vitaminD: '', vitaminB12: '', folate: '', vitaminB6: '', vitaminC: '', vitaminE: '', vitaminK2: '',

  // 7. Minerals
  calcium: '', phosphite: '', magnesium: '', zinc: '', copper: '', selenium: '', chromium: '',

  // 8. Electrolytes
  sodium: '', potassium: '', chloride: '', bicarbonate: '', anionGap: '', serumOsmolality: '', ionizedCalcium: '',

  // 9. LFT
  bilirubinTotal: '', bilirubinDirect: '', bilirubinIndirect: '', totalProtein: '', albumin: '',
  globulin: '', agRatio: '', ast: '', alt: '', alp: '', ggt: '', gammaGlobulinFraction: '',

  // 10. CBC
  wbcCount: '', neutrophils: '', lymphocytes: '', monocytes: '', eosinophils: '', basophils: '',
  absoluteNeutrophilCount: '', absoluteLymphocyteCount: '', absoluteEosinophilCount: '', absoluteMonocyteCount: '',
  rbcCount: '', hematocrit: '', mcv: '', mch: '', mchc: '', rdwCv: '', rdwSd: '',
  plateletCount: '', mpv: '', pdw: '', pct: '', pLcr: '', pLcc: '', nlr: '', mentzerIndex: '',
  immaturePlateletFraction: '', immatureReticFraction: '',

  // 11. Inflammation
  hsCrp: '', esrInflammation: '', il6: '', tnfAlpha: '', igA: '', igG: '', igM: '', cortisolRatio: '',

  // 12. Urine
  urineColour: '', urineClarity: '', urinePh: '', urineSpecificGravity: '', urineBlood: '',
  urineLeukocytes: '', urineBilirubin: '', urineUrobilinogen: '', urineKetones: '', urineGlucose: '',
  urineProtein: '', urineNitrites: '', microalbuminuria: '', urineCreatinine: '', urineSodiumPotassium: '', urineOsmolality: '',

  // 13. Performance
  restingLactate: '', exerciseLactate: '', lactateCurvePoints: '', anaerobicThreshold: '',
  vo2Max: '', cPeptide: '', rbc23Dpg: '',

  // 14. Bone Health
  boneIonizedCalcium: '', boneVitaminD: '', pth: '', boneSpecificAlp: '',
  boneMagnesium: '', bonePhosphate: '', boneDensity: '',
};

interface BloodReportFormProps {
  data: BloodReportData;
  onChange: (data: BloodReportData) => void;
}

// ==================== COMPONENT ====================

export function BloodReportForm({ data, onChange }: BloodReportFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    iron: true,
    kidney: false,
    lipid: false,
    muscle: false,
    hormonal: false,
    vitamins: false,
    minerals: false,
    electrolytes: false,
    lft: false,
    cbc: false,
    inflammation: false,
    urine: false,
    performance: false,
    bone: false,
  });

  // File upload state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState<ExtractionProgress | null>(null);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // Handle file upload and extraction
  const handleFileUpload = useCallback(async (file: File) => {
    setIsExtracting(true);
    setUploadError(null);
    setExtractionResult(null);

    try {
      const result = await bloodReportExtractor.extractFromFile(
        file,
        (progress) => setExtractionProgress(progress)
      );

      setExtractionResult(result);

      // Auto-fill the form with extracted data
      if (Object.keys(result.extractedData).length > 0) {
        onChange({ ...data, ...result.extractedData });
      }
    } catch (error) {
      console.error('Extraction error:', error);
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Failed to extract data from file. Please try again.'
      );
    } finally {
      setIsExtracting(false);
      setExtractionProgress(null);
    }
  }, [data, onChange]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearExtractionResult = () => {
    setExtractionResult(null);
    setUploadError(null);
  };

  const renderInput = (
    name: keyof BloodReportData,
    label: string,
    placeholder: string,
    unit?: string,
    step?: string
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {unit && <span className="text-gray-400">({unit})</span>}
      </label>
      <input
        type="number"
        name={name}
        value={data[name]}
        onChange={handleInputChange}
        step={step || '0.1'}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderTextInput = (
    name: keyof BloodReportData,
    label: string,
    placeholder: string
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={data[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderSelect = (
    name: keyof BloodReportData,
    label: string,
    options: string[]
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select
        name={name}
        value={data[name]}
        onChange={handleInputChange}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderSection = (
    id: string,
    title: string,
    icon: React.ReactNode,
    bgColor: string,
    textColor: string,
    content: React.ReactNode
  ) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between p-4 ${bgColor} hover:opacity-90 transition-colors`}
      >
        <span className={`flex items-center gap-2 font-medium ${textColor}`}>
          {icon}
          {title}
        </span>
        {expandedSections[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expandedSections[id] && (
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {content}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Auto-Extract from Blood Report</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload your blood report (PDF or Image) and the system will automatically extract
          and fill the test values using OCR. <strong>Supported: PDF, JPG, PNG, JPEG</strong>
        </p>

        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${isExtracting ? 'pointer-events-none opacity-60' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,image/*,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {isExtracting ? (
            <div className="space-y-3">
              <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
              <p className="text-blue-600 font-medium">
                {extractionProgress?.message || 'Processing...'}
              </p>
              {extractionProgress && (
                <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress.progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-4 mb-3">
                <FileText className="w-9 h-9 text-red-500" />
                <Image className="w-9 h-9 text-green-500" />
              </div>
              <p className="text-gray-600 mb-2">
                Drag & drop your blood report here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-gray-400">Supported: PDF, JPG, PNG, JPEG (Max 10MB)</p>
            </>
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
            <button
              type="button"
              onClick={clearExtractionResult}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Extraction Result */}
        {extractionResult && (
          <div className="mt-4 p-4 bg-white border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-700">Extraction Complete!</span>
              </div>
              <button
                type="button"
                onClick={clearExtractionResult}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Fields Extracted</p>
                <p className="font-semibold text-green-700">
                  {extractionResult.matchedFields.length} tests
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Confidence</p>
                <p className="font-semibold text-blue-700">
                  {extractionResult.confidence.toFixed(1)}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 col-span-2 md:col-span-1">
                <p className="text-gray-500 text-xs mb-1">Matched Tests</p>
                <p className="font-semibold text-purple-700 text-xs truncate">
                  {extractionResult.matchedFields.slice(0, 5).join(', ')}
                  {extractionResult.matchedFields.length > 5 && '...'}
                </p>
              </div>
            </div>

            {extractionResult.matchedFields.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Extracted values have been auto-filled below. Please review and verify.</p>
                <div className="flex flex-wrap gap-2">
                  {extractionResult.matchedFields.map((field) => (
                    <span
                      key={field}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Show extracted text for debugging when no matches */}
            {extractionResult.matchedFields.length === 0 && extractionResult.extractedText && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-orange-600 font-medium mb-2">
                  No test values could be matched. Here is the text that was extracted from your file:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                    {extractionResult.extractedText.substring(0, 1000)}
                    {extractionResult.extractedText.length > 1000 && '...'}
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tip: If the text looks garbled, try uploading a clearer image or a digital PDF (not scanned).
                </p>
              </div>
            )}

            {/* Show unmatched lines if some matches were found */}
            {extractionResult.unmatchedText.length > 0 && extractionResult.matchedFields.length > 0 && (
              <details className="mt-3 pt-3 border-t border-gray-100">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  Show {extractionResult.unmatchedText.length} unmatched lines (click to expand)
                </summary>
                <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-500 max-h-32 overflow-y-auto">
                  {extractionResult.unmatchedText.map((line, i) => (
                    <div key={i} className="truncate">{line}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-purple-700">
          <strong>Blood Reports (Auto-Analyzed):</strong> Enter blood test values for comprehensive
          health monitoring. The system will automatically analyze and flag any concerning values.
          All 14 panels are available below.
        </p>
      </div>

      {/* 1. Iron & RBC Profile */}
      {renderSection(
        'iron',
        '1. Iron & RBC Profile',
        <Droplet className="w-4 h-4" />,
        'bg-red-50',
        'text-red-800',
        <>
          {renderInput('hemoglobin', 'Hemoglobin', '14.5', 'g/dL')}
          {renderInput('serumIron', 'Serum Iron', '100', 'μg/dL')}
          {renderInput('ferritin', 'Ferritin', '80', 'ng/mL')}
          {renderInput('tibc', 'TIBC', '350', 'μg/dL')}
          {renderInput('uibc', 'UIBC', '200', 'μg/dL')}
          {renderInput('transferrinSaturation', 'Transferrin Sat', '30', '%')}
          {renderInput('solubleTransferrinReceptor', 'sTfR', '3.5', 'mg/L')}
          {renderInput('reticulocyteCount', 'Reticulocyte Count', '1.2', '%')}
          {renderInput('reticulocyteHemoglobinContent', 'RET-He', '30', 'pg')}
          {renderInput('hepcidin', 'Hepcidin', '50', 'ng/mL')}
          {renderInput('zincProtoporphyrin', 'ZPP', '30', 'μmol/mol')}
          {renderInput('crpAdjustedFerritin', 'CRP-Adj Ferritin', '80', 'ng/mL')}
        </>
      )}

      {/* 2. Kidney Function */}
      {renderSection(
        'kidney',
        '2. Kidney (Renal) Function',
        <Beaker className="w-4 h-4" />,
        'bg-yellow-50',
        'text-yellow-800',
        <>
          {renderInput('urea', 'Urea', '25', 'mg/dL')}
          {renderInput('creatinine', 'Creatinine', '1.0', 'mg/dL')}
          {renderInput('uricAcid', 'Uric Acid', '5.5', 'mg/dL')}
          {renderInput('bun', 'BUN', '15', 'mg/dL')}
          {renderInput('bunCreatinineRatio', 'BUN/Creatinine Ratio', '15', '')}
          {renderInput('egfr', 'eGFR', '90', 'mL/min')}
          {renderInput('cystatinC', 'Cystatin-C', '0.9', 'mg/L')}
        </>
      )}

      {/* 3. Lipid Profile */}
      {renderSection(
        'lipid',
        '3. Lipid Profile',
        <Activity className="w-4 h-4" />,
        'bg-blue-50',
        'text-blue-800',
        <>
          {renderInput('totalCholesterol', 'Total Cholesterol', '180', 'mg/dL')}
          {renderInput('hdl', 'HDL', '55', 'mg/dL')}
          {renderInput('ldl', 'LDL', '100', 'mg/dL')}
          {renderInput('vldl', 'VLDL', '25', 'mg/dL')}
          {renderInput('triglycerides', 'Triglycerides', '120', 'mg/dL')}
          {renderInput('cholesterolHdlRatio', 'Cholesterol/HDL Ratio', '3.5', '')}
          {renderInput('nonHdlCholesterol', 'Non-HDL Cholesterol', '130', 'mg/dL')}
          {renderInput('apoB', 'ApoB', '90', 'mg/dL')}
          {renderTextInput('ldlParticleSize', 'LDL Particle Size', 'Large/Small')}
        </>
      )}

      {/* 4. Muscle Damage Markers */}
      {renderSection(
        'muscle',
        '4. Muscle Damage / Recovery Markers',
        <Zap className="w-4 h-4" />,
        'bg-orange-50',
        'text-orange-800',
        <>
          {renderInput('creatineKinase', 'Creatine Kinase (CK)', '150', 'U/L')}
          {renderInput('ldh', 'LDH', '200', 'U/L')}
          {renderInput('myoglobin', 'Myoglobin', '50', 'ng/mL')}
          {renderInput('crp', 'CRP', '0.5', 'mg/L')}
          {renderInput('esr', 'ESR', '10', 'mm/hr')}
          {renderInput('aldolase', 'Aldolase', '5', 'U/L')}
          {renderInput('astAltRatio', 'AST/ALT Ratio', '1.2', '')}
        </>
      )}

      {/* 5. Hormonal Profile */}
      {renderSection(
        'hormonal',
        '5. Hormonal Profile',
        <TestTube className="w-4 h-4" />,
        'bg-purple-50',
        'text-purple-800',
        <>
          {renderInput('cortisol', 'Cortisol', '15', 'μg/dL')}
          {renderInput('testosterone', 'Testosterone', '600', 'ng/dL')}
          {renderInput('freeTestosterone', 'Free Testosterone', '15', 'pg/mL')}
          {renderInput('freeTCRatio', 'Free T/C Ratio', '0.04', '')}
          {renderInput('tsh', 'TSH', '2.5', 'mIU/L')}
          {renderInput('freeT3', 'Free T3', '3.0', 'pg/mL')}
          {renderInput('freeT4', 'Free T4', '1.2', 'ng/dL')}
          {renderInput('reverseT3', 'Reverse T3', '20', 'ng/dL')}
          {renderInput('dheaS', 'DHEA-S', '300', 'μg/dL')}
          {renderInput('igf1', 'IGF-1', '200', 'ng/mL')}
          {renderInput('prolactin', 'Prolactin', '10', 'ng/mL')}
          {renderInput('lh', 'LH', '5', 'mIU/mL')}
          {renderInput('fsh', 'FSH', '5', 'mIU/mL')}
          {renderInput('shbg', 'SHBG', '40', 'nmol/L')}
        </>
      )}

      {/* 6. Vitamins */}
      {renderSection(
        'vitamins',
        '6. Vitamins',
        <Pill className="w-4 h-4" />,
        'bg-green-50',
        'text-green-800',
        <>
          {renderInput('vitaminD', 'Vitamin D (25-OH)', '40', 'ng/mL')}
          {renderInput('vitaminB12', 'Vitamin B12', '500', 'pg/mL')}
          {renderInput('folate', 'Folate (B9)', '15', 'ng/mL')}
          {renderInput('vitaminB6', 'Vitamin B6', '10', 'ng/mL')}
          {renderInput('vitaminC', 'Vitamin C', '1.0', 'mg/dL')}
          {renderInput('vitaminE', 'Vitamin E', '10', 'mg/L')}
          {renderInput('vitaminK2', 'Vitamin K2', '0.5', 'ng/mL')}
        </>
      )}

      {/* 7. Minerals */}
      {renderSection(
        'minerals',
        '7. Minerals',
        <Bone className="w-4 h-4" />,
        'bg-teal-50',
        'text-teal-800',
        <>
          {renderInput('calcium', 'Calcium', '9.5', 'mg/dL')}
          {renderInput('phosphite', 'Phosphate', '3.5', 'mg/dL')}
          {renderInput('magnesium', 'Magnesium', '2.0', 'mg/dL')}
          {renderInput('zinc', 'Zinc', '100', 'μg/dL')}
          {renderInput('copper', 'Copper', '100', 'μg/dL')}
          {renderInput('selenium', 'Selenium', '100', 'μg/L')}
          {renderInput('chromium', 'Chromium', '0.5', 'μg/L')}
        </>
      )}

      {/* 8. Electrolytes */}
      {renderSection(
        'electrolytes',
        '8. Electrolytes',
        <Flame className="w-4 h-4" />,
        'bg-cyan-50',
        'text-cyan-800',
        <>
          {renderInput('sodium', 'Sodium', '140', 'mEq/L')}
          {renderInput('potassium', 'Potassium', '4.0', 'mEq/L')}
          {renderInput('chloride', 'Chloride', '100', 'mEq/L')}
          {renderInput('bicarbonate', 'Bicarbonate (HCO3)', '24', 'mEq/L')}
          {renderInput('anionGap', 'Anion Gap', '12', 'mEq/L')}
          {renderInput('serumOsmolality', 'Serum Osmolality', '290', 'mOsm/kg')}
          {renderInput('ionizedCalcium', 'Ionized Calcium', '4.5', 'mg/dL')}
        </>
      )}

      {/* 9. Liver Function Test */}
      {renderSection(
        'lft',
        '9. Liver Function Test (LFT)',
        <FlaskConical className="w-4 h-4" />,
        'bg-amber-50',
        'text-amber-800',
        <>
          {renderInput('bilirubinTotal', 'Bilirubin Total', '1.0', 'mg/dL')}
          {renderInput('bilirubinDirect', 'Bilirubin Direct', '0.3', 'mg/dL')}
          {renderInput('bilirubinIndirect', 'Bilirubin Indirect', '0.7', 'mg/dL')}
          {renderInput('totalProtein', 'Total Protein', '7.0', 'g/dL')}
          {renderInput('albumin', 'Albumin', '4.0', 'g/dL')}
          {renderInput('globulin', 'Globulin', '3.0', 'g/dL')}
          {renderInput('agRatio', 'A/G Ratio', '1.3', '')}
          {renderInput('ast', 'AST', '25', 'U/L')}
          {renderInput('alt', 'ALT', '25', 'U/L')}
          {renderInput('alp', 'ALP', '70', 'U/L')}
          {renderInput('ggt', 'GGT', '30', 'U/L')}
          {renderInput('gammaGlobulinFraction', 'Gamma Globulin', '1.0', 'g/dL')}
        </>
      )}

      {/* 10. CBC / Hematology */}
      {renderSection(
        'cbc',
        '10. Hematology / CBC',
        <Heart className="w-4 h-4" />,
        'bg-rose-50',
        'text-rose-800',
        <>
          {renderInput('wbcCount', 'WBC Count', '7.0', '×10³/μL')}
          {renderInput('neutrophils', 'Neutrophils', '60', '%')}
          {renderInput('lymphocytes', 'Lymphocytes', '30', '%')}
          {renderInput('monocytes', 'Monocytes', '5', '%')}
          {renderInput('eosinophils', 'Eosinophils', '3', '%')}
          {renderInput('basophils', 'Basophils', '1', '%')}
          {renderInput('absoluteNeutrophilCount', 'ANC', '4.0', '×10³/μL')}
          {renderInput('absoluteLymphocyteCount', 'ALC', '2.0', '×10³/μL')}
          {renderInput('absoluteEosinophilCount', 'AEC', '0.2', '×10³/μL')}
          {renderInput('absoluteMonocyteCount', 'AMC', '0.4', '×10³/μL')}
          {renderInput('rbcCount', 'RBC Count', '5.0', '×10⁶/μL')}
          {renderInput('hematocrit', 'Hematocrit', '45', '%')}
          {renderInput('mcv', 'MCV', '90', 'fL')}
          {renderInput('mch', 'MCH', '30', 'pg')}
          {renderInput('mchc', 'MCHC', '34', 'g/dL')}
          {renderInput('rdwCv', 'RDW-CV', '13', '%')}
          {renderInput('rdwSd', 'RDW-SD', '42', 'fL')}
          {renderInput('plateletCount', 'Platelet Count', '250', '×10³/μL')}
          {renderInput('mpv', 'MPV', '10', 'fL')}
          {renderInput('pdw', 'PDW', '12', '%')}
          {renderInput('pct', 'PCT', '0.25', '%')}
          {renderInput('pLcr', 'P-LCR', '25', '%')}
          {renderInput('pLcc', 'P-LCC', '60', '×10³/μL')}
          {renderInput('nlr', 'NLR', '2.0', '')}
          {renderInput('mentzerIndex', 'Mentzer Index', '13', '')}
          {renderInput('immaturePlateletFraction', 'IPF', '3', '%')}
          {renderInput('immatureReticFraction', 'IRF', '5', '%')}
        </>
      )}

      {/* 11. Inflammation & Immunity */}
      {renderSection(
        'inflammation',
        '11. Inflammation & Immunity',
        <Shield className="w-4 h-4" />,
        'bg-indigo-50',
        'text-indigo-800',
        <>
          {renderInput('hsCrp', 'hs-CRP', '1.0', 'mg/L')}
          {renderInput('esrInflammation', 'ESR', '10', 'mm/hr')}
          {renderInput('il6', 'IL-6', '2.0', 'pg/mL')}
          {renderInput('tnfAlpha', 'TNF-alpha', '5.0', 'pg/mL')}
          {renderInput('igA', 'IgA', '200', 'mg/dL')}
          {renderInput('igG', 'IgG', '1000', 'mg/dL')}
          {renderInput('igM', 'IgM', '100', 'mg/dL')}
          {renderInput('cortisolRatio', 'Cortisol AM/PM Ratio', '2.5', '')}
        </>
      )}

      {/* 12. Urine Analysis */}
      {renderSection(
        'urine',
        '12. Urine Analysis',
        <Beaker className="w-4 h-4" />,
        'bg-lime-50',
        'text-lime-800',
        <>
          {renderSelect('urineColour', 'Colour', ['Pale Yellow', 'Yellow', 'Dark Yellow', 'Amber', 'Red', 'Brown'])}
          {renderSelect('urineClarity', 'Clarity', ['Clear', 'Slightly Cloudy', 'Cloudy', 'Turbid'])}
          {renderInput('urinePh', 'pH', '6.0', '')}
          {renderInput('urineSpecificGravity', 'Specific Gravity', '1.020', '')}
          {renderSelect('urineBlood', 'Blood', ['Negative', 'Trace', '+', '++', '+++'])}
          {renderSelect('urineLeukocytes', 'Leukocytes', ['Negative', 'Trace', '+', '++', '+++'])}
          {renderSelect('urineBilirubin', 'Bilirubin', ['Negative', '+', '++', '+++'])}
          {renderSelect('urineUrobilinogen', 'Urobilinogen', ['Normal', 'Increased'])}
          {renderSelect('urineKetones', 'Ketones', ['Negative', 'Trace', '+', '++', '+++'])}
          {renderSelect('urineGlucose', 'Glucose', ['Negative', 'Trace', '+', '++', '+++'])}
          {renderSelect('urineProtein', 'Protein', ['Negative', 'Trace', '+', '++', '+++'])}
          {renderSelect('urineNitrites', 'Nitrites', ['Negative', 'Positive'])}
          {renderInput('microalbuminuria', 'Microalbuminuria', '20', 'mg/L')}
          {renderInput('urineCreatinine', 'Urine Creatinine', '100', 'mg/dL')}
          {renderTextInput('urineSodiumPotassium', 'Urine Na/K', '1.5')}
          {renderInput('urineOsmolality', 'Urine Osmolality', '600', 'mOsm/kg')}
        </>
      )}

      {/* 13. Endurance / Performance Biomarkers */}
      {renderSection(
        'performance',
        '13. Endurance / Performance Biomarkers',
        <Gauge className="w-4 h-4" />,
        'bg-sky-50',
        'text-sky-800',
        <>
          {renderInput('restingLactate', 'Resting Lactate', '1.0', 'mmol/L')}
          {renderInput('exerciseLactate', 'Exercise Lactate', '4.0', 'mmol/L')}
          {renderTextInput('lactateCurvePoints', 'Lactate Curve Points', '1.0, 2.0, 4.0, 8.0')}
          {renderInput('anaerobicThreshold', 'Anaerobic Threshold', '4.0', 'mmol/L')}
          {renderInput('vo2Max', 'VO2 Max', '55', 'mL/kg/min')}
          {renderInput('cPeptide', 'C-Peptide', '2.0', 'ng/mL')}
          {renderInput('rbc23Dpg', 'RBC 2,3-DPG', '15', 'μmol/g Hb')}
        </>
      )}

      {/* 14. Bone Health Panel */}
      {renderSection(
        'bone',
        '14. Bone Health Panel',
        <Scan className="w-4 h-4" />,
        'bg-stone-50',
        'text-stone-800',
        <>
          {renderInput('boneIonizedCalcium', 'Ionized Calcium', '4.5', 'mg/dL')}
          {renderInput('boneVitaminD', 'Vitamin D', '40', 'ng/mL')}
          {renderInput('pth', 'PTH', '40', 'pg/mL')}
          {renderInput('boneSpecificAlp', 'Bone-specific ALP', '15', 'μg/L')}
          {renderInput('boneMagnesium', 'Magnesium', '2.0', 'mg/dL')}
          {renderInput('bonePhosphate', 'Phosphate', '3.5', 'mg/dL')}
          {renderTextInput('boneDensity', 'Bone Density (DEXA)', 'T-score: 0.5')}
        </>
      )}
    </div>
  );
}

export default BloodReportForm;
