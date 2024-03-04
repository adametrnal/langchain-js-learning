import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview"
});

const prompt = ChatPromptTemplate.fromTemplate(
    `What are three good names for a company that makes {product}?`
)



async function getNames() {
    try {
        const response = await prompt.format({
            product: "colorful socks"
        });
        console.log(response);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getNamesFormatted() {
    try {
        const response = await prompt.formatMessages({
            product: "colorful socks"
        });
        console.log(response);
    } catch (error) {
        console.error("Error:", error);
    }
}

// getNames();
// getNamesFormatted();


// import { 
//     SystemMessagePromptTemplate, 
//     HumanMessagePromptTemplate 
//   } from "@langchain/core/prompts";
  
//   const promptFromMessages = ChatPromptTemplate.fromMessages([
//     SystemMessagePromptTemplate.fromTemplate(
//       "You are an expert at picking company names."
//     ),
//     HumanMessagePromptTemplate.fromTemplate(
//       "What are three good names for a company that makes {product}?"
//     )
//   ]);
  
//   await promptFromMessages.formatMessages({
//       product: "shiny objects"
//   });