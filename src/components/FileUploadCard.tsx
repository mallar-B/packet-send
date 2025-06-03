"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { useFileContext } from "@/context/SelectedFileContext";
import { Progress } from "./ui/progress";

const FileUploadCard = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
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
    <div className={cn("p-6", className)}>
      <Card className="w-full border-dashed border-2 border-muted-foreground p-6 bg-card">
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
      <Card className="w-full border-double border-4 rounded-xl border-muted-foreground p-6 bg-card">
        {/* Sending state*/}
        {file ? (
          <div className="flex w-full border-b-1 border-muted-foreground px-4 pb-2">
            <span className="font-bold text-2xl text-sidebar-foreground">
              {progress === 0
                ? "In Queue"
                : progress < 100
                  ? "Sending..."
                  : "Sent"}
            </span>
          </div>
        ) : null}
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-foreground self-start">
            <span className="font-bold text-lg rounded-s-2xl">File:</span>{" "}
            {/* slice middle if name is too long */}
            {file.name.length > 70
              ? `${file.name.slice(0, file.name.length - 20)} … ${file.name.slice(-10)}`
              : file.name}{" "}
          </p>
          <p className="text-sm text-foreground self-start">
            <span className="font-bold text-lg rounded-s-2xl">Size:</span>{" "}
            {byteToGB(file.size)}
          </p>
          {/* this input is so that reupload works, thats why its hidden */}
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="w-full h-full hidden cursor-pointer"
          />
          {/* Only for sender*/}
          {progress !== 0 ? (
            <div className="mt-3 flex self-start w-full items-center gap-3">
              <Progress value={progress} className="w-full" />
              <span className="text-xl font-black">{progress}%</span>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Button
        className={`w-max mt-4 cursor-pointer rounded-lg start-0 flex ${progress !== 0 && progress < 100 ? "cursor-not-allowed" : ""}`}
        onClick={handleClick}
        disabled={progress !== 0 && progress < 100}
      >
        <Upload className="mr-1 font-bold" />
        <span className="font-bold text-accent text-lg my-4">
          Upload a Different File
        </span>
      </Button>
    </div>
  );
};
export default FileUploadCard;
