"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileReferences } from "@/types/types";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeReferences = ({
  fileReferences,
}: {
  fileReferences: FileReferences;
}) => {
  const [tab, setTab] = useState(fileReferences[0]?.filename);
  return (
    <div className="max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-x-auto rounded bg-muted">
          {fileReferences.map((file) => (
            <Button
              key={file.filename}
              onClick={() => setTab(file.filename)}
              variant={tab === file.filename ? "default" : "outline"}
            >
              {file.filename}
            </Button>
          ))}
        </div>

        {fileReferences.map((file) => (
          <TabsContent key={file.filename} value={file.filename}>
            <SyntaxHighlighter
              language="typescript"
              style={atomDark}
              className="h-full w-full overflow-y-auto"
            >
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default CodeReferences;
