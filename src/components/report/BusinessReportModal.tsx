import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { WorldDefinition } from '../../types/world';
import { sqlEngine } from '../../modules/sql-engine/worker-client';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  FileText,
  TrendingUp,
  Package,
  AlertTriangle,
  Printer,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';

interface BusinessReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  world: WorldDefinition;
}

export const BusinessReportModal: React.FC<BusinessReportModalProps> = ({
  isOpen,
  onClose,
  world,
}) => {
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReportMetrics();
    }
  }, [isOpen, world]);

  const loadReportMetrics = async () => {
    setIsLoading(true);
    const data: Record<string, any> = {};

    try {
      for (const metric of world.reportConfig.metrics) {
        const res = await sqlEngine.execute(metric.query);
        if (res.success && res.results && res.results[0]) {
          data[metric.id] = {
            columns: res.results[0].columns,
            values: res.results[0].values,
          };
        }
      }
    } catch (e) {
      console.warn('Failed executing report metric queries:', e);
    } finally {
      setReportData(data);
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={world.reportConfig.title}
      subtitle={world.reportConfig.subtitle}
      maxWidth="4xl"
    >
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Compiling live SQL analytical metrics from {world.dbFileName}...</p>
        </div>
      ) : (
        <div className="space-y-6 text-xs text-slate-200">
          {/* Executive Summary Memo */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 mb-1.5 font-bold text-emerald-400 text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Executive Briefing Memo</span>
            </div>
            <p>{world.reportConfig.executiveSummaryTemplate}</p>
          </div>

          {/* Key Stat Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric: Total Revenue */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-sm">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  Total Gross Revenue
                </span>
                <span className="text-xl font-bold font-mono text-emerald-300">
                  {reportData['total_revenue']?.values?.[0]?.[0] || '₹0'}
                </span>
              </div>
            </div>

            {/* Metric: Total Inventory Units */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-sm">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  Stock Units on Hand
                </span>
                <span className="text-xl font-bold font-mono text-sky-300">
                  {reportData['total_inventory']?.values?.[0]?.[0] || '0'} units
                </span>
              </div>
            </div>

            {/* Metric: Low Stock Alerts */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-sm">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  Active Reorder Alerts
                </span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  {reportData['low_stock_count']?.values?.[0]?.[0] || '0'} lines
                </span>
              </div>
            </div>
          </div>

          {/* Revenue by Category Lightweight Chart */}
          {reportData['revenue_by_category']?.values && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span>Revenue by Department / Category</span>
                </div>
                <Badge variant="emerald" size="sm">
                  Live Aggregation
                </Badge>
              </div>

              {/* Lightweight SVG Bar Chart */}
              <div className="space-y-2 pt-2">
                {(() => {
                  const items = reportData['revenue_by_category'].values as [string, number][];
                  const maxVal = Math.max(...items.map((i) => Number(i[1]) || 1));

                  return items.map(([category, revenue], idx) => {
                    const revNum = Number(revenue) || 0;
                    const pct = Math.max(8, Math.round((revNum / maxVal) * 100));

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300">{category}</span>
                          <span className="text-emerald-400 font-bold">
                            ₹{revNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Best Selling Products Table */}
          {reportData['best_sellers']?.values && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Top Best-Selling Products (Velocity Ranking)</span>
              </h4>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">Rank</th>
                      <th className="px-3 py-2">Product Name</th>
                      <th className="px-3 py-2 text-right">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reportData['best_sellers'].values.map((row: any[], i: number) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-slate-500">#{i + 1}</td>
                        <td className="px-3 py-2 text-slate-200">{row[0]}</td>
                        <td className="px-3 py-2 text-right text-emerald-400 font-bold">
                          {row[1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Immediate Reorder Alert Table */}
          {reportData['low_stock_items']?.values && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Immediate Reorder Procurement List</span>
              </h4>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">Product Name</th>
                      <th className="px-3 py-2">Stock On Hand</th>
                      <th className="px-3 py-2">Reorder Level</th>
                      <th className="px-3 py-2">Shelf / Bin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reportData['low_stock_items'].values.map((row: any[], i: number) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-slate-200">{row[0]}</td>
                        <td className="px-3 py-2 text-amber-400 font-bold">{row[1]}</td>
                        <td className="px-3 py-2 text-slate-400">{row[2]}</td>
                        <td className="px-3 py-2 text-sky-400">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Print Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save PDF
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
