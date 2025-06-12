"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Download, Upload } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { useFileContext } from "@/context/SelectedFileContext";
import { Progress } from "./ui/progress";

const FileUploadCard = ({
  progress,
  className,
  isDisabled,
}: {
  progress: number;
  className?: string;
  isDisabled?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { file, setFile } = useFileContext();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log("Selected files:", files);
    setFile(files ? files[0] : null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("Selected files:", files);
    setFile(files ? files[0] : null);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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

  return !file ? (
    <div
      className={cn(
        `pt-6 group ${isDisabled ? "cursor-not-allowed pointer-events-none" : ""}`,
        className,
      )}
    >
      <Card
        className={`w-full border-dashed border-2 border-muted-foreground p-6 bg-card ${isDisabled ? "cursor-not-allowed pointer-events-none" : ""}`}
      >
        <CardContent
          className={cn(
            `flex flex-col items-center justify-center gap-4 text-center cursor-pointer`,
            `${isDisabled ? "cursor-not-allowed pointer-events-none" : ""}`,
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-10 h-10" />
          <p className="text-sm md:text-base text-muted-foreground">
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
    <div className={cn("pt-6", className)}>
      <Card className="w-full border-double border-4 rounded-xl border-muted-foreground p-4 sm:p-6 bg-card">
        {file && (
          <div className="flex w-full border-b border-muted-foreground px-2 sm:px-4 pb-2">
            <span className="font-semibold sm:font-bold text-lg sm:text-2xl text-sidebar-foreground">
              {progress === 0
                ? "In Queue"
                : progress < 100
                  ? "Sending..."
                  : "Sent"}
            </span>
          </div>
        )}
        <CardContent className="flex flex-col items-start sm:items-center justify-center gap-4 text-left sm:text-center md:text-left">
          <p className="text-sm sm:text-base text-foreground break-all w-full">
            <span className="font-bold text-base sm:text-lg">File:</span>{" "}
            {file.name.length > 70
              ? `${file.name.slice(0, file.name.length - 20)} … ${file.name.slice(-10)}`
              : file.name}
          </p>
          <p className="text-sm sm:text-base text-foreground md:self-start">
            <span className="font-bold text-base sm:text-lg">Size:</span>{" "}
            {byteToGB(file.size)}
          </p>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {progress !== 0 && (
            <div className="mt-3 flex flex-col sm:flex-row w-full items-center gap-3">
              <Progress value={progress} className="w-full" />
              <span className="text-lg sm:text-xl font-bold">{progress}%</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          className={cn(
            "w-full sm:w-max flex items-center justify-center gap-2",
            "cursor-pointer rounded-lg",
            progress !== 0 && progress < 100
              ? "cursor-not-allowed bg-muted-foreground hover:bg-muted-foreground pointer-events-none"
              : "",
          )}
          onClick={handleClick}
        >
          <Upload className="w-5 h-5" />
          <span className="text-base font-semibold text-accent">
            Upload a Different File
          </span>
        </Button>

        <Button
          className={cn(
            "w-full sm:w-max flex items-center justify-center gap-2",
            "cursor-pointer rounded-lg",
            progress !== 0 && progress < 100
              ? "cursor-not-allowed bg-muted-foreground hover:bg-muted-foreground pointer-events-none"
              : "",
          )}
          onClick={() => window.location.reload()}
        >
          <Download className="w-5 h-5" />
          <span className="text-base font-semibold text-accent">
            Receive a File
          </span>
        </Button>
      </div>
    </div>
  );
};
export default FileUploadCard;
