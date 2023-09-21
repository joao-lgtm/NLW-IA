import { FFmpeg } from "@ffmpeg/ffmpeg";

import coreURL from "../ffmpeg/ffmpeg-core.js?url"
import wasmURL from "../ffmpeg/ffmpeg-core.wasm?url"
import workerURL from "../ffmpeg/ffmpeg-worker.js?url"


let ffmepg: FFmpeg | null

export async function getFFmpeg(){
    if(ffmepg){
        return ffmepg
    }

    ffmepg = new FFmpeg()


    if(!ffmepg.loaded){
        await ffmepg.load({
            coreURL,
            wasmURL,
            workerURL
        })
    }


    return ffmepg
}

