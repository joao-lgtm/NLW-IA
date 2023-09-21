import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import fastifyMultipart from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";


const pump = promisify(pipeline)


export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1048576 * 25
        }
    });

    app.post('/videos', async (request, reply) => {
        const data = await request.file()

        if (!data) {
            return reply.status(400).send({ error: 'missing file input.' });
        }

        const extension = path.extname(data.filename)

        if (extension != '.mp3') {
            return reply.status(400).send({ error: 'invalid input type, please upload a mp3' })
        }

        const fileBaseName = path.basename(data.filename, extension)
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
        const uploadDestination = path.resolve(__dirname, '../../temp/', fileUploadName)


        const dataStream = data.file; // Use data.file como o fluxo de leitura

        await pump(dataStream, fs.createWriteStream(uploadDestination));

        const video = await prisma.video.create({
            data: {
                nome: data.filename,
                path: uploadDestination
            }
        })
        return {
            video,
        }
    })

}