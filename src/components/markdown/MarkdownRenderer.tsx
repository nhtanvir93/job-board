import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export const markdownClassNames =
  "max-w-none prose prose-neutral dark:prose-invert font-sans";

const MarkdownRenderer = ({
  className,
  options,
  ...props
}: MDXRemoteProps & { className?: string }) => {
  return (
    <div className={cn(markdownClassNames, className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
          },
        }}
      ></MDXRemote>
    </div>
  );
};

export default MarkdownRenderer;
