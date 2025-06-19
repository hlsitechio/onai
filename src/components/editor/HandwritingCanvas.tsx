
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eraser, Pen, Undo, Redo, Trash2 } from 'lucide-react';

interface HandwritingCanvasProps {
  onTextExtracted?: (text: string) => void;
  className?: string;
  width?: number;
  height?: number;
}

interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  onTextExtracted,
  className,
  width = 800,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#ffffff');
  const [penWidth, setPenWidth] = useState(3);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const getEventPos = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    // Only start drawing with pen or primary pointer (to avoid palm rejection issues)
    if (event.pointerType === 'touch' && !event.isPrimary) return;
    if (event.pointerType === 'mouse' && event.buttons !== 1) return;
    
    console.log('Starting drawing with:', {
      pointerType: event.pointerType,
      pressure: event.pressure,
      isPrimary: event.isPrimary
    });
    
    setIsDrawing(true);
    const pos = getEventPos(event);
    const pressure = event.pressure || 0.5;
    
    setCurrentStroke([{
      x: pos.x,
      y: pos.y,
      pressure,
      timestamp: Date.now()
    }]);

    // Prevent scrolling while drawing
    event.preventDefault();
  }, [getEventPos]);

  const draw = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getEventPos(event);
    const pressure = event.pressure || 0.5;
    const newPoint = {
      x: pos.x,
      y: pos.y,
      pressure,
      timestamp: Date.now()
    };
    
    setCurrentStroke(prev => [...prev, newPoint]);
    
    const ctx = getContext();
    if (!ctx || currentStroke.length === 0) return;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      // Enhanced pressure sensitivity for Samsung S Pen
      const pressureMultiplier = event.pointerType === 'pen' ? pressure * 3 : 1;
      ctx.lineWidth = Math.max(1, penWidth * pressureMultiplier);
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = penWidth * 4;
    }
    
    ctx.beginPath();
    const lastPoint = currentStroke[currentStroke.length - 1];
    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    event.preventDefault();
  }, [isDrawing, getEventPos, getContext, currentStroke, tool, penColor, penWidth]);

  const stopDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentStroke.length === 0) return;
    
    console.log('Stopping drawing');
    setIsDrawing(false);
    
    const newStroke: Stroke = {
      points: currentStroke,
      color: penColor,
      width: penWidth
    };
    
    const newStrokes = [...strokes, newStroke];
    setStrokes(newStrokes);
    setCurrentStroke([]);
    
    // Save to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStrokes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    event.preventDefault();
  }, [isDrawing, currentStroke, strokes, penColor, penWidth, history, historyIndex]);

  const redrawCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    
    // Set dark background for better visibility
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      stroke.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      
      ctx.stroke();
    });
  }, [getContext, strokes, width, height]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setStrokes(history[newIndex] || []);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setStrokes(history[newIndex]);
    }
  }, [history, historyIndex]);

  const clear = useCallback(() => {
    setStrokes([]);
    setCurrentStroke([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    redrawCanvas();
  }, [history, redrawCanvas]);

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2">
          <Button
            variant={tool === 'pen' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('pen')}
            className="text-white"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="text-white"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-white/20 mx-2" />
          
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
            title="Pen color"
          />
          
          <input
            type="range"
            min="1"
            max="8"
            value={penWidth}
            onChange={(e) => setPenWidth(Number(e.target.value))}
            className="w-20"
            title="Pen width"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="text-white"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="text-white"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-white/20 rounded-lg overflow-hidden bg-gray-900">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block touch-none cursor-crosshair"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ 
            width: '100%', 
            height: 'auto',
            maxHeight: '400px'
          }}
        />
        
        {strokes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-center">
              Draw with your S Pen or stylus<br />
              <span className="text-sm">Supports pressure sensitivity and palm rejection</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandwritingCanvas;
