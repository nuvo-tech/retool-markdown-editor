import React, { useState, useEffect, useRef, useMemo } from "react";
import { type FC } from "react";
import { Retool } from "@tryretool/custom-component-support";
import MDEditor, { getCommands, getExtraCommands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

const underline = {
  name: "Underline",
  keyCommand: "underline",
  shortcuts: "ctrlcmd+u",
  buttonProps: { "aria-label": "Underline" },
  icon: (
    <svg width="12" height="12" viewBox="4 2 16 20">
      <path
        d="M18,18.5 C18.8284,18.5 19.5,19.1716 19.5,20 C19.5,20.7796706 18.9050879,21.4204457 18.1444558,21.4931332 L18,21.5 L6,21.5 C5.17157,21.5 4.5,20.8284 4.5,20 C4.5,19.2203294 5.09488554,18.5795543 5.85553954,18.5068668 L6,18.5 L18,18.5 Z M17,2.5 C17.7796706,2.5 18.4204457,3.09488554 18.4931332,3.85553954 L18.5,4 L18.5,11 C18.5,14.5899 15.5899,17.5 12,17.5 C8.48819022,17.5 5.62684948,14.7150508 5.50410301,11.2331372 L5.5,11 L5.5,4 C5.5,3.17157 6.17157,2.5 7,2.5 C7.77969882,2.5 8.420449,3.09488554 8.49313345,3.85553954 L8.5,4 L8.5,11 C8.5,12.933 10.067,14.5 12,14.5 C13.8685667,14.5 15.3951267,13.0357256 15.4948211,11.1920355 L15.5,11 L15.5,4 C15.5,3.17157 16.1716,2.5 17,2.5 Z"
        fill="currentColor"
      />
    </svg>
  ),
  execute: (state: any, api: any) => {
    const modifyText = state.selectedText ? `_${state.selectedText}_` : `_`;
    api.replaceSelection(modifyText);
  },
};

const createFullscreenCommand = (toggleFullscreen: () => Promise<void>) => ({
  name: "fullscreen",
  keyCommand: "fullscreen",
  buttonProps: {
    "aria-label": "Toggle fullscreen (ctrl + 0)",
    title: "Toggle fullscreen (ctrl+ 0)",
  },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M118 171.133334L118 342.200271C118 353.766938 126.675 365.333605 141.133333 365.333605L382.634614 365.333605C394.201281 365.333605 405.767948 356.658605 405.767948 342.200271L405.767948 171.133334C405.767948 159.566667 397.092948 148 382.634614 148L141.133333 148C126.674999 148 117.999999 156.675 118 171.133334zM465.353591 413.444444L370 413.444444 370 471.222222 474.0221 471.222222C500.027624 471.222222 520.254143 451 520.254143 425L520.254143 321 462.464089 321 462.464089 413.444444 465.353591 413.444444zM471.0221 43L367 43 367 100.777778 462.353591 100.777778 462.353591 196.111111 520.143647 196.111111 520.143647 89.2222219C517.254144 63.2222219 497.027624 43 471.0221 43zM57.7900547 100.777778L153.143646 100.777778 153.143646 43 46.2320439 43C20.2265191 43 0 63.2222219 0 89.2222219L0 193.222222 57.7900547 193.222222 57.7900547 100.777778zM57.7900547 321L0 321 0 425C0 451 20.2265191 471.222222 46.2320439 471.222223L150.254143 471.222223 150.254143 413.444445 57.7900547 413.444445 57.7900547 321z"
      />
    </svg>
  ),
  execute: async (state: any, api: any) => {
    api.textArea.focus();
    await toggleFullscreen();
  },
});

export const MarkdownEditor: FC = () => {
  const [defaultValue] = Retool.useStateString({
    name: "defaultValue",
    label: "Default value",
  });
  const [value, setValue] = Retool.useStateString({
    name: "value",
    label: "Value",
    inspector: "hidden",
  });
  const [theme] = Retool.useStateString({
    name: "theme",
    label: "Theme",
    initialValue: "Light",
  });

  const [localValue, setLocalValue] = useState(value || defaultValue || "");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (defaultValue !== undefined) setLocalValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setValue(localValue), 300);
    return () => clearTimeout(timerRef.current);
  }, [localValue, setValue]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const commands = useMemo(() => {
    const cmds = getCommands();
    cmds.splice(2, 0, underline);
    return cmds;
  }, []);

  const extraCommands = useMemo(() => {
    const extraCmds = getExtraCommands();
    extraCmds.splice(-1, 1, createFullscreenCommand(toggleFullscreen));
    return extraCmds;
  }, []);

  const colorMode = theme === "Dark" ? "dark" : "light";
  const isDark = theme === "Dark";

  return (
    <div className="container" data-color-mode={colorMode}>
      {isDark && (
        <style>{`
          .wmde-markdown-color {
            background-color: #19191B !important;
          }
        `}</style>
      )}
      <MDEditor
        value={localValue}
        onChange={(value) => setLocalValue(value ?? "")}
        commands={commands}
        extraCommands={extraCommands}
        fullscreen={isFullscreen}
        style={
          isDark
            ? {
                backgroundColor: "#19191B",
                border: "1px solid #353536",
              }
            : { border: "1px solid #d1d5db" }
        }
        visibleDragbar={false}
        data-color-mode={colorMode}
        previewOptions={{
          components: {
            em: (props: any) => {
              const node = props.node;
              const position = node?.position;
              if (position) {
                const sourceText = localValue.substring(
                  position.start.offset,
                  position.end.offset
                );
                if (sourceText?.startsWith("_") && sourceText.endsWith("_")) {
                  return <u {...props} />;
                }
              }
              return <em {...props} />;
            },
          },
        }}
      />
    </div>
  );
};
