
import React, { useState } from "react";
import { Table, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TableInsertDialogProps {
  onInsertTable: (rows: number, cols: number, hasHeader: boolean) => void;
}

const TableInsertDialog: React.FC<TableInsertDialogProps> = ({ onInsertTable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  const handleInsert = () => {
    onInsertTable(rows, cols, hasHeader);
    setIsOpen(false);
  };

  // Quick insert grid (3x3 preview)
  const renderQuickGrid = () => {
    const cells = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        cells.push(
          <div
            key={`${r}-${c}`}
            className="w-6 h-6 border border-white/20 hover:bg-blue-500/30 cursor-pointer transition-colors"
            onClick={() => {
              setRows(r + 1);
              setCols(c + 1);
              onInsertTable(r + 1, c + 1, true);
              setIsOpen(false);
            }}
            title={`${r + 1} x ${c + 1} table`}
          />
        );
      }
    }
    return (
      <div className="grid grid-cols-5 gap-1 w-fit">
        {cells}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a2e] border border-white/10 text-white max-w-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Insert Table</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-300 mb-2">Quick Insert:</p>
              {renderQuickGrid()}
              <p className="text-xs text-slate-400 mt-1">Click to insert table</p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm text-slate-300 mb-3">Custom Size:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Rows</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Columns</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Include header row</span>
              </label>
              
              <Button
                onClick={handleInsert}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Insert Table
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableInsertDialog;
