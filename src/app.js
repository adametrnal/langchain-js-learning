import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Peer dependency
import * as parse from "pdf-parse";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview"
});

//basic test

async function getJoke() {
    try {
        const response = await model.invoke([
            new HumanMessage("Tell me a joke.")
        ]);
        console.log(response);
    } catch (error) {
        console.error("Error:", error);
    }
}

//getJoke();

//load a PDF
const loader = new PDFLoader("../docs/2018-virginia-construction-code.pdf")
const rawVAConstructionCodeDocs = await loader.load();
//console.log(rawVAConstructionCodeDocs.slice(0, 5));


//Splitting
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 64,
});
const splitDocs = await splitter.splitDocuments(rawVAConstructionCodeDocs);

//console.dir(splitDocs.slice(0, 5), {depth: null});

//Generate Embeddings
const embeddings = new OpenAIEmbeddings();
const vectorstore = new MemoryVectorStore(embeddings);
await vectorstore.addDocuments(splitDocs); //TODO: just in memory for now. Would need to persist

const retrievedDocs = await vectorstore.similaritySearch(
    "What type of insulation is required?",
    4
);

const pageContents = retrievedDocs.map(doc=>doc.pageContent);
console.log(pageContents);



