import React, { useState, useEffect } from 'react';
import { BoqItem, INITIAL_BOQ_ITEMS, BOQ_CATEGORIES } from '../../data/boqData';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  IndianRupee,
  Layers,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  X,
  FileText,
  AlertCircle,
  Share2
} from 'lucide-react';

interface MasterBoqStudioProps {
  activeProjectName: string;
  onPushToVendorPOs?: (items: BoqItem[]) => void;
  onSendToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
  autoOpenBoqModal?: boolean;
}

export const MasterBoqStudio: React.FC<MasterBoqStudioProps> = ({
  activeProjectName,
  onPushToVendorPOs,
  onSendToast,
  autoOpenBoqModal = false
}) => {
  const [items, setItems] = useState<BoqItem[]>(INITIAL_BOQ_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (autoOpenBoqModal) {
      setIsModalOpen(true);
    }
  }, [autoOpenBoqModal]);
  const [editingItem, setEditingItem] = useState<BoqItem | null>(null);

  // Client Quotation Print View Modal
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Form State
  const [formCategory, setFormCategory] = useState<string>('Modular Kitchen');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpec, setFormSpec] = useState('');
  const [formUnit, setFormUnit] = useState<BoqItem['unit']>('SqFt');
  const [formQty, setFormQty] = useState<number>(100);
  const [formMatRate, setFormMatRate] = useState<number>(1200);
  const [formLabRate, setFormLabRate] = useState<number>(300);
  const [formMargin, setFormMargin] = useState<number>(25);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Commercial Calculations
  const totalMaterialCost = filteredItems.reduce(
    (sum, it) => sum + it.materialUnitRate * it.quantity,
    0
  );
  const totalLaborCost = filteredItems.reduce(
    (sum, it) => sum + it.laborUnitRate * it.quantity,
    0
  );
  const totalDirectCost = totalMaterialCost + totalLaborCost;

  const totalClientPrice = filteredItems.reduce((sum, it) => {
    const baseUnitRate = it.materialUnitRate + it.laborUnitRate;
    const clientUnitRate = Math.round(baseUnitRate * (1 + it.markupMarginPercent / 100));
    return sum + clientUnitRate * it.quantity;
  }, 0);

  const grossProfitMargin = totalClientPrice - totalDirectCost;
  const grossProfitPercent =
    totalClientPrice > 0 ? ((grossProfitMargin / totalClientPrice) * 100).toFixed(1) : '0';
  const gstAmount = Math.round(totalClientPrice * 0.18);
  const grandTotalWithGst = totalClientPrice + gstAmount;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormCategory('Modular Kitchen');
    setFormCode(`BOQ-${Math.floor(100 + Math.random() * 900)}`);
    setFormDescription('');
    setFormSpec('');
    setFormUnit('SqFt');
    setFormQty(100);
    setFormMatRate(1200);
    setFormLabRate(300);
    setFormMargin(25);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BoqItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormCode(item.code);
    setFormDescription(item.description);
    setFormSpec(item.specification);
    setFormUnit(item.unit);
    setFormQty(item.quantity);
    setFormMatRate(item.materialUnitRate);
    setFormLabRate(item.laborUnitRate);
    setFormMargin(item.markupMarginPercent);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                category: formCategory,
                code: formCode,
                description: formDescription,
                specification: formSpec,
                unit: formUnit,
                quantity: Number(formQty),
                materialUnitRate: Number(formMatRate),
                laborUnitRate: Number(formLabRate),
                markupMarginPercent: Number(formMargin)
              }
            : it
        )
      );
      onSendToast?.('success', 'BOQ Item Updated', `Updated ${formCode}: ${formDescription}`);
    } else {
      const newItem: BoqItem = {
        id: `boq-${Date.now()}`,
        code: formCode || `BOQ-${Math.floor(100 + Math.random() * 900)}`,
        category: formCategory,
        description: formDescription,
        specification: formSpec,
        unit: formUnit,
        quantity: Number(formQty),
        materialUnitRate: Number(formMatRate),
        laborUnitRate: Number(formLabRate),
        markupMarginPercent: Number(formMargin),
        status: 'Draft'
      };
      setItems([newItem, ...items]);
      onSendToast?.('success', 'BOQ Item Added', `Added ${newItem.code}: ${newItem.description}`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    onSendToast?.('info', 'BOQ Line Removed', 'The line item has been removed from master estimate.');
  };

  const handleExportCsv = () => {
    const headers = [
      'Item Code',
      'Category',
      'Description',
      'Specification',
      'Unit',
      'Quantity',
      'Material Rate (₹)',
      'Labor Rate (₹)',
      'Base Rate (₹)',
      'Markup (%)',
      'Client Rate (₹)',
      'Total Net (₹)',
      'Status'
    ];

    const rows = filteredItems.map((it) => {
      const baseRate = it.materialUnitRate + it.laborUnitRate;
      const clientRate = Math.round(baseRate * (1 + it.markupMarginPercent / 100));
      const totalNet = clientRate * it.quantity;
      return [
        it.code,
        `"${it.category.replace(/"/g, '""')}"`,
        `"${it.description.replace(/"/g, '""')}"`,
        `"${it.specification.replace(/"/g, '""')}"`,
        it.unit,
        it.quantity,
        it.materialUnitRate,
        it.laborUnitRate,
        baseRate,
        `${it.markupMarginPercent}%`,
        clientRate,
        totalNet,
        it.status
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Foryn_Master_BOQ_${activeProjectName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onSendToast?.('success', 'BOQ Exported', 'Master BOQ exported as CSV spreadsheet.');
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
              Commercial Costing Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {activeProjectName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Master Bill of Quantities (BOQ)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Parametrically derived line items, rate breakdown, material specifications, and live contractor-to-client margin analysis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Formal Quotation</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--foryn-accent)] hover:brightness-110 text-slate-950 text-xs font-black transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add BOQ Item</span>
          </button>
        </div>
      </div>

      {/* Commercial Summary Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Direct Material
          </span>
          <div className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
            ₹{(totalMaterialCost / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-slate-400">Supplier Procurement</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Direct Labor
          </span>
          <div className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
            ₹{(totalLaborCost / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-slate-400">Carpentry & Site Masonry</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Total Cost Base
          </span>
          <div className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
            ₹{(totalDirectCost / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-slate-400">Contractor Baseline</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
            Gross Margin
          </span>
          <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
            {grossProfitPercent}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            +₹{(grossProfitMargin / 100000).toFixed(2)} Lakhs
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            GST 18% Output
          </span>
          <div className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
            ₹{(gstAmount / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] text-slate-400">Govt Compliance</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 text-white dark:bg-[var(--foryn-accent)] dark:text-slate-950 space-y-1 shadow-xs border border-transparent">
          <span className="text-[10px] font-mono uppercase opacity-80 font-bold block">
            Client Price (Net)
          </span>
          <div className="text-base font-black font-mono">
            ₹{(grandTotalWithGst / 100000).toFixed(2)}L
          </div>
          <span className="text-[10px] opacity-80">Inclusive of GST</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, joinery specs, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-semibold outline-hidden"
          >
            {BOQ_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-semibold outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Client Approved">Client Approved</option>
            <option value="Procurement Released">Procurement Released</option>
            <option value="Site Installed">Site Installed</option>
          </select>
        </div>
      </div>

      {/* Main BOQ Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-3 w-16">Code</th>
                <th className="py-3 px-3 w-28">Category</th>
                <th className="py-3 px-4 min-w-[240px]">Description & Technical Specifications</th>
                <th className="py-3 px-3 text-center w-16">Unit</th>
                <th className="py-3 px-3 text-right w-16">Qty</th>
                <th className="py-3 px-3 text-right w-24">Cost Rate</th>
                <th className="py-3 px-3 text-right w-20">Margin</th>
                <th className="py-3 px-3 text-right w-24">Client Rate</th>
                <th className="py-3 px-4 text-right w-28">Total Amount</th>
                <th className="py-3 px-3 text-center w-24">Status</th>
                <th className="py-3 px-3 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    No BOQ line items match the selected category or query.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const baseUnitRate = item.materialUnitRate + item.laborUnitRate;
                  const clientUnitRate = Math.round(
                    baseUnitRate * (1 + item.markupMarginPercent / 100)
                  );
                  const lineTotal = clientUnitRate * item.quantity;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.code}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">
                          {item.description}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                          {item.specification}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">{item.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        ₹{baseUnitRate.toLocaleString('en-IN')}
                        <div className="text-[9px] text-slate-400">
                          (₹{item.materialUnitRate} + ₹{item.laborUnitRate})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.markupMarginPercent}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                        ₹{clientUnitRate.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            item.status === 'Client Approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.status === 'Procurement Released'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : item.status === 'Site Installed'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Line Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete Line Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Overall Totals */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            Showing {filteredItems.length} of {items.length} parametric items in {activeProjectName}
          </div>
          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-slate-400 uppercase text-[10px] mr-2">Total Direct Cost:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                ₹{totalDirectCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] mr-2">Client Quotation (Net):</span>
              <span className="font-black text-slate-900 dark:text-white text-sm">
                ₹{totalClientPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                {editingItem ? 'Edit BOQ Line Item' : 'Add New BOQ Line Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    {BOQ_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Item Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18mm BWP Marine Base Carcass with Blum Soft Close"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                  Technical Specifications & Brands
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed material grade, laminate thickness, hardware runner spec..."
                  value={formSpec}
                  onChange={(e) => setFormSpec(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Unit
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as BoqItem['unit'])}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold"
                  >
                    <option value="SqFt">SqFt</option>
                    <option value="Rft">Rft</option>
                    <option value="Nos">Nos</option>
                    <option value="Sets">Sets</option>
                    <option value="Lumpsum">Lumpsum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                    Markup Margin %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formMargin}
                    onChange={(e) => setFormMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Material Unit Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formMatRate}
                    onChange={(e) => setFormMatRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                    Labor Unit Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formLabRate}
                    onChange={(e) => setFormLabRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono flex items-center justify-between text-xs">
                <span className="text-slate-500">Computed Client Price:</span>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹
                  {(
                    Math.round(
                      (Number(formMatRate) + Number(formLabRate)) *
                        (1 + Number(formMargin) / 100)
                    ) * Number(formQty)
                  ).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--foryn-accent)] hover:brightness-110 text-slate-950 font-black"
                >
                  {editingItem ? 'Save Changes' : 'Add to BOQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Formal Client Quotation Modal */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 animate-in fade-in duration-200">
            {/* Print Header */}
            <div className="flex items-start justify-between border-b pb-6 mb-6">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  PENTAGRAM ARCHITECTURE & LIVING PVT. LTD.
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Golf Course Road, DLF Phase 5, Gurugram, Haryana 122002 • GSTIN: 06AABCP1234F1Z9
                </p>
                <div className="mt-4 text-xs font-semibold space-y-0.5">
                  <p><span className="text-slate-400">Project: </span>{activeProjectName}</p>
                  <p><span className="text-slate-400">Estimate Reference: </span>PGL-EST-2026-V2</p>
                  <p><span className="text-slate-400">Date: </span>11 September 2026</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded">
                  OFFICIAL COMMERCIAL ESTIMATE
                </div>
                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="mt-4 text-xs text-slate-400 hover:text-slate-700 font-bold underline"
                >
                  Close Window
                </button>
              </div>
            </div>

            {/* Quote Line Items Summary */}
            <div className="space-y-4 flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2">#</th>
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Unit</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Rate (₹)</th>
                    <th className="py-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-800">
                  {filteredItems.map((it, idx) => {
                    const clientUnitRate = Math.round(
                      (it.materialUnitRate + it.laborUnitRate) * (1 + it.markupMarginPercent / 100)
                    );
                    return (
                      <tr key={it.id}>
                        <td className="py-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5">
                          <div className="font-bold">{it.description}</div>
                          <div className="text-[10px] text-slate-500">{it.specification}</div>
                        </td>
                        <td className="py-2.5 text-center font-mono">{it.unit}</td>
                        <td className="py-2.5 text-right font-mono">{it.quantity}</td>
                        <td className="py-2.5 text-right font-mono">₹{clientUnitRate.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 text-right font-mono font-bold">
                          ₹{(clientUnitRate * it.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals Calculation Box */}
              <div className="border-t pt-4 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{totalClientPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (18% Output):</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 border-t pt-1.5">
                    <span>Grand Total:</span>
                    <span>₹{grandTotalWithGst.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="border-t pt-4 text-[11px] text-slate-500 space-y-1">
                <div className="font-bold text-slate-700">Commercial Payment Milestones:</div>
                <p>1. Design & Factory Advance: 50% upon signing this estimate</p>
                <p>2. Factory Carcass Dry-Fit & Material Dispatch: 35%</p>
                <p>3. Final Handover & Snag Clearance: 15%</p>
              </div>

              {/* Signatures */}
              <div className="border-t pt-6 mt-6 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="h-12 border-b border-slate-300" />
                  <p className="mt-1 font-bold text-slate-700">Authorized Signatory (Foryn / Pentagram)</p>
                </div>
                <div>
                  <div className="h-12 border-b border-slate-300" />
                  <p className="mt-1 font-bold text-slate-700">Client Acceptance Signature</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Quotation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
