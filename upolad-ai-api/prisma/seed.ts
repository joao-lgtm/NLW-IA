import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  
  await prisma.prompt.deleteMany()

  await prisma.prompt.create({
    data: {
      title: 'Título YouTube',
      template: `Seu papel é gerar três títulos para um vídeo do YouTube.

Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar os títulos.
Abaixo você também receberá uma lista de títulos, use essa lista como referência para os títulos a serem gerados.

Os títulos devem ter no máximo 60 caracteres.
Os títulos devem ser chamativos e atrativos para maximizar os cliques.

Retorne APENAS os três títulos em formato de lista como no exemplo abaixo:
'''
- Título 1
- Título 2
- Título 3
'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Descrição YouTube',
      template: `Seu papel é gerar uma descrição sucinta para um vídeo do YouTube.
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar a descrição.

A descrição deve possuir no máximo 80 palavras em primeira pessoa contendo os pontos principais do vídeo.

Use palavras chamativas e que cativam a atenção de quem está lendo.

Além disso, no final da descrição inclua uma lista de 3 até 10 hashtags em letra minúscula contendo palavras-chave do vídeo.

O retorno deve seguir o seguinte formato:
'''
Descrição.

#hashtag1 #hashtag2 #hashtag3 ...
'''

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })


  await prisma.prompt.create({
    data: {
      title: 'Resumo de Vídeo do YouTube',
      template: `Sua missão é gerar um resumo sucinto para um vídeo do YouTube.
  
  Abaixo, você encontrará uma transcrição desse vídeo. Use esta transcrição para criar o resumo.
  
  O resumo deve ter no máximo 80 palavras e deve incluir os principais pontos do vídeo de forma envolvente.
  
  Use palavras atrativas para prender a atenção do leitor.
  
  Além disso, ao final do resumo, inclua de 3 a 10 hashtags em letras minúsculas que contenham palavras-chave relacionadas ao vídeo.
  
  O retorno deve seguir o seguinte formato:
  '''
  Resumo do vídeo.
  
  #hashtag1 #hashtag2 #hashtag3 ...
  '''
  
  Transcrição:
  '''
  {transcricao}
  '''`.trim()
    }
  })
  
  await prisma.prompt.create({
    data: {
      title: 'Resumo de Vídeo',
      template: `Sua tarefa é criar um resumo sucinto para um vídeo qualquer.
  
  Assista ao vídeo e identifique os principais pontos.
  
  O resumo deve ter no máximo 100 palavras e deve capturar a essência do vídeo de forma envolvente.
  
  Utilize uma linguagem cativante para prender a atenção do leitor.
  
  No final do resumo, inclua de 3 a 10 palavras-chave relacionadas ao conteúdo do vídeo.
  
  O retorno deve seguir o seguinte formato:
  '''
  Resumo do vídeo.
  
  Palavra-chave1, Palavra-chave2, Palavra-chave3, ...
  '''
      
  Assista ao vídeo e identifique os principais pontos.
  `.trim()
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })






  


  
  