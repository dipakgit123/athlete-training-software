'use client';

import type { BloodReportData } from '../components/forms/BloodReportForm';

// Types for dynamic imports
type TesseractWorker = import('tesseract.js').Worker;
type PDFDocumentProxy = any;

// Helper to create flexible patterns that match various formats:
// "Hemoglobin: 12.0", "Hemoglobin (gm%) 12.0", "Hemoglobin 12.0", "HB - 12.0"
const createPatterns = (names: string[]): RegExp[] => {
  const patterns: RegExp[] = [];
  for (const name of names) {
    // Pattern: name followed by optional (unit) or : or - then number
    patterns.push(new RegExp(`${name}\\s*(?:\\([^)]*\\))?\\s*[:\\-]?\\s*(\\d+\\.?\\d*)`, 'i'));
  }
  return patterns;
};

// Blood test patterns with variations in naming
const BLOOD_TEST_PATTERNS: Array<{
  field: keyof BloodReportData;
  patterns: RegExp[];
  unit?: string;
}> = [
  // Iron & RBC Profile
  {
    field: 'hemoglobin',
    patterns: createPatterns(['hemoglobin', 'haemoglobin', 'hb', 'hgb']),
    unit: 'g/dL',
  },
  {
    field: 'serumIron',
    patterns: createPatterns(['serum\\s*iron', 's\\.?\\s*iron']),
    unit: 'μg/dL',
  },
  {
    field: 'ferritin',
    patterns: createPatterns(['ferritin']),
    unit: 'ng/mL',
  },
  {
    field: 'tibc',
    patterns: createPatterns(['tibc', 'total\\s*iron\\s*binding\\s*capacity', 'iron\\s*binding\\s*capacity']),
    unit: 'μg/dL',
  },
  {
    field: 'transferrinSaturation',
    patterns: createPatterns(['transferrin\\s*saturation', 'tsat', 'iron\\s*saturation']),
    unit: '%',
  },
  {
    field: 'reticulocyteCount',
    patterns: createPatterns(['reticulocyte\\s*count', 'retic\\s*count', 'reticulocyte']),
    unit: '%',
  },

  // Kidney Function
  {
    field: 'urea',
    patterns: createPatterns(['blood\\s*urea', 'urea']),
    unit: 'mg/dL',
  },
  {
    field: 'creatinine',
    patterns: createPatterns(['creatinine', 'serum\\s*creatinine']),
    unit: 'mg/dL',
  },
  {
    field: 'uricAcid',
    patterns: createPatterns(['uric\\s*acid', 'serum\\s*uric\\s*acid']),
    unit: 'mg/dL',
  },
  {
    field: 'bun',
    patterns: createPatterns(['bun', 'blood\\s*urea\\s*nitrogen']),
    unit: 'mg/dL',
  },
  {
    field: 'egfr',
    patterns: createPatterns(['egfr', 'estimated\\s*gfr', 'glomerular\\s*filtration']),
    unit: 'mL/min',
  },

  // Lipid Profile
  {
    field: 'totalCholesterol',
    patterns: createPatterns(['total\\s*cholesterol', 'cholesterol']),
    unit: 'mg/dL',
  },
  {
    field: 'hdl',
    patterns: createPatterns(['hdl[\\s\\-]?cholesterol', 'hdl', 'high\\s*density\\s*lipoprotein']),
    unit: 'mg/dL',
  },
  {
    field: 'ldl',
    patterns: createPatterns(['ldl[\\s\\-]?cholesterol', 'ldl', 'low\\s*density\\s*lipoprotein']),
    unit: 'mg/dL',
  },
  {
    field: 'vldl',
    patterns: createPatterns(['vldl[\\s\\-]?cholesterol', 'vldl']),
    unit: 'mg/dL',
  },
  {
    field: 'triglycerides',
    patterns: createPatterns(['triglycerides?', 'tg']),
    unit: 'mg/dL',
  },

  // Muscle Damage Markers
  {
    field: 'creatineKinase',
    patterns: createPatterns(['creatine\\s*kinase', 'ck', 'cpk']),
    unit: 'U/L',
  },
  {
    field: 'ldh',
    patterns: createPatterns(['ldh', 'lactate\\s*dehydrogenase']),
    unit: 'U/L',
  },
  {
    field: 'crp',
    patterns: createPatterns(['crp', 'c[\\-\\s]?reactive\\s*protein']),
    unit: 'mg/L',
  },
  {
    field: 'esr',
    patterns: createPatterns(['esr', 'erythrocyte\\s*sedimentation']),
    unit: 'mm/hr',
  },

  // Hormonal Profile
  {
    field: 'cortisol',
    patterns: createPatterns(['cortisol']),
    unit: 'μg/dL',
  },
  {
    field: 'testosterone',
    patterns: createPatterns(['testosterone', 'total\\s*testosterone', 'free\\s*testosterone']),
    unit: 'ng/dL',
  },
  {
    field: 'tsh',
    patterns: createPatterns(['tsh', 'thyroid\\s*stimulating']),
    unit: 'mIU/L',
  },
  {
    field: 'freeT3',
    patterns: createPatterns(['free\\s*t3', 'ft3', 't3']),
    unit: 'pg/mL',
  },
  {
    field: 'freeT4',
    patterns: createPatterns(['free\\s*t4', 'ft4', 't4']),
    unit: 'ng/dL',
  },

  // Vitamins - with patterns for Indian lab reports
  {
    field: 'vitaminD',
    patterns: [
      // Exact match for "25-Hydroxy Vitamin -D (ng/ml) 23.38" format from user's PDF
      /25[\-\s]?hydroxy\s*vitamin\s*[\-\s]?d\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      // Standard patterns with optional units in parentheses
      /vitamin\s*[\-\s]?d3?\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*[\-\s]?d3?\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /25[\-\s]?oh[\-\s]?d\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /cholecalciferol\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      // Indian lab format: "Vit D Total" or "Vitamin D, Total"
      /vit\.?\s*d\s*(?:total|,\s*total)?\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'ng/mL',
  },
  {
    field: 'vitaminB12',
    patterns: [
      /vitamin\s*b[\\-\s]?12\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*b[\\-\s]?12\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /b[\\-\s]?12\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /cobalamin\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /cyanocobalamin\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'pg/mL',
  },
  {
    field: 'folate',
    patterns: [
      /folate\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /folic\s*acid\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vitamin\s*b9\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /serum\s*folate\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'ng/mL',
  },
  {
    field: 'vitaminB6',
    patterns: [
      /vitamin\s*b[\\-\s]?6\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*b[\\-\s]?6\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /b[\\-\s]?6\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /pyridoxine\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'ng/mL',
  },
  {
    field: 'vitaminC',
    patterns: [
      /vitamin\s*c\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*c\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /ascorbic\s*acid\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'mg/dL',
  },
  {
    field: 'vitaminE',
    patterns: [
      /vitamin\s*e\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*e\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /alpha\s*tocopherol\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /tocopherol\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'mg/L',
  },
  {
    field: 'vitaminK2',
    patterns: [
      /vitamin\s*k[\\-\s]?2\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /vit\.?\s*k[\\-\s]?2\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /k[\\-\s]?2\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
      /menaquinone\s*(?:\([^)]*\))?\s*[:\-]?\s*(\d+\.?\d*)/i,
    ],
    unit: 'ng/mL',
  },

  // Minerals
  {
    field: 'calcium',
    patterns: createPatterns(['calcium', 'serum\\s*calcium']),
    unit: 'mg/dL',
  },
  {
    field: 'magnesium',
    patterns: createPatterns(['magnesium', 'serum\\s*magnesium']),
    unit: 'mg/dL',
  },
  {
    field: 'phosphite',
    patterns: createPatterns(['phosphate', 'phosphorus', 'serum\\s*phosphorus']),
    unit: 'mg/dL',
  },
  {
    field: 'zinc',
    patterns: createPatterns(['zinc', 'serum\\s*zinc']),
    unit: 'μg/dL',
  },

  // Electrolytes
  {
    field: 'sodium',
    patterns: createPatterns(['sodium', 'serum\\s*sodium']),
    unit: 'mEq/L',
  },
  {
    field: 'potassium',
    patterns: createPatterns(['potassium', 'serum\\s*potassium']),
    unit: 'mEq/L',
  },
  {
    field: 'chloride',
    patterns: createPatterns(['chloride', 'serum\\s*chloride']),
    unit: 'mEq/L',
  },

  // Liver Function
  {
    field: 'bilirubinTotal',
    patterns: createPatterns(['total\\s*bilirubin', 'bilirubin\\s*total', 'bilirubin']),
    unit: 'mg/dL',
  },
  {
    field: 'bilirubinDirect',
    patterns: createPatterns(['direct\\s*bilirubin', 'bilirubin\\s*direct']),
    unit: 'mg/dL',
  },
  {
    field: 'totalProtein',
    patterns: createPatterns(['total\\s*protein', 'serum\\s*protein']),
    unit: 'g/dL',
  },
  {
    field: 'albumin',
    patterns: createPatterns(['albumin', 'serum\\s*albumin']),
    unit: 'g/dL',
  },
  {
    field: 'globulin',
    patterns: createPatterns(['globulin']),
    unit: 'g/dL',
  },
  {
    field: 'ast',
    patterns: createPatterns(['ast', 'sgot', 'aspartate\\s*aminotransferase']),
    unit: 'U/L',
  },
  {
    field: 'alt',
    patterns: createPatterns(['alt', 'sgpt', 'alanine\\s*aminotransferase']),
    unit: 'U/L',
  },
  {
    field: 'alp',
    patterns: createPatterns(['alp', 'alkaline\\s*phosphatase']),
    unit: 'U/L',
  },
  {
    field: 'ggt',
    patterns: createPatterns(['ggt', 'gamma\\s*gt', 'gamma\\s*glutamyl']),
    unit: 'U/L',
  },

  // CBC / Hematology
  {
    field: 'wbcCount',
    patterns: createPatterns(['wbc\\s*count', 'wbc', 'white\\s*blood\\s*cell', 'total\\s*wbc', 'leucocyte', 'tlc']),
    unit: '×10³/μL',
  },
  {
    field: 'rbcCount',
    patterns: createPatterns(['rbc\\s*count', 'rbc', 'red\\s*blood\\s*cell', 'erythrocyte\\s*count']),
    unit: '×10⁶/μL',
  },
  {
    field: 'plateletCount',
    patterns: createPatterns(['platelet\\s*count', 'platelets?', 'plt']),
    unit: '×10³/μL',
  },
  {
    field: 'hematocrit',
    patterns: createPatterns(['hematocrit', 'haematocrit', 'hct', 'packed\\s*cell\\s*volume', 'pcv']),
    unit: '%',
  },
  {
    field: 'mcv',
    patterns: createPatterns(['mcv', 'mean\\s*corpuscular\\s*volume']),
    unit: 'fL',
  },
  {
    field: 'mch',
    patterns: createPatterns(['mch', 'mean\\s*corpuscular\\s*hemoglobin', 'mean\\s*corpuscular\\s*hb']),
    unit: 'pg',
  },
  {
    field: 'mchc',
    patterns: createPatterns(['mchc', 'mean\\s*corpuscular\\s*hb\\s*concentration']),
    unit: 'g/dL',
  },
  {
    field: 'neutrophils',
    patterns: createPatterns(['neutrophils?', 'neut']),
    unit: '%',
  },
  {
    field: 'lymphocytes',
    patterns: createPatterns(['lymphocytes?', 'lymph']),
    unit: '%',
  },
  {
    field: 'monocytes',
    patterns: createPatterns(['monocytes?', 'mono']),
    unit: '%',
  },
  {
    field: 'eosinophils',
    patterns: createPatterns(['eosinophils?', 'eos']),
    unit: '%',
  },
  {
    field: 'basophils',
    patterns: createPatterns(['basophils?', 'baso']),
    unit: '%',
  },
  {
    field: 'rdwCv',
    patterns: createPatterns(['rdw[\\-\\s]?cv', 'rdw[\\-\\s]?sd', 'rdw']),
    unit: '%',
  },
  {
    field: 'mpv',
    patterns: createPatterns(['mpv', 'mean\\s*platelet\\s*volume']),
    unit: 'fL',
  },

  // hs-CRP
  {
    field: 'hsCrp',
    patterns: createPatterns(['hs[\\-\\s]?crp', 'high\\s*sensitivity\\s*crp']),
    unit: 'mg/L',
  },

  // Glucose related (for performance)
  {
    field: 'restingLactate',
    patterns: createPatterns(['resting\\s*lactate', 'lactate']),
    unit: 'mmol/L',
  },
];

export interface ExtractionResult {
  extractedData: Partial<BloodReportData>;
  extractedText: string;
  confidence: number;
  matchedFields: string[];
  unmatchedText: string[];
}

export interface ExtractionProgress {
  stage: 'loading' | 'processing' | 'extracting' | 'complete';
  progress: number;
  message: string;
}

class BloodReportExtractor {
  private worker: TesseractWorker | null = null;

  // Initialize Tesseract worker (dynamic import)
  async initializeWorker(): Promise<void> {
    if (!this.worker) {
      const { createWorker } = await import('tesseract.js');
      this.worker = await createWorker('eng');
    }
  }

  // Terminate worker to free resources
  async terminateWorker(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  // Extract text from image using OCR
  async extractTextFromImage(
    file: File,
    onProgress?: (progress: ExtractionProgress) => void
  ): Promise<string> {
    onProgress?.({
      stage: 'loading',
      progress: 10,
      message: 'Loading OCR engine...',
    });

    await this.initializeWorker();

    onProgress?.({
      stage: 'processing',
      progress: 30,
      message: 'Processing image...',
    });

    const imageUrl = URL.createObjectURL(file);

    try {
      onProgress?.({
        stage: 'extracting',
        progress: 50,
        message: 'Extracting text from image...',
      });

      const result = await this.worker!.recognize(imageUrl);

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Text extraction complete',
      });

      return result.data.text;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  // Extract text from PDF by rendering to canvas and using OCR
  async extractTextFromPDF(
    file: File,
    onProgress?: (progress: ExtractionProgress) => void
  ): Promise<string> {
    onProgress?.({
      stage: 'loading',
      progress: 5,
      message: 'Loading PDF library...',
    });

    // Dynamically load PDF.js from CDN to avoid Next.js bundling issues
    await this.loadPdfJsFromCDN();

    onProgress?.({
      stage: 'loading',
      progress: 15,
      message: 'Reading PDF file...',
    });

    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = (window as any).pdfjsLib;

    if (!pdfjsLib) {
      throw new Error('PDF library failed to load. Please try uploading an image instead.');
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;

    onProgress?.({
      stage: 'processing',
      progress: 25,
      message: `Processing ${totalPages} page(s)...`,
    });

    // Initialize OCR worker
    await this.initializeWorker();

    let allText = '';

    // Process each page (limit to first 3 pages for performance)
    const pagesToProcess = Math.min(totalPages, 3);

    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      onProgress?.({
        stage: 'extracting',
        progress: 25 + ((pageNum / pagesToProcess) * 60),
        message: `Extracting text from page ${pageNum}/${pagesToProcess}...`,
      });

      const page = await pdf.getPage(pageNum);

      // First try to get text content directly (for digital PDFs)
      try {
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        if (pageText.trim().length > 50) {
          // If we got meaningful text, use it
          allText += pageText + '\n';
          continue;
        }
      } catch (e) {
        // Text extraction failed, will use OCR
      }

      // For scanned PDFs, render to canvas and use OCR
      const scale = 2; // Higher scale = better OCR quality
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Could not create canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to image and run OCR
      const imageDataUrl = canvas.toDataURL('image/png');
      const result = await this.worker!.recognize(imageDataUrl);
      allText += result.data.text + '\n';

      // Clean up
      canvas.remove();
    }

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'PDF extraction complete',
    });

    return allText;
  }

  // Load PDF.js from CDN dynamically
  private async loadPdfJsFromCDN(): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('PDF extraction is only available in the browser');
    }

    // Check if already loaded
    if ((window as any).pdfjsLib) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;

      script.onload = () => {
        // Set worker source
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve();
        } else {
          reject(new Error('PDF.js failed to initialize'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load PDF.js library'));
      };

      document.head.appendChild(script);
    });
  }

  // Parse extracted text and match with blood test patterns
  parseBloodReportText(text: string): ExtractionResult {
    const extractedData: Partial<BloodReportData> = {};
    const matchedFields: string[] = [];
    const unmatchedLines: string[] = [];

    // Log extracted text for debugging
    console.log('=== EXTRACTED TEXT ===');
    console.log(text);
    console.log('=== END EXTRACTED TEXT ===');

    // Normalize text - replace multiple spaces and handle common OCR issues
    const normalizedText = text
      .replace(/\s+/g, ' ')
      .replace(/[|]/g, ':')
      .replace(/\n/g, ' ')
      .trim();

    console.log('=== NORMALIZED TEXT ===');
    console.log(normalizedText.substring(0, 500));
    console.log('=== END NORMALIZED (first 500 chars) ===');

    // Check if text contains vitamin-related words for debugging
    const vitaminKeywords = ['vitamin', 'vit ', 'vit.', 'b12', 'b6', 'folate', 'd3', '25-oh', 'cobalamin'];
    const foundVitaminKeywords = vitaminKeywords.filter(kw => normalizedText.toLowerCase().includes(kw));
    console.log('=== VITAMIN KEYWORDS FOUND ===', foundVitaminKeywords);
    if (foundVitaminKeywords.length === 0) {
      console.log('WARNING: No vitamin-related keywords found in the PDF. Your PDF may not contain vitamin test results.');
    }

    // Also try line-by-line matching for table formats
    const lines = text.split('\n').filter((line) => line.trim());

    // Try to match each pattern against both normalized and line-by-line
    for (const pattern of BLOOD_TEST_PATTERNS) {
      let found = false;

      // First try normalized text (for inline formats)
      for (const regex of pattern.patterns) {
        const match = normalizedText.match(regex);
        if (match && match[1]) {
          const value = parseFloat(match[1]);
          if (!isNaN(value)) {
            extractedData[pattern.field] = value.toString();
            matchedFields.push(pattern.field);
            console.log(`Matched ${pattern.field}: ${value} (normalized)`);
            found = true;
            break;
          }
        }
      }

      // If not found, try line by line (for table formats)
      if (!found) {
        for (const line of lines) {
          for (const regex of pattern.patterns) {
            const match = line.match(regex);
            if (match && match[1]) {
              const value = parseFloat(match[1]);
              if (!isNaN(value)) {
                extractedData[pattern.field] = value.toString();
                matchedFields.push(pattern.field);
                console.log(`Matched ${pattern.field}: ${value} (line: ${line.substring(0, 50)})`);
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
      }

      // Also try a more flexible pattern: look for the field name followed by any number
      if (!found) {
        const fieldNames = this.getFieldNameVariations(pattern.field);
        for (const fieldName of fieldNames) {
          // Flexible pattern: field name ... number (with various separators)
          const flexPattern = new RegExp(
            fieldName + '[\\s\\-:_\\|\\t]+([\\d]+\\.?[\\d]*)',
            'i'
          );
          const match = normalizedText.match(flexPattern);
          if (match && match[1]) {
            const value = parseFloat(match[1]);
            if (!isNaN(value) && value > 0) {
              extractedData[pattern.field] = value.toString();
              matchedFields.push(pattern.field);
              console.log(`Matched ${pattern.field}: ${value} (flexible: ${fieldName})`);
              found = true;
              break;
            }
          }
        }
      }
    }

    // Extract lines that couldn't be matched (for debugging)
    for (const line of lines) {
      const hasMatch = BLOOD_TEST_PATTERNS.some((pattern) =>
        pattern.patterns.some((regex) => regex.test(line))
      );
      if (!hasMatch && line.match(/\d+\.?\d*/)) {
        unmatchedLines.push(line.trim());
      }
    }

    // Calculate confidence based on matched fields
    const confidence =
      matchedFields.length > 0
        ? Math.min((matchedFields.length / BLOOD_TEST_PATTERNS.length) * 100, 100)
        : 0;

    console.log(`=== EXTRACTION RESULT: ${matchedFields.length} fields matched ===`);

    return {
      extractedData,
      extractedText: text,
      confidence,
      matchedFields,
      unmatchedText: unmatchedLines.slice(0, 20), // Show more unmatched lines for debugging
    };
  }

  // Get variations of field names for flexible matching
  private getFieldNameVariations(field: string): string[] {
    const variations: Record<string, string[]> = {
      hemoglobin: ['hemoglobin', 'haemoglobin', 'hb', 'hgb'],
      serumIron: ['serum iron', 'iron', 's\\.?\\s*iron'],
      ferritin: ['ferritin'],
      tibc: ['tibc', 'total iron binding'],
      transferrinSaturation: ['transferrin sat', 'tsat', 'iron sat'],
      reticulocyteCount: ['reticulocyte', 'retic'],
      urea: ['urea', 'blood urea'],
      creatinine: ['creatinine', 'serum creatinine', 'creat'],
      uricAcid: ['uric acid'],
      bun: ['bun', 'blood urea nitrogen'],
      egfr: ['egfr', 'gfr', 'glomerular'],
      totalCholesterol: ['total cholesterol', 'cholesterol', 't\\.?\\s*chol'],
      hdl: ['hdl', 'high density'],
      ldl: ['ldl', 'low density'],
      vldl: ['vldl'],
      triglycerides: ['triglyceride', 'tg'],
      creatineKinase: ['creatine kinase', 'ck', 'cpk'],
      ldh: ['ldh', 'lactate dehydrogenase'],
      crp: ['crp', 'c reactive', 'c-reactive'],
      esr: ['esr', 'erythrocyte sed'],
      cortisol: ['cortisol'],
      testosterone: ['testosterone'],
      tsh: ['tsh', 'thyroid stimulating'],
      freeT3: ['free t3', 'ft3', 't3'],
      freeT4: ['free t4', 'ft4', 't4'],
      vitaminD: ['vitamin d', 'vit d', '25-oh', '25 oh', 'vitamin d3', 'cholecalciferol'],
      vitaminB12: ['vitamin b12', 'b12', 'cobalamin', 'cyanocobalamin'],
      folate: ['folate', 'folic acid', 'b9'],
      vitaminB6: ['vitamin b6', 'b6', 'pyridoxine'],
      vitaminC: ['vitamin c', 'vit c', 'ascorbic acid'],
      vitaminE: ['vitamin e', 'vit e', 'tocopherol'],
      vitaminK2: ['vitamin k2', 'k2', 'menaquinone'],
      calcium: ['calcium', 'ca'],
      magnesium: ['magnesium', 'mg'],
      phosphite: ['phosphate', 'phosphorus'],
      zinc: ['zinc', 'zn'],
      sodium: ['sodium', 'na'],
      potassium: ['potassium', 'k'],
      chloride: ['chloride', 'cl'],
      bilirubinTotal: ['total bilirubin', 'bilirubin total', 't\\.?\\s*bilirubin'],
      bilirubinDirect: ['direct bilirubin', 'd\\.?\\s*bilirubin'],
      totalProtein: ['total protein', 'serum protein'],
      albumin: ['albumin'],
      globulin: ['globulin'],
      ast: ['ast', 'sgot', 'aspartate'],
      alt: ['alt', 'sgpt', 'alanine'],
      alp: ['alp', 'alkaline phosphatase'],
      ggt: ['ggt', 'gamma gt'],
      wbcCount: ['wbc', 'white blood', 'leucocyte', 'tlc'],
      rbcCount: ['rbc', 'red blood', 'erythrocyte'],
      plateletCount: ['platelet', 'plt'],
      hematocrit: ['hematocrit', 'hct', 'pcv'],
      mcv: ['mcv', 'mean corpuscular volume'],
      mch: ['mch', 'mean corpuscular hemo'],
      mchc: ['mchc'],
      neutrophils: ['neutrophil', 'neut'],
      lymphocytes: ['lymphocyte', 'lymph'],
      monocytes: ['monocyte', 'mono'],
      eosinophils: ['eosinophil', 'eos'],
      basophils: ['basophil', 'baso'],
      rdwCv: ['rdw', 'rdw-cv'],
      mpv: ['mpv', 'mean platelet'],
      hsCrp: ['hs-crp', 'hscrp', 'high sensitivity crp'],
      restingLactate: ['lactate', 'resting lactate'],
    };
    return variations[field] || [field.replace(/([A-Z])/g, ' $1').toLowerCase()];
  }

  // Main extraction function
  async extractFromFile(
    file: File,
    onProgress?: (progress: ExtractionProgress) => void
  ): Promise<ExtractionResult> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('File extraction is only available in the browser');
    }

    let text = '';
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    try {
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        text = await this.extractTextFromPDF(file, onProgress);
      } else if (
        fileType.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|bmp|webp)$/.test(fileName)
      ) {
        text = await this.extractTextFromImage(file, onProgress);
      } else {
        throw new Error(
          'Unsupported file type. Please upload a PDF or image file (JPG, PNG, etc.)'
        );
      }

      return this.parseBloodReportText(text);
    } catch (error) {
      console.error('Extraction error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const bloodReportExtractor = new BloodReportExtractor();

export default BloodReportExtractor;
