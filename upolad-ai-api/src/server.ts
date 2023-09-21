import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscrepitionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-trascription";
import { fastifyCors } from "@fastify/cors";

const app = fastify()


app.register(fastifyCors, {
    origin: '*',
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscrepitionRoute)
app.register(generateAICompletionRoute)


app.listen({
    port: 3333
}).then(() => {
    console.log('listening on port')
})