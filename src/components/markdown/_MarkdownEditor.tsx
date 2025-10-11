"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertTable,
  InsertThematicBreak,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import type { ForwardedRef } from "react";

import useIsDarkMode from "@/hooks/useIsDarkMode";
import { cn } from "@/lib/utils";

import { markdownClassNames } from "./MarkdownRenderer";

export default function InitializedMDXEditor({
  editorRef,
  className,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertThematicBreak />
              <InsertTable />
            </>
          ),
        }),
      ]}
      suppressHtmlProcessing
      {...props}
      ref={editorRef}
      className={cn(markdownClassNames, isDarkMode && "dark-theme", className)}
    />
  );
}
