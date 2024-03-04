import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

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
console.log(rawVAConstructionCodeDocs.slice(0, 5));


//Splitting

