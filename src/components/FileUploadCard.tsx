"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "./ui/button";

const FileUploadCard = ({ className }: { className?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log("Selected files:", files);
    setSelectedFile(files[0]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Selected files:", files);
    setSelectedFile(files ? files[0] : null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const byteToGB = (bytes: number) => {
    if (bytes < 1024) {
      return bytes.toFixed(2).toString() + "B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2).toString() + "KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2).toString() + "MB";
    } else return (bytes / (1024 * 1024 * 1024)).toFixed(2).toString() + "GB";
  };

  return !selectedFile ? (
    <div className={cn("p-6", className)}>
      <Card className="w-full border-dashed border-2 border-muted-foreground p-6 bg-background">
        <CardContent
          className="flex flex-col items-center justify-center gap-4 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-10 h-10" />
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
  ) : (
    <div className={cn("p-6", className)}>
      <Card className="w-full border-double border-4 rounded-2xl border-muted-foreground p-6 bg-background">
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-foreground self-start">
            <span className="font-bold text-lg rounded-s-2xl">File:</span>{" "}
            {/* slice middle if name is too long */}
            {selectedFile.name.length > 70
              ? `${selectedFile.name.slice(0, selectedFile.name.length - 20)} … ${selectedFile.name.slice(-10)}`
              : selectedFile.name}{" "}
          </p>
          <p className="text-sm text-foreground self-start">
            <span className="font-bold text-lg rounded-s-2xl">Size:</span>{" "}
            {byteToGB(selectedFile.size)}
          </p>
          {/* this input is so that reupload works, thats why its hidden */}
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="w-full h-full hidden cursor-pointer"
          />
        </CardContent>
      </Card>
      <Button
        className="w-max mt-4 cursor-pointer rounded-2xl start-0 flex"
        onClick={handleClick}
      >
        <Upload className="mr-1 font-bold" />
        <span className="font-bold text-accent text-lg my-4">
          Re-Upload a Different File
        </span>
      </Button>
    </div>
  );
};
export default FileUploadCard;
