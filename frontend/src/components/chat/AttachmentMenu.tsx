import { useRef } from "react";
import { Image, FileText, Camera } from "lucide-react";

interface Props {
  onAttach: (files: FileList, type: "image" | "file") => void;
}

const ITEMS: {
  label: string;
  icon: typeof Image;
  type: "image" | "file";
  accept: string;
  capture?: boolean;
}[] = [
  { label: "Images & Videos", icon: Image, type: "image", accept: "image/*,video/*" },
  { label: "Documents", icon: FileText, type: "file", accept: ".pdf,.doc,.docx,.txt,.xlsx,.pptx,.csv" },
  { label: "Camera", icon: Camera, type: "image", accept: "image/*", capture: true },
];

export function AttachmentMenu({ onAttach }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const refMap = {
    image: imageRef,
    file: fileRef,
  };

  const handleClick = (item: (typeof ITEMS)[0]) => {
    const ref = item.capture ? cameraRef : refMap[item.type];
    ref.current?.click();
  };

  const handleChange =
    (type: "image" | "file") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onAttach(e.target.files, type);
        e.target.value = "";
      }
    };

  return (
    <>
      <div className="p-1.5 space-y-0.5 min-w-[180px]">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-left"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60 text-muted-foreground">
                <Icon size={16} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <input
        ref={imageRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleChange("image")}
      />
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx,.csv"
        multiple
        className="hidden"
        onChange={handleChange("file")}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange("image")}
      />
    </>
  );
}
