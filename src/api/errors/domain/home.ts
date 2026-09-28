export const HomeError = {
  STUDENT_NOT_FOUND: {
    code: "STUDENT_NOT_FOUND",
    message: "O estudante informado não foi encontrado no sistema.",
    statusCode: 404,
  },
  SUBJECT_NOT_CLASSIFIED: {
    code: "SUBJECT_NOT_CLASSIFIED",
    message: "A IA não conseguiu classificar este assunto na árvore cognitiva.",
    statusCode: 422,
  },
  AI_INVALID_RESPONSE: {
    code: "AI_INVALID_RESPONSE",
    message: "A resposta retornada pela IA não atende ao formato estruturado exigido.",
    statusCode: 502,
  }
} as const;
