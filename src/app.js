"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const runnable_1 = require("langchain/schema/runnable");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const model = new openai_1.ChatOpenAI({
    modelName: "gpt-4-turbo-preview"
});
//basic test
async function getJoke() {
    try {
        const response = await model.invoke([
            new messages_1.HumanMessage("Tell me a joke.")
        ]);
        console.log(response);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//getJoke();
//load a PDF
const loader = new pdf_1.PDFLoader("../docs/2018-virginia-construction-code.pdf");
const rawVAConstructionCodeDocs = await loader.load();
//console.log(rawVAConstructionCodeDocs.slice(0, 5));
//Splitting
const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
    chunkSize: 1536,
    chunkOverlap: 128,
});
const splitDocs = await splitter.splitDocuments(rawVAConstructionCodeDocs);
//console.dir(splitDocs.slice(0, 5), {depth: null});
//Generate Embeddings
const embeddings = new openai_2.OpenAIEmbeddings();
const vectorstore = new memory_1.MemoryVectorStore(embeddings);
await vectorstore.addDocuments(splitDocs); //TODO: just in memory for now. Would need to persist
const retrievedDocs = await vectorstore.similaritySearch("What type of insulation is required?", 4);
const pageContents = retrievedDocs.map(doc => doc.pageContent);
//console.log(pageContents);
//Create a Runnable Sequence to answer questions
const retriever = vectorstore.asRetriever();
const convertDocsToString = (documents) => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`;
    }).join("\n");
};
const documentRetrievalChain = runnable_1.RunnableSequence.from([
    (input) => input.question,
    retriever,
    convertDocsToString
]);
const results = await documentRetrievalChain.invoke({
    question: "What type of insulation is required?"
});
console.log(results);
