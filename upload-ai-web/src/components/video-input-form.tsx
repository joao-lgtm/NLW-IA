import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { FileVideo, Upload } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { FormEvent, ChangeEvent, useMemo, useState, useRef } from "react"
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { api } from "@/lib/axios"


type status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessage = {
    converting: 'Convertendo...',
    generating: 'Transcrevendo...',
    uploading: 'Carregando...',
    success: 'Sucesso!'
}

interface VideoInpuntFormProps{
    onVideoUploaded: ( id: string) => void
}

export function VideoInputForm(props: VideoInpuntFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<status>('waiting')


    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function hadleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget


        if (!files) {
            return
        }

        const selectedFile = files[0]

        setVideoFile(selectedFile)
    }

    async function convertVideoTofile(video: File) {
        console.log('convert STARTED')

        const ffmpeg = await getFFmpeg()

        await ffmpeg.writeFile('input.mp4', await fetchFile(video))

        // ffmpeg.on('log', log =>{
        //     console.log(log)
        // }) 

        ffmpeg.on("progress", progress => {
            console.log('covert progress: ' + Math.round(progress.progress) * 100)
        })

        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
        ])

        const data = await ffmpeg.readFile('output.mp3')

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg',
        })


        return audioFile
    }

    async function hadleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return
        }

        setStatus('converting')

        const audioFile = await convertVideoTofile(videoFile)

        const data = new FormData()

        setStatus('uploading')


        data.append('file', audioFile)

        const response = await api.post('/videos', data)

        const videoId = response.data.video.id

        setStatus('generating')

        await api.post(`/videos/${videoId}/transcription`, {
            prompt,
        })

        setStatus('success')

        props.onVideoUploaded(videoId)
    }


    const previewUrl = useMemo(() => {
        if (!videoFile) {
            return null
        }

        return URL.createObjectURL(videoFile)
    }, [videoFile]);




    return (
        <form onSubmit={hadleUploadVideo} className="space-y-6" >
            <label
                htmlFor="video"
                className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
                {previewUrl ? (
                    <video src={previewUrl} controls={false} className="pointer-events-none absolute inset-0" />
                ) : (
                    <>
                        Selecione um video
                        <FileVideo className="w-4 h-4" />
                    </>
                )}
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={hadleFileSelected} />

            <Separator />


            <div className="space-y-2">
                <Label htmlFor="trascription_prompt"> Prompt de transcrição </Label>
                <Textarea
                    ref={promptInputRef}
                    disabled={status != 'waiting'}
                    id="trascription_prompt"
                    className="h-20 leading-relaxed resize-none"
                    placeholder="Inclua palavras-chaves mencionadas no video separadas por vírgula (,)" />
            </div>


            <Button
            data-success={status === 'success'}
             disabled={status != 'waiting'}
             type="submit"
             className="w-full data-[success=true]:bg-emerald-400"
             >
                {status === 'waiting' ?(
                    <>
                        Carrgar Video
                        <Upload className="w-4 h-4 ml-2" />
                    </>
                    ) : statusMessage[status]
                }
            </Button>
        </form >
    )
}