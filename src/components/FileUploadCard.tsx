"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useRef } from "react";

const FileUploadCard = ({ className }: { className?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Selected files:", files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("p-6 ", className)}>
      <Card className="w-full border-dashed border-2 border-muted-foreground p-6 bg-background">
        <CardContent
          className="flex flex-col items-center justify-center gap-4 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-10 h-10 " />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to upload
          </p>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="w-full h-full invisible cursor-pointer"
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default FileUploadCard;
