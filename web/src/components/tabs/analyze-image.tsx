import { ImageUploader } from "@components/structure/file-drop";
import { Button } from "@components/ui/button";
import { useState } from "react";

export function ImageTextTab() {
    const [image, setImage] = useState<File | null>(null)
    const [process_state, setProcessState] = useState<"capturing" | "processing" | "displaying">("capturing")


    return (
        <>
            {process_state === "capturing" ?
                (
                    <div className="flex gap-10 items-center">
                        <ImageUploader image={image} setImage={setImage} />
                        <Button
                            onClick={() => {
                                if (image !== null) {
                                    setProcessState("processing")
                                }
                            }}
                        >
                            Analyze Selected Image
                        </Button>
                    </div>
                ) : <></>
            }
            {process_state === "processing" ?
                (
                    <div className="flex gap-10 items-center">
                        <Button
                            onClick={() => {
                                setProcessState("capturing")
                            }}
                        >
                            Abort Image Processing
                        </Button>
                    </div>
                ) : <></>
            }
            {process_state === "displaying" ?
                (
                    <div className="flex gap-10 items-center">
                        <ImageUploader image={image} setImage={setImage} />
                        <Button> Analyze Selected Image </Button>
                    </div>
                ) : <></>
            }
        </>
    )
}