import { useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clipboard } from "lucide-react"

type ImageUploaderProps = {
    image: File | null,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
}


export function PasteImageButton({
  onImagePaste,
}: {
  onImagePaste: (file: File) => void
}) {
  const handlePasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read()

      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type)
            const file = new File([blob], "clipboard-image", { type: blob.type })
            onImagePaste(file)
            return
          }
        }
      }
    } catch (err) {
      console.error("Clipboard access failed:", err)
    }
  }

  return (
    <Button
      size="icon"
      variant="outline"
      className="absolute top-2 right-2 rounded-full"
      onClick={handlePasteFromClipboard}
    >
      <Clipboard className="h-4 w-4 text-white" />
    </Button>
  )
}

export function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
    }
  }

  return (
    <div
      className="relative w-80 h-80 border-3 border-black rounded-2xl flex items-center justify-center flex-col gap-4 p-4 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <PasteImageButton onImagePaste={setImage} />

      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="Selected"
          className="max-h-40 object-contain"
        />
      ) : (
        <div className="text-sm text-muted-foreground">Drag an image here</div>
      )}

      <label htmlFor="image-upload">
        <Input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
          Select Image From Computer
        </Button>
      </label>
    </div>
  )
}