import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Download, 
  History, 
  Trash2,
  Tag,
  Check,
  RefreshCw
} from 'lucide-react';
import { csvService } from '../services/csvService';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatINR, formatDate } from '../utils/currency';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 'Housing', 
  'Entertainment', 'Health', 'Education', 'Investment', 'Others', 'Income'
];

export const CsvUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await csvService.getHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch upload history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.csv')) {
      setFile(droppedFile);
      processUpload(droppedFile);
    } else {
      error('Please drop a valid .csv file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processUpload(selectedFile);
    }
  };

  const processUpload = async (fileToUpload) => {
    setUploading(true);
    setPreviewData(null);
    setImportResult(null);
    try {
      const res = await csvService.uploadCsv(fileToUpload);
      if (res.success && res.data) {
        setPreviewData(res.data);
        success(`Parsed ${res.data.valid_rows} valid rows from ${res.data.filename}!`);
      }
    } catch (err) {
      error(err.message || 'Failed to process statement CSV');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (index, newCategory) => {
    if (!previewData) return;
    const updatedRows = [...previewData.all_valid_data];
    updatedRows[index].category = newCategory;
    setPreviewData({
      ...previewData,
      all_valid_data: updatedRows,
      preview_data: updatedRows.slice(0, 100)
    });
  };

  const handleFinalImport = async () => {
    if (!previewData || !previewData.all_valid_data) return;

    setImporting(true);
    try {
      const payload = {
        filename: previewData.filename,
        bank_name: previewData.bank_name,
        transactions: previewData.all_valid_data
      };
      const res = await csvService.importTransactions(payload);
      if (res.success && res.data) {
        setImportResult(res.data);
        success(`Successfully imported ${res.data.successful_rows} transactions!`);
        fetchHistory();
      }
    } catch (err) {
      error(err.message || 'Failed to import transactions');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = (type = 'hdfc') => {
    let content = '';
    let filename = '';
    if (type === 'hdfc') {
      filename = 'hdfc_bank_sample_statement.csv';
      content = `Date,Narration,Debit Amount,Credit Amount,Closing Balance
01/08/2026,Monthly Salary Credit Infosys,,85000.00,124500.00
02/08/2026,Swiggy Bangalore Urban,480.00,,124020.00
03/08/2026,Uber India Trip Koramangala,320.00,,123700.00
04/08/2026,Amazon Retail Online Order,3450.00,,120250.00
05/08/2026,Bescom Electricity Bill Payment,1850.00,,118400.00
06/08/2026,Zomato Food Delivery Indiranagar,620.00,,117780.00
08/08/2026,Apollo Pharmacy Health Meds,890.00,,116890.00
10/08/2026,Netflix Subscription Monthly,649.00,,116241.00
15/08/2026,Freelance UI UX Design Milestone,,18000.00,133001.00
18/08/2026,Zara Clothing Store Orion Mall,4200.00,,127622.00
20/08/2026,HPCL Auto Fuel Petrol,2000.00,,125622.00
26/08/2026,Zerodha Mutual Fund SIP,15000.00,,107092.00`;
    } else {
      filename = 'sbi_bank_sample_statement.csv';
      content = `Txn Date,Description,Dr Amount,Cr Amount,Balance
01-08-2026,Salary Credit Tech Mahindra,,72000.00,98500.00
03-08-2026,Rent Payment to Landlord,20000.00,,78500.00
05-08-2026,Flipkart Internet Pvt Ltd,2890.00,,75610.00
07-08-2026,Swiggy Food Order,550.00,,75060.00
09-08-2026,BPCL Petrol Pump,1800.00,,73260.00
11-08-2026,Spotify India Monthly,179.00,,73081.00
14-08-2026,Tata Power Electricity,1450.00,,71631.00
19-08-2026,Ola Cabs Ride,340.00,,70511.00
21-08-2026,Groww Mutual Fund SIP,10000.00,,60511.00
25-08-2026,Dividend Credit TCS,,1400.00,60991.00`;
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    window.URL.revokeObjectURL(url);
    info(`Downloaded ${filename}. You can upload it now!`);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Bank Statement Ingestion Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload statement CSVs from any bank. Transactions will be parsed, verified, and auto-categorized automatically.
          </p>
        </div>

        {/* Sample CSV Download Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => downloadSampleCsv('hdfc')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HDFC Sample CSV</span>
          </button>
          <button
            onClick={() => downloadSampleCsv('sbi')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SBI Sample CSV</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Box */}
      {!previewData && !importResult && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`glass-panel p-10 rounded-3xl border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-500/10 shadow-glow' 
              : 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-glow">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {uploading ? 'Processing CSV with Pandas Engine...' : 'Drag & drop bank statement CSV here'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Supports standard columns: <code className="text-indigo-400">Date</code>, <code className="text-indigo-400">Description / Narration</code>, <code className="text-indigo-400">Debit / Withdrawal</code>, <code className="text-indigo-400">Credit / Deposit</code>, and <code className="text-indigo-400">Balance</code>.
          </p>

          <button
            type="button"
            disabled={uploading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all pointer-events-none"
          >
            {uploading ? 'Parsing Statement...' : 'Browse Files on Computer'}
          </button>
        </div>
      )}

      {/* Uploading State */}
      {uploading && (
        <LoadingSpinner label="Validating CSV headers, rows, and running automatic categorization engine..." />
      )}

      {/* Step 2: Preview & Validation Table */}
      {previewData && !importResult && (
        <div className="space-y-6">
          
          {/* Summary Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Bank Detected</span>
              <span className="text-base font-bold text-indigo-400">{previewData.bank_name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Transactions Found</span>
              <span className="text-base font-bold text-slate-100">{previewData.total_rows}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-emerald-400 block font-medium">Valid Ready to Import</span>
              <span className="text-base font-bold text-emerald-300">{previewData.valid_rows}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs text-amber-400 block font-medium">Duplicates / Skipped</span>
              <span className="text-base font-bold text-amber-300">{previewData.duplicate_rows}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
            <div className="flex items-center space-x-2 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Review auto-assigned categories below. You can change any category before confirming the import.</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => { setPreviewData(null); setFile(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalImport}
                disabled={importing}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-glow-success transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{importing ? 'Importing Transactions...' : `Commit & Import ${previewData.valid_rows} Rows`}</span>
              </button>
            </div>
          </div>

          {/* Preview Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Parsed Statement Preview (First {previewData.preview_data?.length} rows)
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-900/40">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description / Narration</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Auto Category (Editable)</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {previewData.preview_data?.map((row, idx) => {
                    const isIncome = row.type === 'income';
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {row.description}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isIncome ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={row.category}
                            onChange={(e) => handleCategoryChange(idx, e.target.value)}
                            className="glass-input px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 focus:border-indigo-500"
                          >
                            {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                              <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}>
                          {isIncome ? '+' : '-'}{formatINR(row.amount)}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {row.is_duplicate ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Duplicate
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Step 3: Success Confirmation Card */}
      {importResult && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 shadow-glow-success text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-100">Bank Statement Ingestion Complete!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your transactions have been saved to your database and your dashboard analytics, health score, and AI recommendations have been recalculated in real time.
          </p>

          {/* Metric Pill Counters */}
          <div className="inline-grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left">
            <div>
              <span className="text-xs text-slate-400 block">Imported</span>
              <span className="text-lg font-bold text-emerald-400">{importResult.successful_rows} rows</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Duplicates</span>
              <span className="text-lg font-bold text-amber-400">{importResult.duplicate_rows} rows</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Total</span>
              <span className="text-lg font-bold text-slate-200">{importResult.total_rows} rows</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center space-x-3">
            <button
              onClick={() => { setImportResult(null); setPreviewData(null); setFile(null); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Upload Another Statement
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
            >
              <span>View Updated Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload History Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Statement Ingestion History</h3>
          </div>
          <button
            onClick={fetchHistory}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
            title="Refresh History"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingHistory ? (
          <div className="text-center py-6 text-xs text-slate-500">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">No bank statements uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Bank</th>
                  <th className="py-2.5 px-3">Total Rows</th>
                  <th className="py-2.5 px-3">Imported</th>
                  <th className="py-2.5 px-3">Duplicates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((stmt) => (
                  <tr key={stmt.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(stmt.upload_date)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{stmt.original_filename}</td>
                    <td className="py-2.5 px-3 text-indigo-400">{stmt.bank_name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{stmt.total_rows}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{stmt.successful_rows}</td>
                    <td className="py-2.5 px-3 text-amber-400">{stmt.duplicate_rows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
