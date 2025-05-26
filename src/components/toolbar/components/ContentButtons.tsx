
import React from "react";
import { List, ListOrdered, Quote, Code, Link, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleInsertList, handleBlockquote, handleCode, handleInsertLink, handleInsertImage } from '../utils/formattingUtils';
import TableInsertDialog from "../TableInsertDialog";
import { handleInsertTable } from '../utils/fileUtils';

const ContentButtons: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInsertList(false)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInsertList(true)}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBlockquote}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCode}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleInsertLink}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Insert Link (Ctrl+K)"
      >
        <Link className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleInsertImage}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>

      <TableInsertDialog onInsertTable={handleInsertTable} />
    </div>
  );
};

export default ContentButtons;
