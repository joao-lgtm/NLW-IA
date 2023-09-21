import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { prisma } from "../lib/prisma";
import { z } from "zod"
import { openai } from "../lib/opeani";

export async function createTranscrepitionRoute(app: FastifyInstance) {
    app.post('/videos/:videosId/transcription', async (req) => {

        const paramsSchema = z.object({
            videosId: z.string().uuid(),
        })

        const { videosId } = paramsSchema.parse(req.params)


        const bodySchema = z.object({
            prompt: z.string(),
        })

        const { prompt } = bodySchema.parse(req.body)

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videosId,
            }
        })


        const videoPath = video.path
        const audioReadStream = createReadStream(videoPath)

        const response = await openai.audio.transcriptions.create({
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })

        const transcription = response.text

        await prisma.video.update({
            where: {
                id: videosId,
            },
            data:{
                transcription
            }
        })

        return transcription
    })
}