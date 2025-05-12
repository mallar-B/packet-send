"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const InteractionCard = () => {
  //TODO: add file preview support
  // const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (file: File) => {
    const chunkSize: number = 64 * 1024; // 64 KB
    const chunks: Uint8Array[] = [];
    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const buffer = await chunk.arrayBuffer();
      chunks.push(new Uint8Array(buffer));
      offset += chunkSize;

      const percentage = (offset / file.size) * 100;
      setUploadProgress(percentage > 100 ? 100 : percentage);
    }
    setUploadComplete(true);
  };

  return (
    <Tabs defaultValue="upload">
      <TabsList>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="download">Download</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card className="p-4 space-y-4">
          <Label htmlFor="file">Choose file</Label>
          <Input id="file" type="file" onChange={(e) => handleFileChange(e)} />

          {/*TODO: Add drag & drop component */}

          <Progress value={uploadProgress} className="w-full" />

          <Button
            disabled={!uploadComplete}
            onClick={() => {
              console.log(uploadProgress);
            }}
          >
            Create Link
          </Button>

          {uploadComplete && (
            <Card className="p-2 mt-2">
              <p>File: my_file.pdf</p>
              <p>Size: 2.1 MB</p>
              <Badge variant="outline">Link created</Badge>
            </Card>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="download">
        <Card className="p-4 space-y-4">
          <Label htmlFor="link">Enter link</Label>
          <Input id="link" placeholder="https://..." onChange={(e) => setDownloadLink(e.target.value)}/>

          <Button disabled={!downloadLink}>Download</Button>

        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default InteractionCard;
